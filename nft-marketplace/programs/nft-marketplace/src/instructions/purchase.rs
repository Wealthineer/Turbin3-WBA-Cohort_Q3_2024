//pay fee to treasury
//rewards for taker
//close listing and vault

use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};
use anchor_spl::{associated_token::AssociatedToken, metadata::Metadata, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked, CloseAccount, close_account}};

use crate::{listing::Listing, marketplace::Marketplace};


#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    taker: Signer<'info>,
    maker: SystemAccount<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump,
    )]
    marketplace: Box<Account<'info, Marketplace>>,
    maker_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = maker_mint,
        associated_token::authority = taker,
        associated_token::token_program = token_program
    )]
    taker_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump = listing.bump,
    )]
    listing: Box<Account<'info, Listing>>,

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = listing,    
    )]
    vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump = marketplace.treasury_bump,
    )]
    treasury: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub metadata_program: Program<'info, Metadata>,
    associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Purchase<'info> {
    pub fn purchase(&self) -> Result<()> {    
        //move nft from vault to taker
        let seeds = &[
            &self.marketplace.key().to_bytes()[..],
            &self.maker_mint.key().to_bytes()[..],
            &[self.listing.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.taker_ata.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(self.token_program.to_account_info(), accounts, signer_seeds);

        transfer_checked(cpi_ctx, 1, self.maker_mint.decimals)?;

        //send fee to treasury
        let fee_amount = ((self.listing.price as u128 * self.marketplace.fee as u128) / 10000) as u64;

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer { 
            from: self.taker.to_account_info(),
            to: self.treasury.to_account_info(),
         };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, fee_amount)?;
        //pay maker
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer { 
            from: self.taker.to_account_info(),
            to: self.maker.to_account_info(),
         };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, self.listing.price - fee_amount)?;

        //close vault
        let accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.maker.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        let ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            accounts,
            signer_seeds
        );

        close_account(ctx)?;

        Ok(())
    }
}