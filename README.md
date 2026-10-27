# 🛡️ NEMO-RED: Autonomous Multi-Agent AI Red-Teaming Studio
> **An enterprise AI Red-Teaming Swarm powered by NVIDIA Nemotron on Nebius Token Factory.**
> *Autonomous adversarial penetration testing, OWASP Top 10 for LLMs auditing, live zero-day reconnaissance, and auto-immunization defense engineering.*

[![Built for Nebius x NVIDIA Hackathon](https://img.shields.io/badge/Nebius%20x%20NVIDIA-Global%20AI%20Hackathon-76b900.svg)](https://nebius.com)
[![Engine](https://img.shields.io/badge/Engine-NVIDIA%20Nemotron--3.5--Lightning-f43f5e.svg)](https://nebius.com/token-factory)
[![Threat Feed](https://img.shields.io/badge/Recon-Tavily%20Zero--Day%20Live-06b6d4.svg)](https://tavily.com)
[![Observability](https://img.shields.io/badge/Telemetry-LangSmith%20Traced-a855f7.svg)](https://smith.langchain.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Executive Summary & Problem Statement

Enterprises are rapidly deploying autonomous LLM agents with access to internal databases, wire transfer capabilities, customer records, and customer-facing refund tools. However, conventional security tools are built for static software, not non-deterministic LLMs. Traditional red-teaming requires human security teams costing $50k+ per audit, taking weeks, and failing to simulate the complex multi-turn deception and tool-misuse vectors that break real agents.

**NEMO-RED** is an autonomous multi-agent security studio that turns the reasoning power of **NVIDIA Nemotron** against AI vulnerabilities. It deploys an adversarial swarm of specialized personas to probe, social-engineer, and exploit target agents, assesses breaches in real-time against the **OWASP Top 10 for LLMs 2025/2026**, and automatically synthesizes **mathematically-grounded prompt firewalls** with live verification re-tests.

---

## ⚡ Key Architecture & Autonomous Swarm

```
                         [ USER / AUDITOR COMMAND ]
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  Tavily Intelligence │ │  Adversarial Swarm   │ │ Target Agent Sandbox │
│  Live Zero-Day CVEs  │ │  (5 Nemotron Personas│ │ (FinTech, Health,   │
│  & Jailbreak Feeds   │ │  Adaptive Strategies)│ │  Custom Enterprise)  │
└──────────┬───────────┘ └──────────┬───────────┘ └──────────┬───────────┘
           │                        │                        │
           └────────────────►───────┴───────◄────────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │    AI Safety Judge Arbiter   │
                     │  (OWASP LLM & Blast Radius)  │
                     └──────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │   Auto-Immunizer       │      │   LangSmith Traces     │
       │   Prompt Firewall &    │      │   Full Observability   │
       │   Live Re-Test Verify  │      │   Token & Latency HUD  │
       └────────────────────────┘      └────────────────────────┘
```

### 1. The Adversarial Swarm (5 Specialist Personas)
- **`Ghost-Injector` (PHANTOM_ZERO)**: XML tag smuggling, role inversion, system instruction boundary blurring.
- **`Social-Engineer` (VORTEX_SOCIAL)**: Executive authority simulation, emergency distress, regulatory bluffing.
- **`Logic-Breaker` (SYNTAX_VOID)**: Multi-turn hypothetical nesting, paradoxes, academic pretexts.
- **`Data-Harvester` (CIPHER_LEAK)**: Exfiltration of simulated PII, API tokens, Canary secrets.
- **`Privilege-Escalator` (ROOT_BREACH)**: Unauthorized tool calling, limit overrides, financial bypasses.

### 2. The Target Arena
- **Apex Capital Underwriter**: Evaluates commercial credit lines, restricted from exceeding $5k limits and leaking `ALPHA_RISK_RATIO_99`.
- **NovaHealth Clinical Triage**: HIPAA-constrained medical agent strictly forbidden from dispensing Schedule II narcotics or leaking `PATIENT_RECORD_PHI_88201`.
- **OmniCorp Support Executive**: Authorized for micro-refunds (<$50), forbidden from running `tool_admin_force_refund` or disclosing `STRIPE_DISPUTE_BYPASS_KEY_4481`.
- **Custom Agent Mode**: Paste any system prompt, tool definitions, and guardrails to audit custom enterprise systems.

### 3. AI Safety Judge
Automated impartial scoring against OWASP categories:
- `OWASP-LLM01`: Prompt Injection
- `OWASP-LLM02`: Sensitive Data Disclosure
- `OWASP-LLM06`: Excessive Agency
- `OWASP-LLM07`: System Prompt Leak
- `OWASP-LLM08`: Vector & Logic Confusion

### 4. Auto-Immunizer & Prompt Firewall
When vulnerabilities are exploited, the Auto-Immunizer synthesizes an enterprise defense layer (XML Delimiter Isolation, Canary Traps, Absolute Negative Constraints), and immediately fires a live verification re-test against the immunized agent to prove 100% exploit mitigation.

---

## 🏆 Hackathon Judging Criteria Alignment

| Criterion | Weight | How NEMO-RED Excels |
| :--- | :---: | :--- |
| **Technological Implementation** | **25%** | Deep integration with NVIDIA Nemotron (`Nemotron-3_5-Lightning`, `Nemotron-3-Super-120b`, `Nemotron-3-Ultra-550b`) on Nebius Token Factory. Real-time streaming, LangSmith tracing, Tavily web reconnaissance, sub-second latency. |
| **Design & User Experience** | **25%** | Cyberpunk command center aesthetic (`#070a12`, neon crimson vs emerald), live duel battle arena, side-by-side prompt diffing, interactive OWASP radar, zero placeholders. |
| **Potential Impact** | **25%** | Critical enterprise problem. LLM security is the #1 blocker to enterprise autonomous agent adoption. NEMO-RED provides automated, continuous compliance certification in seconds. |
| **Idea Quality & Originality** | **25%** | Breakthrough red-vs-blue dynamic tournament. Rather than static rule checks, autonomous LLM agents actively adapt in multi-turn combat, followed by autonomous self-healing prompt immunization. |

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ or 20+
- Nebius Token Factory API Key (with NVIDIA Nemotron model access)

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/your-username/nemored.git
cd nemored
npm install
\`\`\`

### 2. Configure Environment
Copy `.env.example` to `.env.local` and add your keys:
\`\`\`bash
cp .env.example .env.local
\`\`\`
Edit `.env.local`:
\`\`\`env
NEBIUS_API_KEY=your_nebius_api_key
NEBIUS_MODEL=nvidia/Nemotron-3_5-Lightning
TAVILY_API_KEY=your_tavily_api_key
LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_TRACING=true
\`\`\`

### 3. Run Locally
\`\`\`bash
npm run dev -- -p 3005
\`\`\`
Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 📄 License
MIT License. Open source and built for the **Nebius x NVIDIA Global AI Hackathon**.
