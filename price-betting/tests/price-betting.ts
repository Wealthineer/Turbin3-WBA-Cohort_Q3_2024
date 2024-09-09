import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PriceBetting } from "../target/types/price_betting";
import { Keypair, SystemProgram, PublicKey, Commitment } from "@solana/web3.js";
import { assert } from "chai";

const commitment: Commitment = "confirmed";

describe("price-betting", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;;

  const program = anchor.workspace.PriceBetting as Program<PriceBetting>;

  const initSeed = new anchor.BN(123);
  const betSeed = new anchor.BN(999);
  const openUntil = new anchor.BN(Date.now() + 1000 * 60);
  const resolveDate = new anchor.BN(Date.now() + 1000 * 60 * 3);
  const pricePrediction = new anchor.BN(1000);
  const amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);
  const fees = 1000;

  //Setup keys
  const [admin, betCreator, betTaker] = Array.from({length: 3}, () => Keypair.generate());
  console.log("Admin", admin.publicKey.toBase58());
  console.log("Bet Creator", betCreator.publicKey.toBase58());
  console.log("Bet Taker", betTaker.publicKey.toBase58());

  const betProgram  = PublicKey.findProgramAddressSync([Buffer.from("program"), admin.publicKey.toBuffer(), initSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
  console.log("Bet Program", betProgram.toBase58());
  const treasury  = PublicKey.findProgramAddressSync([Buffer.from("treasury"), betProgram.toBuffer()], program.programId)[0];
  console.log("Treasury", treasury.toBase58());
  const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
  console.log("Bet", bet.toBase58());
  const bettingPool = PublicKey.findProgramAddressSync([Buffer.from("betting_pool"), bet.toBuffer()], program.programId)[0];
  console.log("Betting Pool", bettingPool.toBase58());

  

  it("Airdrop", async () => {
    await Promise.all([admin,betCreator, betTaker].map(async (k) => {
      return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
    })).then(confirmTxs);
  });

  it("Initialize", async () => {
    const tx = await program.methods.initialize(initSeed, fees).accountsPartial({
      admin: admin.publicKey,
      betProgram: betProgram,
      treasury: treasury,
      systemProgram: SystemProgram.programId,
    })
    .signers([admin])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

    const initializedBetProgram = await program.account.betProgram.fetch(betProgram)

    assert.equal(initializedBetProgram.admin.toBase58(), admin.publicKey.toBase58())
    assert.equal(initializedBetProgram.treasury.toBase58(), treasury.toBase58())
    assert.equal(initializedBetProgram.seed.toString(), initSeed.toString())
    assert.equal(initializedBetProgram.fees, fees)




  });

  it("Create Bet", async () => {

    const creatorBalanceBefore = await connection.getBalance(betCreator.publicKey)

    const tx = await program.methods.createBet(betSeed, openUntil, resolveDate, pricePrediction, true, new PublicKey("BSzfJs4d1tAkSDqkepnfzEVcx2WtDVnwwXa2giy9PLeP"), amount).accountsPartial({
      betCreator: betCreator.publicKey,
      betProgram: betProgram,
      bet: bet,
      bettingPool: bettingPool,
      systemProgram: SystemProgram.programId,
    })
    .signers([betCreator])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

    const initializedBet = await program.account.bet.fetch(bet)

    const poolBalance = await connection.getBalance(bettingPool)
    const creatorBalanceAfter = await connection.getBalance(betCreator.publicKey)

    assert.equal(poolBalance, amount.toNumber())
    assert.isAtMost(creatorBalanceAfter, creatorBalanceBefore - poolBalance) //tx costs get ignored on local validator but rent for bet does not

    assert.equal(initializedBet.winner, null)
    assert.equal(initializedBet.openUntil.toString(), openUntil.toString())
    assert.equal(initializedBet.taker, null)
    assert.equal(initializedBet.pricePrediction.toString(), pricePrediction.toString())
    assert.equal(initializedBet.directionCreator, true)
    assert.equal(initializedBet.resolverFeed.toBase58(), new PublicKey("BSzfJs4d1tAkSDqkepnfzEVcx2WtDVnwwXa2giy9PLeP").toBase58())
    assert.equal(initializedBet.betSeed.toString(), betSeed.toString())
  });

  it("Cancel Bet", async () => {
    const poolBalanceBefore = await connection.getBalance(bettingPool)
    const creatorBalanceBefore = await connection.getBalance(betCreator.publicKey)

      const tx = await program.methods.cancelBet(betSeed).accountsPartial({
        betCreator: betCreator.publicKey,
        betProgram: betProgram,
        bet: bet,
        bettingPool: bettingPool,
        systemProgram: SystemProgram.programId,
      })
      .signers([betCreator])
      .rpc();
      console.log("Your transaction signature", tx);

      await confirmTx(tx)

      try {
        const initializedBet = await program.account.bet.fetch(bet)
        assert.fail("Bet should not exist")
      } catch (e) {
        assert.isTrue(e.message.includes("Account does not exist or has no data"))
      }

      const poolBalanceAfter = await connection.getBalance(bettingPool)
      const creatorBalanceAfter = await connection.getBalance(betCreator.publicKey)

      assert.equal(poolBalanceAfter, 0)
      assert.equal(creatorBalanceAfter, 100 * anchor.web3.LAMPORTS_PER_SOL) //since gas costs get ignored, we expect to be back to the starting balance after the rent and the wager are returned

  });

  it("Create Bet 2", async () => {

    const creatorBalanceBefore = await connection.getBalance(betCreator.publicKey)
    const tx = await program.methods.createBet(betSeed, openUntil, resolveDate, pricePrediction, true, new PublicKey("BSzfJs4d1tAkSDqkepnfzEVcx2WtDVnwwXa2giy9PLeP"), amount).accountsPartial({
      betCreator: betCreator.publicKey,
      betProgram: betProgram,
      bet: bet,
      bettingPool: bettingPool,
      systemProgram: SystemProgram.programId,
    })
    .signers([betCreator])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

    const initializedBet = await program.account.bet.fetch(bet)

    const poolBalance = await connection.getBalance(bettingPool)
    const creatorBalanceAfter = await connection.getBalance(betCreator.publicKey)

    assert.equal(poolBalance, amount.toNumber())
    assert.isAtMost(creatorBalanceAfter, creatorBalanceBefore - poolBalance) //tx costs get ignored on local validator

    assert.equal(initializedBet.winner, null)
    assert.equal(initializedBet.openUntil.toString(), openUntil.toString())
    assert.equal(initializedBet.taker, null)
    assert.equal(initializedBet.pricePrediction.toString(), pricePrediction.toString())
    assert.equal(initializedBet.directionCreator, true)
    assert.equal(initializedBet.resolverFeed.toBase58(), new PublicKey("BSzfJs4d1tAkSDqkepnfzEVcx2WtDVnwwXa2giy9PLeP").toBase58())
    assert.equal(initializedBet.betSeed.toString(), betSeed.toString())
  });

  it("Accept Bet 2", async () => {
    const takerBalanceBefore = await connection.getBalance(betTaker.publicKey)
    const tx = await program.methods.acceptBet(betSeed).accountsPartial({
      betTaker: betTaker.publicKey,
      betCreator: betCreator.publicKey,
      betProgram: betProgram,
      bet: bet,
      bettingPool: bettingPool,
      treasury: treasury,
      systemProgram: SystemProgram.programId,
    })
    .signers([betTaker])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

    const poolBalance = await connection.getBalance(bettingPool)
    const takerBalanceAfter = await connection.getBalance(betTaker.publicKey)
    const treasuryBalanceAfter = await connection.getBalance(treasury)

    const acceptedBet = await program.account.bet.fetch(bet)

    assert.equal(acceptedBet.taker.toBase58(), betTaker.publicKey.toBase58())

    assert.equal(takerBalanceAfter, takerBalanceBefore - amount.toNumber()) //tx costs get ignored on local validator
    assert.equal(poolBalance, (2 * amount.toNumber()) * (1 - (fees / 10000))) //fees are deducted from the pool after taker has paid their part
    assert.equal(treasuryBalanceAfter, (2 * amount.toNumber()) * (fees / 10000))
  });

  it("Withdraw from treasury", async () => {

    const treasuryBalanceBefore = await connection.getBalance(treasury)

    const tx = await program.methods.withdrawFromTreasury(initSeed).accountsPartial({
      admin: admin.publicKey,
      betProgram: betProgram,
      treasury: treasury,
      systemProgram: SystemProgram.programId,
    })
    .signers([admin])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

    const treasuryBalanceAfter = await connection.getBalance(treasury)

    assert.isAbove(treasuryBalanceBefore, 0)
    assert.equal(treasuryBalanceAfter, 0)
  });

                     

  it("Resolve (just dummy impl)", async () => {
    const tx = await program.methods.resolveBet(betSeed).accountsPartial({
      resolver: betCreator.publicKey,
      betCreator: betCreator.publicKey,
      betProgram: betProgram,
      bet: bet,
    })
    .signers([betCreator])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

  });

  it("Claim Winnings", async () => {

    const bettingPoolBalanceBefore = await connection.getBalance(bettingPool)

    const tx = await program.methods.claimBet(betSeed).accountsPartial({
      claimer: betCreator.publicKey, //claim as bet creator since the dummy resolver always resolves to the bet creator
      betCreator: betCreator.publicKey,
      betProgram: betProgram,
      bet: bet,
      bettingPool: bettingPool,
      systemProgram: SystemProgram.programId,
    })
    .signers([betCreator])
    .rpc();
    console.log("Your transaction signature", tx);

    await confirmTx(tx)

    const claimerBalanceAfter = await connection.getBalance(betCreator.publicKey)
    const bettingPoolBalanceAfter = await connection.getBalance(bettingPool)

    assert.equal(claimerBalanceAfter, 100 * anchor.web3.LAMPORTS_PER_SOL - amount.toNumber() + bettingPoolBalanceBefore) //starting balance minus the bet amount plus the pool balance before the claim
    assert.equal(bettingPoolBalanceAfter, 0) //the pool is empty after the claim

    try {
      const claimedBet = await program.account.bet.fetch(bet)
      assert.fail("Bet should be closed after claim")
    } catch (e) {
      assert.isTrue(e.message.includes("Account does not exist or has no data"))
    }


  });
});





// Helpers
const confirmTx = async (signature: string) => {
  const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction(
    {
      signature,
      ...latestBlockhash,
    },
    commitment
  )
}
const confirmTxs = async (signatures: string[]) => {
  await Promise.all(signatures.map(confirmTx))
}
