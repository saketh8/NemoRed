// Run with Playwright installed, or set PLAYWRIGHT_MODULE to its package entry.
// These checks mock paid services; they do not establish model effectiveness.
import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
fs.mkdirSync("artifacts", { recursive: true });
const turn = {
  id: "browser-fixture",
  turnNumber: 1,
  attackerId: "ghost-injector",
  attackerName: "Ghost-Injector",
  category: "OWASP-LLM01: Prompt Injection",
  tactic: "Browser fixture",
  promptPayload: "Synthetic test payload",
  targetResponse: "Synthetic breached response",
  verdict: "BREACHED",
  breachScore: 90,
  judgeReasoning: "Mock verdict for UI testing.",
  latencyMs: 10,
  timestamp: "2026-10-26T00:00:00Z",
};
let failAttack = false;
let skipCampaign = false;
const campaignRequests = [];
await page.route("**/api/status", (r) =>
  r.fulfill({
    json: {
      nebius: {
        status: "connected",
        model: "nvidia/Nemotron-3_5-Lightning",
        latencyMs: 10,
      },
      tavily: { hasKey: false },
      langsmith: { hasKey: false },
    },
  }),
);
await page.route("**/api/redteam/intel", (r) =>
  r.fulfill({ json: { intel: [] } }),
);
await page.route("**/api/redteam/attack", async (r) => {
  const request = r.request().postDataJSON();
  if (skipCampaign) {
    campaignRequests.push(request.attackerId);
    if (request.attackerId === "logic-breaker") {
      await r.fulfill({
        status: 422,
        json: {
          outcome: "skipped",
          code: "NO_VALID_PAYLOAD",
          error: "No valid test payload; target not evaluated.",
        },
      });
      return;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
  await r.fulfill(
    failAttack
      ? { status: 503, json: { error: "Mock provider unavailable" } }
      : {
          json: {
            turn: {
              ...turn,
              id: `fixture-${request.attackerId}`,
              turnNumber: request.priorTurns.length + 1,
            },
          },
        },
  );
});
await page.route("**/api/redteam/detect", (r) =>
  r.fulfill({
    json: {
      result: {
        isThreat: true,
        threatScore: 88,
        severity: "HIGH",
        primaryVector: "Injection",
        attackTactic: "Mock assessment",
        suspiciousTokens: ["override"],
        recommendedAction: "BLOCK",
        sanitizedPrompt: "Summarize the text.",
        latencyMs: 10,
      },
    },
  }),
);
await page.route("**/api/redteam/immunize", (r) =>
  r.fulfill({
    json: {
      patch: {
        originalPrompt: "Original fixture",
        hardenedPrompt: "Candidate fixture",
        hardeningTechniques: ["Test constraint"],
        retestPayload: turn.promptPayload,
        retestResponse: "Still vulnerable",
        retestVerdict: "BREACHED",
        retestScore: 85,
        mitigationConfidence: 15,
      },
    },
  }),
);
try {
  await page.goto(process.env.TEST_BASE_URL || "http://localhost:3005", {
    waitUntil: "networkidle",
  });
  await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await page.getByText("See exactly what happened.", { exact: true }).waitFor();
  await page.getByRole("tab", { name: "Scan", exact: true }).click();
  await page.getByRole("button", { name: "Scan prompt" }).click();
  await page.getByText("Potential threat detected").waitFor();
  await page.getByRole("button", { name: "Try the demo" }).click();
  await page.getByText("Sample mode · Illustrative results").waitFor();
  await page.getByRole("button", { name: "Report", exact: true }).click();
  await page
    .getByText("ILLUSTRATIVE SAMPLE — not live inference evidence", {
      exact: false,
    })
    .waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").isVisible(), false);
  await page.getByRole("tab", { name: "Harden" }).click();
  assert.equal(
    await page.getByRole("button", { name: "Generate defense" }).isDisabled(),
    true,
  );
  await page.getByRole("tab", { name: "Test" }).click();
  await page
    .getByRole("button", { name: "Dispatch Ghost-Injector" })
    .first()
    .click();
  await page.getByText("Synthetic test payload", { exact: true }).waitFor();
  assert.equal(
    await page.getByText("Sample mode · Illustrative results").count(),
    0,
  );
  await page.getByRole("tab", { name: "Harden" }).click();
  await page.getByRole("button", { name: "Generate defense" }).click();
  await page.getByText("Retest result: Review required").waitFor();
  await page.screenshot({
    path: "artifacts/failed-retest.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Apply to sandbox" }).click();
  await page.getByRole("tab", { name: "Test", exact: true }).waitFor();
  failAttack = true;
  await page
    .getByRole("button", { name: "Dispatch Ghost-Injector" })
    .first()
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "Mock provider unavailable" })
    .waitFor();
  await page.getByText("Connect your agent", { exact: true }).click();
  await page
    .getByRole("button", { name: "Custom prompt", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Target system prompt", exact: true })
    .fill("");
  assert.equal(
    await page.getByRole("button", { name: "Use this agent" }).isDisabled(),
    true,
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  failAttack = false;
  skipCampaign = true;
  await page.getByRole("button", { name: "Run campaign" }).click();
  await page
    .getByText("Campaign finished: 4 evaluated, 1 skipped.", { exact: true })
    .waitFor();
  assert.equal(campaignRequests.length, 5);
  assert.equal(new Set(campaignRequests).size, 5);
  await page
    .getByRole("complementary", { name: "Skipped tests" })
    .getByText("Logic-Breaker:", { exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Report", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByText("No valid test payload; target not evaluated.", { exact: false })
    .waitFor();
  await page.keyboard.press("Escape");
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `No overflow at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Sample", exact: true }).click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "Sample findings fit mobile",
  );
  await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: workflow tabs, sample provenance, report/Escape, sample hardening guard, attack, failed retest, patch reset, provider error, form validation, campaign continues after a skipped test with exported provenance, 3 viewport widths, no browser errors.",
  );
} finally {
  await browser.close();
}
