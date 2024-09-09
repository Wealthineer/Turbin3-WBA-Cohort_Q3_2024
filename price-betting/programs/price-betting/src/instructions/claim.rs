use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::{state::program::BetProgram, Bet, error::PriceBettingError};

#[derive(Accounts)]
#[instruction(bet_seed: u64)]
pub struct Claim<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,
    /// CHECK: No checks needed
    pub bet_creator: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"program", bet_program.admin.key().as_ref(), bet_program.seed.to_le_bytes().as_ref()],
        bump = bet_program.bump
    )]
    pub bet_program: Account<'info, BetProgram>,
    #[account(
        mut,
        close = bet_creator,
        seeds = [b"bet", bet_program.key().as_ref(), bet_creator.key().as_ref(), bet_seed.to_le_bytes().as_ref()],
        bump = bet.bump,
    )]
    pub bet: Account<'info, Bet>,
    #[account(
        mut,
        seeds = [b"betting_pool", bet.key().as_ref()],
        bump = bet.pool_bump,
    )]
    pub betting_pool: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Claim<'info> {

    pub fn validate(&mut self) -> Result<()> {
        //If there is a winner, the battle has been resolved - no further tests required
        require!(self.bet.winner.is_some(), PriceBettingError::BetNotResolved);
        require!(self.claimer.key() == self.bet.winner.unwrap(), PriceBettingError::OnlyWinnerCanClaim);
        Ok(())
    }

    pub fn claim_winnings(&mut self) -> Result<()> {
        let amount = self.betting_pool.lamports();

        let transfer_accounts = Transfer {
            from: self.betting_pool.to_account_info(),
            to: self.claimer.to_account_info(),
        };

        let bet_binding = self.bet.key();
        let bumps_binding = [self.bet.pool_bump];
        let signer_seeds = &[&[b"betting_pool", bet_binding.as_ref(), &bumps_binding][..]];

        let cpi_ctx = CpiContext::new_with_signer(self.system_program.to_account_info(), transfer_accounts, signer_seeds);

        transfer(cpi_ctx, amount)
    }
}