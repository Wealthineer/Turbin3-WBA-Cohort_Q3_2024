use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};

use crate::{state::program::BetProgram, Bet};

#[derive(Accounts)]
#[instruction(bet_seed: u64)]
pub struct Create<'info> {
    #[account(mut)]
    pub bet_creator: Signer<'info>,
    #[account(
        mut,
        seeds = [b"program", bet_program.admin.key().as_ref(), bet_program.seed.to_le_bytes().as_ref()],
        bump = bet_program.bump
    )]
    pub bet_program: Account<'info, BetProgram>,
    #[account(
        init,
        payer = bet_creator,
        seeds = [b"bet", bet_program.key().as_ref(), bet_creator.key().as_ref(), bet_seed.to_le_bytes().as_ref()],
        bump,
        space = Bet::INIT_SPACE,
    )]
    pub bet: Account<'info, Bet>,
    #[account(
        mut,
        seeds = [b"betting_pool", bet.key().as_ref()],
        bump,
    )]
    pub betting_pool: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Create<'info> {
    pub fn create_bet(&mut self, bet_seed: u64, open_until: u64, resolve_date: u64, price_prediction: u64, direction_creator: bool, resolver_feed: Pubkey, bumps: &CreateBumps) -> Result<()> {
        self.bet.set_inner(Bet {
            taker: None,
            open_until,
            resolve_date,
            price_prediction,
            direction_creator,
            resolver_feed,
            winner: None,
            bet_seed,
            bump: bumps.bet,
        });
        Ok(())
    }

    pub fn deposit_wager(&mut self, amount: u64) -> Result<()> {
        let transfer_accounts = Transfer {
            from: self.bet_creator.to_account_info(),
            to: self.betting_pool.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(self.system_program.to_account_info(), transfer_accounts);

        transfer(cpi_ctx, amount)
    }
}