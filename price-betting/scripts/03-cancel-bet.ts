import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";

//This import brings all the wallets and settings done in 99-config.ts that are used in multiple scripts
import { admin, betCreator, betProgram, betSeed, connection } from "./99-config";

async function main() {

    console.log("Bet Creator: ", betCreator.publicKey.toBase58());
    console.log("Admin: ", admin.publicKey.toBase58());

    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    console.log("Bet Program", betProgram.toBase58());
    const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet", bet.toBase58());
    const bettingPool = PublicKey.findProgramAddressSync([Buffer.from("betting_pool"), bet.toBuffer()], program.programId)[0];
    console.log("Betting Pool", bettingPool.toBase58());
    
    try {
        //@ts-ignore
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
      
          await confirmTx(provider, tx)
    } catch (e) {
        if (e.message.includes("The program expected this account to be already initialized")) {
            console.log("Bet doesn't exist")
        } else if (e.message.includes("BetAlreadyAccepted")) {
            console.log("Bet has already been accepted and cannot be canceled")
        } else {
            console.log(e)
        }
    }
}

main();