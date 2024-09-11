export type PriceBetting =  {
    "address": "5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL",
    "metadata": {
      "name": "price_betting",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "accept_bet",
        "discriminator": [
          251,
          25,
          85,
          221,
          41,
          69,
          191,
          252
        ],
        "accounts": [
          {
            "name": "bet_taker",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "cancel_bet",
        "discriminator": [
          17,
          248,
          130,
          128,
          153,
          227,
          231,
          9
        ],
        "accounts": [
          {
            "name": "bet_creator",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "claim_bet",
        "discriminator": [
          60,
          61,
          185,
          215,
          180,
          119,
          174,
          126
        ],
        "accounts": [
          {
            "name": "claimer",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "create_bet",
        "discriminator": [
          197,
          42,
          153,
          2,
          59,
          63,
          143,
          246
        ],
        "accounts": [
          {
            "name": "bet_creator",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          },
          {
            "name": "open_until",
            "type": "u64"
          },
          {
            "name": "resolve_date",
            "type": "u64"
          },
          {
            "name": "price_prediction",
            "type": "u64"
          },
          {
            "name": "direction_creator",
            "type": "bool"
          },
          {
            "name": "resolver_feed",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initialize",
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "admin"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "fees",
            "type": "u16"
          }
        ]
      },
      {
        "name": "resolve_bet_local_test_dummy",
        "discriminator": [
          225,
          46,
          207,
          206,
          221,
          14,
          12,
          241
        ],
        "accounts": [
          {
            "name": "resolver",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "resolver_feed",
            "relations": [
              "bet"
            ]
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "resolve_bet_wihtout_update",
        "discriminator": [
          188,
          234,
          50,
          192,
          125,
          180,
          159,
          66
        ],
        "accounts": [
          {
            "name": "resolver",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "resolver_feed",
            "relations": [
              "bet"
            ]
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw_from_treasury",
        "discriminator": [
          0,
          164,
          86,
          76,
          56,
          72,
          12,
          170
        ],
        "accounts": [
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "admin"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Bet",
        "discriminator": [
          147,
          23,
          35,
          59,
          15,
          75,
          155,
          32
        ]
      },
      {
        "name": "BetProgram",
        "discriminator": [
          192,
          199,
          192,
          9,
          23,
          23,
          235,
          69
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "BetNoLongerAvailable",
        "msg": "Bet no longer available"
      },
      {
        "code": 6001,
        "name": "BetAlreadyAccepted",
        "msg": "Bet already accepted"
      },
      {
        "code": 6002,
        "name": "BetAlreadyResolved",
        "msg": "Bet already resolved"
      },
      {
        "code": 6003,
        "name": "BetNotAccepted",
        "msg": "Bet has not been accepted yet"
      },
      {
        "code": 6004,
        "name": "ResolveDateNotReached",
        "msg": "Resolve date has not been reached yet"
      },
      {
        "code": 6005,
        "name": "BetNotResolved",
        "msg": "Bet has not been resolved yet"
      },
      {
        "code": 6006,
        "name": "Unauthorized",
        "msg": "Unauthorized"
      },
      {
        "code": 6007,
        "name": "OnlyWinnerCanClaim",
        "msg": "Only winner can claim"
      },
      {
        "code": 6008,
        "name": "FeedMismatch",
        "msg": "Resolver Feed does not match"
      },
      {
        "code": 6009,
        "name": "NoValueFound",
        "msg": "Switchbaord: NoValueFound"
      },
      {
        "code": 6010,
        "name": "NoFeedData",
        "msg": "Switchbaord: NoFeedData"
      },
      {
        "code": 6011,
        "name": "PriceConversionOverflow",
        "msg": "Switchbaord: PriceConversionOverflow"
      }
    ],
    "types": [
      {
        "name": "Bet",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "taker",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "open_until",
              "type": "u64"
            },
            {
              "name": "resolve_date",
              "type": "u64"
            },
            {
              "name": "price_prediction",
              "type": "u64"
            },
            {
              "name": "direction_creator",
              "type": "bool"
            },
            {
              "name": "resolver_feed",
              "type": "pubkey"
            },
            {
              "name": "winner",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "bet_seed",
              "type": "u64"
            },
            {
              "name": "pool_bump",
              "type": "u8"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "BetProgram",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "pubkey"
            },
            {
              "name": "treasury",
              "type": "pubkey"
            },
            {
              "name": "seed",
              "type": "u64"
            },
            {
              "name": "fees",
              "type": "u16"
            },
            {
              "name": "treasury_bump",
              "type": "u8"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ]
  }

export const IDL: PriceBetting = {
    "address": "5RoVruk757C3LWt6ZVXajctxrqTDdGJEEmH1sh5qDTPL",
    "metadata": {
      "name": "price_betting",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "accept_bet",
        "discriminator": [
          251,
          25,
          85,
          221,
          41,
          69,
          191,
          252
        ],
        "accounts": [
          {
            "name": "bet_taker",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "cancel_bet",
        "discriminator": [
          17,
          248,
          130,
          128,
          153,
          227,
          231,
          9
        ],
        "accounts": [
          {
            "name": "bet_creator",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "claim_bet",
        "discriminator": [
          60,
          61,
          185,
          215,
          180,
          119,
          174,
          126
        ],
        "accounts": [
          {
            "name": "claimer",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "create_bet",
        "discriminator": [
          197,
          42,
          153,
          2,
          59,
          63,
          143,
          246
        ],
        "accounts": [
          {
            "name": "bet_creator",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "betting_pool",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116,
                    116,
                    105,
                    110,
                    103,
                    95,
                    112,
                    111,
                    111,
                    108
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          },
          {
            "name": "open_until",
            "type": "u64"
          },
          {
            "name": "resolve_date",
            "type": "u64"
          },
          {
            "name": "price_prediction",
            "type": "u64"
          },
          {
            "name": "direction_creator",
            "type": "bool"
          },
          {
            "name": "resolver_feed",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "initialize",
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "admin"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "fees",
            "type": "u16"
          }
        ]
      },
      {
        "name": "resolve_bet_local_test_dummy",
        "discriminator": [
          225,
          46,
          207,
          206,
          221,
          14,
          12,
          241
        ],
        "accounts": [
          {
            "name": "resolver",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "resolver_feed",
            "relations": [
              "bet"
            ]
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "resolve_bet_wihtout_update",
        "discriminator": [
          188,
          234,
          50,
          192,
          125,
          180,
          159,
          66
        ],
        "accounts": [
          {
            "name": "resolver",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_creator"
          },
          {
            "name": "bet_program",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program.admin",
                  "account": "BetProgram"
                },
                {
                  "kind": "account",
                  "path": "bet_program.seed",
                  "account": "BetProgram"
                }
              ]
            }
          },
          {
            "name": "bet",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    98,
                    101,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                },
                {
                  "kind": "account",
                  "path": "bet_creator"
                },
                {
                  "kind": "arg",
                  "path": "bet_seed"
                }
              ]
            }
          },
          {
            "name": "resolver_feed",
            "relations": [
              "bet"
            ]
          }
        ],
        "args": [
          {
            "name": "bet_seed",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdraw_from_treasury",
        "discriminator": [
          0,
          164,
          86,
          76,
          56,
          72,
          12,
          170
        ],
        "accounts": [
          {
            "name": "admin",
            "writable": true,
            "signer": true
          },
          {
            "name": "bet_program",
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    112,
                    114,
                    111,
                    103,
                    114,
                    97,
                    109
                  ]
                },
                {
                  "kind": "account",
                  "path": "admin"
                },
                {
                  "kind": "arg",
                  "path": "seed"
                }
              ]
            }
          },
          {
            "name": "treasury",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    116,
                    114,
                    101,
                    97,
                    115,
                    117,
                    114,
                    121
                  ]
                },
                {
                  "kind": "account",
                  "path": "bet_program"
                }
              ]
            }
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "seed",
            "type": "u64"
          }
        ]
      }
    ],
    "accounts": [
      {
        "name": "Bet",
        "discriminator": [
          147,
          23,
          35,
          59,
          15,
          75,
          155,
          32
        ]
      },
      {
        "name": "BetProgram",
        "discriminator": [
          192,
          199,
          192,
          9,
          23,
          23,
          235,
          69
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "BetNoLongerAvailable",
        "msg": "Bet no longer available"
      },
      {
        "code": 6001,
        "name": "BetAlreadyAccepted",
        "msg": "Bet already accepted"
      },
      {
        "code": 6002,
        "name": "BetAlreadyResolved",
        "msg": "Bet already resolved"
      },
      {
        "code": 6003,
        "name": "BetNotAccepted",
        "msg": "Bet has not been accepted yet"
      },
      {
        "code": 6004,
        "name": "ResolveDateNotReached",
        "msg": "Resolve date has not been reached yet"
      },
      {
        "code": 6005,
        "name": "BetNotResolved",
        "msg": "Bet has not been resolved yet"
      },
      {
        "code": 6006,
        "name": "Unauthorized",
        "msg": "Unauthorized"
      },
      {
        "code": 6007,
        "name": "OnlyWinnerCanClaim",
        "msg": "Only winner can claim"
      },
      {
        "code": 6008,
        "name": "FeedMismatch",
        "msg": "Resolver Feed does not match"
      },
      {
        "code": 6009,
        "name": "NoValueFound",
        "msg": "Switchbaord: NoValueFound"
      },
      {
        "code": 6010,
        "name": "NoFeedData",
        "msg": "Switchbaord: NoFeedData"
      },
      {
        "code": 6011,
        "name": "PriceConversionOverflow",
        "msg": "Switchbaord: PriceConversionOverflow"
      }
    ],
    "types": [
      {
        "name": "Bet",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "taker",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "open_until",
              "type": "u64"
            },
            {
              "name": "resolve_date",
              "type": "u64"
            },
            {
              "name": "price_prediction",
              "type": "u64"
            },
            {
              "name": "direction_creator",
              "type": "bool"
            },
            {
              "name": "resolver_feed",
              "type": "pubkey"
            },
            {
              "name": "winner",
              "type": {
                "option": "pubkey"
              }
            },
            {
              "name": "bet_seed",
              "type": "u64"
            },
            {
              "name": "pool_bump",
              "type": "u8"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "BetProgram",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "pubkey"
            },
            {
              "name": "treasury",
              "type": "pubkey"
            },
            {
              "name": "seed",
              "type": "u64"
            },
            {
              "name": "fees",
              "type": "u16"
            },
            {
              "name": "treasury_bump",
              "type": "u8"
            },
            {
              "name": "bump",
              "type": "u8"
            }
          ]
        }
      }
    ]
  }