use crate::*;

// await contract.nft_mint ({token_id: "token-2", metadata: {title: "Skate Park", description: "New Skate Park", media: "https://gateway.pinata.cloud/ipfs/QmUw6rr1AyApS8qFyo3FYS2Sc4Y4iVrPN6LevFgoUmdrsL", funding_goal: 45, funding_min_deposit: 5}, receiver_id: "bim-starter.sp03.testnet"}, "300000000000000", "3000000000000000000000000")

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        metadata: TokenMetadata,
        receiver_id: AccountId,
        //we add an optional parameter for sub consultant fund
        subconsultants_funds: Option<HashMap<AccountId, u32>>,
    ) {
        //measure the initial storage being used on the contract
        let initial_storage_usage = env::storage_usage();

        // create a subconsultants map to store in the token
        let mut subconsultants = HashMap::new();

        // if sub consultant fund were passed into the function: 
        if let Some(subconsultants_funds) = subconsultants_funds {
            //make sure that the length of the sub consultant fund is below 7 since we won't have enough GAS to pay out that many people
            assert!(subconsultants_funds.len() < 7, "Cannot add more than 6 perpetual subconsultants amounts");

            //iterate through the sub consultant fund and insert the account and amount in the subconsultants map
            for (account, amount) in subconsultants_funds {
                subconsultants.insert(account, amount);
            }
        }

        //specify the token struct that contains the owner ID 
        let token = Token {
            //set the owner ID equal to the receiver ID passed into the function
            owner_id: receiver_id,
            //we set the approved account IDs to the default value (an empty map)
            approved_account_ids: Default::default(),
            //the next approval ID is set to 0
            next_approval_id: 0,
            //the map of sub consultant fund for the token (The owner will get 100% - total sub consultant fund)
            subconsultants,
            //set supporters to an empty map
            supporters: Default::default(),
        };

        //insert the token ID and token struct and make sure that the token doesn't exist
        assert!(
            self.tokens_by_id.insert(&token_id, &token).is_none(),
            "Token already exists"
        );

        //insert the token ID and metadata
        self.token_metadata_by_id.insert(&token_id, &metadata);

        //call the internal method for adding the token to the owner
        self.internal_add_token_to_owner(&token.owner_id, &token_id);

        // Construct the mint log as per the events standard.
        let nft_mint_log: EventLog = EventLog {
            // Standard name ("nep171").
            standard: NFT_STANDARD_NAME.to_string(),
            // Version of the standard ("nft-1.0.0").
            version: NFT_METADATA_SPEC.to_string(),
            // The data related with the event stored in a vector.
            event: EventLogVariant::NftMint(vec![NftMintLog {
                // Owner of the token.
                owner_id: token.owner_id.to_string(),
                // Vector of token IDs that were minted.
                token_ids: vec![token_id.to_string()],
                // An optional memo to include.
                memo: None,
            }]),
        };

        // Log the serialized json.
        env::log_str(&nft_mint_log.to_string());

        //calculate the required storage which was the used - initial
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

        //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
        refund_deposit(required_storage_in_bytes);
    }

    #[payable]
    pub fn nft_consultants(
        &mut self,
        token_id: TokenId,
        subconsultants_funds: Option<HashMap<AccountId, u32>>,
        bim_file: Option<String>,
    ) {
        //get the token object from the token ID if it exists
        let mut token = self.tokens_by_id.get(&token_id).expect("No token");

        let mut token_meta = self.token_metadata_by_id.get(&token_id).expect("No token for metadata");

        token_meta.media = bim_file;
        token_meta.reference.replace("Team".to_string());

        token.subconsultants.clear();

        // if sub consultant fund were passed into the function: 
        if let Some(subconsultants_funds) = subconsultants_funds {
            //make sure that the length of the sub consultant fund is below 7 since we won't have enough GAS to pay out that many people
            assert!(subconsultants_funds.len() < 7, "Cannot add more than 6 subconsultants amounts");

            //iterate through the sub consultant fund and insert the account and amount in the subconsultants map
            for (account, amount) in subconsultants_funds {
                token.subconsultants.insert(account, amount);
            }
        }
        //insert the token ID and metadata
        self.token_metadata_by_id.insert(&token_id, &token_meta);

        //insert the token ID and sub consultants
        self.tokens_by_id.insert(&token_id, &token);

    }

    #[payable]
    pub fn nft_project_phase(
        &mut self,
        token_id: TokenId,
        phase: Option<String>,
    ) {
        
        let mut token_meta = self.token_metadata_by_id.get(&token_id).expect("No token for metadata");

        token_meta.phase = phase;

        //insert the token ID and metadata
        self.token_metadata_by_id.insert(&token_id, &token_meta);

    }

    // await contract.donation({token_id: "token-2", supporter_id: "sp02.testnet"}, "300000000000000", "3000000000000000000000000")
    
    #[payable]
    pub fn donation(
        &mut self,
        token_id: TokenId,
    ) {
        assert_at_least_one_yocto();
        //measure the initial storage being used on the contract
        let initial_storage_usage = env::storage_usage();
        let supporter_id = env::predecessor_account_id();
        let amount = env::attached_deposit();

        //get the token object from the token ID if it exists
        let mut token = self.tokens_by_id.get(&token_id).expect("No token");

        //with the token search for the supporter id. 
        //If found add amount to existing amount. 
        //If not found add supporter id and their amount

        match token.supporters.get(&supporter_id){
            Some(&current_amount) => token.supporters.insert(supporter_id, current_amount + amount),
            None => token.supporters.insert(supporter_id, amount),
        };
        let supporters = &token.supporters;
        //add all supporters funds
        let mut total_funding = 0;
        for (_k, v) in supporters.iter() {
            total_funding += *v;
        };

        //get the metadata object to update total funding
        let mut token_meta = self.token_metadata_by_id.get(&token_id).expect("No token for metadata");

        token_meta.funding_total.replace(total_funding);

        let project_ref = "Project";
        if token_meta.funding_total >= token_meta.funding_goal {
            token_meta.reference.replace(project_ref.to_string())
        } else {
            None
        };
        //insert the token ID and metadata
        self.tokens_by_id.insert(&token_id, &token);

        //insert the token ID and metadata
        self.token_metadata_by_id.insert(&token_id, &token_meta);

        //if funded is true return money to wanna be supporter

        // TODO: let storage_used = bytes_for_supporter(&supporter_id, env::attached_deposit());

        //calculate the required storage which was the used - initial
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

        //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
        refund_deposit(required_storage_in_bytes);
    }
}