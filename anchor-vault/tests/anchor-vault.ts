import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVault } from "../target/types/anchor_vault";

describe("anchor-vault-q3", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorVault as Program<AnchorVault>;


  const vaultState = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("state"), provider.publicKey.toBytes()], program.programId)[0];
  const vault = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultState.toBytes()], program.programId)[0];


  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initialize()
    .accounts({
      user: provider.wallet.publicKey
    })
    .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Allows deposits", async () => {

    const depositAmount = 0.1 * anchor.web3.LAMPORTS_PER_SOL;
    const tx = await program.methods
    .deposit(new anchor.BN(depositAmount))
    .accounts({
      user: provider.wallet.publicKey
    })
    .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Allows withdrawals", async () => {

    const withdrawAmount = 0.1 * anchor.web3.LAMPORTS_PER_SOL;
    const tx = await program.methods
    .withdraw(new anchor.BN(withdrawAmount))
    .accounts({
      user: provider.wallet.publicKey
    })
    .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Allows closing the vault", async () => {

    const tx = await program.methods
    .close()
    .accounts({
      user: provider.wallet.publicKey
    })
    .rpc();
    console.log("Your transaction signature", tx);
  });

});
