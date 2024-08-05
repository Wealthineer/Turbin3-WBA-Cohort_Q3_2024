use anchor_lang::prelude::*;

declare_id!("3hx5PHmctbwZAiohkqXnfzd8DxtXjc9KP7hT1RcJ7vGd");

#[program]
pub mod vote_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _url: String) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;
        Ok(())
    }

    pub fn upvote(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.upvote()?;
        Ok(())
    }

    pub fn downvote(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.downvote()?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init, 
        payer = payer,
        seeds = [_url.as_bytes().as_ref()],
        bump,
        space=VoteState::INIT_SPACE
    )]
    pub vote_account: Account<'info, VoteState>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {
        self.vote_account.score = 0;
        self.vote_account.last_vote = None;
        self.vote_account.bump = bumps.vote_account;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url: String)]
pub struct Vote<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut, 
        seeds = [_url.as_bytes().as_ref()], 
        bump = vote_account.bump, 
    )]
    pub vote_account: Account<'info, VoteState>,
}

impl<'info> Vote<'info> {
    pub fn upvote(&mut self) -> Result<()> {
        self.vote_account.score += 1;
        self.vote_account.last_vote = Some(self.payer.key());
        Ok(())
    }

    pub fn downvote(&mut self) -> Result<()> {
        self.vote_account.score -= 1;
        self.vote_account.last_vote = Some(self.payer.key());
        Ok(())
    }
}

#[account]
pub struct VoteState {
    pub score: i64,
    pub bump: u8,
    pub last_vote: Option<Pubkey>
}

impl Space for VoteState {
    const INIT_SPACE: usize = 8 + 8 + 33 + 1;
}
