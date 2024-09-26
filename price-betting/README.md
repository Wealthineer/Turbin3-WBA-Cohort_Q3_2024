# Price Betting

This is a program that facilitates peer to peer bets on the price of an asset. The bets will be decided by a switchboard price feed.

## TODO

The program currently contains the method `resolve_bet_local_test_dummy` which is a dummy method to be able to run unit tests on localnet. This method must be removed before deploying the program to mainnet or doing a serious test run on devnet.

## Currently deployed program on devnet

- [5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL](https://explorer.solana.com/address/5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL)

## Deploying the program

First make sure that the cluster in `Anchor.toml` is set to `devnet`.

If a new instance of the program is required, the following commands should be run:
```bash
anchor build
anchor deploy
```
Make sure to update the program id where necessary in this case.

## Running the scripts

### Preparation
First make sure that the cluster in `Anchor.toml` is set to `devnet`. On localnet the switchboard program is not available.

Make sure to add admin.json, maker.json and taker.json to the /scripts/wallets folder. Those are wallets in byte array format. The wallets need to be prefunded on devnet. The scripts only work fully on devnet, not localnet, since switchboard is not present on localnet.

Install the yarn project dependencies

```bash
yarn
```

### Setting up a program instance to handle the bets

First the 'casino' instance need to be initialized. Before this no bet can be created.

```bash
yarn init-program
```

### Creating a bet
For the bet to be created, there must not be an active bet from the same creator, using the same seed.

```bash
yarn create-bet
```

### Accepting a bet
To accept a bet, the bet must be active and within the allowed time window.
```bash
yarn accept-bet
```

### Resolving a bet
If a bet is accepted and the point in time has passed, that marks the end of the bet, the bet can be resolved.
```bash
yarn resolve-bet
```

### Claiming the reward as a winner
Once a bet is resolved, the winner can claim the price money.
```bash
yarn claim-bet
```

### Cancelling a bet
If a bet is not accepted yet, it can be cancelled by the creator.
```bash
yarn cancel-bet
```

### Claiming the casino's treasury
If the casino's treasury is not empty, the treasury can be claimed by the admin.
```bash
yarn claim-treasury
```

## Running unit tests
Make sure that the cluster in `Anchor.toml` is set to `localnet`.
```bash
anchor test
```
The tests go through all the program methods. The resolve step however uses the mock implementation that needs to be removed in the future to go over this step without the not available switchboard program and to enable the ability to test claiming of the winnings that can only be done after the resolve step.