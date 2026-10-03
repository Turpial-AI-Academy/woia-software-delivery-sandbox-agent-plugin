# Delivery Sandbox Standard

## 1. Definition

A delivery sandbox is an isolated, disposable or explicitly preserved environment used to exercise one exact software candidate with the services needed to obtain delivery evidence before a production-affecting action.

It is not automatically a production clone. Its purpose is proportional evidence with explicit parity gaps.

## 2. Lifecycle

~~~text
DISCOVER
-> DECIDE
-> PROVISION
-> HYDRATE
-> EXECUTE
-> VERIFY
-> DESTROY
-> REPORT
~~~

A sandbox that cannot prove candidate identity, resource ownership, or cleanup boundaries is not safe to automate.

An unchanged exact-candidate plan/report may receive bounded follow-up using durable matching evidence. That route cannot change the asserted security boundary or authorize provisioning/hydration/execution/teardown. Current ownership, isolation, required live service/data observations, and explicit mutation authorization remain mandatory for any runtime work. Load lifecycle detail for the affected obligation; do not replay setup only because a new invocation starts.

## 3. Ownership model

Every mutating run needs a stable sandbox identifier. Resources created for the run SHOULD inherit that identifier through the adapter's normal naming/labeling surface.

Record, when applicable:

- Compose project name;
- container names/labels;
- network;
- volumes;
- database/schema/instance;
- allocated ports;
- local files created outside the repository;
- OpenShip/Coolify project/environment identity.

Do not infer ownership from a resource merely looking temporary.

## 4. Isolation

Prefer the smallest isolation mechanism that prevents collisions and production access.

Examples:

- separate Docker network and project namespace;
- non-conflicting ports;
- dedicated database/volume;
- sandbox-specific environment variables;
- distinct preview/staging project where a control plane is used.

Isolation must cover stateful services, not only the application process.

## 5. Candidate identity

Preferred identity:

~~~text
git commit SHA
~~~

Acceptable alternatives for non-Git delivery include an immutable artifact digest or equivalent content identity.

Record both source identity and built artifact identity when a build transforms the candidate materially.

If source or artifact changes, candidate-bound validation evidence becomes stale.

## 6. Parity vocabulary

Report one or more levels instead of saying "same as production" without proof.

- `REPOSITORY_LOCAL` — repository-owned commands and local services execute.
- `SERVICE_EQUIVALENT` — relevant service families/versions/config shapes are represented sufficiently for the test.
- `PIPELINE_PREFLIGHT` — delivery workflow logic is replayed locally, with known runner/context differences.
- `TARGET_LIKE` — candidate runs on controlled infrastructure shaped similarly to the intended target.

None of these labels by itself proves production equivalence.

## 7. Persistence

Default: ephemeral.

Preserve a sandbox only when:

- the user explicitly requests debugging time;
- a failing state must be inspected;
- recreating the environment is materially expensive and preservation is authorized.

Report retained resources and the exact safe cleanup procedure.

## 8. Cleanup

Cleanup is an ownership gate, not a convenience command.

Before teardown:

1. enumerate;
2. attribute ownership;
3. capture required evidence;
4. remove owned resources;
5. verify unrelated state remains.

Broad host cleanup such as deleting all unused volumes or resetting shared Docker state is outside this capability unless separately and explicitly authorized.

## 9. Production boundary

A sandbox task must STOP before:

- production database mutation;
- production storage mutation;
- production DNS/routing change;
- production deployment/promotion;
- copying production secrets;
- importing sensitive production data without an approved sanitization path.

Crossing one of those boundaries requires a separate explicit decision and belongs to the responsible production/release capability.
