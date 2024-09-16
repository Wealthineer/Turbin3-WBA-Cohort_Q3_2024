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
    const treasury  = PublicKey.findProgramAddressSync([Buffer.from("treasury"), betProgram.toBuffer()], program.programId)[0];
    console.log("Treasury", treasury.toBase58());
    const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet", bet.toBase58());
    const bettingPool = PublicKey.findProgramAddressSync([Buffer.from("betting_pool"), bet.toBuffer()], program.programId)[0];
    console.log("Betting Pool", bettingPool.toBase58());
    
    try {
        //@ts-ignore
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
      
          await confirmTx(provider, tx)
    } catch (e) {
        if (e.message.includes("BetAlreadyAccepted")) {
            console.log("Bet has already been accepted")
        } else {
            console.log(e)
        }
    }

    //@ts-ignore
    const initializedBet = await program.account.bet.fetch(bet)

    console.log("Accepted Bet: ")
    console.log(initializedBet)
}

main();