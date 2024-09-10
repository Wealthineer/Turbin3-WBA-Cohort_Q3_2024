use anchor_lang::prelude::*;

#[error_code]
pub enum PriceBettingError {
    #[msg("Bet no longer available")]
    BetNoLongerAvailable,
    #[msg("Bet already accepted")]
    BetAlreadyAccepted,
    #[msg("Bet already resolved")]
    BetAlreadyResolved,
    #[msg("Bet has not been accepted yet")]
    BetNotAccepted,
    #[msg("Resolve date has not been reached yet")]
    ResolveDateNotReached,
    #[msg("Bet has not been resolved yet")]
    BetNotResolved,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Only winner can claim")]
    OnlyWinnerCanClaim,
    #[msg("Resolver Feed does not match")]
    FeedMismatch,
    #[msg("Switchbaord: NoValueFound")]
    NoValueFound,
    #[msg("Switchbaord: NoFeedData")]
    NoFeedData,
    #[msg("Switchbaord: PriceConversionOverflow")]
    PriceConversionOverflow,
}