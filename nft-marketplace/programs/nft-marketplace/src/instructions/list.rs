use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, metadata::{MasterEditionAccount, Metadata, MetadataAccount}, token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked}};

use crate::{listing::Listing, marketplace::Marketplace};


#[derive(Accounts)]
pub struct List<'info> {
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
        init,
        payer = maker,
        space = Listing::INIT_SPACE,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump,
    )]
    listing: Box<Account<'info, Listing>>,

    #[account(
        init_if_needed,
        payer = maker,
        associated_token::mint = maker_mint,
        associated_token::authority = listing,    
    )]
    vault: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            maker_mint.key().as_ref(),
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub metadata: Account<'info, MetadataAccount>,

    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            maker_mint.key().as_ref(),
            b"edition",
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub edition: Account<'info, MasterEditionAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>,
    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> List<'info> {
    pub fn list(&mut self, price: u64, bumps: &ListBumps) -> Result<()> {
        self.listing.set_inner(Listing {
            maker: self.maker.key(),
            mint: self.maker_mint.key(),
            price,
            bump: bumps.listing,
        });

        Ok(())
    }

    pub fn deposit_nft(&mut self) -> Result<()> {
        
        let accounts = TransferChecked {
            from: self.maker_ata.to_account_info(),
            mint: self.maker_mint.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(self.token_program.to_account_info(), accounts);

        transfer_checked(cpi_ctx, 1, self.maker_mint.decimals)
    }
}