# Submission readiness audit

Reviewed October 26, 2026 against the [overview](https://nebiusglobalaihackathon.devpost.com/) and [official rules](https://nebiusglobalaihackathon.devpost.com/rules). This is a practical checklist, not an eligibility determination.

**Status: source prepared; final submission is not complete.**

The official submission window ends **October 30, 2026 at 10:00 a.m. Pacific**. Judging runs December 1–15, ending at noon Pacific. Keep the working demo available free to judges through that period.

| Requirement | Evidence / status | Remaining action |
| --- | --- | --- |
| NVIDIA open model on Nebius | Server-side Nemotron Token Factory adapter; real local health probe succeeded | Approved live sandbox run reached provider and trace delivery, but the attacker refused and the judge was inconclusive. Refusal/truncation handling is now fixed; a successful full live workflow is still required |
| Appropriate category | Best Apps and Agents: a practical AI agent evaluation workflow | Select it in Devpost. Coding track is weaker because this app does not write/run/test code |
| Working project | Production build, functional UI, mocked module tests, local preview | Complete final live test and deploy |
| Public working demo/test build | Local application available | Add public HTTPS URL and verify anonymously; provide testing credentials if needed |
| Project description | `docs/DEVPOST.md` | Review and paste into Devpost |
| Public YouTube video, ≤3 minutes | `docs/DEMO.md` recording script | Record actual workflow, upload publicly, supply URL |
| Public source repository | Git remote is `https://github.com/saketh8/NemoRed` | Push reviewed changes and confirm public visibility while logged out |
| Open-source license | Root `LICENSE` is MIT; linked prominently in README | Retain license when publishing |
| Setup and technology guidance | README, `.env.example`, deployment guide | Verify clean installation on hosting environment |
| Sponsor feedback | Draft prompts in Devpost document | Add truthful observations from actual usage; do not invent benchmarks |
| Pre-existing work disclosure | Current changes described below | Confirm creation date; disclose significant in-window changes if project predates August 26 |
| English submission | Docs and UI are English | Keep demo narration/captions in English |
| Eligibility, ownership, team representative | Cannot be established from source code | Confirm age, location eligibility, ownership, licenses, conflicts, and authorized representative under rules §3–4 |
| City award | Overview and rules differ about attendance eligibility | Use actual attendance information; seek organizer clarification if relying on city association alone |

## Changes prepared in this revision

- Interactive product introduction, orbital motion, workflow selector, studio tabs, responsive styling, reduced-motion handling, and accessible report dialog.
- Actual provider state, explicit sample provenance, visible request failures, and sample/live separation.
- Replaced unsupported safety/certification claims and fabricated threat identifiers with evidence-scoped reporting.
- Judge exact-canary override and inconclusive handling; malformed completions fail explicitly.
- Bounded attack inputs, explicit tracing configuration, provider timeouts, deployment packaging, and module-level regression tests.

Do not claim unmeasured cost savings, 100% mitigation, mathematically guaranteed safety, real external tool execution, or a complete OWASP certification. Show a concrete transcript, a proposed patch, and its observed retest instead.

## Release gates

- [ ] Full live attack → finding → patch → replay → export verified.
- [ ] Public demo URL tested in an incognito browser; credits and hosting last through judging.
- [ ] Updated public repository and README verified without login.
- [ ] Public YouTube URL, no longer than three minutes.
- [ ] Actual technology feedback and creation-history disclosure completed.
- [ ] Eligibility and team details confirmed; final Devpost submission sent before deadline.
