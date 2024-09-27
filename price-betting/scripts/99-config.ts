import { Keypair, PublicKey, Connection} from "@solana/web3.js";
import {BN, web3} from "@coral-xyz/anchor";

import adminWallet from "./wallets/admin.json";
import makerWallet from "./wallets/maker.json";
import takerWallet from "./wallets/taker.json";

//keypairs - need to have sufficient SOL balance to pay for fees and wagers
export const admin = Keypair.fromSecretKey(new Uint8Array(adminWallet));
export const betCreator = Keypair.fromSecretKey(new Uint8Array(makerWallet));
export const betTaker = Keypair.fromSecretKey(new Uint8Array(takerWallet));

//connection
export const connection = new Connection("https://api.devnet.solana.com", 'confirmed');

//init program
export const initSeed = new BN(123); //vary this to create multiple instance from the same admin wallet
export const fees = 1000;  //1,000 = 10%

//bet
export const betSeed = new BN(999); //vary this to have mutliple open bets from the same creator wallet open at the same time
export const openUntil = new BN(Date.now() + 1000 * 30); //Bet is open for 30 seconds to be accepted
export const resolveDate = new BN(Date.now() + 1000 * 35); //Bet can be resolved after 35 seconds
export const pricePrediction = new BN(1000 * (10**10)); //actual price prediction needs to be multiplied by 10**10 to enable enough precision using intergers onchain
export const wagerAmount = new BN(0.1 * web3.LAMPORTS_PER_SOL); //wager amount
 
//switchboard
export const bonkUsdSwitchboardFeedDevnet = "2N5FN6TiH6hVroPkt4zoXHPEsDHp6B8cSV38ALnJic46";   
export const switchboardProgramIdDevnet = new PublicKey("Aio4gaXjXzJNVLtzwtNVmSqGKpANtXhybbkhtAC94ji2");

//These accounts will be managed here, so that someone who does not want to initiate there own program can simply add an already initialized instance here without the need for the appropriate admin keypair

const programId = new PublicKey("5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL");

export const betProgram  = PublicKey.findProgramAddressSync([Buffer.from("program"), admin.publicKey.toBuffer(), initSeed.toArrayLike(Buffer, "le", 8)], programId)[0];
console.log("Bet Program", betProgram.toBase58());
export const treasury  = PublicKey.findProgramAddressSync([Buffer.from("treasury"), betProgram.toBuffer()], programId)[0];
console.log("Treasury", treasury.toBase58());