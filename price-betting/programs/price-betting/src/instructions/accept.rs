//move funds from taker to betting pool
//set taker as taker in the bet and accepted to true //TODO: maybe remove accepted since not necessary - just check if taker is != Pubkey::default()
//transfer fees from betting pool to treasury

use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::{error::PriceBettingError, state::program::BetProgram, Bet};

#[derive(Accounts)]
#[instruction(bet_seed: u64)]
pub struct Accept<'info> {
    #[account(mut)]
    pub bet_taker: Signer<'info>,
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
    #[account(
        mut,
        seeds = [b"treasury", bet_program.key().as_ref()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Accept<'info> {


    pub fn validate(&mut self) -> Result<()> {
        require!(self.bet.open_until as i64 > Clock::get()?.unix_timestamp, PriceBettingError::BetNoLongerAvailable);
        require!(self.bet.taker.is_none(), PriceBettingError::BetAlreadyAccepted);
        Ok(())
    }

    pub fn deposit_wager(&mut self, bet_seed: u64) -> Result<()> {
        let _ = bet_seed; //we need bet seed to derive the right bet pda - but only in the accounts
        let amount = self.betting_pool.lamports(); //TODO: If we ever want to not just match the amount the bet_creator put in, we need to change this to add that value to bet struct and take it from there

        let transfer_accounts = Transfer {
            from: self.bet_taker.to_account_info(),
            to: self.betting_pool.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.system_program.to_account_info(), transfer_accounts);

        transfer(cpi_ctx, amount)
    }

    pub fn set_bet_taker(&mut self) -> Result<()> {
        self.bet.taker = Some(self.bet_taker.key());
        Ok(())
    }

    pub fn pay_protocol_fee(&mut self) -> Result<()> {
        let fee_amount = ((self.betting_pool.lamports() as u128 * self.bet_program.fees as u128) / 10000) as u64;

        let transfer_accounts = Transfer {
            from: self.betting_pool.to_account_info(),
            to: self.treasury.to_account_info(),
        };

        let bet_binding = self.bet.key();
        let bumps_binding = [self.bet.pool_bump];
        let signer_seeds = &[&[b"betting_pool", bet_binding.as_ref(), &bumps_binding][..]];

        let cpi_ctx = CpiContext::new_with_signer(self.system_program.to_account_info(), transfer_accounts, signer_seeds);

        transfer(cpi_ctx, fee_amount)
    }
}

