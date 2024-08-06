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

If the tests are not running, consider checking on the idl in `target/idl`and rename it from `anchor_vault_q3.json` to `anchor_vault_q3.json` with the underscore in q_3 since this is what anchor expects, but the name is generated wrong.

## What to expect
The tests will initialize a vote account, give out the initial count of zero, upvote and downvote once and return the vote count after each action in a print statement.