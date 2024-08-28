use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    pub accepted: bool,
    pub taker: Pubkey,
    pub open_until: u64,
    pub resolve_date: u64,
    pub price_prediction: u64,
    pub direction_creator: bool,
    pub resolver_feed: Pubkey,
    pub winner: Pubkey,
    pub bump: u8,
}

impl Space for Bet {
    const INIT_SPACE: usize = 8 + 1 + 32 + 8 + 8 + 8 + 1 + 32 + 32 + 1;
}