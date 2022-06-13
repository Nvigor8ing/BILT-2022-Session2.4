import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
        // await contract.nft_mint ({token_id: "token-1", metadata: {title: "My Non Fungible Team Token", description: "The Team Most Certainly Goes :)", media: "https://bafybeiftczwrtyr3k7a2k4vutd3amkwsmaqyhrdzlhvpt33dyjivufqusq.ipfs.dweb.link/goteam-gif.gif"}, receiver_id: "bim-starter.sp02.testnet"}, "300000000000000", "3000000000000000000000000")
   
 
    viewMethods: [
      'nft_tokens',
      'nft_metadata',
      'nft_token',
      'nft_tokens_for_owner',
      'nft_total_supply',
      'nft_supply_for_owner',
      'nft_payout',
      'nft_is_approved'
    ],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: [
      'new_default_meta',
      'nft_mint',
      'nft_approve',
      'nft_consultants',
      'nft_transfer_payout',
      'nft_project_phase',
      'nft_phase_payout',
      'nft_revoke',
      'nft_revoke_all',
      'donation'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}
