# Anchor Escrow

This is a program that fcilitates a secure exchange of spl tokens between two parties that do not need to trust each other

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
- Setting up Sol for maker & taker (`Airdrop`)
- Create mints, tokens and ATAs for the following test (`Create mints, tokens and ATAs`)
- Open an escrow by the maker (`Make`)
- Take the escrow previously opened by the taker, transferring tokens to the maker and closing the vaul in the process (`Take`)
- Make sure the transaction fails if the maker does not have enough tokens to deposit into the escrow (`Make fails when not enough tokens are available`)
- Open another escrow (`Make 2`)
- Refund the escrow by the maker, closing the vault in the process (`Refund`)
