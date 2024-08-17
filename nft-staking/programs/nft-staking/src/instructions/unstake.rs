use anchor_lang::prelude::*;
use anchor_spl::{metadata::{mpl_token_metadata::instructions::{ThawDelegatedAccountCpi, ThawDelegatedAccountCpiAccounts}, MasterEditionAccount, Metadata, MetadataAccount}, token::{Revoke, revoke, Mint, Token, TokenAccount}};

use crate::state::{StakeAccount, StakeConfig, UserAccount};


#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint =  mint,
        associated_token::authority = user,
    )]
    pub mint_ata: Account<'info, TokenAccount>,
    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        seeds::program = metadata_program.key(),
        constraint = metadata.collection.as_ref().unwrap().verified == true,
        bump,
    )]
    pub metadata: Account<'info, MetadataAccount>,

    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            mint.key().as_ref(),
            b"edition",
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub edition: Account<'info, MasterEditionAccount>,
    #[account(
        seeds = [b"config".as_ref()],
        bump = config.bump,
    )]
    pub config: Account<'info, StakeConfig>,
    #[account(
        mut,
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(
        mut,
        close = user,
        seeds = [b"stake", mint.key().as_ref(), config.key().as_ref()],
        bump = stake_account.bump,
    )]
    pub stake_account: Account<'info, StakeAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,
}

impl<'info> Unstake<'info> {
    pub fn unstake(&mut self) -> Result<()> {
        let bump = [self.stake_account.bump];
        let signer_seeds = &[&[b"stake", self.mint.to_account_info().key.as_ref(), self.config.to_account_info().key.as_ref(), &bump][..]];


        let delegate  = &self.stake_account.to_account_info();
        let token_account = &self.mint_ata.to_account_info();
        let edition = &self.edition.to_account_info();
        let mint = &self.mint.to_account_info();
        let token_program = &self.token_program.to_account_info();
        let metadata_program = &self.metadata_program.to_account_info();

        ThawDelegatedAccountCpi::new(
            metadata_program,
            ThawDelegatedAccountCpiAccounts{
                delegate,
                token_account,
                edition,
                mint,
                token_program,
            }
        ).invoke_signed(signer_seeds)?;


        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = Revoke {
            source: self.mint_ata.to_account_info(),
            authority: self.user.to_account_info(),
        };

        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        revoke(cpi_context)?;

        self.user_account.amount_staked -= 1;

        let time_elapsed = ((Clock::get()?.unix_timestamp - self.stake_account.last_updated) / (60*60*24)) as u32;
        self.user_account.points += time_elapsed * self.config.points_per_stake as u32;

        Ok(())

    }
}