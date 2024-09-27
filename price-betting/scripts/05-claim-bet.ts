import { SystemProgram, PublicKey, Connection} from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";

//This import brings all the wallets and settings done in 99-config.ts that are used in multiple scripts
import { admin, betCreator, betProgram, betSeed, betTaker, connection } from "./99-config";

async function main() {

    console.log("Admin", admin.publicKey.toBase58());
    console.log("Bet Taker", betTaker.publicKey.toBase58());
    console.log("Bet Creator", betCreator.publicKey.toBase58());

    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    console.log("Bet Program", betProgram.toBase58());
    const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet", bet.toBase58());
    const bettingPool = PublicKey.findProgramAddressSync([Buffer.from("betting_pool"), bet.toBuffer()], program.programId)[0];
    console.log("Betting Pool", bettingPool.toBase58());
    
    try {
        const claimer = betCreator //adjust depending on who is the winner and allowed to claim
        console.log("Claimer: ", claimer.publicKey.toBase58())
        const claimerBalanceBefore = await connection.getBalance(claimer.publicKey)
        const bettingPoolBalanceBefore = await connection.getBalance(bettingPool)
        console.log("Betting Pool Balance Before: ", bettingPoolBalanceBefore)
        console.log("Claimer Balance Before: ", claimerBalanceBefore)
        //@ts-ignore
        const tx = await program.methods.claimBet(betSeed).accountsPartial({
            claimer: claimer.publicKey, 
            betCreator: betCreator.publicKey,
            betProgram: betProgram,
            bet: bet,
            bettingPool: bettingPool,
            systemProgram: SystemProgram.programId,
          })
          .signers([claimer]) //adjust depending on who is the winner and allowed to claim
          .rpc();
          console.log("Your transaction signature", tx);
      
        await confirmTx(provider, tx)

        const claimerBalanceAfter = await connection.getBalance(claimer.publicKey)
        const bettingPoolBalanceAfter = await connection.getBalance(bettingPool)

        console.log("Betting Pool Balance After: ", bettingPoolBalanceAfter)
        console.log("Claimer Balance After: ", claimerBalanceAfter)
    } catch (e) {
        if (e.message.includes("BetAlreadyAccepted")) {
            console.log("Bet has already been accepted")
        } else {
            console.log(e)
        }
    }
}

main();