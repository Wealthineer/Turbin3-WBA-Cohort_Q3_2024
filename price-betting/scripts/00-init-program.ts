import { SystemProgram} from "@solana/web3.js";

import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";

//This import brings all the wallets and settings done in 99-config.ts that are used in multiple scripts
import { fees, initSeed, admin, betProgram, treasury, connection } from "./99-config";

async function main() {

    console.log("Admin", admin.publicKey.toBase58());

    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    try {
        const tx = await program.methods
        .initialize(initSeed, fees)
        .accountsPartial({
            admin: admin.publicKey,
            bet_program: betProgram,
            treasury: treasury,
            system_program: SystemProgram.programId,
          })
          .signers([admin])
          .rpc();
          console.log("Your transaction signature", tx);
      
          await confirmTx(provider, tx)
    } catch (e) {
        if (e.message.includes("already in use")) {
            console.log("Bet Program already initialized")
        } else {
            console.log(e)
        }
    }

    //@ts-ignore
    const initializedBetProgram = await program.account.betProgram.fetch(betProgram)

      console.log("Initialized Bet Program: ")
      console.log(initializedBetProgram)
}

main();