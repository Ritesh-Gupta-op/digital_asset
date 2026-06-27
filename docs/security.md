# Security guide

- Enforce authentication checks inside every entry point.
- Validate terms hashes, royalty values, and addresses.
- Prefer explicit error handling and avoid panics in production paths.
- Review upgrade operations and contract ownership before deployment.
- Keep deployment secrets and wallet private keys out of the repository.
