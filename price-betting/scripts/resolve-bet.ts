import { Keypair, SystemProgram, PublicKey, Connection, Commitment} from "@solana/web3.js";
import adminWallet from "./wallets/admin.json";
import takerWallet from "./wallets/taker.json";
import makerWallet from "./wallets/maker.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";

import {BN, workspace, web3, getProvider} from "@coral-xyz/anchor";
import { AnchorUtils, asV0Tx, loadLookupTables, PullFeed } from "@switchboard-xyz/on-demand";

export const TX_CONFIG = {
    commitment: "processed" as Commitment,
    skipPreflight: true,
    maxRetries: 0,
  };

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
    const bonkUsdSwitchboardFeedDevnet = "2N5FN6TiH6hVroPkt4zoXHPEsDHp6B8cSV38ALnJic46";    

    const betProgram  = PublicKey.findProgramAddressSync([Buffer.from("program"), admin.publicKey.toBuffer(), initSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet Program", betProgram.toBase58());
    const treasury  = PublicKey.findProgramAddressSync([Buffer.from("treasury"), betProgram.toBuffer()], program.programId)[0];
    console.log("Treasury", treasury.toBase58());
    const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet", bet.toBase58());

    //@ts-ignore
    const unresolvedBet = await program.account.bet.fetch(bet)

    console.log("Unresolved Bet: ")
    console.log(unresolvedBet)

    const feed = new PublicKey(bonkUsdSwitchboardFeedDevnet);
    const switchboardProgram = await AnchorUtils.loadProgramFromEnv();

    //@ts-ignore
    const feedAccount = new PullFeed(switchboardProgram, feed);
    const [pullIx, responses, _ , luts] = await feedAccount.fetchUpdateIx();

    console.log("Responses: ", responses)
    console.log("Luts: ", luts)

    const lookupTables = await loadLookupTables([...responses.map((x) => x.oracle), feedAccount]);

    console.log("Lookup Tables: ", lookupTables)

    //@ts-ignore
    const resolveIx = await program.methods.resolveBetWihtoutUpdate(betSeed).accountsPartial({
        resolver: betCreator.publicKey,
        betCreator: betCreator.publicKey,
        betProgram: betProgram,
        bet: bet,
        resolverFeed: new PublicKey(bonkUsdSwitchboardFeedDevnet),
      }).instruction();

    const tx = await asV0Tx({
        connection,
        ixs: [resolveIx], //TODO: Manage to add pullIx here - resolve error that switchboard UI to create feed seems to use different devnet program than the sdk - both program ids exist and got a idl
        signers: [betCreator],
        computeUnitPrice: 200_000,
        computeUnitLimitMultiple: 1.3,
        // lookupTables: lookupTables,
      });

    // simulate the transaction
    // const simulateResult =
    // await connection.simulateTransaction(tx, {
    //     commitment: "processed",
    // });
    // console.log(simulateResult);

    // Send the transaction via rpc 
    const sig = await connection.sendTransaction(tx);

    await confirmTx(provider, sig)

    //@ts-ignore
    const resolvedBet = await program.account.bet.fetch(bet)

    console.log("Resolved Bet: ")
    console.log(resolvedBet)
}

main();