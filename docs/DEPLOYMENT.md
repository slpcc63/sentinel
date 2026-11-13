# Deployment boundary

Sentinel must have its own database URL, Square token-encryption key, Square
application credentials, callback URL, deployment history, automation secret,
and rollback target. It must not fall back to Cadence or legacy shared
credentials in an independent runtime.

Before promotion:

1. Run `npm ci`, `npm test`, `npm run typecheck`, and `npm run build` on the exact commit.
2. Configure only the Sentinel variables listed in `.env.example` through the deployment provider.
3. Confirm the Square callback matches the Sentinel environment and application.
4. Run database migrations with a tested backup and compatible rollback reader.
5. Configure scheduled automation only after its target deployment and secret are approved.
6. Record the exact deployment and prior Sentinel rollback target.

No scheduled production caller is committed by default. The mutation integration
test requires a disposable loopback PostgreSQL database named `cadence_build` or
`sentinel_build`, `SPLIT_ISOLATION_DATABASE_URL`, and a matching
`SPLIT_ISOLATION_CONFIRM_DATABASE`.
