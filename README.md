# Sentinel

Sentinel is SLPCC63's Square Time Card Manager application. This repository
contains the independently buildable Sentinel application extracted from
`slpcc63/hosted-saas`.

## Local verification

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The build requires the variable names documented in `.env.example`. Never
commit real values. The optional PostgreSQL mutation test is guarded and must
only be run against a disposable loopback database as described in
`docs/DEPLOYMENT.md`.

This repository establishes source and release independence. It does not claim
that a production deployment, live migration, or full-v1 acceptance is complete.
