use anchor_lang::prelude::*;

#[account]
pub struct Program {
    pub treasury: Pubkey,
    pub fees: u16
    pub bump: u8,
}

impl Space for Program {
    const INIT_SPACE: usize = 8 + 32 + 2 + 1;
}