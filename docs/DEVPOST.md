# Devpost submission draft

## Project name
NEMO-RED

## Tagline
An AI agent security studio that turns adversarial findings into testable defense improvements.

## Track
Best Apps and Agents

## Inspiration
A system prompt can look convincing and still fail when a user claims emergency authority or hides instructions inside data. AI application builders need to see the failing conversation and test a proposed fix before trusting it.

## What it does
NEMO-RED gives builders a repeatable prompt-level evaluation loop. Choose a fictional business agent or bring a custom system prompt. Five specialist personas probe its boundaries. Review the exact request, target response, and model judge's reasoning. When a test finds a breach, generate a revised prompt and replay one exploit against it. Export the transcript and retest evidence for human review.

## How we built it
The application uses Next.js, React, and TypeScript. NVIDIA Nemotron runs through Nebius Token Factory for attack generation, target simulation, judging, defense synthesis, and replay evaluation. Hosted inference lets us focus on the evaluation workflow without provisioning model-serving infrastructure. Optional Tavily retrieval adds research context; optional LangSmith tracing records completed operations.

The UI follows the investigation: configure and test, inspect findings, then harden and retest. An interactive product walkthrough, responsive layouts, visible progress, and explicit sample labels make the workflow understandable before a visitor spends inference credits.

## Challenges and lessons
A model judge must not silently convert malformed output into a confident safety result. We added explicit inconclusive handling and a deterministic check for exact synthetic-canary disclosure. We also separate illustrative samples from live evidence and report retest outcomes without treating a single successful replay as a general guarantee.

## What is distinctive
The output is not just a score. It is a connected trail from an adversarial request to the observed response, a proposed defense, and an observed replay. The target remains a controlled prompt sandbox, so builders can examine failures without connecting actual financial or clinical tools.

## What's next
Evaluate a larger held-out test set, add legitimate-task regression checks after patching, support independent judge models, and integrate permission-scoped real agent adapters. These are future work, not current capabilities.

## Required links — complete before submission
- Working demo: **ADD PUBLIC HTTPS URL**
- Public repository: https://github.com/saketh8/NemoRed (confirm visibility and push current changes)
- Public YouTube video: **ADD VIDEO URL, ≤3 MINUTES**

## Sponsor feedback — author must complete from actual experience
The OpenAI-compatible API allowed one server-side adapter to serve all Nemotron roles. The local health probe succeeded during validation. One approved Apex Capital sandbox run used `nvidia/Nemotron-3_5-Lightning`, took 25,252 ms end to end, and recorded a LangSmith trace. The attacker declined to generate a probe; downstream output was incomplete and the judge result was inconclusive. We corrected the application to reject non-structured payloads and truncated completions instead of forwarding them as evidence. This is a failed workflow observation, not a performance benchmark.

Concrete feedback: clearer model-specific guidance for reasoning/output token budgets and structured refusal responses would help evaluation tools distinguish declined tasks from malformed or truncated JSON.

Record the following after a complete live campaign:

- Exact model ID, date, successful/failed requests, and observed end-to-end latency.
- Whether JSON output was valid, whether retries were needed, and any rate-limit behavior.
- What worked well in Token Factory and one concrete improvement request, with reproducible details.
- Only discuss AI Cloud, Serverless, or other NVIDIA tooling if you actually used them. This application currently uses Token Factory-hosted Nemotron.

## Existing project disclosure — author must confirm
If the project existed before August 26, 2026, describe the earlier baseline and the significant work completed during the submission period. This revision adds the interactive redesign, evidence-integrity fixes, test coverage, and submission documentation. Do not assert a creation date without checking project history.
