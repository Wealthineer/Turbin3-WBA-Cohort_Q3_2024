use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, metadata::Metadata, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked, CloseAccount, close_account}};

use crate::{listing::Listing, marketplace::Marketplace};


#[derive(Accounts)]
pub struct Delist<'info> {
    #[account(mut)]
    maker: Signer<'info>,
    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump,
    )]
    marketplace: Box<Account<'info, Marketplace>>,
    maker_mint: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = maker,
    )]
    maker_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        mut,
        close = maker,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump,
    )]
    listing: Box<Account<'info, Listing>>,

    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = listing,    
    )]
    vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub metadata_program: Program<'info, Metadata>,
    associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Delist<'info> {
    pub fn withdraw_nft(&self) -> Result<()> {

        let seeds = &[
            &self.marketplace.key().to_bytes()[..],
            &self.maker_mint.key().to_bytes()[..],
            &[self.listing.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let accounts = TransferChecked {
            from: self.vault.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.maker_ata.to_account_info(),
            authority: self.listing.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(self.token_program.to_account_info(), accounts, signer_seeds);

        transfer_checked(cpi_ctx, 1, self.maker_mint.decimals)?;

        //close account
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