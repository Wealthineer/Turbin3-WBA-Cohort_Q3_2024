use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::{error::PriceBettingError, state::program::BetProgram};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        seeds = [b"program", admin.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump = bet_program.bump,
    )]
    pub bet_program: Account<'info, BetProgram>,
    #[account(
        mut,
        seeds = [b"treasury", bet_program.key().as_ref()],
        bump = bet_program.treasury_bump,
    )]
    pub treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    pub fn validate(&mut self) -> Result<()> {
        require!(self.bet_program.admin == self.admin.key(), PriceBettingError::Unauthorized);
        Ok(())
    }

    pub fn withdraw_from_treasury(&mut self) -> Result<()> {
        let amount = self.treasury.lamports();

        let bet_program_binding = self.bet_program.key();
        let bumps_binding = [self.bet_program.treasury_bump];
        let signer_seeds = &[&[b"treasury", bet_program_binding.as_ref(), &bumps_binding][..]];

        let transfer_accounts = Transfer {
            from: self.treasury.to_account_info(),
            to: self.admin.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(self.system_program.to_account_info(), transfer_accounts, signer_seeds);

        transfer(cpi_ctx, amount)
    }
}
