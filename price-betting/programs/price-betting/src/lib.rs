use anchor_lang::prelude::*;

pub mod state;
pub use state::*;

pub mod instructions;
pub use instructions::*;

declare_id!("5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL");

#[program]
pub mod price_betting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn create_bet(ctx: Context<Create>) -> Result<()> {
        Ok(())
    }

    pub fn accept_bet(ctx: Context<Accept>) -> Result<()> {
        Ok(())
    }

    pub fn cancel_bet(ctx: Context<Cancel>) -> Result<()> {
        Ok(())
    }

    pub fn resolve_bet(ctx: Context<Resolve>) -> Result<()> {
        Ok(())
    }

    pub fn claim_bet(ctx: Context<Claim>) -> Result<()> {
        Ok(())
    }
}

