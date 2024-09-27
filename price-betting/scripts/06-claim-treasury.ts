import { SystemProgram, Connection} from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";

//This import brings all the wallets and settings done in 99-config.ts that are used in multiple scripts
import { admin, betProgram, connection, initSeed, treasury } from "./99-config";

async function main() {

    console.log("Admin", admin.publicKey.toBase58());

    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    console.log("Bet Program", betProgram.toBase58());
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