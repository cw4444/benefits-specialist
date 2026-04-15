const sampleBrief = `Accountabilities

Lead benefits procurement, administration, and renewal cycles for EMEA, including health, retirement, and supplemental benefit programs
Manage relationships with vendors, brokers, and external partners, including negotiations on pricing, SLAs, and renewals
Design and launch locally relevant supplemental benefits such as wellness, mental health, and family support programs
Serve as a regional subject matter expert, supporting internal teams and responding to client and employee benefits inquiries
Ensure accuracy of benefits data, including eligibility, enrollment, billing, and ongoing administration
Collaborate with product, legal, and operations teams to maintain alignment with statutory requirements and EOR frameworks
Develop clear country-level benefits documentation, communications, and enrollment guides to improve employee understanding
Support global benefits operations teams to ensure efficient enrollment and administration of EOR employee benefits

Requirements

4+ years of experience in benefits management, preferably with EMEA regional exposure
Experience managing end-to-end benefits renewals and vendor/broker relationships
Strong knowledge of statutory and supplemental benefits structures in at least one major EMEA market
Ability to design and implement scalable, compliant, and employee-centric benefits programs
Strong communication skills with the ability to simplify complex benefits topics for diverse audiences
Experience working in fast-paced, high-growth, or international environments
Strong problem-solving skills with a consultative, solution-oriented approach
Ability to manage complexity, ensure accuracy, and maintain strong attention to detail
Nice to have: experience in EOR/PEO environments, familiarity with HRIS or benefits platforms, and multilingual capabilities`;

const els = {
  input: document.querySelector("#input-text"),
  fileInput: document.querySelector("#file-input"),
  fileName: document.querySelector("#file-name"),
  provider: document.querySelector("#provider"),
  apiKey: document.querySelector("#api-key"),
  modelName: document.querySelector("#model-name"),
  statusPill: document.querySelector("#status-pill"),
  run: document.querySelector("#run-demo"),
  sample: document.querySelector("#load-sample"),
  renewal: document.querySelector("#renewal-text"),
  vendor: document.querySelector("#vendor-text"),
  compliance: document.querySelector("#compliance-text"),
  scale: document.querySelector("#scale-text"),
  rScore: document.querySelector("#score-renewal"),
  vScore: document.querySelector("#score-vendor"),
  cScore: document.querySelector("#score-compliance"),
};

const storageKeys = {
  provider: "benefits-demo-provider",
  apiKey: "benefits-demo-api-key",
  modelName: "benefits-demo-model",
  input: "benefits-demo-input",
};

function loadState() {
  els.provider.value = localStorage.getItem(storageKeys.provider) || "local";
  els.apiKey.value = localStorage.getItem(storageKeys.apiKey) || "";
  els.modelName.value = localStorage.getItem(storageKeys.modelName) || "";
  els.input.value = localStorage.getItem(storageKeys.input) || sampleBrief;
}

function saveState() {
  localStorage.setItem(storageKeys.provider, els.provider.value);
  localStorage.setItem(storageKeys.apiKey, els.apiKey.value);
  localStorage.setItem(storageKeys.modelName, els.modelName.value);
  localStorage.setItem(storageKeys.input, els.input.value);
}

function scoreFrom(text, patterns) {
  const lower = text.toLowerCase();
  return Math.min(
    100,
    patterns.reduce((sum, pattern) => sum + (lower.includes(pattern) ? 1 : 0), 0) * 20
  );
}

function bullets(text, items) {
  return items.filter(Boolean).join(" ");
}

function analyze(text) {
  const renewalSignals = [
    "renewal", "renewals", "procurement", "pricing", "sla", "slas", "vendor", "broker",
  ];
  const complianceSignals = ["statutory", "eor", "legal", "compliance", "country-level", "emea"];
  const scaleSignals = ["scalable", "fast-paced", "high-growth", "standard", "documentation", "data"];

  const renewalScore = scoreFrom(text, renewalSignals);
  const vendorScore = scoreFrom(text, ["vendor", "broker", "pricing", "sla", "relationship", "external"]);
  const complianceScore = scoreFrom(text, complianceSignals);
  const scaleScore = scoreFrom(text, scaleSignals);

  const renewalText = bullets(
    text,
    [
      renewalScore >= 60
        ? "The role clearly needs end-to-end renewal ownership, with vendor pricing and SLA negotiation built in."
        : "Renewal ownership is present, but the brief would benefit from clearer timelines, approval gates, and decision owners.",
      "A human reviewer should confirm what happens 90, 60, and 30 days before renewal so nothing slips through.",
    ]
  );

  const vendorText = bullets(
    text,
    [
      vendorScore >= 60
        ? "Vendor and broker management is a core requirement, so the tool should audit contracts, SLAs, escalations, and renewal levers."
        : "Vendor touchpoints are light in the brief, so the audit should surface any missing supplier, broker, or service-level detail.",
      "The strongest follow-up question is whether benefits data, billing, and eligibility are owned in one place or split across teams.",
    ]
  );

  const complianceText = bullets(
    text,
    [
      complianceScore >= 60
        ? "This is firmly a statutory-plus-regional benefits role: country-level rules, EOR frameworks, and legal alignment are all in scope."
        : "Compliance expectations are mentioned, but the output should still call out which countries, statutory schemes, and EOR rules apply.",
      "A non-technical user should get a short country-by-country summary instead of a legal dump.",
    ]
  );

  const scaleText = bullets(
    text,
    [
      scaleScore >= 60
        ? "The role is scalable if the process is template-led: one intake, one renewal calendar, one vendor scorecard, and one documentation pack per country."
        : "Scaleability should be judged by whether the process can be repeated across countries without rework or hidden manual steps.",
      "If the same questions need answering twice, the workflow should capture them once and reuse the answer everywhere.",
    ]
  );

  return {
    renewalScore,
    vendorScore,
    complianceScore,
    scaleScore,
    renewalText,
    vendorText,
    complianceText,
    scaleText,
  };
}

function render(results) {
  els.rScore.textContent = `${results.renewalScore}%`;
  els.vScore.textContent = `${results.vendorScore}%`;
  els.cScore.textContent = `${results.complianceScore}%`;
  els.renewal.textContent = results.renewalText;
  els.vendor.textContent = results.vendorText;
  els.compliance.textContent = results.complianceText;
  els.scale.textContent = results.scaleText;
}

function runAnalysis() {
  saveState();
  els.statusPill.textContent = els.provider.value === "local" ? "Local mode" : "Ready for API";
  render(analyze(els.input.value.trim()));
}

els.sample.addEventListener("click", () => {
  els.input.value = sampleBrief;
  els.fileName.textContent = "Sample brief loaded";
  runAnalysis();
});

els.run.addEventListener("click", runAnalysis);

els.fileInput.addEventListener("change", async () => {
  const file = els.fileInput.files?.[0];
  if (!file) return;
  const text = await file.text();
  els.input.value = text;
  els.fileName.textContent = file.name;
  runAnalysis();
});

[els.provider, els.apiKey, els.modelName, els.input].forEach((field) => {
  field.addEventListener("input", saveState);
  field.addEventListener("change", saveState);
});

loadState();
render(analyze(els.input.value.trim()));

