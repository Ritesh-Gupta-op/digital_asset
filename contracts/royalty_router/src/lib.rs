#![allow(clippy::needless_pass_by_value)]

use soroban_sdk::{
    contract, contractclient, contracterror, contractimpl, contracttype, Address, BytesN, Env,
    Symbol,
};

#[contractclient(name = "LicenseRegistryClient")]
pub trait LicenseRegistryContract {
    fn init_license(
        env: Env,
        creator: Address,
        licensee: Address,
        terms_hash: BytesN<32>,
        royalty_bps: u32,
    ) -> u128;
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin = 0,
    Registry = 1,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NotAuthorized = 1,
    InvalidInput = 2,
    RegistryCallFailed = 3,
}

#[contract]
pub struct RoyaltyRouter;

#[contractimpl]
impl RoyaltyRouter {
    pub fn __constructor(env: Env, admin: Address, registry: Address) {
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Registry, &registry);
    }

    pub fn route_royalty(env: Env, creator: Address, licensee: Address, terms_hash: BytesN<32>, royalty_bps: u32) -> u128 {
        creator.require_auth();
        if royalty_bps > 10000 {
            panic_with_error!(&env, Error::InvalidInput);
        }

        let registry: Address = env.storage().instance().get(&DataKey::Registry).unwrap();
        let client = LicenseRegistryClient::new(&env, &registry);
        let _ = client.init_license(&creator, &licensee, &terms_hash, &royalty_bps);
        env.events().publish((Symbol::new(&env, "royalty_routed"),), (creator, licensee, terms_hash, royalty_bps));
        1u128
    }

    pub fn get_registry(env: Env) -> Address {
        env.storage().instance().get(&DataKey::Registry).unwrap()
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as TestAddress;

    #[test]
    fn stores_registry_address() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let registry = Address::generate(&env);
        let contract = RoyaltyRouterClient::new(&env, &env.register_contract(None, RoyaltyRouter {}));
        contract.__constructor(&admin, &registry);
        assert_eq!(contract.get_registry(), registry);
    }

    #[test]
    fn validates_royalty_input() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let registry = Address::generate(&env);
        let contract = RoyaltyRouterClient::new(&env, &env.register_contract(None, RoyaltyRouter {}));
        contract.__constructor(&admin, &registry);
        let creator = Address::generate(&env);
        let licensee = Address::generate(&env);
        let terms_hash = BytesN::from_array(&env, &[4u8; 32]);
        let result = std::panic::catch_unwind(|| {
            contract.route_royalty(&creator, &licensee, &terms_hash, &10001);
        });
        assert!(result.is_err());
    }
}
