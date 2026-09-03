import { useState, useRef, useCallback, useEffect } from "react";

const ALL_CHIPS = [
  "Calm", "Premium", "Playful", "Grounded", "Bold", "Minimal", "Handcrafted", "Precise",
];

const LUMA_TEXT =
  "Luma is a wellbeing app for busy young professionals. It helps people take short, personalised reset breaks during hectic workdays through breathing, audio sessions, gentle movement, and reflection prompts. The brand should feel calm, optimistic, grounded, intelligent, and quietly premium. Avoid clinical, overly spiritual, neon, cartoon-like, or noisy aesthetics.";

const LUMA_FILES = [
  { name: "Luma_Project_Brief.pdf", type: "pdf" },
  { name: "Audience_Research.pdf", type: "pdf" },
  { name: "Visual_References.jpg", type: "img" },
];

const LUMA_CHIPS = ["Calm", "Grounded", "Premium", "Minimal"];

const REFINE_CHIPS = ["More energetic", "More minimal", "More premium", "Less organic", "More playful"];

const LOADING_STEPS = [
  "Reading project context",
  "Distilling visual direction",
  "Sourcing imagery",
  "Building your moodboard",
];

const DEFAULT_PALETTE = [
  { name: "Warm Cream", hex: "#F4F0E8" },
  { name: "Sage", hex: "#9DAA92" },
  { name: "Clay Accent", hex: "#C98568" },
  { name: "Charcoal", hex: "#252A28" },
];

/* ---------------- icons ---------------- */
function PdfIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 2.5h8.5L19 7v14.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-18a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M14.5 2.5V7H19" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>);
}
function ImgIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" /><circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M21 16.5 15.5 11 6 20" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>);
}
function UploadIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 15.5V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M7.5 8 12 3.5 16.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>);
}
function CloseIcon() {
  return (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 5 19 19M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>);
}
function CopyIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="8.5" y="8.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.5" /></svg>);
}
function CheckIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5 9.5 17 19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}
function ShareIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="m8.2 10.7 7.6-3.9M8.2 13.3l7.6 3.9" stroke="currentColor" strokeWidth="1.5" /></svg>);
}
function RefineIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3v2.2M12 18.8V21M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M3 12h2.2M18.8 12H21M5.6 18.4l1.5-1.5M16.9 7.1l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.5" /></svg>);
}
function GearIcon() {
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" /><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.9-1.3-2-3.4-2.2.7a7.7 7.7 0 0 0-2.6-1.5L14 2.5h-4l-.5 2.5a7.7 7.7 0 0 0-2.6 1.5l-2.2-.7-2 3.4L4.6 10.5a7.6 7.6 0 0 0 0 3L2.7 14.8l2 3.4 2.2-.7c.76.66 1.64 1.17 2.6 1.5L10 21.5h4l.5-2.5a7.7 7.7 0 0 0 2.6-1.5l2.2.7 2-3.4-1.9-1.3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>);
}
function ShuffleIcon() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h3.2c1.4 0 2.7.7 3.4 1.9L15 18h3M3 18h3.2c1.4 0 2.7-.7 3.4-1.9L15 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16.5 4 19.5 6l-3 2M16.5 20 19.5 18l-3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>);
}

/* -------------- helpers -------------- */
function TextureFallback({ label }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #E9E2D2 0%, #C7B9A0 60%, #ADA087 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="img"
      aria-label={label}
    >
      <span style={{ fontSize: 11, color: "#5B5852", fontWeight: 500, opacity: 0.7, padding: "0 12px", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

function isValidHex(v) {
  return typeof v === "string" && /^#([0-9a-fA-F]{6})$/.test(v.trim());
}

function stripFences(s) {
  return s.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
}

async function callGemini(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.9 },
      }),
    });
  } catch {
    throw new Error("Couldn't reach Gemini (network/CORS error). Check your connection and that the API key is valid, then try again.");
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Gemini request failed (${res.status}). Check your Gemini API key. ${t.slice(0, 140)}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  if (!text) throw new Error("Gemini returned an empty response. Try again.");
  let parsed;
  try {
    parsed = JSON.parse(stripFences(text));
  } catch {
    throw new Error("Couldn't parse Gemini's response. Try again.");
  }
  return parsed;
}

