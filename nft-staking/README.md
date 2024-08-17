# Anchor NFT Staking

This is a program to stake an NFT by freezing it in the users wallet and enable the user to claim tokens depending on how long the NFT was staked.

## Running the scripts

To install the project run:

```bash
anchor build
```

To execute the scripts run:

```bash
anchor test
```

or in case anchor test has issues spinning up a test validator

```bash
solana-test-validator --reset
anchor test --skip-local-validator
```

## What to expect
The test cases go through the following scenarios:
- The first 3 tests setup the NFT mint, mint the NFT and verify the NFT for the collection
- Intializes the Staking Config (`Initialize Config Account`)
- Setting up the user account for the staking program (`Initialize User Account`)
- Stake the NFT with the program (`Stake NFT`)
- Unstake the NFT again (`Unstake NFT`)
- Claim the Tokens the user is eligible for (`Claim Rewards`)
