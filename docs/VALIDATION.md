# Validation record — October 26, 2026

## Verified locally

- `npm run lint`: passes.
- `npm test`: 10 tests against actual TypeScript source modules, mocking external services. Covers canary detection, malformed judge output, normalized scores, real target/persona definitions, absent credentials, empty/truncated completions, sample export provenance, input bounds, missing-key status, and refused attack generation.
- `npm run build`: Next.js production build and TypeScript checks pass; standalone output enabled.
- `tests/browser-smoke.mjs`: Playwright checks pass with mocked inference services. Covers method tabs, sample loading, report dialog/Escape, sample hardening guard, successful mock attack, failed mock retest, patch application/reset, provider error feedback, custom prompt validation, and 390/768/1440 px widths without horizontal overflow. No browser page errors.
- Real configured Nebius health probe succeeded with `nvidia/Nemotron-3_5-Lightning`.

## Live workflow limitation

One explicitly approved run used only the built-in fictional Apex Capital sandbox. The attack endpoint returned after 25,252 ms and LangSmith accepted the trace. However, the attacker refused to generate a payload; the original fallback forwarded that refusal, a later response was truncated, and the judge result was inconclusive. This does **not** count as a successful attack/patch/retest demonstration.

The adapter now rejects token-limit truncation, and the attack generator rejects responses without a valid structured payload. These fixes are covered by regression tests. No repeated paid campaigns or safety-refusal bypass attempts were made. A successful full live workflow remains a release gate.

## Not verified

- Hosted public deployment and anonymous access.
- Docker runtime (Dockerfile prepared; standalone build verified).
- Full live defense generation and replay.
- Public repository visibility/current revision and final Devpost submission.
- YouTube demo publication, personal eligibility, and pre-existing-work disclosure.

Local screenshots/transcripts are under ignored `artifacts/`. They are QA evidence, not automatically published submission assets. Mocked screenshots should not be represented as live model results.