async function searchUnsplash(apiKey, query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  let res;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Client-ID ${apiKey}` },
    });
  } catch {
    throw new Error("Couldn't reach Unsplash (network/CORS error). Check your connection and access key, then try again.");
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unsplash request failed (401). Check your Unsplash access key.");
    throw new Error(`Unsplash request failed (${res.status}).`);
  }
  const data = await res.json();
  return data?.results || [];
}

function directionPrompt({ description, feelings, filenames, refine }) {
  const feelingsLine = feelings.length ? feelings.join(", ") : "unspecified";
  const filesLine = filenames.length ? filenames.join(", ") : "none";
  return `You are Mosaik, an AI visual-direction engine for moodboards. Read the project context below and produce ONE cohesive visual direction as strict JSON. Be specific to this exact brief \u2014 avoid generic default answers.

PROJECT DESCRIPTION:
"""${description}"""

DESIRED FEELING TAGS: ${feelingsLine}
ATTACHED SOURCE FILES (names only, for context): ${filesLine}
${refine ? `\nREFINEMENT REQUEST: The user has an existing direction and wants it adjusted to feel: "${refine}". Shift the direction accordingly while keeping it coherent with the original brief.\n` : ""}

Return ONLY a JSON object with this exact shape, no markdown fences, no commentary:
{
  "projectName": "short 1-2 word project or brand name inferred from the brief (invent one if none is given)",
  "title": "a 2-4 word evocative name for this visual direction, not generic (avoid words like 'Vision' or 'Concept')",
  "rationale": "one sentence, under 30 words, explaining the direction and what it avoids",
  "imageryLabel": "one short sentence describing lighting, materials and textures for the imagery direction",
  "imageryQueries": ["6 short stock-photo search queries, 2-4 words each, visually distinct from one another, evoking the mood/materials/colors rather than literal brand names"],
  "palette": [{"name": "short color role name", "hex": "#RRGGBB"} x4, harmonious and matched to the mood],
  "principles": [{"title": "1-3 word principle name", "copy": "under 16 words explaining it"} x3],
  "headingFont": "a real Google Fonts family name suited to the mood, distinctive for display/headings",
  "bodyFont": "a real Google Fonts family name, highly readable, suited for UI/body text",
  "headingSpecimen": "a short evocative phrase, under 6 words, representative of the heading font's voice",
  "bodySpecimen": "one sentence, under 18 words, representative of the body copy voice"
}`;
}

/* -------------- main app -------------- */
export default function MosaikApp() {
  const [screen, setScreen] = useState("input"); // input | result
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedChips, setSelectedChips] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const [geminiKey, setGeminiKey] = useState("");
  const [unsplashKey, setUnsplashKey] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [keyDraft, setKeyDraft] = useState({
    gemini: "",
    unsplash: "",
  });

  const [result, setResult] = useState(null); // { projectName, title, rationale, imageryLabel, images:[{url,alt}], palette, principles, headingFont, bodyFont, headingSpecimen, bodySpecimen }
  const [copiedSwatch, setCopiedSwatch] = useState(null);
  const [toast, setToast] = useState(null);
  const [refineOpen, setRefineOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedRefineChip, setSelectedRefineChip] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [reshuffling, setReshuffling] = useState(false);

  const toastTimer = useRef(null);
  const fontLinkRef = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const loadFonts = (headingFont, bodyFont) => {
    try {
      const fam = (f) => encodeURIComponent(f).replace(/%20/g, "+");
      const href = `https://fonts.googleapis.com/css2?family=${fam(headingFont)}:wght@400;500;700&family=${fam(bodyFont)}:wght@400;500;600&display=swap`;
      if (fontLinkRef.current) {
        fontLinkRef.current.href = href;
      } else {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        fontLinkRef.current = link;
      }
    } catch {
      /* non-fatal */
    }
  };

  const keysReady = geminiKey.trim().length > 0 && unsplashKey.trim().length > 0;
  const canGenerate = text.trim().length > 0 && status === "idle";

  const toggleChip = (chip) => {
    setSelectedChips((prev) => (prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]));
  };
  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));
  const fileInputRef = useRef(null);
  const [customChips, setCustomChips] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  const triggerFilePicker = () => fileInputRef.current?.click();

  const handleFilesSelected = (e) => {
    const picked = Array.from(e.target.files || []);
    const mapped = picked.map((f) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return { name: f.name, type: ext === "pdf" ? "pdf" : "img" };
    });
    setFiles((prev) => {
      const existingNames = new Set(prev.map((p) => p.name));
      const deduped = mapped.filter((m) => !existingNames.has(m.name));
      return [...prev, ...deduped];
    });
    e.target.value = "";
  };

  const handleTrySample = () => {
    setText(LUMA_TEXT);
    setFiles(LUMA_FILES);
    setSelectedChips(LUMA_CHIPS);
  };

  const addCustomChip = () => {
    const val = keywordInput.trim();
    if (!val) return;
    setCustomChips((prev) => (prev.includes(val) ? prev : [...prev, val]));
    setKeywordInput("");
  };
  const removeCustomChip = (val) => setCustomChips((prev) => prev.filter((c) => c !== val));

  const fetchImagesForQueries = async (queries) => {
    const settled = await Promise.allSettled(
      queries.map((q) => searchUnsplash(unsplashKey, q))
    );
    return settled.map((r, i) => {
      if (r.status === "fulfilled" && r.value.length) {
        const pick = r.value[Math.floor(Math.random() * Math.min(3, r.value.length))];
        return {
          url: pick.urls?.regular,
          alt: pick.alt_description || queries[i],
          credit: pick.user?.name,
          creditUrl: pick.user?.links?.html,
          query: queries[i],
        };
      }
      return { url: null, alt: queries[i], query: queries[i] };
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return;
    if (!keysReady) {
      setSettingsOpen(true);
      return;
    }
    setStatus("loading");
    setErrorMsg(null);
    setLoadingStep(0);
    try {
      await new Promise((r) => setTimeout(r, 350));
      setLoadingStep(1);
      const prompt = directionPrompt({
        description: text,
        feelings: [...selectedChips, ...customChips],
        filenames: files.map((f) => f.name),
      });
      const direction = await callGemini(geminiKey, prompt);

      setLoadingStep(2);
      const images = await fetchImagesForQueries(
        Array.isArray(direction.imageryQueries) && direction.imageryQueries.length
          ? direction.imageryQueries.slice(0, 6)
          : ["natural light workspace", "tactile materials", "calm portrait", "soft shadows desk", "minimal composition", "warm texture"]
      );

      setLoadingStep(3);
      const palette = Array.isArray(direction.palette)
        ? direction.palette.filter((c) => c && isValidHex(c.hex)).slice(0, 4)
        : [];

      const finalResult = {
        projectName: direction.projectName || "Untitled",
        title: direction.title || "Visual Direction",
        rationale: direction.rationale || "",
        imageryLabel: direction.imageryLabel || "",
        images,
        palette: palette.length === 4 ? palette : DEFAULT_PALETTE,
        principles: Array.isArray(direction.principles) ? direction.principles.slice(0, 3) : [],
        headingFont: direction.headingFont || "DM Serif Display",
        bodyFont: direction.bodyFont || "Inter",
        headingSpecimen: direction.headingSpecimen || "A softer way to reset.",
        bodySpecimen: direction.bodySpecimen || "Small moments of reset can change the pace of a whole day.",
        feelings: [...selectedChips, ...customChips],
      };

      loadFonts(finalResult.headingFont, finalResult.bodyFont);
      await new Promise((r) => setTimeout(r, 300));
      setResult(finalResult);
      setStatus("idle");
      setScreen("result");
    } catch (e) {
      setErrorMsg(e.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  }, [text, selectedChips, customChips, files, geminiKey, unsplashKey, keysReady]);

  const handleReshuffleImagery = async () => {
    if (!result || reshuffling) return;
    setReshuffling(true);
    try {
      const queries = result.images.map((i) => i.query);
      const images = await fetchImagesForQueries(queries);
      setResult((r) => ({ ...r, images }));
      showToast("Imagery reshuffled.");
    } catch (e) {
      showToast("Couldn't reshuffle imagery.");
    } finally {
      setReshuffling(false);
    }
  };

  const copySwatch = (hex) => {
    setCopiedSwatch(hex);
    showToast(`${hex} copied`);
    setTimeout(() => setCopiedSwatch((c) => (c === hex ? null : c)), 1400);
  };

  const copyMoodboardData = () => showToast("Moodboard details copied.");

  const openRefine = () => {
    setSelectedRefineChip(null);
    setRefineOpen(true);
  };

  const regenerate = useCallback(async () => {
    if (!selectedRefineChip || !result) return;
    setRegenerating(true);
    setErrorMsg(null);
    try {
      const prompt = directionPrompt({
        description: text,
        feelings: result.feelings || [...selectedChips, ...customChips],
        filenames: files.map((f) => f.name),
        refine: selectedRefineChip,
      });
      const direction = await callGemini(geminiKey, prompt);
      const images = await fetchImagesForQueries(
        Array.isArray(direction.imageryQueries) && direction.imageryQueries.length
          ? direction.imageryQueries.slice(0, 6)
          : result.images.map((i) => i.query)
      );
      const palette = Array.isArray(direction.palette)
        ? direction.palette.filter((c) => c && isValidHex(c.hex)).slice(0, 4)
        : [];
      const finalResult = {
        projectName: direction.projectName || result.projectName,
        title: direction.title || result.title,
        rationale: direction.rationale || result.rationale,
        imageryLabel: direction.imageryLabel || result.imageryLabel,
        images,
        palette: palette.length === 4 ? palette : result.palette,
        principles: Array.isArray(direction.principles) ? direction.principles.slice(0, 3) : result.principles,
        headingFont: direction.headingFont || result.headingFont,
        bodyFont: direction.bodyFont || result.bodyFont,
        headingSpecimen: direction.headingSpecimen || result.headingSpecimen,
        bodySpecimen: direction.bodySpecimen || result.bodySpecimen,
        feelings: result.feelings,
      };
      loadFonts(finalResult.headingFont, finalResult.bodyFont);
      setResult(finalResult);
      setRefineOpen(false);
      showToast("Moodboard updated.");
    } catch (e) {
      showToast(e.message || "Couldn't refine the moodboard.");
    } finally {
      setRegenerating(false);
    }
  }, [selectedRefineChip, result, text, selectedChips, customChips, files, geminiKey]);

  const copyLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1600);
  };

  const handleCreateAnother = () => {
    setScreen("input");
    setResult(null);
    setText("");
    setFiles([]);
    setSelectedChips([]);
    setCustomChips([]);
    setKeywordInput("");
    setErrorMsg(null);
  };

  const openSettings = () => {
    setKeyDraft({ gemini: geminiKey, unsplash: unsplashKey });
    setSettingsOpen(true);
  };
  const saveSettings = () => {
    setGeminiKey(keyDraft.gemini.trim());
    setUnsplashKey(keyDraft.unsplash.trim());
    setSettingsOpen(false);
  };

  return (
    <div style={styles.page}>
      <GlobalStyle />
      <div className="mosaik-root">
        {screen === "input" ? (
          <InputScreen
            text={text} setText={setText}
            files={files} removeFile={removeFile}
            fileInputRef={fileInputRef} triggerFilePicker={triggerFilePicker} handleFilesSelected={handleFilesSelected}
            selectedChips={selectedChips} toggleChip={toggleChip}
            customChips={customChips} keywordInput={keywordInput} setKeywordInput={setKeywordInput}
            addCustomChip={addCustomChip} removeCustomChip={removeCustomChip}
            handleTrySample={handleTrySample}
            canGenerate={canGenerate} status={status} loadingStep={loadingStep}
            handleGenerate={handleGenerate}
            errorMsg={errorMsg}
            keysReady={keysReady}
            openSettings={openSettings}
          />
        ) : (
          <ResultScreen
            result={result}
            onBack={() => setScreen("input")}
            onNew={handleCreateAnother}
            openSettings={openSettings}
            copiedSwatch={copiedSwatch} copySwatch={copySwatch}
            copyMoodboardData={copyMoodboardData}
            openRefine={openRefine}
            reshuffling={reshuffling} handleReshuffleImagery={handleReshuffleImagery}
            setShareOpen={setShareOpen}
          />
        )}

        {toast && <div className="mosaik-toast" style={styles.toast}>{toast}</div>}

        {settingsOpen && (
          <SettingsModal
            keyDraft={keyDraft} setKeyDraft={setKeyDraft}
            onSave={saveSettings} onClose={() => setSettingsOpen(false)}
          />
        )}

        {refineOpen && (
          <RefineModal
            selectedRefineChip={selectedRefineChip} setSelectedRefineChip={setSelectedRefineChip}
            regenerating={regenerating} regenerate={regenerate}
            onClose={() => !regenerating && setRefineOpen(false)}
          />
        )}

        {shareOpen && result && (
          <ShareModal
            projectName={result.projectName} title={result.title}
            linkCopied={linkCopied} copyLink={copyLink}
            onClose={() => setShareOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

/* -------------- input screen -------------- */
function InputScreen({
  text, setText, files, removeFile,
  fileInputRef, triggerFilePicker, handleFilesSelected,
  selectedChips, toggleChip,
  customChips, keywordInput, setKeywordInput, addCustomChip, removeCustomChip,
  handleTrySample, canGenerate, status, loadingStep, handleGenerate, errorMsg, keysReady, openSettings,
}) {
  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.wordmark}>Mosaik</div>
        <div style={styles.navLinks}>
          <a href="#" className="mosaik-nav-link mosaik-focusable" style={styles.navLink}>How it works</a>
          <a href="#" className="mosaik-nav-link mosaik-focusable" style={styles.navLink}>My moodboards</a>
          <button type="button" className="mosaik-focusable" style={styles.gearBtn} onClick={openSettings} aria-label="Settings">
            <GearIcon />
          </button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>AI visual direction tool</p>
          <h1 className="mosaik-heading" style={styles.heading}>What are you building?</h1>
          <p style={styles.subcopy}>
            Share your project context, research, or early ideas. Mosaik will turn it into a visual direction.
          </p>
          {!keysReady && (
            <button type="button" className="mosaik-focusable" style={styles.keysNudge} onClick={openSettings}>
              Add your Gemini &amp; Unsplash keys to generate real results \u2192
            </button>
          )}
        </div>

        <div style={styles.card}>
          {status !== "loading" ? (
            <>
              <label htmlFor="mosaik-desc" style={styles.fieldLabel}>Describe your project</label>
              <textarea
                id="mosaik-desc"
                className="mosaik-textarea mosaik-focusable"
                style={styles.textarea}
                placeholder={"Example: We\u2019re creating a wellbeing app for busy young professionals. It should feel calm, grounded, and quietly premium\u2014not clinical or overly spiritual."}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
              />

              <div style={styles.attachRow}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  multiple
                  onChange={handleFilesSelected}
                  style={{ display: "none" }}
                />
                <button type="button" className="mosaik-focusable" style={styles.addSourcesBtn} onClick={triggerFilePicker}>
                  <UploadIcon /> Add sources
                </button>
                <span style={styles.supportedTypes}>PDF, PNG, JPG</span>
              </div>
              <p style={styles.helperText}>
                Add project briefs, market research, brand documents, sketches, or brainstorm visuals.
              </p>

              {files.length > 0 && (
                <div style={styles.chipRow}>
                  {files.map((f) => (
                    <div key={f.name} className="mosaik-chip-in" style={styles.fileChip}>
                      <span style={styles.fileChipIcon}>{f.type === "pdf" ? <PdfIcon /> : <ImgIcon />}</span>
                      <span style={styles.fileChipName}>{f.name}</span>
                      <button type="button" aria-label={`Remove ${f.name}`} className="mosaik-focusable" style={styles.fileChipRemove} onClick={() => removeFile(f.name)}>
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={styles.feelSection}>
                <label htmlFor="mosaik-keyword-input" style={styles.feelLabel}>Anything it should feel like?</label>
                <div style={styles.chipRow}>
                  {ALL_CHIPS.map((chip) => {
                    const selected = selectedChips.includes(chip);
                    return (
                      <button type="button" key={chip} className="mosaik-chip mosaik-focusable" onClick={() => toggleChip(chip)}
                        style={{ ...styles.feelChip, ...(selected ? styles.feelChipSelected : {}) }}>
                        {chip}
                        {selected && <span style={styles.feelChipX}><CloseIcon /></span>}
                      </button>
                    );
                  })}
                </div>

                <div style={styles.keywordInputRow}>
                  <input
                    id="mosaik-keyword-input"
                    type="text"
                    className="mosaik-focusable"
                    style={styles.keywordInput}
                    placeholder="Type a keyword and press Enter\u2026"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomChip();
                      }
                    }}
                  />
                  <button type="button" className="mosaik-focusable" style={styles.keywordAddBtn} onClick={addCustomChip}>
                    Add
                  </button>
                </div>

                {customChips.length > 0 && (
                  <div style={styles.chipRow}>
                    {customChips.map((chip) => (
                      <span key={chip} className="mosaik-chip-in" style={styles.customChip}>
                        {chip}
                        <button type="button" aria-label={`Remove ${chip}`} className="mosaik-focusable" style={styles.customChipRemove} onClick={() => removeCustomChip(chip)}>
                          <CloseIcon />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

              <div style={styles.actionsRow}>
                <button type="button" className="mosaik-focusable" style={styles.tryLumaBtn} onClick={handleTrySample}>
                  Try creating a sample moodboard
                </button>
                <button type="button" className="mosaik-primary-btn mosaik-focusable"
                  style={{ ...styles.primaryBtn, ...(canGenerate ? {} : styles.primaryBtnDisabled) }}
                  disabled={!canGenerate} onClick={handleGenerate}>
                  Generate moodboard
                </button>
              </div>
            </>
          ) : (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingDots}>
                <span className="mosaik-dot" style={styles.dot} />
                <span className="mosaik-dot" style={styles.dot} />
                <span className="mosaik-dot" style={styles.dot} />
              </div>
              <p key={loadingStep} className="mosaik-fade" style={styles.loadingText}>
                {LOADING_STEPS[loadingStep]}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

/* -------------- result screen -------------- */
function ResultScreen({
  result, onBack, onNew, openSettings, copiedSwatch, copySwatch, copyMoodboardData,
  openRefine, reshuffling, handleReshuffleImagery, setShareOpen,
}) {
  if (!result) return null;
  const { projectName, title, rationale, imageryLabel, images, palette, principles, headingFont, bodyFont, headingSpecimen, bodySpecimen, feelings } = result;
  const [hero, img2, img3, img4, img5, img6] = images.concat(Array(6).fill({ url: null, alt: "" }));

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.wordmark}>Mosaik</div>
        <div style={styles.navLinks}>
          <button type="button" className="mosaik-focusable" style={styles.gearBtn} onClick={openSettings} aria-label="Settings"><GearIcon /></button>
          <button type="button" className="mosaik-focusable" style={styles.newMoodboardBtn} onClick={onNew}>New moodboard</button>
        </div>
      </nav>

      <main style={styles.main2}>
        <button type="button" onClick={onBack} className="mosaik-link mosaik-focusable" style={styles.backLink}>
          \u2190 Back to project input
        </button>

        <p style={styles.eyebrowResult}>Generated live from your input via Gemini &amp; Unsplash \u2014 no data stored.</p>

        <div style={styles.metaRow}>
          <span style={styles.metaItem}><span style={styles.metaKey}>Project </span><span style={styles.metaVal}>{projectName}</span></span>
          {feelings && feelings.length > 0 && (
            <>
              <span style={styles.metaDivider} />
              <span style={styles.metaItem}><span style={styles.metaKey}>Inputs </span><span style={styles.metaVal}>{feelings.join(", ")}</span></span>
            </>
          )}
        </div>

        <div key={title} className="mosaik-fade" style={styles.titleBlock}>
          <h1 className="mosaik-title" style={{ ...styles.title, fontFamily: `'${headingFont}', 'DM Serif Display', serif` }}>{title}</h1>
          <p style={styles.rationale}>{rationale}</p>
        </div>

        {/* Imagery */}
        <section style={styles.section}>
          <div style={styles.sectionHeadRow}>
            <h2 style={styles.sectionHeading}>Imagery direction</h2>
            <button type="button" className="mosaik-focusable" style={styles.reshuffleBtn} onClick={handleReshuffleImagery} disabled={reshuffling}>
              <ShuffleIcon /> {reshuffling ? "Reshuffling\u2026" : "Reshuffle imagery"}
            </button>
          </div>

          <div className="mosaik-imagery-grid">
            <ImgTile img={hero} area="hero" />
            <ImgTile img={img2} area="a" />
            <ImgTile img={img3} area="b" />
            <ImgTile img={img4} area="c" />
          </div>
          <div className="mosaik-support-row">
            <ImgTile img={img5} tall />
            <ImgTile img={img6} tall />
          </div>
          <p style={styles.imageryLabel}>{imageryLabel}</p>
        </section>

        {/* Palette */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>Colour palette</h2>
          <div className="mosaik-palette-grid">
            {palette.map((c) => {
              const isDark = getLuminance(c.hex) < 0.5;
              return (
                <button type="button" key={c.hex} className="mosaik-swatch mosaik-focusable" onClick={() => copySwatch(c.hex)}
                  style={{ ...styles.swatch, background: c.hex, color: isDark ? "#F4F0E8" : "#252A28" }}>
                  <span style={styles.swatchTop}>
                    <span style={styles.swatchName}>{c.name}</span>
                    <span style={styles.swatchIcon}>{copiedSwatch === c.hex ? <CheckIcon /> : <CopyIcon />}</span>
                  </span>
                  <span style={styles.swatchHex}>{c.hex.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Typography */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>Type with warmth and clarity</h2>
          <div className="mosaik-type-grid">
            <div style={styles.typeCard} className="mosaik-card-hover">
              <p style={styles.typeFontLabel}>Heading \u2014 {headingFont}</p>
              <p style={{ ...styles.typeSpecimenSerif, fontFamily: `'${headingFont}', serif` }}>{headingSpecimen}</p>
              <p style={styles.typeDescriptor}>Sets the tone for this direction</p>
            </div>
            <div style={styles.typeCard} className="mosaik-card-hover">
              <p style={styles.typeFontLabel}>Body \u2014 {bodyFont}</p>
              <p style={{ ...styles.typeSpecimenSans, fontFamily: `'${bodyFont}', sans-serif` }}>{bodySpecimen}</p>
              <p style={styles.typeDescriptor}>Clear, modern, highly readable</p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>Visual principles</h2>
          <div className="mosaik-principles-grid">
            {principles.map((p, i) => (
              <div key={i} style={styles.principleCard} className="mosaik-card-hover">
                <h3 style={styles.principleTitle}>{p.title}</h3>
                <p style={styles.principleCopy}>{p.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* UI glimpse */}
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>How this could translate to product UI</h2>
          <div style={styles.uiPreviewWrap}>
            <div className="mosaik-ui-grid">
              <div style={styles.phoneCard}>
                <div style={{ ...styles.phoneHeaderDot, background: palette[2]?.hex || "#C98568" }} />
                <p style={{ ...styles.phoneTitle, fontFamily: `'${headingFont}', serif` }}>Today\u2019s reset</p>
                <p style={{ ...styles.phoneSub, fontFamily: `'${bodyFont}', sans-serif` }}>3 minute breathing session</p>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, background: palette[1]?.hex || "#9DAA92" }} />
                </div>
                <button type="button" style={{ ...styles.phonePrimaryBtn, background: palette[3]?.hex || "#252A28", fontFamily: `'${bodyFont}', sans-serif` }} tabIndex={-1}>
                  Begin session
                </button>
              </div>
              <div style={styles.uiNotesCol}>
                <p style={{ ...styles.uiNote, fontFamily: `'${bodyFont}', sans-serif` }}>
                  Soft rounded primary actions and a single accent progress cue keep the interface calm rather than gamified.
                </p>
                <p style={{ ...styles.uiNote, fontFamily: `'${bodyFont}', sans-serif` }}>
                  Cards sit on the base background with quiet shadows\u2014no harsh borders, no clinical white.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div style={styles.bottomSpacer} />
      </main>

      <div className="mosaik-fab" style={styles.fab}>
        <button type="button" className="mosaik-fab-btn mosaik-focusable" style={styles.fabSecondary} onClick={copyMoodboardData}>
          <CopyIcon /> Copy moodboard data
        </button>
        <button type="button" className="mosaik-fab-btn mosaik-focusable" style={styles.fabSecondary} onClick={openRefine}>
          <RefineIcon /> Refine moodboard
        </button>
        <button type="button" className="mosaik-fab-btn mosaik-focusable" style={styles.fabSecondary} onClick={onNew}>
          Create another
        </button>
        <button type="button" className="mosaik-fab-btn mosaik-focusable" style={styles.fabPrimary} onClick={() => setShareOpen(true)}>
          <ShareIcon /> Share
        </button>
      </div>
    </>
  );
}

function ImgTile({ img, area, tall }) {
  const cls = area ? `mosaik-tile-${area}` : "mosaik-tile-support";
  return (
    <div className={cls} style={{ ...styles.imgCard, ...(tall ? { height: "100%" } : {}) }}>
      {img?.url ? (
        <img src={img.url} alt={img.alt || ""} style={styles.imgTag} loading="lazy" />
      ) : (
        <TextureFallback label={img?.query || img?.alt || "image"} />
      )}
    </div>
  );
}

function getLuminance(hex) {
  try {
    const c = hex.replace("#", "");
    const r = parseInt(c.substr(0, 2), 16) / 255;
    const g = parseInt(c.substr(2, 2), 16) / 255;
    const b = parseInt(c.substr(4, 2), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  } catch {
    return 1;
  }
}

/* -------------- modals -------------- */
function SettingsModal({ keyDraft, setKeyDraft, onSave, onClose }) {
  return (
    <div className="mosaik-modal-backdrop" style={styles.modalBackdrop} onClick={onClose}>
      <div className="mosaik-modal-panel" style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <p style={styles.modalLabel}>API keys</p>
          <button type="button" aria-label="Close" className="mosaik-focusable" style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
        </div>
        <p style={styles.modalHint}>
          Used directly from your browser to call Gemini and Unsplash. Nothing is stored or sent anywhere else.
        </p>
        <label style={styles.settingsLabel} htmlFor="mosaik-gemini-key">Gemini API key</label>
        <input
          id="mosaik-gemini-key"
          type="password"
          className="mosaik-focusable"
          style={styles.settingsInput}
          value={keyDraft.gemini}
          onChange={(e) => setKeyDraft((k) => ({ ...k, gemini: e.target.value }))}
          placeholder="AIza\u2026"
        />
        <label style={{ ...styles.settingsLabel, marginTop: 16 }} htmlFor="mosaik-unsplash-key">Unsplash access key</label>
        <input
          id="mosaik-unsplash-key"
          type="password"
          className="mosaik-focusable"
          style={styles.settingsInput}
          value={keyDraft.unsplash}
          onChange={(e) => setKeyDraft((k) => ({ ...k, unsplash: e.target.value }))}
          placeholder="Unsplash access key"
        />
        <button type="button" className="mosaik-focusable" style={styles.regenerateBtn} onClick={onSave}>
          Save keys
        </button>
      </div>
    </div>
  );
}

function RefineModal({ selectedRefineChip, setSelectedRefineChip, regenerating, regenerate, onClose }) {
  return (
    <div className="mosaik-modal-backdrop" style={styles.modalBackdrop} onClick={onClose}>
      <div className="mosaik-modal-panel" style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <p style={styles.modalLabel}>What should change?</p>
          <button type="button" aria-label="Close" className="mosaik-focusable" style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={styles.refineChipRow}>
          {REFINE_CHIPS.map((chip) => {
            const selected = selectedRefineChip === chip;
            return (
              <button type="button" key={chip} className="mosaik-chip-btn mosaik-focusable" onClick={() => setSelectedRefineChip(chip)}
                style={{ ...styles.refineChip, ...(selected ? styles.refineChipSelected : {}) }}>
                {chip}
              </button>
            );
          })}
        </div>
        <button type="button" className="mosaik-focusable"
          style={{ ...styles.regenerateBtn, ...(selectedRefineChip && !regenerating ? {} : styles.regenerateBtnDisabled) }}
          disabled={!selectedRefineChip || regenerating} onClick={regenerate}>
          {regenerating ? "Regenerating\u2026" : "Regenerate moodboard"}
        </button>
      </div>
    </div>
  );
}

function ShareModal({ projectName, title, linkCopied, copyLink, onClose }) {
  const slug = `${(projectName || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(title || "direction").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="mosaik-modal-backdrop" style={styles.modalBackdrop} onClick={onClose}>
      <div className="mosaik-modal-panel" style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <p style={styles.modalTitleShare}>Moodboard ready to share</p>
          <button type="button" aria-label="Close" className="mosaik-focusable" style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={styles.shareUrlRow}>
          <span style={styles.shareUrl}>mosaik.design/m/{slug}</span>
          <button type="button" className="mosaik-focusable" style={styles.copyLinkBtn} onClick={copyLink}>
            {linkCopied ? <CheckIcon /> : <CopyIcon />} {linkCopied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------- global style -------------- */
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      .mosaik-root { font-family: 'Inter', -apple-system, sans-serif; }
      .mosaik-focusable:focus-visible { outline: 2px solid #7C8D74; outline-offset: 2px; }

      .mosaik-nav-link, .mosaik-link { position: relative; text-decoration: none; }
      .mosaik-nav-link::after, .mosaik-link::after { content: ""; position: absolute; left: 0; bottom: -3px; width: 0%; height: 1px; background: currentColor; transition: width 0.2s ease; }
      .mosaik-nav-link:hover::after, .mosaik-link:hover::after { width: 100%; }

      textarea.mosaik-textarea:focus { outline: none; border-color: #97A98D; box-shadow: 0 0 0 3px rgba(124,141,116,0.16); }

      .mosaik-chip, .mosaik-chip-btn { transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease; }
      .mosaik-primary-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
      .mosaik-primary-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(58,56,53,0.18); }

      .mosaik-swatch { transition: transform 0.18s ease, box-shadow 0.18s ease; cursor: pointer; }
      .mosaik-swatch:hover { transform: translateY(-3px); box-shadow: 0 14px 28px -16px rgba(37,42,40,0.35); }
      .mosaik-card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease; }
      .mosaik-card-hover:hover { transform: translateY(-2px); box-shadow: 0 16px 32px -20px rgba(37,42,40,0.3); }
      .mosaik-fab-btn { transition: transform 0.15s ease, background 0.15s ease; }
      .mosaik-fab-btn:hover { transform: translateY(-1px); }

      .mosaik-fade-in, .mosaik-chip-in { animation: mosaikChipIn 0.35s ease both; }
      @keyframes mosaikChipIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .mosaik-fade { animation: mosaikFade 0.35s ease both; }
      @keyframes mosaikFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .mosaik-dot { animation: mosaikPulse 1.1s ease-in-out infinite; }
      .mosaik-dot:nth-child(2) { animation-delay: 0.15s; }
      .mosaik-dot:nth-child(3) { animation-delay: 0.3s; }
      @keyframes mosaikPulse { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
      .mosaik-toast { animation: mosaikToastIn 0.3s ease both; }
      @keyframes mosaikToastIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
      .mosaik-modal-backdrop { animation: mosaikBackdropIn 0.2s ease both; }
      @keyframes mosaikBackdropIn { from { opacity: 0; } to { opacity: 1; } }
      .mosaik-modal-panel { animation: mosaikPanelIn 0.28s ease both; }
      @keyframes mosaikPanelIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

      @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

      .mosaik-imagery-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; grid-template-rows: 210px 210px; gap: 14px; }
      .mosaik-tile-hero { grid-column: 1; grid-row: 1 / 3; }
      .mosaik-tile-a { grid-column: 2; grid-row: 1; }
      .mosaik-tile-b { grid-column: 3; grid-row: 1; }
      .mosaik-tile-c { grid-column: 2 / 4; grid-row: 2; }
      .mosaik-support-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; height: 220px; }

      .mosaik-palette-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .mosaik-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
      .mosaik-principles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      .mosaik-ui-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

      @media (max-width: 860px) {
        .mosaik-nav-links a { display: none; }
        .mosaik-heading, .mosaik-title { font-size: 34px !important; }
        .mosaik-imagery-grid { grid-template-columns: 1fr; grid-template-rows: none; }
        .mosaik-tile-hero, .mosaik-tile-a, .mosaik-tile-b, .mosaik-tile-c { grid-column: auto; grid-row: auto; height: 220px; }
        .mosaik-support-row { grid-template-columns: 1fr; height: auto; }
        .mosaik-support-row > div { height: 200px; }
        .mosaik-palette-grid { grid-template-columns: repeat(2, 1fr); }
        .mosaik-type-grid { grid-template-columns: 1fr; }
        .mosaik-principles-grid { grid-template-columns: 1fr; }
        .mosaik-ui-grid { grid-template-columns: 1fr; }
        .mosaik-fab { position: static !important; margin: 40px auto 0 !important; justify-content: center !important; flex-wrap: wrap; }
      }
    `}</style>
  );
}

/* -------------- style tokens -------------- */
const COLORS = {
  bg: "#F6F3EC", cardBg: "#FFFEFC", charcoal: "#252A28", charcoalSoft: "#5B5852",
  hairline: "#E6E1D6", sage: "#7C8D74", sageSoft: "#EEF1E9", clay: "#C98568", claySoft: "#F3E7DF",
};

const styles = {
  page: { minHeight: "100vh", width: "100%", background: COLORS.bg, color: COLORS.charcoal },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 48px", maxWidth: 1180, margin: "0 auto" },
  wordmark: { fontFamily: "'DM Serif Display', serif", fontSize: 22, color: COLORS.charcoal },
  navLinks: { display: "flex", alignItems: "center", gap: 24 },
  navLink: { fontSize: 14.5, color: COLORS.charcoalSoft, fontWeight: 500 },
  gearBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 9, border: `1px solid ${COLORS.hairline}`, background: "#FBFAF6", color: COLORS.charcoalSoft, cursor: "pointer" },
  newMoodboardBtn: { fontSize: 13.5, fontWeight: 500, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "9px 16px", cursor: "pointer" },

  main: { maxWidth: 760, margin: "0 auto", padding: "56px 24px 100px", display: "flex", flexDirection: "column", alignItems: "center" },
  main2: { maxWidth: 1040, margin: "0 auto", padding: "8px 32px 140px" },

  heroText: { textAlign: "center", maxWidth: 560, marginBottom: 44 },
  eyebrow: { fontSize: 13, letterSpacing: "0.04em", color: COLORS.sage, fontWeight: 500, margin: "0 0 14px" },
  heading: { fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 46, lineHeight: 1.12, margin: "0 0 16px", color: COLORS.charcoal },
  subcopy: { fontSize: 16.5, lineHeight: 1.6, color: COLORS.charcoalSoft, margin: 0 },
  keysNudge: { marginTop: 18, background: "none", border: "none", padding: 0, fontSize: 13.5, fontWeight: 500, color: COLORS.clay, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 },

  card: { width: "100%", background: COLORS.cardBg, border: `1px solid ${COLORS.hairline}`, borderRadius: 20, padding: "32px 32px 28px", boxShadow: "0 20px 50px -28px rgba(51,49,45,0.22)" },
  fieldLabel: { display: "block", fontSize: 13.5, fontWeight: 600, color: COLORS.charcoal, marginBottom: 10 },
  textarea: { width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 15.5, lineHeight: 1.6, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 14, padding: "16px 18px", resize: "vertical", minHeight: 132 },
  attachRow: { display: "flex", alignItems: "center", gap: 14, marginTop: 18 },
  addSourcesBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 500, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer" },
  supportedTypes: { fontSize: 12.5, color: COLORS.charcoalSoft, opacity: 0.75 },
  helperText: { fontSize: 12.5, color: COLORS.charcoalSoft, opacity: 0.75, margin: "8px 0 0" },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 },
  fileChip: { display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.sageSoft, border: `1px solid #DCE4D6`, borderRadius: 10, padding: "7px 8px 7px 10px", fontSize: 13, color: COLORS.charcoal },
  fileChipIcon: { display: "flex", color: COLORS.sage },
  fileChipName: { fontWeight: 500 },
  fileChipRemove: { display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, border: "none", background: "transparent", color: COLORS.charcoalSoft, cursor: "pointer", borderRadius: 6 },
  feelSection: { marginTop: 26, paddingTop: 22, borderTop: `1px solid ${COLORS.hairline}` },
  feelLabel: { display: "block", fontSize: 13.5, fontWeight: 600, color: COLORS.charcoal, marginBottom: 12 },
  feelChip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: COLORS.charcoalSoft, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 999, padding: "7px 14px", cursor: "pointer" },
  feelChipSelected: { color: "#7A4B34", background: COLORS.claySoft, borderColor: "#E3C7B4" },
  feelChipX: { display: "flex", opacity: 0.75 },
  keywordInputRow: { display: "flex", gap: 8, marginTop: 14 },
  keywordInput: { flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "10px 14px" },
  keywordAddBtn: { fontSize: 13, fontWeight: 600, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "10px 16px", cursor: "pointer" },
  customChip: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#7A4B34", background: COLORS.claySoft, border: "1px solid #E3C7B4", borderRadius: 999, padding: "7px 8px 7px 14px" },
  customChipRemove: { display: "flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, border: "none", background: "transparent", color: "#7A4B34", cursor: "pointer", opacity: 0.8 },
  errorText: { fontSize: 13, color: "#A14A3A", background: "#FBEAE4", border: "1px solid #EFC9BC", borderRadius: 10, padding: "10px 14px", marginTop: 20 },
  actionsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 30 },
  tryLumaBtn: { background: "none", border: "none", padding: 0, fontSize: 13.5, fontWeight: 500, color: COLORS.sage, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" },
  primaryBtn: { background: COLORS.charcoal, color: "#F6F3EC", border: "none", borderRadius: 12, padding: "13px 24px", fontSize: 14.5, fontWeight: 600, cursor: "pointer" },
  primaryBtnDisabled: { background: "#DAD6CB", color: "#A9A499", cursor: "not-allowed" },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "38px 0 30px", gap: 18 },
  loadingDots: { display: "flex", gap: 7 },
  dot: { width: 8, height: 8, borderRadius: "50%", background: COLORS.sage, display: "inline-block" },
  loadingText: { fontSize: 14.5, color: COLORS.charcoalSoft, fontWeight: 500, margin: 0 },

  backLink: { display: "inline-block", fontSize: 13.5, fontWeight: 500, color: COLORS.charcoalSoft, marginBottom: 22, background: "none", border: "none", cursor: "pointer", padding: 0 },
  eyebrowResult: { fontSize: 12.5, color: COLORS.sage, fontWeight: 500, margin: "0 0 18px" },
  metaRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 22, flexWrap: "wrap" },
  metaItem: { fontSize: 13 },
  metaKey: { color: COLORS.charcoalSoft, opacity: 0.75 },
  metaVal: { color: COLORS.charcoal, fontWeight: 500 },
  metaDivider: { width: 1, height: 12, background: COLORS.hairline },
  titleBlock: { marginBottom: 56, maxWidth: 640 },
  title: { fontWeight: 400, fontSize: 56, lineHeight: 1.08, margin: "0 0 18px", color: COLORS.charcoal },
  rationale: { fontSize: 17, lineHeight: 1.6, color: COLORS.charcoalSoft, margin: 0 },
  section: { marginBottom: 64 },
  sectionHeadRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  sectionHeading: { fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 26, margin: 0, color: COLORS.charcoal },
  reshuffleBtn: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 999, padding: "8px 14px", cursor: "pointer" },
  imgCard: { borderRadius: 16, overflow: "hidden", border: `1px solid ${COLORS.hairline}`, height: "100%" },
  imgTag: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  imageryLabel: { marginTop: 16, fontSize: 13, color: COLORS.charcoalSoft, opacity: 0.8 },
  swatch: { borderRadius: 16, padding: "18px 18px 20px", height: 132, display: "flex", flexDirection: "column", justifyContent: "space-between", border: "none", textAlign: "left", fontFamily: "'Inter', sans-serif" },
  swatchTop: { display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  swatchName: { fontSize: 14, fontWeight: 600 },
  swatchIcon: { opacity: 0.85 },
  swatchHex: { fontSize: 13, opacity: 0.85, letterSpacing: "0.02em" },
  typeCard: { background: COLORS.cardBg, border: `1px solid ${COLORS.hairline}`, borderRadius: 18, padding: "30px 28px" },
  typeFontLabel: { fontSize: 12.5, fontWeight: 600, color: COLORS.sage, margin: "0 0 18px" },
  typeSpecimenSerif: { fontSize: 30, lineHeight: 1.25, color: COLORS.charcoal, margin: "0 0 16px" },
  typeSpecimenSans: { fontSize: 18, fontWeight: 500, lineHeight: 1.5, color: COLORS.charcoal, margin: "0 0 16px" },
  typeDescriptor: { fontSize: 13, color: COLORS.charcoalSoft, opacity: 0.8, margin: 0 },
  principleCard: { background: COLORS.cardBg, border: `1px solid ${COLORS.hairline}`, borderRadius: 16, padding: "24px 22px" },
  principleTitle: { fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: COLORS.charcoal },
  principleCopy: { fontSize: 14.5, lineHeight: 1.55, color: COLORS.charcoalSoft, margin: 0 },
  uiPreviewWrap: { background: "#EFEAE0", border: `1px solid ${COLORS.hairline}`, borderRadius: 20, padding: 28 },
  phoneCard: { background: COLORS.cardBg, borderRadius: 20, padding: "22px 22px 24px", maxWidth: 260, boxShadow: "0 18px 34px -22px rgba(37,42,40,0.3)" },
  phoneHeaderDot: { width: 8, height: 8, borderRadius: "50%", marginBottom: 14 },
  phoneTitle: { fontSize: 20, margin: "0 0 6px", color: COLORS.charcoal },
  phoneSub: { fontSize: 13, color: COLORS.charcoalSoft, margin: "0 0 18px" },
  progressTrack: { width: "100%", height: 6, borderRadius: 999, background: "#E4E9DE", overflow: "hidden", marginBottom: 20 },
  progressFill: { width: "58%", height: "100%", borderRadius: 999 },
  phonePrimaryBtn: { width: "100%", color: "#F6F3EC", border: "none", borderRadius: 12, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "default" },
  uiNotesCol: { display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 },
  uiNote: { fontSize: 14, lineHeight: 1.6, color: COLORS.charcoalSoft, margin: 0 },
  bottomSpacer: { height: 20 },
  fab: { position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, background: COLORS.cardBg, border: `1px solid ${COLORS.hairline}`, borderRadius: 999, padding: 8, boxShadow: "0 20px 44px -20px rgba(37,42,40,0.35)", zIndex: 20 },
  fabSecondary: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500, color: COLORS.charcoal, background: "transparent", border: "none", borderRadius: 999, padding: "10px 16px", cursor: "pointer", whiteSpace: "nowrap" },
  fabPrimary: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 600, color: "#F6F3EC", background: COLORS.charcoal, border: "none", borderRadius: 999, padding: "10px 18px", cursor: "pointer", whiteSpace: "nowrap" },
  toast: { position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", background: COLORS.charcoal, color: "#F6F3EC", fontSize: 13.5, fontWeight: 500, padding: "12px 20px", borderRadius: 12, boxShadow: "0 16px 32px -18px rgba(37,42,40,0.5)", zIndex: 30 },
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(37,42,40,0.32)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 40, padding: 20 },
  modalPanel: { background: COLORS.cardBg, borderRadius: 20, padding: "26px 26px 24px", width: "100%", maxWidth: 420, boxShadow: "0 30px 60px -22px rgba(37,42,40,0.4)" },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  modalLabel: { fontSize: 15, fontWeight: 600, color: COLORS.charcoal, margin: 0 },
  modalHint: { fontSize: 12.5, color: COLORS.charcoalSoft, opacity: 0.85, margin: "0 0 20px", lineHeight: 1.5 },
  modalTitleShare: { fontFamily: "'DM Serif Display', serif", fontSize: 22, color: COLORS.charcoal, margin: 0 },
  modalClose: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, border: "none", background: "transparent", color: COLORS.charcoalSoft, cursor: "pointer" },
  settingsLabel: { display: "block", fontSize: 13, fontWeight: 600, color: COLORS.charcoal, marginBottom: 8 },
  settingsInput: { width: "100%", fontFamily: "'Inter', sans-serif", fontSize: 14, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "11px 14px" },
  refineChipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  refineChip: { fontSize: 13.5, fontWeight: 500, color: COLORS.charcoalSoft, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 999, padding: "8px 15px", cursor: "pointer" },
  refineChipSelected: { color: "#7A4B34", background: COLORS.claySoft, borderColor: "#E3C7B4" },
  regenerateBtn: { width: "100%", marginTop: 22, background: COLORS.charcoal, color: "#F6F3EC", border: "none", borderRadius: 12, padding: "13px 0", fontSize: 14.5, fontWeight: 600, cursor: "pointer" },
  regenerateBtnDisabled: { background: "#DAD6CB", color: "#A9A499", cursor: "not-allowed" },
  shareUrlRow: { display: "flex", alignItems: "center", gap: 10, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 12, padding: "10px 10px 10px 16px" },
  shareUrl: { flex: 1, fontSize: 13.5, color: COLORS.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  copyLinkBtn: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: COLORS.charcoal, background: COLORS.sageSoft, border: "1px solid #DCE4D6", borderRadius: 9, padding: "8px 13px", cursor: "pointer", whiteSpace: "nowrap" },
};