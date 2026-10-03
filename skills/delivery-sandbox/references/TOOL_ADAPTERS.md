# Tool Adapters

Choose adapters from repository evidence. These tools are options, not a mandatory stack.

## Selection matrix

| Adapter | Best fit | Strength | Important boundary |
|---|---|---|---|
| Repository-native | Existing local sandbox/service commands | Lowest change and best project fit | Preserve healthy existing behavior |
| Docker / Compose | General multi-service isolation | Portable containers, networks and volumes | Never broad-delete shared host state |
| Supabase CLI | Repositories using Supabase | Local Postgres/Auth/Storage and related services | Use local project state; do not create cloud projects merely for tests |
| act | GitHub Actions workflow preflight | Replays many workflows locally | Does not prove hosted-runner parity |
| OpenShip | Local/self-hosted deployment and preview workflows | Deployment-oriented control plane with CLI/API/MCP surfaces | Optional external adapter; do not make it a plugin runtime dependency |
| Coolify | Persistent self-hosted preview/staging on controlled Linux infrastructure | Preview deployments and managed app/services | Treat preview code as untrusted and isolate credentials |

## Repository-native first

If the repository already has a healthy, reproducible sandbox or integration environment, use it. Adapters should close a real gap, not replace conventions for aesthetics.

## Docker / Docker Compose

Use when containers materially improve service isolation, dependency reproducibility, or cleanup ownership.

Prefer:

- repository-owned Dockerfiles/Compose;
- unique project names;
- explicit volumes/networks;
- health checks;
- deterministic images/tags where the project defines them.

Do not run host-wide prune commands as normal teardown.

## Supabase CLI

For Supabase projects, prefer the repository's local Supabase configuration and CLI instead of allocating another hosted project just to test a candidate.

Current Supabase CLI supports running the local stack in containers, including Postgres, Auth, Storage and related services. Typical project-scoped flow is:

~~~text
supabase init    # only if project local configuration does not exist
supabase start
... apply/verify migrations and seed ...
supabase stop
~~~

Use the repository's actual install style (`supabase`, `npx supabase`, etc.). Do not silently install a global CLI.

Official reference:
https://supabase.com/docs/guides/local-development/cli/getting-started

## act

Use `act` when the repository has GitHub Actions and a local replay would catch workflow/configuration failures earlier.

Classification:

~~~text
act result = PIPELINE_PREFLIGHT
~~~

Do not promote an `act` PASS into "GitHub Actions parity PASS". Runner images can be intentionally incomplete, Docker differs from GitHub virtual machines, and hosted permissions/context/services may differ.

Official runner limitations:
https://github.com/nektos/act-docs/blob/main/src/usage/runners.md

A real remote run may still be required by repository policy, platform coverage, governance, or runner-specific behavior.

## OpenShip

OpenShip is an optional adapter when the project benefits from a deployment-oriented local/self-hosted control plane.

Useful surfaces include:

- deploying Git projects or local source to an installation;
- separate preview environments;
- CLI/API automation;
- an external MCP surface when the operator has configured it.

The `delivery-sandbox` plugin itself remains skill-only. Do not embed OpenShip credentials or make OpenShip a runtime dependency.

Official references:
https://openship.io/docs/cli/deploy
https://openship.io/docs/guides/preview-environments

## Coolify

Coolify is an optional adapter for a persistent controlled Linux host used as preview/staging infrastructure.

Use it when the desired evidence genuinely needs a server-like self-hosted target rather than a workstation-only environment.

Preview code may be untrusted. Never expose production credentials to preview deployments.

Official references:
https://coolify.io/docs/applications/deployments/preview-deployments
https://coolify.io/docs/start-with-self-hosted

## Tool installation

Do not install system/global tooling silently.

When an adapter is required but unavailable:

1. report `SANDBOX_BLOCKED`;
2. name the missing capability/tool;
3. give the smallest installation or operator action;
4. resume only after availability can be verified.

Do not modify global Docker, shell, Git, or credential configuration merely to make a sandbox pass.
