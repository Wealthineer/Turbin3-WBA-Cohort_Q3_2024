//check if time is up
//get price info from switchboard
//set winner

use anchor_lang::prelude::*;

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
    )]
    pub bet: Account<'info, Bet>,
}

impl<'info> Resolve<'info> {
    pub fn validate(&mut self) -> Result<()> {
        //Bet cannot be already resolved
        require!(self.bet.winner.is_none(), PriceBettingError::BetAlreadyResolved);
        //Bet must have been accepted
        require!(self.bet.taker.is_some(), PriceBettingError::BetNotAccepted);
        //Resolve date must have been reached
        require!(self.bet.resolve_date as i64 <= Clock::get()?.unix_timestamp, PriceBettingError::ResolveDateNotReached); //TODO: Why does > or <=work but not <
        Ok(())
    }

    pub fn resolve_bet_dummy_impl(&mut self) -> Result<()> {
        //TODO: Implement this - so far just done to test claim afterwards
        self.bet.winner = Some(self.bet_creator.key());
        Ok(())
    }
}