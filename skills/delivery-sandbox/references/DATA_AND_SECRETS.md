# Data and Secrets

## 1. Default data order

Prefer the least-sensitive source that can reproduce the required behavior:

1. repository migrations/schema;
2. deterministic synthetic seed data;
3. repository-owned fixtures;
4. explicitly authorized sanitized snapshot.

Raw production data is not a default sandbox input.

## 2. Production-derived data

A production-derived snapshot may be used only when all of the following are true:

- synthetic/fixture data cannot reproduce the behavior materially;
- the user or governing policy explicitly authorizes the use;
- the extraction scope is minimized;
- a sanitization plan exists before import;
- sensitive fields are removed, transformed, tokenized, or otherwise rendered safe;
- the resulting sandbox data is treated according to its residual sensitivity;
- cleanup/retention expectations are explicit.

Do not copy a production database merely because it is convenient.

## 3. Migrations

Apply the repository's real migration path to the sandbox whenever feasible.

A migration failure is evidence. Do not:

- edit migration history silently;
- mark a failed migration as applied without proof;
- point the candidate to production to bypass local migration problems;
- delete migration state just to obtain a green run.

Report the first causal migration error and the candidate/migration identity.

## 4. Seeds and fixtures

Synthetic seed data SHOULD be:

- deterministic enough to reproduce failures;
- minimal for the tested behavior;
- free of real credentials and unnecessary personal data;
- owned by the repository when it is part of the product test contract.

Avoid huge fixture datasets when a small representative case is sufficient.

## 5. Secrets

Inventory secret **names and requirements**, not values.

Prefer:

- sandbox-specific generated credentials;
- local development keys explicitly intended for local use;
- an operator-approved secret store;
- ignored local environment files when the repository already uses them safely.

Do not:

- print secret values in reports/logs;
- commit sandbox secrets;
- reuse production API keys merely to simplify setup;
- overwrite host/global credential configuration.

If a required external integration cannot be exercised without a production-grade credential, classify the decision explicitly and use `HUMAN_DECISION_REQUIRED` when authorization is needed.

## 6. External services

When an external service cannot be safely reproduced locally, choose deliberately among:

- a repository-supported local emulator;
- a fake/stub with clearly reported parity limits;
- a dedicated non-production account/project;
- a blocked test with explicit rationale.

Never present a fake/stub result as evidence that the real external integration has passed.

## 7. Retention

Ephemeral sandbox data should be destroyed with the sandbox by default.

If a failing state is preserved for debugging:

- record who/what owns it;
- record residual sensitivity;
- state where it lives;
- state the exact later cleanup action.
