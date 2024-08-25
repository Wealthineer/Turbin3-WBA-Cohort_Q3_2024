use anchor_lang::prelude::*;

pub mod error;
pub mod state;
pub use state::*;
pub mod instructions;
pub use instructions::*;

declare_id!("BX24rGCwXHZkhNpR5dfJHMPmh3uP2WsjwNkGjVtdRP99");

#[program]
pub mod dice_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        ctx.accounts.init(amount)
    }

    pub fn place_bet(ctx: Context<PlaceBet>, seed: u64, roll: u8, amount: u64) -> Result<()> {
        ctx.accounts.create_bet(seed, amount, roll, &ctx.bumps)?;
        ctx.accounts.deposit(amount)
    }

    pub fn resolve_bet(ctx: Context<ResolveBet>, sig: Vec<u8>) -> Result<()> {
        ctx.accounts.verify_ed25519_signature(&sig)?;
        ctx.accounts.resolve_bet(&ctx.bumps, &sig)
    }
}

