import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PriceBetting } from "../target/types/price_betting";
import { Keypair, SystemProgram, PublicKey, Commitment } from "@solana/web3.js";

const commitment: Commitment = "confirmed";

describe("price-betting", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;;

  const program = anchor.workspace.PriceBetting as Program<PriceBetting>;

  const initSeed = new anchor.BN(0);
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
  });

  it("Create Bet", async () => {
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
  });

  it("Cancel Bet", async () => {
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
