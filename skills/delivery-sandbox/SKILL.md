---
name: delivery-sandbox
description: Create, validate, troubleshoot, and tear down isolated local or self-hosted delivery sandboxes for exact candidate testing with databases and dependent services, without requiring production or hosted CI.
license: MIT
compatibility: Works with repositories whose required candidate environment can be provisioned locally or on controlled self-hosted infrastructure; available adapters depend on the repository and host.
metadata:
  author: Turpial AI Academy
  version: "0.5.1"
---

# delivery-sandbox

## Goal

Materialize the smallest isolated environment that can exercise an exact software candidate with its required services, collect trustworthy evidence, explain failures clearly, and remove sandbox-owned resources without touching production.

## Operating flow

~~~text
DISCOVER -> DECIDE -> PROVISION -> HYDRATE -> EXECUTE -> VERIFY -> DESTROY -> REPORT
~~~

This refines the common Turpial flow. Provision/hydrate/execute are implementation work; verify plus ownership-safe teardown are validation work.

## Required references

Read as needed:

- [Sandbox standard](references/SANDBOX_STANDARD.md)
- [Tool adapters](references/TOOL_ADAPTERS.md)
- [Data and secrets](references/DATA_AND_SECRETS.md)
- [Candidate and evidence](references/CANDIDATE_EVIDENCE.md)
- [Troubleshooting](references/TROUBLESHOOTING.md)

Use the templates under [assets/](assets/README.md) when persistent handoff/evidence improves the task.

## Non-negotiable safety

1. Discover before provisioning. Inspect repository-owned commands, services, schemas, migrations, workflows, current environment tooling, and the intended deployment target.
2. Bind the sandbox to an exact candidate: preferably a Git commit SHA, otherwise an immutable artifact digest or equivalent identity.
3. Sandbox creation must not mutate production, production databases, production storage, production DNS, or production deployment state.
4. Do not copy production credentials into a sandbox. Prefer sandbox-specific credentials and safe local defaults.
5. Prefer repository migrations plus synthetic seed/fixture data. A production-derived snapshot requires explicit authorization, a sanitization plan, and evidence that sensitive fields are removed or transformed.
6. Give every created resource an ownership identity. Never tear down a container, volume, database, project, network, route, or environment that cannot be proven to belong to this sandbox.
7. Preserve healthy existing tooling. Do not introduce Docker, Supabase CLI, act, OpenShip, Coolify, or another adapter merely for uniformity.
8. Do not claim environment parity that was not proven. Report the actual parity level and important gaps.
9. Do not weaken tests, skip migrations, disable security checks, or alter candidate behavior only to make the sandbox pass.
10. Respect separate human authorization boundaries for production-affecting changes, deployment, release publication, and destructive operations outside sandbox-owned resources.

## Bounded plan or report follow-up

Use only when a healthy authoritative plan/report and durable execution evidence cover the same exact candidate and unchanged configuration, adapter, hydration inputs, ownership, isolation, and production boundary. The amendment must not change the security boundary being asserted.

1. Locate the existing artifact and its exact candidate/configuration/run identity; identify the affected section or evidence obligation.
2. Inspect only supporting inputs and required invariants: candidate identity, resource ownership, isolation, data/secrets policy, production untouched, parity gaps, and cleanup state.
3. Amend the smallest coherent plan/report section while preserving unrelated artifacts and valid evidence. Do not provision, rehydrate, or replay the full lifecycle solely because a new turn began.
4. Reuse only inspectable evidence of actual execution with unchanged inputs and obligations. Perform fresh checks or observations when the gate requires them or mutable state cannot be independently established; report reused execution separately from this invocation.
5. Report what changed, reused/invalidated evidence, fresh validation, uncertainty, and retained resources. Load only references triggered by the affected decision or risk.

This path does not authorize sandbox/resource mutations or a new runtime PASS. A preserved sandbox must have current ownership, isolation, services, and data state verified before any separately authorized execution or teardown. A completed run's durable evidence does not prove a sandbox is still allocated or healthy now.

## Deep path

Use the complete lifecycle below for a new sandbox/plan, unclear scope, contradictions, unhealthy tooling or runtime/platform drift, missing durable required evidence, or a failed invariant. Candidate/artifact changes, adapters, runtime/services, schema/migrations/persisted data, hydration/secrets/auth, isolation/ownership, production/deployment/rollback boundaries, or cross-provider dependencies require affected deep validation. Never infer parity, safe data, ownership, or production isolation from recollection.

## Evidence lifecycle

Preserve durable discovery/setup facts only when their inputs and scope remain valid. Invalidate candidate-bound runtime/build/migration/test/smoke evidence after candidate or relevant configuration changes; revalidate the affected obligations and mandatory safety invariants. Assumptions and prose claims are not execution evidence. Reuse still-valid exact-candidate execution evidence without repeating expensive checks merely for a new turn; freshly execute/observe whenever the required gate or mutable runtime/data/resource state demands it. Never turn historical evidence into current proof for a changed candidate.

