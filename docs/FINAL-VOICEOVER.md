# Narration for NemoRED_.mp4 (2:30)

**0:00.00–0:12.00**

Meet NEMO-RED: a security testing studio for AI agents. It helps developers challenge an assistant’s boundaries, inspect what happened, and test a proposed defense.

**0:12.00–0:26.00**

Here, I’m selecting Nova, a fictional healthcare assistant. Five specialists explore different failure modes, from instruction manipulation to sensitive-data disclosure. For this test, I’ll use the Social Engineer.

**0:26.00–0:34.00**

I dispatch the Social Engineer. It tests whether the assistant can be pressured into crossing its boundaries.

**0:34.00–0:40.00**

The assistant refuses, but echoes the supplied canary. Our exact-match check flags the response.

**0:40.00–0:53.00**

Next, I generate a proposed defense. Nemo Red strengthens the system instructions and replays the test. The payload and response remain available for inspection.

**0:53.00–1:00.00**

The replay is marked defended. That’s evidence for this attempt, not a guarantee against every attack.

**1:00.00–1:17.00**

NVIDIA Nemotron, served through Nebius Token Factory, powers the testing workflow: generating attacks, running the sandbox assistant, judging responses, and proposing defenses. The studio brings those steps together in one place.

**1:17.00–1:30.00**

The goal is a repeatable development loop: choose a target, challenge its boundaries, inspect the evidence, and test improvements. Developers can run individual specialists or launch a broader campaign.

**1:30.00–1:39.00**

The separate prompt scanner assesses suspicious input and recommends an action. Here, it flags a potential threat for review.

**1:39.00–1:53.00**

I’m now switching to clearly labeled sample results to show the review interface. These are illustrative, not live evidence, and defense generation stays disabled in sample mode.

**1:53.00–2:00.00**

The report packages findings and transcripts for review, while preserving their sample designation.

**2:00.00–2:11.00**

Nemo Red brings the process together: probe, inspect, and harden. Beyond the built-in sandboxes, developers can configure targets for their own use cases.

**2:11.00–2:23.00**

Here, I choose Website and import content to build a simulated assistant. The Ghost Injector then tests its instruction boundaries. This evaluates the simulation, not the website itself.

**2:23.00–2:27.00**

This attempt is resisted, with the response preserved for review.

**2:27.00–2:30.15**

Nemo Red. Break it here. Not out there.
