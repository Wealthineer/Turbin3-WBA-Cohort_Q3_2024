use anchor_lang::prelude::*;

pub mod state;
use state::*;

pub mod contexts;
use contexts::*;

declare_id!("84naee8TwWkXjhtukdFCCPwjEUUv4ixiuAwKmXcjrjfo");

#[program]
pub mod amm {
    use super::*;

    //init a pool
    pub fn initialize(ctx: Context<Initialize>, seed: u64, fee: u16, amount_x: u64, amount_y: u64) -> Result<()> {

        ctx.accounts.save_config(seed, fee, ctx.bumps.config, ctx.bumps.mint_lp)?;
        ctx.accounts.deposit(amount_x, true)?;
        ctx.accounts.deposit(amount_y, false)?;
        ctx.accounts.mint_lp_tokens(amount_x, amount_y)?;

        Ok(())

    }


    // //Deposit liquidity to mint LP tokens
    // pub fn deposit (ctx: Context<Deposit>, amount: u64, max_x: u64, max_y: u64) -> Result<()> { //amount in LP token, max_x and max_y are used to set slippage
    //     //deposit_tokens(amount)
    //     //mint_lp_token(amount)
    // }

    // //Burn LP tokens to withdraw liquidity
    // pub fn withdraw (ctx: Context<Withdraw>, amount: u64, min_x: u64, min_y: u64) -> Result<()> { 
    //     //burn_lp_token(amnount)
    //     //withdraw_tokens(amount)
    // }



    // //expiration considerations for swap: when you take the latest block hash the transaction is valid for about 1.5 minutes - if that is too long you can either set expiration or you choose an older block hash that expires earlier -> dean preferred older block hash over expiration as parameter
    // pub fn swap (ctx: Context<Swap>, amount: u64, min_receive: u64, is_x: bool) -> Result<()> { //slippage with min_receive, direction of swap (x to y or vice versa) through is_x flag

    //    //deposit_token()
    //    //withdraw token()

    // }
}


