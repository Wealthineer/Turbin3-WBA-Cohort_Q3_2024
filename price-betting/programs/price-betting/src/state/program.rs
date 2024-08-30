use anchor_lang::prelude::*;

#[account]
pub struct BetProgram {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub seed: u64,
    pub fees: u16,
    pub treasury_bump: u8,
    pub bump: u8,
}

impl Space for BetProgram {
    const INIT_SPACE: usize = 8 + 32 + 32 + 8 + 2 + 1 + 1;
}