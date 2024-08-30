use anchor_lang::prelude::*;

use crate::state::program::BetProgram;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        seeds = [b"program", admin.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump,
        space = BetProgram::INIT_SPACE,
    )]
    pub bet_program: Account<'info, BetProgram>,
    #[account(
        seeds = [b"treasury", bet_program.key().as_ref()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, seed: u64, fees: u16, bumps: &InitializeBumps) -> Result<()> {
        self.bet_program.set_inner(BetProgram {
            admin: self.admin.key(),
            treasury: self.treasury.key(),
            seed,
            fees,
            treasury_bump: bumps.treasury,
            bump: bumps.bet_program,
        });
        Ok(())
    }
}
