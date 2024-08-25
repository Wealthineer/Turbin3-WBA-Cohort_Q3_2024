# Dice game

A simple dice game built with Anchor. Signature hashes in combination with slots are used for randomness.

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
The tests will initialize a game, place a bet and then resolve it.