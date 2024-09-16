import { Keypair, SystemProgram, PublicKey, Connection} from "@solana/web3.js";
import adminWallet from "./wallets/admin.json";
import makerWallet from "./wallets/maker.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";
import {BN} from "@coral-xyz/anchor";

async function main() {

    const admin = Keypair.fromSecretKey(new Uint8Array(adminWallet));

    const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    const initSeed = new BN(123);

    const betProgram  = PublicKey.findProgramAddressSync([Buffer.from("program"), admin.publicKey.toBuffer(), initSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet Program", betProgram.toBase58());
    const treasury  = PublicKey.findProgramAddressSync([Buffer.from("treasury"), betProgram.toBuffer()], program.programId)[0];
    console.log("Treasury", treasury.toBase58());
    
    try {

        console.log("Claiming Treasury")
        console.log("Balance before: ", await provider.connection.getBalance(treasury))
        //@ts-ignore
        const tx = await program.methods.withdrawFromTreasury(initSeed).accountsPartial({
            admin: admin.publicKey,
            betProgram: betProgram,
            treasury: treasury,
            systemProgram: SystemProgram.programId,
          })
          .signers([admin])
          .rpc();
          console.log("Your transaction signature", tx);

          await confirmTx(provider, tx)

          console.log("Balance after: ", await provider.connection.getBalance(treasury))
    } catch (e) {
        if (e.message.includes("already in use")) {
            console.log("Bet already initialized")
        } else {
            console.log(e)
        }
    }
}

main();