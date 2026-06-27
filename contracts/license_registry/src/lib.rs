#![allow(clippy::needless_pass_by_value)]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, Address, BytesN, Env, Symbol, Vec,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin = 0,
    Owner = 1,
    LicenseCounter = 2,
    License(u128) = 3,
    CreatorLicenses(Address) = 4,
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
    pub state: Symbol,
    pub royalty_bps: u32,
}

#[contract]
pub struct LicenseRegistry;

#[contractimpl]
impl LicenseRegistry {
    pub fn __constructor(env: Env, admin: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Owner, &admin);
        env.storage().instance().set(&DataKey::LicenseCounter, &0u128);
    }

    pub fn init_license(
        env: Env,
        creator: Address,
        licensee: Address,
        terms_hash: BytesN<32>,
        royalty_bps: u32,
    ) -> u128 {
        creator.require_auth();
        if royalty_bps > 10000 {
            panic_with_error!(&env, Error::InvalidInput);
        }

        let counter: u128 = env.storage().instance().get(&DataKey::LicenseCounter).unwrap_or(0);
        let id = counter + 1;
        let record = LicenseRecord {
            id,
            creator: creator.clone(),
            licensee: licensee.clone(),
            terms_hash: terms_hash.clone(),
            state: Symbol::new(&env, "draft"),
            royalty_bps,
        };
        env.storage().persistent().set(&DataKey::License(id), &record);
        let mut licenses = env.storage().persistent().get(&DataKey::CreatorLicenses(creator.clone())).unwrap_or(Vec::new(&env));
        licenses.push_back(record.clone());
        env.storage().persistent().set(&DataKey::CreatorLicenses(creator), &licenses);
        env.storage().instance().set(&DataKey::LicenseCounter, &id);

        env.events().publish((Symbol::new(&env, "license_created"), id), (creator, licensee, terms_hash, royalty_bps));
        id
    }

    pub fn activate_license(env: Env, id: u128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        let mut record: LicenseRecord = env.storage().persistent().get(&DataKey::License(id)).unwrap_or_else(|| panic_with_error!(&env, Error::NotFound));
        if record.state != Symbol::new(&env, "draft") {
            panic_with_error!(&env, Error::InvalidState);
        }
        record.state = Symbol::new(&env, "active");
        env.storage().persistent().set(&DataKey::License(id), &record);
        env.events().publish((Symbol::new(&env, "license_activated"), id), record.creator);
    }

    pub fn get_license(env: Env, id: u128) -> LicenseRecord {
        env.storage().persistent().get(&DataKey::License(id)).unwrap_or_else(|| panic_with_error!(&env, Error::NotFound))
    }

    pub fn get_creator_licenses(env: Env, creator: Address) -> Vec<LicenseRecord> {
        env.storage().persistent().get(&DataKey::CreatorLicenses(creator)).unwrap_or(Vec::new(&env))
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
    use super::*;
    use soroban_sdk::testutils::Address as TestAddress;

    #[test]
    fn creates_and_reads_license() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let contract = LicenseRegistryClient::new(&env, &env.register_contract(None, LicenseRegistry {}));
        contract.__constructor(&admin);

        let terms_hash = BytesN::from_array(&env, &[1u8; 32]);
        let id = contract.init_license(&creator, &licensee, &terms_hash, &2000);
        let record = contract.get_license(&id);
        assert_eq!(record.state, Symbol::new(&env, "draft"));
        assert_eq!(record.royalty_bps, 2000);
    }

    #[test]
    fn activates_license() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let contract = LicenseRegistryClient::new(&env, &env.register_contract(None, LicenseRegistry {}));
        contract.__constructor(&admin);

        let terms_hash = BytesN::from_array(&env, &[2u8; 32]);
        let id = contract.init_license(&creator, &licensee, &terms_hash, &1500);
        contract.activate_license(&id);
        let record = contract.get_license(&id);
        assert_eq!(record.state, Symbol::new(&env, "active"));
    }

    #[test]
    fn rejects_invalid_royalty() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let contract = LicenseRegistryClient::new(&env, &env.register_contract(None, LicenseRegistry {}));
        contract.__constructor(&admin);

        let terms_hash = BytesN::from_array(&env, &[3u8; 32]);
        let result = std::panic::catch_unwind(|| {
            contract.init_license(&creator, &licensee, &terms_hash, &10001);
        });
        assert!(result.is_err());
    }
}
