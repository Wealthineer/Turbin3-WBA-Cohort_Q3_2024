# Anchor Vault

This is a program that allows to deposit and withdraw SOL.

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
The tests will initialize a vault, deposit to it, withdraw from it and finally close it again.