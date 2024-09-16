import { Keypair, SystemProgram, PublicKey, Connection} from "@solana/web3.js";
import adminWallet from "./wallets/admin.json";
import takerWallet from "./wallets/taker.json";
import makerWallet from "./wallets/maker.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";
import {BN} from "@coral-xyz/anchor";

async function main() {

    const admin = Keypair.fromSecretKey(new Uint8Array(adminWallet));
    const betTaker = Keypair.fromSecretKey(new Uint8Array(takerWallet));
    const betCreator = Keypair.fromSecretKey(new Uint8Array(makerWallet));

    console.log("Admin", admin.publicKey.toBase58());
    console.log("Bet Taker", betTaker.publicKey.toBase58());
    console.log("Bet Creator", betCreator.publicKey.toBase58());

    const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);
    const initSeed = new BN(123);
    const betSeed = new BN(999);

    const betProgram  = PublicKey.findProgramAddressSync([Buffer.from("program"), admin.publicKey.toBuffer(), initSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
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