import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");

const skillRoot = path.join(ROOT, "skills", "delivery-sandbox");

test("sandbox lifecycle covers discovery through ownership-safe teardown", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const headings = ["## Discover", "## Decide", "## Provision", "## Hydrate", "## Execute", "## Verify", "## Destroy", "## Report"];
  let previous = -1;
  for (const heading of headings) {
    const index = skill.indexOf(heading);
    assert.ok(index > previous, heading + " must appear in lifecycle order");
    previous = index;
  }
  assert.match(skill, /remove only sandbox-owned resources/i);
});

test("candidate evidence is exact and becomes stale after candidate changes", async () => {
  const evidence = await readFile(path.join(skillRoot, "references", "CANDIDATE_EVIDENCE.md"), "utf8");
  assert.match(evidence, /exact full SHA|exact candidate|commit SHA/i);
  assert.match(evidence, /branch name alone.*can move/i);
  assert.match(evidence, /candidate change invalidates/i);
  assert.match(evidence, /production_touched: false/);
});

test("data policy prefers synthetic data and protects production-derived data", async () => {
  const data = await readFile(path.join(skillRoot, "references", "DATA_AND_SECRETS.md"), "utf8");
  assert.match(data, /deterministic synthetic seed data/);
  assert.match(data, /explicitly authorized sanitized snapshot/);
  assert.match(data, /Raw production data is not a default sandbox input/);
  assert.match(data, /Do not copy a production database merely because it is convenient/);
  assert.match(data, /Do not.*reuse production API keys/is);
});

test("adapter scope contains approved tools and excludes Dokploy", async () => {
  const adapters = await readFile(path.join(skillRoot, "references", "TOOL_ADAPTERS.md"), "utf8");
  for (const tool of ["Docker / Docker Compose", "Supabase CLI", "act", "OpenShip", "Coolify"]) {
    assert.match(adapters, new RegExp(tool.replace("/", "\\/"), "i"));
  }
  assert.doesNotMatch(adapters, /Dokploy/i);
});

test("act is preflight evidence rather than hosted-runner parity", async () => {
  const adapters = await readFile(path.join(skillRoot, "references", "TOOL_ADAPTERS.md"), "utf8");
  assert.match(adapters, /act result = PIPELINE_PREFLIGHT/);
  assert.match(adapters, /does not prove hosted-runner parity/i);
  assert.match(adapters, /Runner images can be intentionally incomplete/i);
});

test("machine-readable evidence encodes production and cleanup safety", async () => {
  const evidence = JSON.parse(await readFile(path.join(skillRoot, "assets", "sandbox-evidence.template.json"), "utf8"));
  assert.equal(evidence.schema, "com.turpial.delivery-sandbox-evidence/v1");
  assert.equal(evidence.production_touched, false);
  assert.equal(evidence.cleanup.resources_owned_only, true);
  assert.equal(evidence.data.production_derived, false);
  assert.ok(["SANDBOX_PASS", "SANDBOX_FAIL", "SANDBOX_BLOCKED", "HUMAN_DECISION_REQUIRED"].includes(evidence.outcome));
});

test("troubleshooting reports first causal error for non-DevOps operators", async () => {
  const troubleshooting = await readFile(path.join(skillRoot, "references", "TROUBLESHOOTING.md"), "utf8");
  assert.match(troubleshooting, /first causal error/i);
  assert.match(troubleshooting, /operator may not be a DevOps specialist/i);
  assert.match(troubleshooting, /smallest next action/i);
  assert.match(troubleshooting, /whether the agent can fix it autonomously/i);
  assert.match(troubleshooting, /Do not patch around evidence/i);
});

test("report exposes stable outcomes and cleanup state", async () => {
  const report = await readFile(path.join(skillRoot, "assets", "sandbox-report.template.md"), "utf8");
  for (const outcome of ["SANDBOX_PASS", "SANDBOX_FAIL", "SANDBOX_BLOCKED", "HUMAN_DECISION_REQUIRED"]) {
    assert.match(report, new RegExp(outcome));
  }
  assert.match(report, /production touched/i);
  assert.match(report, /resources intentionally preserved/i);
  assert.match(report, /unrelated resources verified untouched/i);
});

test("bounded sandbox follow-up preserves exact evidence and cannot cross safety or runtime boundaries", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const bounded = skill.split("## Bounded plan or report follow-up\n")[1]?.split("## Deep path\n")[0];
  assert.ok(bounded);
  for (const obligation of [
    /authoritative plan\/report/i, /durable execution.*same exact candidate/is,
    /unchanged configuration/i, /hydration inputs/i, /ownership/i, /isolation/i,
    /production boundary/i, /must not change.*security boundary/is,
    /affected section/i, /preserving unrelated artifacts.*valid evidence/is,
    /actual execution.*unchanged inputs/is, /fresh checks or observations/i,
    /references.*affected decision/is,
  ]) assert.match(bounded, obligation);
  assert.match(bounded, /does not authorize.*mutations.*new runtime PASS/is);
  assert.match(bounded, /Do not provision.*rehydrate.*new turn/is);
  assert.match(bounded, /current ownership.*data state verified.*execution or teardown/is);
});

test("deep sandbox routing retains candidate, data, trust, parity and ownership risks", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const deep = skill.split("## Deep path\n")[1]?.split("## Evidence lifecycle\n")[0];
  assert.ok(deep);
  for (const risk of [
    /new sandbox\/plan/i, /unclear scope/i, /contradictions/i, /runtime\/platform drift/i,
    /missing durable/i, /failed invariant/i, /Candidate\/artifact changes/i,
    /adapters/i, /runtime\/services/i, /schema.*migrations.*persisted/i,
    /hydration.*secrets.*auth/i, /isolation.*ownership/i,
    /production.*deployment.*rollback/i, /cross-provider/i,
  ]) assert.match(deep, risk);
  assert.match(deep, /Never infer parity.*recollection/is);
});

test("evidence lifecycle amortizes unchanged execution without replacing fresh mutable-state proof", async () => {
  const skill = await readFile(path.join(skillRoot, "SKILL.md"), "utf8");
  const lifecycle = skill.split("## Evidence lifecycle\n")[1]?.split("## Discover\n")[0];
  const evidence = await readFile(path.join(skillRoot, "references", "CANDIDATE_EVIDENCE.md"), "utf8");
  assert.ok(lifecycle);
  assert.match(lifecycle, /discovery\/setup facts.*remain valid/is);
  assert.match(lifecycle, /Invalidate candidate-bound.*configuration changes.*safety invariants/is);
  assert.match(lifecycle, /Assumptions and prose claims.*not execution evidence/is);
  assert.match(lifecycle, /Reuse.*exact-candidate.*without repeating expensive checks/is);
  assert.match(lifecycle, /freshly execute\/observe.*mutable runtime\/data\/resource/is);
  assert.match(evidence, /original run identity.*reused evidence from fresh execution/is);
  assert.match(evidence, /ownership before execution\/cleanup.*must be obtained now/is);
});
