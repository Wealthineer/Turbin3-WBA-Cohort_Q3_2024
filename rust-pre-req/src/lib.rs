mod programs;

#[cfg(test)]
mod tests {
    use crate::programs::wba_prereq::{CompleteArgs, UpdateArgs, WbaPrereqProgram};
    use bs58;
    use dotenv::dotenv;
    use solana_client::rpc_client::RpcClient;
    use solana_program::{pubkey::Pubkey, system_instruction::transfer, system_program};
    use solana_sdk::{
        message::Message,
        signature::{read_keypair_file, Keypair, Signer},
        transaction::Transaction,
    };
    use std::io::{self, BufRead};
    use std::str::FromStr;

    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!(
            "You have generated a new Solana wallet: {}",
            kp.pubkey().to_string()
        );
        println!("");
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
    }
    #[test]
    fn airdop() {
        //Import the keypair from dev-wallet.json
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        //Connect to Solana devnet rpc client
        let client = RpcClient::new(RPC_URL);

        //claim 2 devnet SOL - 2 billion lamports
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(signature) => {
                println!("Success! Checkout your TX here: ");
                println!(
                    "https://explorer.solana.com/tx/{}?cluster=devnet",
                    signature.to_string()
                );
            }
            Err(e) => {
                println!("Oops, something went wrong: {}", e.to_string());
            }
        }
    }

    #[test]
    fn transfer_sol() {
        dotenv().ok();
        //import keypair
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let wba_pubkey = Pubkey::from_str(&std::env::var("WBA_PUB_KEY").unwrap()).unwrap();
        //connect to solana devnet rpc client
        let client = RpcClient::new(RPC_URL);
        //get recent blockhash
        let recent_blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &wba_pubkey, 100_000_000)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }

    #[test]
    fn clear_dev_wallet() {
        dotenv().ok();
        //import keypair
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let wba_pubkey = Pubkey::from_str(&std::env::var("WBA_PUB_KEY").unwrap()).unwrap();
        //connect to solana devnet rpc client
        let client = RpcClient::new(RPC_URL);
        //get recent blockhash

        let balance = client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");
        println!("Current balance: {}", balance);

        let recent_blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        //mock transaction to calculate fees
        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &wba_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );

        let fee = client
            .get_fee_for_message(&message)
            .expect("Failed to get fee");
        println!("Estimated fee: {}", fee);

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &wba_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );

        let closing_balance = client
            .get_balance(&keypair.pubkey())
            .expect("Failed to get balance");
        println!("Closing balance: {}", closing_balance);
    }

    #[test]
    fn base58_to_wallet() {
        println!("Input your private key as base58:");
        let stdin = io::stdin();
        let base58 = stdin.lock().lines().next().unwrap().unwrap();
        println!("Your wallet file is:");
        let wallet = bs58::decode(base58).into_vec().unwrap();
        println!("{:?}", wallet);
    }
    #[test]
    fn wallet_to_base58() {
        println!("Input your private key as a wallet file byte array:");
        let stdin = io::stdin();
        let wallet = stdin
            .lock()
            .lines()
            .next()
            .unwrap()
            .unwrap()
            .trim_start_matches('[')
            .trim_end_matches(']')
            .split(',')
            .map(|s| s.trim().parse::<u8>().unwrap())
            .collect::<Vec<u8>>();
        println!("Your private key is:");
        let base58 = bs58::encode(wallet).into_string();
        println!("{:?}", base58);
    }
    #[test]
    fn complete_wba() {
        dotenv().ok();
        let client = RpcClient::new(RPC_URL);
        let signer = read_keypair_file("wba-wallet.json").expect("Couldn't find wallet file");

        let prereq = WbaPrereqProgram::derive_program_address(&[
            b"prereq",
            signer.pubkey().to_bytes().as_ref(),
        ]);

        let github_account =
            std::env::var("GITHUB_ACCOUNT").expect("GITHUB_ACCOUNT not set in .env");

        println!("Github account: {}", github_account);
        
        let args = CompleteArgs {
            github: github_account.as_bytes().to_vec(),
        };

        let recent_blockhash = client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");

        let transaction = WbaPrereqProgram::complete(
            &[&signer.pubkey(), &prereq, &system_program::id()],
            &args,
            Some(&signer.pubkey()),
            &[&signer],
            recent_blockhash,
        );

        let signature = client
            .send_and_confirm_transaction(&transaction)
            .expect("Failed to send transaction");

        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet",
            signature
        );
    }
}
