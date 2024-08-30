use anchor_lang::prelude::*;

#[account]
pub struct Bet {
    pub taker: Option<Pubkey>,
    pub open_until: u64,
    pub resolve_date: u64,
    pub price_prediction: u64,
    pub direction_creator: bool,
    pub resolver_feed: Pubkey,
    pub winner: Option<Pubkey>,
    pub bet_seed: u64,
    pub bump: u8,
}

impl Space for Bet {
    const INIT_SPACE: usize = 8 + 33 + 8 + 8 + 8 + 1 + 32 + 33 + 8 + 1;
}