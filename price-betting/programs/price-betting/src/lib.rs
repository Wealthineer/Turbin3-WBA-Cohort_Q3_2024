use anchor_lang::prelude::*;

pub mod state;
pub use state::*;

pub mod instructions;
pub use instructions::*;

declare_id!("5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL");

#[program]
pub mod price_betting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, fees: u16) -> Result<()> {
        ctx.accounts.initialize(seed, fees, &ctx.bumps)
    }

    pub fn create_bet(ctx: Context<Create>, bet_seed: u64, open_until: u64, resolve_date: u64, price_prediction: u64, direction_creator: bool, resolver_feed: Pubkey, amount: u64) -> Result<()> {
        ctx.accounts.create_bet(bet_seed, open_until, resolve_date, price_prediction, direction_creator, resolver_feed, &ctx.bumps,)?;
        ctx.accounts.deposit_wager(amount)
    }

    // pub fn accept_bet(ctx: Context<Accept>) -> Result<()> {
    //     Ok(())
    // }

    // pub fn cancel_bet(ctx: Context<Cancel>) -> Result<()> {
    //     Ok(())
    // }

    // pub fn resolve_bet(ctx: Context<Resolve>) -> Result<()> {
    //     Ok(())
    // }

    // pub fn claim_bet(ctx: Context<Claim>) -> Result<()> {
    //     Ok(())
    // }
}

