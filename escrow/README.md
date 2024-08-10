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