## Discover

For the deep path, build a delivery-environment graph from real repository evidence. For bounded follow-up, inspect the affected inputs and verify the matching existing graph:

~~~text
candidate
-> build/runtime
-> required services
-> database/schema/migrations
-> auth/storage/queues/workers
-> environment variables and secret names
-> quality/release commands
-> existing CI workflows
-> target deployment shape
~~~

Inspect, when present:

- Dockerfiles and Compose files;
- `supabase/` configuration, migrations, seeds, or schemas;
- GitHub Actions workflows;
- repository task runners such as Mise, Make, Just, package scripts, or native build tools;
- health checks, smoke commands, integration tests, release checks, and rollback instructions;
- OpenShip/Coolify project configuration or documented self-hosted targets;
- ports, volumes, persistent-data expectations, and host prerequisites.

Do not read or print secret values merely to inventory the environment.

## Decide

Select the smallest useful strategy from [TOOL_ADAPTERS.md](references/TOOL_ADAPTERS.md).

Prefer, in order of evidence:

1. healthy repository-owned sandbox/local-service commands;
2. Docker/Compose for generic isolated services;
3. Supabase CLI when the project genuinely uses Supabase;
4. `act` only when replaying GitHub Actions locally adds useful preflight evidence;
5. OpenShip when its local/self-hosted deployment model already fits the project;
6. Coolify when a persistent controlled Linux preview/staging host is appropriate.

Adapters may be combined when each has a distinct responsibility. Avoid duplicating the same check in several layers.

Before provisioning, state:

- candidate identity;
- sandbox identifier;
- chosen adapter(s);
- expected owned resources;
- data hydration source;
- validation commands;
- cleanup plan;
- known parity gaps;
- any human decision still required.

## Provision

Create an isolated namespace for the candidate. Reuse healthy project-owned definitions instead of inventing parallel infrastructure.

Isolation may use, depending on the adapter:

- unique Compose project names;
- dedicated networks and non-conflicting ports;
- sandbox-only containers and volumes;
- a local Supabase instance;
- a distinct OpenShip preview/local project;
- a distinct Coolify preview/staging application.

Record ownership before starting mutating operations.

Provisioning is not PASS merely because processes started. Continue through hydration and verification.

## Hydrate

Bring the sandbox to a testable state using [DATA_AND_SECRETS.md](references/DATA_AND_SECRETS.md).

Preferred order:

1. repository schema/migrations;
2. deterministic synthetic seed;
3. repository fixtures;
4. explicitly authorized sanitized snapshot when synthetic data cannot reproduce the relevant behavior.

Verify migrations against the sandbox database before running candidate tests. Do not silently repair migration history or point the application at production as a workaround.

## Execute

Run repository-owned checks against the sandbox and exact candidate.

Examples, when applicable:

- bootstrap/doctor;
- build;
- integration/end-to-end tests;
- database migration checks;
- `ci:fast` / `ci:extended`;
- `release:check`;
- candidate startup;
- health check;
- smoke test.

When using `act`, treat the result as a local workflow **preflight**. It does not prove GitHub-hosted runner parity because runner images, virtualization, services, permissions, and hosted context can differ.

## Verify

Evidence must answer:

- Is this the intended candidate?
- Did required services start?
- Did schema/migrations apply correctly?
- Did the candidate become healthy?
- Did required tests/smokes pass?
- Was production untouched?
- Are important target-parity gaps known?
- Are logs/evidence tied to this run rather than historical output?

If the candidate changes, evidence tied to the previous candidate is stale unless a check is demonstrably candidate-independent.

## Destroy

By default, remove ephemeral resources after evidence is captured.

Before deletion:

1. enumerate the resources to remove;
2. prove each resource belongs to the sandbox identifier;
3. preserve requested logs/evidence;
4. remove only sandbox-owned resources;
5. verify unrelated/pre-existing resources remain.

Never use broad cleanup commands that can delete unrelated Docker volumes, databases, containers, projects, or application state.

A user may explicitly request preservation of a sandbox for debugging. Report that it remains allocated and how to remove it safely later.

## Report

Use one of these outcomes:

- `SANDBOX_PASS`: required evidence passed for the exact candidate.
- `SANDBOX_FAIL`: candidate or sandbox validation failed with a concrete causal error.
- `SANDBOX_BLOCKED`: required host/tool/service capability is unavailable or cannot be verified.
- `HUMAN_DECISION_REQUIRED`: proceeding would cross a production, credential, sensitive-data, destructive, cost, or publication boundary.

For failures, report the **first causal error**, not a flood of secondary symptoms.

Explain in plain language:

1. candidate tested;
2. what environment was created;
3. what passed;
4. what failed and why;
5. whether production was touched;
6. whether cleanup completed;
7. the smallest next action;
8. whether human intervention is actually required.

Never report an unavailable or skipped check as passed.
