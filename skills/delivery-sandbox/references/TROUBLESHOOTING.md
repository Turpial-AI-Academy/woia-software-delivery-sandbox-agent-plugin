# Troubleshooting

## 1. Diagnose the first causal error

When a sandbox fails, do not respond by changing random configuration until something becomes green.

Use:

~~~text
observe exact output
-> identify first causal error
-> classify layer
-> verify candidate + sandbox identity
-> apply smallest correction
-> rerun only invalidated evidence
~~~

Secondary failures caused by the first error should not distract from the root layer.

## 2. Failure classes

### ENVIRONMENT

Host/runtime prerequisite is missing or unhealthy.

Examples:

- Docker engine unavailable;
- required port already owned by unrelated software;
- insufficient disk/memory;
- required CLI unavailable.

### ADAPTER

The selected adapter cannot materialize the intended environment correctly.

Examples:

- invalid Compose configuration;
- local Supabase service startup failure;
- act runner/image incompatibility;
- OpenShip/Coolify project/target misconfiguration.

### CANDIDATE

The candidate itself fails.

Examples:

- build failure;
- application crash;
- failing health check;
- failing tests;
- invalid runtime configuration committed with the candidate.

### DATA_MIGRATION

Schema, migration, seed or fixture work fails.

Treat migration errors as first-class candidate evidence; do not bypass them by changing the target database.

### EXTERNAL_DEPENDENCY

A real external system is unavailable or intentionally not exercised.

Report the parity gap.

### HUMAN_BOUNDARY

Proceeding needs a decision about production, sensitive data, credentials, cost, account/project creation, destructive cleanup, publication, or promotion.

## 3. User-facing diagnosis

The operator may not be a DevOps specialist. Translate tool output into:

- what failed;
- why it matters;
- what was not affected;
- the smallest next action;
- whether the agent can fix it autonomously;
- whether a human decision is actually needed.

Good:

~~~text
SANDBOX_FAIL
Candidate: <sha>
Cause: migration 014 adds a column that already exists in the sandbox schema.
Production touched: no.
Cleanup: complete.
Next: correct/reconcile the migration, recreate the sandbox, rerun migration + smoke.
Human decision: not required.
~~~

Avoid dumping hundreds of downstream errors without causal ordering.

## 4. Safe retry

Before retrying:

- confirm candidate identity;
- confirm whether the failed run left resources;
- remove only owned partial resources when cleanup is needed;
- preserve logs/evidence required for diagnosis;
- avoid duplicate provisioning with the same ports/names unless the adapter supports it safely.

## 5. Do not patch around evidence

Never make a run pass by:

- disabling a meaningful test;
- skipping a required migration;
- substituting production for a missing local service;
- weakening a health check without product justification;
- deleting unrelated host state;
- hiding adapter limitations.

If the adapter cannot supply sufficient evidence, choose another adapter or report the limitation.

## 6. Secret-safe logs

Redact secret values before retaining or reporting logs. Preserve enough context to diagnose the failure without copying credentials or personal data.
