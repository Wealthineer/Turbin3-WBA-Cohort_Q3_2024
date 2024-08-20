use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("name too long")]
    NameTooLong,
}
