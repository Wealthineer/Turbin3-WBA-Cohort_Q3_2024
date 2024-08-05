# Vote Program

A simple program that allows to increase or decrease a counter onchain for a url.

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
The tests will initialize a vote account, give out the initial count of zero, upvote and downvote once and return the vote count after each action in a print statement.
