**0:00–0:12 — Studio and target selection**

“Meet NEMO-RED: a security testing studio for AI agents. It helps developers challenge an assistant’s boundaries, inspect what happened, and test a proposed defense.”

**0:12–0:26 — Nova Health and specialist controls**

“Here, I’m selecting Nova, a fictional healthcare assistant. Five specialists explore different failure modes, from instruction manipulation to sensitive-data disclosure. For this test, I’ll use the Social Engineer.”

**0:26–0:39 — Dispatch and first finding**

“The specialist applies authority pressure. The assistant refuses, but repeats the synthetic canary supplied in the attack. Our exact-match check flags that response for review.”

**0:39–0:53 — Generate defense**

“Next, I generate a proposed defense. NEMO-RED strengthens the system instructions and replays the test. The payload and response remain inspectable, so we can evaluate the actual behavior behind the verdict.”

**0:53–1:00 — Successful replay shown**

“The replay is marked defended. That’s evidence for this attempt, not a guarantee against every attack.”

**1:00–1:17 — Back in the studio**

“NVIDIA Nemotron, served through Nebius Token Factory, powers the testing workflow: generating attacks, running the sandbox assistant, judging responses, and proposing defenses. The studio brings those steps together in one place.”

**1:17–1:30 — Specialist workspace remains visible**

“The goal is a repeatable development loop: choose a target, challenge its boundaries, inspect the evidence, and test improvements. Developers can run individual specialists or launch a broader campaign.”

**1:30–1:39 — Scan view**

“The separate prompt scanner assesses suspicious input and recommends an action. Here, it flags a potential threat for review.”

**1:39–1:53 — Sample findings and disabled hardening**

“I’m now switching to clearly labeled sample results to show the review interface. These are illustrative, not live evidence, and defense generation stays disabled in sample mode.”

**1:53–2:00 — Sample report**

“The report packages findings and transcripts for review, while preserving their sample designation.”

**2:00–2:05 — Hero closing**

“NEMO-RED. Break it here. Not out there.”

## Recording-specific accuracy notes

- The first attack already contains the canary. Describe the response as repeating or echoing it; this footage does not prove discovery of an unknown secret or access to patient records.
- The latter findings and exported report come from sample mode. Keep that distinction in the voiceover.
- Around 1:00–1:30 the studio is mostly unchanged. The script uses that interval for architecture and product purpose rather than implying another test is running.
