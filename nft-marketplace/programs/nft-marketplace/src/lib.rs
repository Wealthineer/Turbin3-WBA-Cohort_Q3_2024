pub mod state;
pub mod instructions;
pub mod error;

use anchor_lang::prelude::*;

pub use state::*;
pub use instructions::*;

declare_id!("3pEtLsbAmUjrWMuK2YrkeRWMDcgVe5b53ZSBb41APpaC");

#[program]
pub mod nft_marketplace {
    use super::*;

    pub fn initialize(ctx: Context<InitializeMarketplace>, name: String, fee: u16) -> Result<()> {
        ctx.accounts.init(name, fee, &ctx.bumps)
    }

    pub fn list(ctx: Context<List>, price: u64) -> Result<()> {
        ctx.accounts.list(price, &ctx.bumps)
    }

    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        ctx.accounts.purchase()
    }

    pub fn delist(ctx: Context<Delist>) -> Result<()> {
        ctx.accounts.withdraw_nft()
    }
}
