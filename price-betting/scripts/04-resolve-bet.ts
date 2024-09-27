import { PublicKey, Commitment} from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { confirmTx } from "./utils";
import { PriceBetting, IDL } from "./programs/price_betting";

import { asV0Tx, PullFeed } from "@switchboard-xyz/on-demand";

//This import brings all the wallets and settings done in 99-config.ts that are used in multiple scripts
import { admin, betCreator, betProgram, betSeed, betTaker, bonkUsdSwitchboardFeedDevnet, connection, switchboardProgramIdDevnet, treasury } from "./99-config";

export const TX_CONFIG = {
    commitment: "processed" as Commitment,
    skipPreflight: true,
    maxRetries: 0,
  };

async function main() {

    console.log("Admin", admin.publicKey.toBase58());
    console.log("Bet Taker", betTaker.publicKey.toBase58());
    console.log("Bet Creator", betCreator.publicKey.toBase58());

    const provider = new AnchorProvider(connection, new Wallet(betCreator), { commitment: "confirmed" });
    const program = new Program<PriceBetting>(IDL, provider);

    console.log("Bet Program", betProgram.toBase58());
    console.log("Treasury", treasury.toBase58());
    const bet  = PublicKey.findProgramAddressSync([Buffer.from("bet"), betProgram.toBuffer(), betCreator.publicKey.toBuffer(), betSeed.toArrayLike(Buffer, "le", 8)], program.programId)[0];
    console.log("Bet", bet.toBase58());

    //@ts-ignore
    const unresolvedBet = await program.account.bet.fetch(bet)

    console.log("Unresolved Bet: ")
    console.log(unresolvedBet)

    const feed = new PublicKey(bonkUsdSwitchboardFeedDevnet);

    const idl = (await Program.fetchIdl(
      switchboardProgramIdDevnet,
      provider
    ))!;

    const switchboardProgram = new Program(idl, provider);

    //@ts-ignore
    const feedAccount = new PullFeed(switchboardProgram, feed);
    const [pullIx, responses, _ , luts] = await feedAccount.fetchUpdateIx();

    //@ts-ignore
    const resolveIx = await program.methods.resolveBetWihtoutUpdate(betSeed).accountsPartial({
        resolver: betCreator.publicKey,
        betCreator: betCreator.publicKey,
        betProgram: betProgram,
        bet: bet,
        resolverFeed: new PublicKey(bonkUsdSwitchboardFeedDevnet),
      }).instruction();

      console.log("Pull Ix pid: ", pullIx.programId.toBase58()) 

    const tx = await asV0Tx({
        connection,
        ixs: [pullIx, resolveIx], //TODO: Manage to add pullIx here - resolve error that switchboard UI to create feed seems to use different devnet program than the sdk - both program ids exist and got a idl
        signers: [betCreator],
        computeUnitPrice: 200_000,
        computeUnitLimitMultiple: 1.3,
        // lookupTables: lookupTables,
      });

    // simulate the transaction
    const simulateResult =
    await connection.simulateTransaction(tx, {
        commitment: "processed",
    });
    console.log(simulateResult);

    // Send the transaction via rpc 
    const sig = await connection.sendTransaction(tx);

    await confirmTx(provider, sig)

    //@ts-ignore
    const resolvedBet = await program.account.bet.fetch(bet)

    console.log("Resolved Bet: ")
    console.log(resolvedBet)
}

main();