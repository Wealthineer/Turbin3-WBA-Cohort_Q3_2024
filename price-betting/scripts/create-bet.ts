import { Keypair, SystemProgram, PublicKey, Connection} from "@solana/web3.js";
import adminWallet from "./wallets/admin.json";
import takerWallet from "./wallets/taker.json";
import makerWallet from "./wallets/maker.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";
import {BN, web3} from "@coral-xyz/anchor";

async function main() {

    const admin = Keypair.fromSecretKey(new Uint8Array(adminWallet));
    const betCreator = Keypair.fromSecretKey(new Uint8Array(makerWallet));

    const connection = new Connection("https://api.devnet.solana.com", 'confirmed');
    const provider = new AnchorProvider(connection, new Wallet(admin), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    const initSeed = new BN(123);
    const betSeed = new BN(999);
    const openUntil = new BN(Date.now() + 1000 * 60); //Bet is open for 1 minute to be accepted
    const resolveDate = new BN(Date.now() + 1000 * 90); //Bet can be resolved after 90 seconds
    const pricePrediction = new BN(1000);
    const amount = new BN(1 * web3.LAMPORTS_PER_SOL);
    const bonkUsdSwitchboardFeedDevnet = "2N5FN6TiH6hVroPkt4zoXHPEsDHp6B8cSV38ALnJic46";    

    const betProgram  = PublicKey.findProgramAddressSync([Buffer.from("program"), admin.publicKey.toBuffer(), initSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet Program", betProgram.toBase58());
    const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet", bet.toBase58());
    const bettingPool = PublicKey.findProgramAddressSync([Buffer.from("betting_pool"), bet.toBuffer()], program.programId)[0];
    console.log("Betting Pool", bettingPool.toBase58());
    
    try {
        //@ts-ignore
        const tx = await program.methods.createBet(betSeed, openUntil, resolveDate, pricePrediction, true, new PublicKey(bonkUsdSwitchboardFeedDevnet), amount).accountsPartial({
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
        if (e.message.includes("already in use")) {
            console.log("Bet already initialized")
        } else {
            console.log(e)
        }
    }

    //@ts-ignore
    const initializedBet = await program.account.bet.fetch(bet)

      console.log("Initialized Bet: ")
      console.log(initializedBet)
}

main();