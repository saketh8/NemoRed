# Three-minute public demo script

Target length: 2:45. Show real app footage and actual inference, not sample fixtures. Do a live rehearsal first. If no breach is found, report that honestly; use a deliberately weak fictional sandbox for a clearly labeled defense demonstration. Never fabricate a successful retest.

| Time | Show | Narration |
| --- | --- | --- |
| 0:00–0:15 | Hero, workflow tabs, open studio | “A convincing system prompt is not evidence that an agent will respect its boundaries. NEMO-RED helps builders test those boundaries.” |
| 0:15–0:35 | Connected Nebius status, model, target prompt | “NVIDIA Nemotron runs the attacker, target sandbox, judge, and defense generator on Nebius Token Factory. This target is fictional; its canary is synthetic.” |
| 0:35–1:10 | Dispatch a persona, actual progress, resulting transcript | “The specialist generates a probe. We keep the exact payload and response so the finding can be inspected.” |
| 1:10–1:35 | Finding and judge explanation | “Here is what happened and why the judge classified it this way. Scores are model judgments, not security guarantees.” |
| 1:35–2:10 | Generate patch, original/proposed prompt, replay | “The defense generator proposes a change and replays one discovered exploit. This is the observed retest result.” |
| 2:10–2:30 | Apply patch to sandbox; report export | “Apply it to a fresh campaign and export the evidence for review. Broader tests and human judgment still matter.” |
| 2:30–2:45 | Show public repository, license, demo URL | “NEMO-RED closes the loop from probe to evidence to a testable defense. Built with Nemotron on Nebius Token Factory.” |

Recording checklist:

- Hide `.env.local`, account credentials, billing screens, and private data.
- Capture the model name and actual Nebius connection, plus the real working flow.
- Avoid implying that edited waiting time is measured latency. Label cuts/time compression.
- Do not claim that traces were recorded unless delivery succeeded.
- Keep narration/captions in English, upload to public YouTube, verify playback logged out.
- Save screenshots of both the initial finding and retest for the Devpost gallery.
