use crate::*;

pub trait NonFungibleTokenCore {
    //calculates the payout for a token given the passed in balance. This is a view method
    fn nft_payout(&self, token_id: TokenId, balance: U128, max_len_payout: u32) -> Payout;
    
    //transfers the token to the receiver ID and returns the payout object that should be payed given the passed in balance. 
    fn nft_transfer_payout(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: u64,
        memo: Option<String>,
        balance: U128,
        max_len_payout: u32,
    ) -> Payout;

    fn nft_phase_payout(
        &mut self,
        token_id: TokenId,
        balance: U128,
        max_len_payout: u32,
    ) -> Payout;
}

#[near_bindgen]
impl NonFungibleTokenCore for Contract {

    //calculates the payout for a token given the passed in balance. This is a view method
    fn nft_payout(&self, token_id: TokenId, balance: U128, max_len_payout: u32) -> Payout {
        //get the token object
		let token = self.tokens_by_id.get(&token_id).expect("No token");

        //get the owner of the token
        let owner_id = token.owner_id;
        //keep track of the total perpetual royalties
        let mut total_perpetual = 0;
        //get the u128 version of the passed in balance (which was U128 before)
        let balance_u128 = u128::from(balance);
		//keep track of the payout object to send back
        let mut payout_object = Payout {
            payout: HashMap::new()
        };
        //get the subconsultants object from token
		let subconsultants = token.subconsultants;

        //make sure we're not paying out to too many people (GAS limits this)
		assert!(subconsultants.len() as u32 <= max_len_payout, "Market cannot payout to that many receivers");

        //go through each key and value in the subconsultants object
		for (k, v) in subconsultants.iter() {
            //get the key
			let key = k.clone();
            //only insert into the payout if the key isn't the token owner (we add their payout at the end)
			if key != owner_id {
                //
				payout_object.payout.insert(key, subconsultants_to_payout(*v, balance_u128));
				total_perpetual += *v;
			}
		}

		// payout to previous owner who gets 100% - total perpetual royalties
		payout_object.payout.insert(owner_id, subconsultants_to_payout(10000 - total_perpetual, balance_u128));

        //return the payout object
		payout_object
	}

    //transfers the token to the receiver ID and returns the payout object that should be payed given the passed in balance. 
    //payout
    //token_id: TokenId, phase_id: u32,
    #[payable]
    fn nft_transfer_payout(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: u64,
        memo: Option<String>,
        balance: U128,
        max_len_payout: u32,
    ) -> Payout { 
        //assert that the user attached 1 yocto NEAR for security reasons
        assert_one_yocto();
        //get the sender ID
        let sender_id = env::predecessor_account_id();
        //transfer the token to the passed in receiver and get the previous token object back
        let previous_token = self.internal_transfer(
            &sender_id,
            &receiver_id,
            &token_id,
            Some(approval_id),
            memo,
        );

        //refund the previous token owner for the storage used up by the previous approved account IDs
        refund_approved_account_ids(
            previous_token.owner_id.clone(),
            &previous_token.approved_account_ids,
        );

        //get the owner of the token
        let owner_id = previous_token.owner_id;
        //keep track of the total perpetual royalties
        let mut total_perpetual = 0;
        //get the u128 version of the passed in balance (which was U128 before)
        let balance_u128 = u128::from(balance);
		//keep track of the payout object to send back
        let mut payout_object = Payout {
            payout: HashMap::new()
        };
        //get the subconsultants object from token
		let subconsultants = previous_token.subconsultants;

        //make sure we're not paying out to too many people (GAS limits this)
		assert!(subconsultants.len() as u32 <= max_len_payout, "Market cannot payout to that many receivers");

        //go through each key and value in the subconsultants object
		for (k, v) in subconsultants.iter() {
            //get the key
			let key = k.clone();
            //only insert into the payout if the key isn't the token owner (we add their payout at the end)
			if key != owner_id {
                //
				payout_object.payout.insert(key, subconsultants_to_payout(*v, balance_u128));
				total_perpetual += *v;
			}
		}

		// payout to previous owner who gets 100% - total perpetual royalties
		payout_object.payout.insert(owner_id, subconsultants_to_payout(10000 - total_perpetual, balance_u128));

        //return the payout object
		payout_object
    }

    #[payable]
    fn nft_phase_payout(
        &mut self,
        token_id: TokenId,
        balance: U128,
        max_len_payout: u32,
    ) -> Payout { 
        //assert that the user attached 1 yocto NEAR for security reasons
        assert_one_yocto();
        //get the sender ID
        let owner_id = env::predecessor_account_id();
        //keep track of the total perpetual royalties
        let mut total_perpetual = 0;
        //get the u128 version of the passed in balance (which was U128 before)
        let balance_u128 = u128::from(balance);
		//keep track of the payout object to send back
        let mut payout_object = Payout {
            payout: HashMap::new()
        };
        //get the subconsultants object from token
        //get the token object from the token ID if it exists
        let token = self.tokens_by_id.get(&token_id).expect("No token");
		let subconsultants = token.subconsultants;

        //make sure we're not paying out to too many people (GAS limits this)
		assert!(subconsultants.len() as u32 <= max_len_payout, "Market cannot payout to that many receivers");

        //go through each key and value in the subconsultants object
		for (k, v) in subconsultants.iter() {
            //get the key
			let key = k.clone();
            //only insert into the payout if the key isn't the token owner (we add their payout at the end)
			if key != owner_id {
                //
				payout_object.payout.insert(key, subconsultants_to_payout(*v, balance_u128));
				total_perpetual += *v;
			}
		}

		// payout to previous owner who gets 100% - total perpetual royalties
		payout_object.payout.insert(owner_id, subconsultants_to_payout(10000 - total_perpetual, balance_u128));

        let supporters = token.supporters;
        //get the meatdata object to update total funding
        let mut token_meta = self.token_metadata_by_id.get(&token_id).expect("No token for metadata");

        //add all supporters funds
        let mut total_funding = 0;
        for (_k, v) in supporters.iter() {
            total_funding += *v;
        };
        let remaining_funds = total_funding - balance_u128;
        //deduct this payout from the total supporter funds
        token_meta.funding_total.replace(remaining_funds);

        //clear subconsultants for the next phase
        //token.subconsultants.clear();

        //return the payout object
		payout_object
    }
}