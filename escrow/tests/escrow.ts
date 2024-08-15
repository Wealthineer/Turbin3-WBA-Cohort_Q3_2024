import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Escrow } from "../target/types/escrow";
import { Keypair, SystemProgram, PublicKey, Commitment } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID as associatedTokenProgram, TOKEN_PROGRAM_ID as tokenProgram, createAccount, createMint, getAssociatedTokenAddressSync, mintTo } from "@solana/spl-token";
import { assert, expect } from "chai";

const commitment: Commitment = "confirmed"; // processed, confirmed, finalized

describe("escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;;

  const program = anchor.workspace.Escrow as Program<Escrow>;

  //Setup keys
  const [maker, taker] = Array.from({length: 2}, () => Keypair.generate());

  console.log("Maker", maker.publicKey.toBase58());
  console.log("Taker", taker.publicKey.toBase58());

  // Random seed
  const seed = new anchor.BN(0);
  const receive_readable = 10;
  const deposit_readable = 20;
  const initial_balance_readable = 5000;
  const receive = new anchor.BN(receive_readable*10**6);
  const deposit = new anchor.BN(deposit_readable*10**6);
  const initial_balance = new anchor.BN(initial_balance_readable*10**6);

  //PDAs
  const escrow  = PublicKey.findProgramAddressSync([Buffer.from("escrow"), maker.publicKey.toBuffer(), seed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
  console.log("Escrow", escrow.toBase58());
  //Mints
  let mint_a;
  let mint_b;

  //ATAs
  let maker_ata_a;
  let maker_ata_b;
  let taker_ata_a;
  let taker_ata_b;
  let vault; //basically escrow_ata_a


  it("Airdrop", async () => {
    await Promise.all([maker, taker].map(async (k) => {
      return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
    })).then(confirmTxs);
  });

  it("Create mints, tokens and ATAs", async () => {
    let [ u1, u2 ] = await Promise.all([maker, taker].map(async(keypair) => { return await newMintToAta(anchor.getProvider().connection, keypair, initial_balance_readable*(10**6)) }))
    mint_a = u1.mint;
    mint_b = u2.mint;
    maker_ata_a = u1.ata;
    maker_ata_b = getAssociatedTokenAddressSync(mint_b, maker.publicKey, false, tokenProgram)

    taker_ata_a = getAssociatedTokenAddressSync(mint_a, taker.publicKey, false, tokenProgram)
    taker_ata_b = u2.ata;

    vault = getAssociatedTokenAddressSync(mint_a, escrow, true, tokenProgram)

    console.log("Maker Ata A:", maker_ata_a.toBase58());
    console.log("Maker Ata B:", maker_ata_b.toBase58());
    console.log("Taker Ata A:", taker_ata_a.toBase58());
    console.log("Taker Ata B:", taker_ata_b.toBase58());
    console.log("Vault:", vault.toBase58());
  })

  it("Make", async () => {

    try {
      const tx = await program.methods
      .make(seed, deposit, receive)
      .accountsPartial({
        maker: maker.publicKey,
        mintA: mint_a,
        mintB: mint_b,
        makerAtaA: maker_ata_a,
        escrow: escrow,
        vault: vault,
        tokenProgram: tokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();
 
      await confirmTx(tx)
 
      console.log("Your transaction signature", tx);

      const balanceMakerAtaA = (await connection.getTokenAccountBalance(maker_ata_a)).value.uiAmount 
      const vaultBalance = (await connection.getTokenAccountBalance(vault)).value.uiAmount

      assert.equal(vaultBalance, deposit_readable, "Vault balance should equal deposit amount")
      assert.equal(balanceMakerAtaA, initial_balance_readable - deposit_readable, "Maker Ata A balance should equal initial balance minus deposit amount")
    } catch (e) {
      console.log(e)
    }
  });

  it("Take", async () => {
    try {
      const tx = await program.methods
      .take()
      .accountsPartial({
        taker: taker.publicKey,
        maker: maker.publicKey,
        mintA: mint_a,
        mintB: mint_b,
        takerAtaA: taker_ata_a,
        takerAtaB: taker_ata_b,
        makerAtaB: maker_ata_b,
        escrow: escrow,
        vault: vault,
        tokenProgram: tokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([taker])
      .rpc();
 
      await confirmTx(tx)
 
      console.log("Your transaction signature", tx);

      const takerAtaABalance = (await connection.getTokenAccountBalance(taker_ata_a)).value.uiAmount
      const takerAtaBBalance = (await connection.getTokenAccountBalance(taker_ata_b)).value.uiAmount
      const makerAtaBBalance = (await connection.getTokenAccountBalance(maker_ata_b)).value.uiAmount

      try{
        await connection.getTokenAccountBalance(vault)
        assert.fail //vault account should be closed - so the above should throw an error and this part never be reached
      } catch(e) {
        const estring = e.toString()
        console.log("Error string reached as expected")
        expect(estring.includes("SolanaJSONRPCError: failed to get token account balance: Invalid param: could not find account")).to.be.true

      }

      assert.equal(takerAtaABalance, deposit_readable, "Taker Ata A balance should equal deposit amount")
      assert.equal(takerAtaBBalance, initial_balance_readable - receive_readable, "Taker Ata B balance should miss receive amount")
      assert.equal(makerAtaBBalance, receive_readable, "Maker Ata B balance should equal receive amount")
    } catch (e) {
      console.log(e)
    }
  })

  it("Make fails when not enough tokens are available", async () => {

    try {
      const tx = await program.methods
      .make(seed, new anchor.BN(deposit_readable*10000*10**6), receive)
      .accountsPartial({
        maker: maker.publicKey,
        mintA: mint_a,
        mintB: mint_b,
        makerAtaA: maker_ata_a,
        escrow: escrow,
        vault: vault,
        tokenProgram: tokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();
 
      await confirmTx(tx)
 
      console.log("Your transaction signature", tx);

      assert.fail("Make failed") //tx should fail and throw and error - therefore this part of the code should never be reached

    } catch (e) {
      const estring = e.toString()
      console.log("Error string reached as expected")
      expect(estring.includes("Program log: Error: insufficient funds")).to.be.true
    }
  });

  it("Make 2", async () => {

    try {
      const tx = await program.methods
      .make(seed, deposit, receive)
      .accountsPartial({
        maker: maker.publicKey,
        mintA: mint_a,
        mintB: mint_b,
        makerAtaA: maker_ata_a,
        escrow: escrow,
        vault: vault,
        tokenProgram: tokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();
 
      await confirmTx(tx)
 
      console.log("Your transaction signature", tx);

      const balanceMakerAtaA = (await connection.getTokenAccountBalance(maker_ata_a)).value.uiAmount 
      const vaultBalance = (await connection.getTokenAccountBalance(vault)).value.uiAmount

      assert.equal(vaultBalance, deposit_readable, "Vault balance should equal deposit amount")
      assert.equal(balanceMakerAtaA, initial_balance_readable - 2*deposit_readable, "Maker Ata A balance should equal initial balance minus deposit amount (x2 since the same already ran once)")
    } catch (e) {
      console.log(e)
    }
  });

  it("Refund", async () => {
    try {

      const tx = await program.methods
      .refund()
      .accountsPartial({
        maker: maker.publicKey,
        mintA: mint_a,
        makerAtaA: maker_ata_a,
        escrow: escrow,
        vault: vault,
        tokenProgram: tokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([maker])
      .rpc();
 
      await confirmTx(tx)
 
      console.log("Your transaction signature", tx);

      const makerAtaABalance = (await connection.getTokenAccountBalance(maker_ata_a)).value.uiAmount

      try{
        await connection.getTokenAccountBalance(vault)
        assert.fail //vault account should be closed - so the above should throw an error and this part never be reached
      } catch(e) {
        const estring = e.toString()
        console.log("Error string reached as expected")
        expect(estring.includes("SolanaJSONRPCError: failed to get token account balance: Invalid param: could not find account")).to.be.true

      }

      assert.equal(makerAtaABalance, initial_balance_readable - deposit_readable, "Maker Ata A balance should equal the starting amount (- 1x deposit since one make escrow transaction already ran in this suite")

    } catch (e) {
      console.log("Refund Error")
      console.log(e)
    }
  })
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

const newMintToAta = async (connection, minter: Keypair, amount: number): Promise<{ mint: PublicKey, ata: PublicKey}> => { 
  const mint = await createMint(connection, minter, minter.publicKey, null, 6)
  // await getAccount(connection, mint, commitment)
  const ata = await createAccount(connection, minter, mint, minter.publicKey)
  const signature = await mintTo(connection, minter, mint, ata, minter, amount)
  await confirmTx(signature)
  return {
    mint,
    ata
  }
}
