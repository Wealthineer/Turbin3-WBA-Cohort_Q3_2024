//check if time is up
//get price info from switchboard
//set winner

use anchor_lang::prelude::*;

use switchboard_on_demand::{on_demand::accounts::pull_feed::PullFeedAccountData, prelude::rust_decimal::{prelude::{FromPrimitive, ToPrimitive}, Decimal}};

use crate::{error::PriceBettingError, state::program::BetProgram, Bet};

#[derive(Accounts)]
#[instruction(bet_seed: u64)]
pub struct Resolve<'info> {
    #[account(mut)]
    pub resolver: Signer<'info>,
    /// CHECK: No checks needed
    pub bet_creator: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"program", bet_program.admin.key().as_ref(), bet_program.seed.to_le_bytes().as_ref()],
        bump = bet_program.bump
    )]
    pub bet_program: Account<'info, BetProgram>,
    #[account(
        mut,
        seeds = [b"bet", bet_program.key().as_ref(), bet_creator.key().as_ref(), bet_seed.to_le_bytes().as_ref()],
        bump = bet.bump,
        has_one = resolver_feed
    )]
    pub bet: Account<'info, Bet>,
    /// CHECK: No checks needed
    pub resolver_feed: UncheckedAccount<'info>,
}

impl<'info> Resolve<'info> {
    pub fn validate(&mut self) -> Result<()> {
        //Bet cannot be already resolved
        require!(self.bet.winner.is_none(), PriceBettingError::BetAlreadyResolved);
        //Bet must have been accepted
        require!(self.bet.taker.is_some(), PriceBettingError::BetNotAccepted);
        //Resolve date must have been reached
        require!(self.bet.resolve_date as i64 <= Clock::get()?.unix_timestamp*1000, PriceBettingError::ResolveDateNotReached); //TODO: Why does > or <=work but not <
        Ok(())
    }

    pub fn resolve_bet_dummy_impl(&mut self) -> Result<()> {
        //TODO: Implement this - so far just done to test claim afterwards
        self.bet.winner = Some(self.bet_creator.key());
        Ok(())
    }

    pub fn resolve_bet_switchboard_impl(&mut self) -> Result<()> {
        let feed_account = self.resolver_feed.data.borrow();

        if self.resolver_feed.key() != self.bet.resolver_feed {
            return Err(PriceBettingError::FeedMismatch.into());
        }

        let feed = match PullFeedAccountData::parse(feed_account) {
            Ok(feed) => feed,
            Err(_e) => return Err(PriceBettingError::NoFeedData.into()),
        };

        //Expected behavior is to update the price in the tx that calls this ix. Therefore max stale can be low and we only expect 1 sample to be present
        let max_stale_slots = 300; // Define the maximum number of slots before data is considered stale
        let min_samples = 1; // Set the minimum number of samples for data accuracy
        let price: Decimal = match feed.get_value(&Clock::get()?, max_stale_slots, min_samples, true) {
            Ok(price) => price,
            Err(_e) => return Err(PriceBettingError::NoValueFound.into()),
        };

        // Convert price to u64 and multiply by 10^10
        let price_mult = Decimal::checked_mul(price, Decimal::from_i64(10_i64.pow(10)).unwrap()).unwrap();

        let price_u64 = Decimal::to_u64(&price_mult)
            .ok_or(PriceBettingError::NoValueFound)?
            .checked_mul(10_u64.pow(10))
            .ok_or(PriceBettingError::PriceConversionOverflow)?;

        // Determine the winner based on the price prediction and direction
        let creator_wins = if self.bet.direction_creator {
            price_u64 >= self.bet.price_prediction
        } else {
            price_u64 < self.bet.price_prediction
        };

        // Set the winner
        self.bet.winner = Some(if creator_wins {
            self.bet_creator.key()
        } else {
            self.bet.taker.unwrap()
        });

        //TODO: Implement this
        Ok(())
    }
}