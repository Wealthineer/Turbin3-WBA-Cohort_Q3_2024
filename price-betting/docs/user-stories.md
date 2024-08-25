### Users involved:
- Bet maker
- Bet taker
- Battle Resolver

### Story 1:
As a maker I want an easy way to open a bet.

#### Acceptance criteria:
- bet gets created with the onchain program
- blink is returned to the user that they can share to find someone who takes their bet
- wager is put
- (easy to understand for the user what to do) 

### Story 2:
As a maker I want customization options, so that I have full control over the bet I am creating.

#### Acceptance criteria:

- wager amount
- wager token
- timeframe during which the bet can be taken (take period)
- date after which the bet can be resolved
- token to bet on
- price point to bet of
- direction (maker sees the price below or above the price point at resolve date)

### Story 3:
As the maker I want an easy way to share my bet with friends and other potential people that  might be interested in taking me up on that bet.

#### Acceptance criteria:

- easy to share link will be provided for the maker
- possibly use blinks for even more seamless shareability 

### Story 4:
As a taker I want to see the important parameters of the bet and a way to accept it right away.

#### Acceptance criteria:
- (blink is working within X)
- displays all parameters of the bet
- enables the taker to accept the displayed bet
- (issues a link to resolve the bet at due date of the bet)
- does only work during the "take period"
- transfers the wager to a vault of the bet program

### Story 5:
As the maker or the taker, or a 3rd party resolver, I want an easy way to resolve the battle, once the date of the bet has arrived

#### Acceptance criteria:
- program resolves the bet with help of an oracle
- the battle can be resolved by anyone
- UI (blink or web page) has a single button to resolve the battle
- (if the bet is resolved using the winner wallet, claim right away)
- (maybe automated bot to resolve for the users so that it gets resolved very timely after bet is finished to get the correct price)

### Story 6:
As the winner of the bet I want to be able to claim my money.
  
##### Acceptance criteria:
- only winner wallet can call the program
- can only be called after the battle has been resolved
- all the funds get transferred to the winner (minus the protocol fee)

### Story 7:
As the maker I want a way to cancel the bet any time before it was accepted

#### Acceptance criteria:
- Only the maker can do this
- this is also available after the take period has expired
- returns the wager to the wallet of the maker

### Story/Non-User Requirement 8:
As the protocol I want to earn a fee, every time a bet is facilitated between two parties

#### Acceptance criteria:
- Protocol gets a percentage of the betting pool
- Fee gets deducted once a taker accepts the bet - not before
- Fee gets transferred to a predefined treasury wallet.