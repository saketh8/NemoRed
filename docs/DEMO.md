# NEMO-RED submission recording

Target: **2:45**, with 15 seconds of margin. Use actual screen recordings and real model results.

The [hackathon requirements](https://nebiusglobalaihackathon.devpost.com/) checked October 28, 2026 require a **public YouTube video of three minutes or less**, showing the working project and its use of NVIDIA models on Nebius. The listed deadline is **October 30, 2026, 10:00 a.m. PDT**. A public working demo URL is a separate requirement; localhost is suitable for filming but is not that public URL.

## Before recording

1. Keep the terminal server you already started running. If it is stopped, run from the project directory:
   ```sh
   npm run dev -- -p 3005
   ```
2. Open `http://localhost:3005` in a clean browser window. Close DevTools, hide bookmarks, enable Do Not Disturb, and keep `.env.local` off screen. Use a 16:9 capture area if possible; make result text readable.
3. Open **Studio**, check **Nebius connected**, and note the exact model selected. A connected badge alone does not prove the full workflow succeeds.
4. Rehearse **Apex → Ghost → Dispatch** using the fictional sandbox. Inspect the actual outcome. If needed, run the campaign once to discover useful evidence. Do not use **Try the demo** or **Sample** for the live-inference segment.
5. If there is a breach or partial leak, rehearse **Harden → Generate defense**, then inspect the actual replay. Never plan narration around an assumed successful defense.
6. Open your public GitHub README in another tab. Use the deployed demo URL only if you have actually deployed and verified it.

## Shot list and ready-to-read narration

Record these as separate clips if convenient. The time budget includes clicks and pauses; trim waiting time and label the cut “Inference wait shortened.”

| Time | Screen action | Narration |
| --- | --- | --- |
| 0:00–0:15 | Hero. Slowly move over the ring and click **Inspect**. | “Your AI agent can sound reliable and still cross a boundary. NEMO-RED helps builders discover those failures before their users do. Break it here. Not out there.” |
| 0:15–0:35 | **Open studio**. Show selected Nemotron model, connection details, **Apex**, then **Inspect configuration**. | “This is a fictional finance assistant with a synthetic secret. NVIDIA Nemotron, served through Nebius Token Factory, powers the attacker, the sandbox assistant, the judge, and the defense generator.” |
| 0:35–1:05 | Select **Ghost**, click **Dispatch**, show real progress, then the returned finding. | “I choose a specialist and dispatch a test. It generates a payload, sends it to the assistant, and evaluates the response. Each test preserves the evidence. A model refusal is reported as a skipped test, not counted as a successful defense.” |
| 1:05–1:30 | Expand the finding. Show payload, response, verdict, and judge explanation. Point to the actual relevant text. | “Here is the exact payload and the assistant’s response. [Describe the observed result in one sentence.] The verdict comes with its reasoning, so we can inspect the evidence instead of trusting a score alone.” |
| 1:30–2:05 | **Harden → Generate defense**. Show **Original / Proposed**, replay result, and **Defense details & replay**. | “Now NEMO-RED proposes a stronger system prompt and replays a discovered test against it. We can compare the original and proposed instructions. [State the observed replay result.] This is one replay, not a guarantee of security.” |
| 2:05–2:25 | **Apply to sandbox**, then dispatch a fresh test. Show its real result if captured. | “Applying the proposal starts a fresh evaluation of the sandbox. The next step is broader testing across all five specialists, rather than assuming the original finding is fixed.” |
| 2:25–2:45 | Open **Report** for an evaluated run. Show public README/license, then return to hero. | “The report preserves the findings for review. NEMO-RED brings testing, evidence, and a testable defense into one workflow, using NVIDIA Nemotron on Nebius Token Factory. The code is open source. Thank you.” |

If a fresh test cannot fit the time budget, omit the apply-and-dispatch clip and use the existing evaluated run's report. Applying a patch resets previous findings; export any evidence you want to retain **before** applying it.

## Outcome-specific lines

Use only the line supported by what is visible:

- Breach: “The assistant disclosed the synthetic canary even though its instructions prohibited disclosure.”
- Partial leak: “The judge identified a partial disclosure; here is the response it flagged.”
- Defended: “This attempt was resisted. That tells us about this test, not every possible attack.”
- Inconclusive: “This result needs review; the evaluator could not establish a reliable verdict.”
- Replay defended: “The proposed prompt resisted this replay.”
- Replay still vulnerable: “The replay still exposes a weakness, so the proposal needs more work.”

If no live breach occurs, don't force the hardening storyline. Replace 1:30–2:25 with **Scan → select a preset → Scan prompt**, show the actual assessment, then inspect the campaign results and report. Say: “This run found no confirmed breach, so I won't claim a mitigation. The separate scanner also assesses incoming prompts and suggests an action for review.”

If Nebius is unavailable, fix the connection or credits before filming the working inference segment. An explicitly labeled sample can explain the interface but does not establish that NVIDIA/Nebius inference works.

## Recording on your Mac

- Press **Shift–Command–5**, select **Record Selected Portion**, and frame the browser.
- Under **Options**, select your microphone and a save location. Record a ten-second test and play it back to check audio.
- Record the clips. Stop using the menu-bar recording button.
- Trim and assemble them in your preferred editor. Keep the final video at **2:45–2:55**. Preserve the real outputs and label shortened inference waits.
- Add a small title: `NEMO-RED | AI agent security testing` and captions if useful. Prioritize readable evidence over transitions or music.

## Upload package

**Title:** NEMO-RED — Test, Inspect, Harden | Nebius × NVIDIA Global AI Hackathon

**Description template:**

> NEMO-RED is an AI agent testing studio built with NVIDIA Nemotron on Nebius Token Factory. This demo shows a fictional sandbox evaluation, inspectable evidence, and [the actual workflow shown: defense proposal and replay / prompt scanning]. Model judgments require review; these tests do not certify security.
>
> Working demo: [YOUR VERIFIED PUBLIC URL]
>
> Source: https://github.com/saketh8/NemoRed
>
> Track: Best Apps and Agents
>
> [If applicable: Inference waiting time has been shortened in the edit.]

Before submitting:

- [ ] Video is three minutes or less and YouTube visibility is **Public**.
- [ ] Playback and links work when logged out.
- [ ] Video shows actual NVIDIA model use through Nebius and a working result.
- [ ] No credentials, private prompts, account details, or unsupported performance claims are visible.
- [ ] Any sample footage is clearly identified; it is not described as a live result.
- [ ] Public working demo and repository URLs are included in Devpost separately.
