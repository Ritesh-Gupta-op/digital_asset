#![no_std]
#![allow(clippy::needless_pass_by_value)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, panic_with_error, Address, BytesN, Env, Symbol,
};

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum LicenseState {
    Draft = 1,
    Active = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    Owner,
    License(u128),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NotAuthorized = 1,
    AlreadyExists = 2,
    NotFound = 3,
    InvalidState = 4,
    InvalidInput = 5,
    UpgradeNotAllowed = 6,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct LicenseRecord {
    pub id: u128,
    pub creator: Address,
    pub licensee: Address,
    pub terms_hash: BytesN<32>,
    pub state: LicenseState,
    pub royalty_bps: u32,
}

#[contract]
pub struct LicenseRegistry;

#[contractimpl]
impl LicenseRegistry {
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Owner, &admin);
    }

    pub fn init_license(
        env: Env,
        id: u128,
        creator: Address,
        licensee: Address,
        terms_hash: BytesN<32>,
        royalty_bps: u32,
    ) {
        creator.require_auth();
        if royalty_bps > 10000 {
            panic_with_error!(&env, Error::InvalidInput);
        }
        if env.storage().persistent().has(&DataKey::License(id)) {
            panic_with_error!(&env, Error::AlreadyExists);
        }

        let record = LicenseRecord {
            id,
            creator: creator.clone(),
            licensee: licensee.clone(),
            terms_hash: terms_hash.clone(),
            state: LicenseState::Draft,
            royalty_bps,
        };
        env.storage().persistent().set(&DataKey::License(id), &record);

        env.events().publish((Symbol::new(&env, "license_created"), id), (creator, licensee, terms_hash, royalty_bps));
    }

    pub fn activate_license(env: Env, id: u128) {
        let mut record: LicenseRecord = env.storage().persistent().get(&DataKey::License(id)).unwrap_or_else(|| panic_with_error!(&env, Error::NotFound));
        
        record.creator.require_auth();

        if record.state != LicenseState::Draft {
            panic_with_error!(&env, Error::InvalidState);
        }
        record.state = LicenseState::Active;
        env.storage().persistent().set(&DataKey::License(id), &record);
        env.events().publish((Symbol::new(&env, "license_activated"), id), record.creator);
    }

    pub fn get_license(env: Env, id: u128) -> LicenseRecord {
        env.storage().persistent().get(&DataKey::License(id)).unwrap_or_else(|| panic_with_error!(&env, Error::NotFound))
    }

    pub fn transfer_ownership(env: Env, new_owner: Address) {
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        owner.require_auth();
        env.storage().instance().set(&DataKey::Owner, &new_owner);
        env.events().publish((Symbol::new(&env, "ownership_transferred"),), (owner, new_owner));
    }

    pub fn upgrade(env: Env, new_wasm_hash: BytesN<32>) {
        let owner: Address = env.storage().instance().get(&DataKey::Owner).unwrap();
        owner.require_auth();
        env.deployer().update_current_contract_wasm(new_wasm_hash);
    }
}

#[cfg(test)]
mod test {
    extern crate std;
    use super::*;
    use soroban_sdk::testutils::Address as TestAddress;

    #[test]
    fn creates_and_reads_license() {
        let env = Env::default();
        env.mock_all_auths();
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let contract = LicenseRegistryClient::new(&env, &env.register_contract(None, LicenseRegistry {}));
        contract.init(&admin);

        let terms_hash = BytesN::from_array(&env, &[1u8; 32]);
        let id = 12345;
        contract.init_license(&id, &creator, &licensee, &terms_hash, &2000);
        let record = contract.get_license(&id);
        assert_eq!(record.state, LicenseState::Draft);
        assert_eq!(record.royalty_bps, 2000);
    }

    #[test]
    fn activates_license() {
        let env = Env::default();
        env.mock_all_auths();
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let contract = LicenseRegistryClient::new(&env, &env.register_contract(None, LicenseRegistry {}));
        contract.init(&admin);

        let terms_hash = BytesN::from_array(&env, &[2u8; 32]);
        let id = 67890;
        contract.init_license(&id, &creator, &licensee, &terms_hash, &1500);
        contract.activate_license(&id);
        let record = contract.get_license(&id);
        assert_eq!(record.state, LicenseState::Active);
    }

    #[test]
    fn rejects_invalid_royalty() {
        let env = Env::default();
        env.mock_all_auths();
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let contract = LicenseRegistryClient::new(&env, &env.register_contract(None, LicenseRegistry {}));
        contract.init(&admin);

        let terms_hash = BytesN::from_array(&env, &[3u8; 32]);
        let id = 999;
        let result = std::panic::catch_unwind(|| {
            contract.init_license(&id, &creator, &licensee, &terms_hash, &10001);
        });
        assert!(result.is_err());
    }
}
