use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)] // 1+1+4+1+1 = 10 - also needs an additional 8 for the discriminator
pub struct StakeConfig {
    pub points_per_stake: u8,
    pub max_stake: u8,
    pub freezing_period: u32,
    pub rewards_bump: u8,
    pub bump: u8
}