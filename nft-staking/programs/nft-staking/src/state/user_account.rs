use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)] // 4 + 1 + 1 - also needs an additional 8 for the discriminator
pub struct UserAccount {
    pub points: u32,
    pub amount_staked: u8,
    pub bump: u8,
}