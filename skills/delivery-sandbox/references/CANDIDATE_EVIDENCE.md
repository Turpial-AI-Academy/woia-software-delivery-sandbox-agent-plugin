# Candidate and Evidence

## 1. Candidate binding

Every sandbox run needs one candidate identity.

Preferred fields:

~~~text
source_type: git
commit_sha: <exact full SHA>
~~~

For built artifacts, additionally record an immutable digest when available.

Do not use a branch name alone as release-quality identity because a branch can move.

## 2. Evidence freshness

Candidate-bound evidence is fresh only when it was produced against the same candidate and relevant sandbox configuration.

A candidate change invalidates prior candidate-bound:

- startup evidence;
- migrations;
- integration/end-to-end tests;
- smoke tests;
- build artifacts;
- deployment-like checks.

Environment-discovery facts may remain valid when demonstrably unchanged, but do not assume that automatically.

## Stable-candidate follow-up

A healthy plan/report can be amended without reprovisioning when the exact candidate, configuration, hydration inputs, isolation, ownership, and required obligations are unchanged. Reuse only durable, inspectable actual execution evidence and preserve unrelated valid artifacts. Record the original run identity and distinguish reused evidence from fresh execution in the current invocation.

Invalidate only materially affected evidence and required cross-cutting safety checks; candidate changes still invalidate candidate-bound evidence listed above. Fresh runtime health, service/data state, ownership before execution/cleanup, or other observations required by a gate must be obtained now. A completed teardown record does not prove a currently running sandbox. Missing evidence, drift, unknown ownership, or boundary changes require deep validation; assumptions and prose are not proof.

## 3. Required evidence fields

Machine-readable evidence SHOULD capture:

- schema identifier;
- sandbox id;
- start/end time;
- candidate identity;
- adapters used;
- parity levels;
- owned resources;
- data hydration source/classification;
- commands/checks and outcomes;
- production-touch assertion;
- cleanup state;
- first causal error when failed;
- human decision when blocked;
- overall outcome.

Use [sandbox-evidence.template.json](../assets/sandbox-evidence.template.json) as a starting point.

## 4. Production untouched assertion

`production_touched: false` means the sandbox workflow itself made no production mutation.

It is not permission to skip verification. Base the assertion on the adapters/resources actually used.

If a production-affecting call occurred intentionally or accidentally, do not hide it behind a normal sandbox outcome. Stop and report the exact mutation/risk.

## 5. Outcome semantics

### SANDBOX_PASS

Use only when:

- exact candidate identity is known;
- required sandbox services/checks passed;
- known parity gaps are reported;
- production was not mutated;
- cleanup succeeded or intentional preservation is explicitly recorded.

### SANDBOX_FAIL

Use when the sandbox ran but candidate/environment validation has a concrete causal failure.

### SANDBOX_BLOCKED

Use when a required capability cannot currently execute or be verified, such as unavailable container runtime or missing self-hosted target.

### HUMAN_DECISION_REQUIRED

Use when the next step crosses a decision boundary involving production, sensitive data, credentials, destructive cleanup outside owned resources, cost/account creation, publication, or promotion.

## 6. Historical evidence

Label historical evidence as historical. Never turn a previous green run into current proof for a changed candidate.
