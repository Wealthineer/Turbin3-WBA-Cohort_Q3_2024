use anchor_lang::prelude::*;

#[error_code]
pub enum PriceBettingError {
    #[msg("Bet no longer available")]
    BetNoLongerAvailable,
    #[msg("Bet already accepted")]
    BetAlreadyAccepted,
}