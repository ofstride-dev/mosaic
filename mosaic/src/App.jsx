import { useState, useRef, useCallback, useEffect } from "react";

const LUMA_TEXT =
  "Luma is a wellbeing app for busy young professionals. It helps people take short, personalised reset breaks during hectic workdays through breathing, audio sessions, gentle movement, and reflection prompts. The brand should feel calm, optimistic, grounded, intelligent, and quietly premium. Avoid clinical, overly spiritual, neon, cartoon-like, or noisy aesthetics.";

const LUMA_FILES = [
  { name: "Luma_Project_Brief.pdf", type: "pdf" },
  { name: "Audience_Research.pdf", type: "pdf" },
  { name: "Visual_References.jpg", type: "img" },
];

const PRESET_CHIPS = ["Calm", "Bold", "Playful", "Minimal", "Premium", "Energetic", "Warm", "Grounded", "Precise"];
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
function LockIcon({ locked }) {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />{locked ? <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /> : <path d="M8 10V7a4 4 0 0 1 7.2-2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}</svg>);
}
function ShareIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" /><circle cx="18" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="m8.2 10.7 7.6-3.9M8.2 13.3l7.6 3.9" stroke="currentColor" strokeWidth="1.5" /></svg>);
}
function RefineIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3v2.2M12 18.8V21M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M3 12h2.2M18.8 12H21M5.6 18.4l1.5-1.5M16.9 7.1l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.5" /></svg>);
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

/* -------------- main app -------------- */
export default function MosaicApp() {
  const [screen, setScreen] = useState("input");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("idle");
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [result, setResult] = useState(null);
  const [copiedSwatch, setCopiedSwatch] = useState(null);
  const [toast, setToast] = useState(null);
  const [refineOpen, setRefineOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedRefineChip, setSelectedRefineChip] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [reshuffling, setReshuffling] = useState(false);
  const [recolouring, setRecolouring] = useState(null);
  const [textureSeeds, setTextureSeeds] = useState([]);
  const [locks, setLocks] = useState({ paletteLocks: { Background:false, Surface:false, Accent:false, Text:false }, headingFontLocked:false, bodyFontLocked:false, imageryLocked:false, uiLanguageLocked:false });
  const [selectedChips, setSelectedChips] = useState([]);
  const [customChips, setCustomChips] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const fileInputRef = useRef(null);
  const toastTimer = useRef(null);
  const fontLinkRef = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = (message) => { clearTimeout(toastTimer.current); setToast(message); toastTimer.current = setTimeout(() => setToast(null), 2400); };
  const loadFonts = (headingFont, bodyFont) => { try { const fam = (f) => encodeURIComponent(f).replace(/%20/g, "+"); const href = `https://fonts.googleapis.com/css2?family=${fam(headingFont)}:wght@300;400;500;600;700&family=${fam(bodyFont)}:wght@300;400;500;600;700&display=swap`; if (fontLinkRef.current) fontLinkRef.current.href = href; else { const link=document.createElement("link"); link.rel="stylesheet"; link.href=href; document.head.appendChild(link); fontLinkRef.current=link; } } catch { /* non-fatal */ } };
  useEffect(() => { if (!result) return; loadFonts(result.headingFont || "DM Serif Display", result.bodyFont || "Inter"); document.documentElement.style.setProperty("--dynamic-ease", result.cssEasingCurve || "cubic-bezier(0.2, 0.8, 0.2, 1)"); }, [result]);
  const canGenerate = text.trim().length > 0 && status === "idle";
  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));
  const triggerFilePicker = () => fileInputRef.current?.click();
  const handleFilesSelected = (e) => { const mapped=Array.from(e.target.files||[]).map((f)=>({name:f.name,type:f.name.split(".").pop().toLowerCase()==="pdf"?"pdf":"img",raw:f})); setFiles((prev)=>[...prev,...mapped.filter((m)=>!prev.some((p)=>p.name===m.name))]); e.target.value=""; };
  const handleTrySample = () => { setText(LUMA_TEXT); setFiles(LUMA_FILES); setSelectedChips(LUMA_CHIPS); setCustomChips([]); };
  const toggleChip = (chip) => setSelectedChips((prev) => prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]);
  const readImage = (file) => new Promise((resolve) => { if (file.type !== "img" || !file.raw) return resolve(null); const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, dataUrl: reader.result }); reader.onerror = () => resolve(null); reader.readAsDataURL(file.raw); });
  const addCustomChip = () => { const val=keywordInput.trim(); if(!val)return; setCustomChips((prev)=>prev.includes(val)?prev:[...prev,val]); setKeywordInput(""); };
  const removeCustomChip = (val) => setCustomChips((prev)=>prev.filter((c)=>c!==val));
  const request = async (url, body) => { const response=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); const payload=await response.json().catch(()=>({})); if(!response.ok) throw new Error(payload.error||"The request failed. Please try again."); return payload; };
  const handleGenerate = useCallback(async () => { if(!text.trim())return; setStatus("loading"); setErrorMsg(null); setLoadingStep(0); try { await new Promise((r)=>setTimeout(r,250)); setLoadingStep(1); const imageFiles=(await Promise.all(files.map(readImage))).filter(Boolean); const direction=await request("/api/generateMoodboard",{description:text,feelings:[...selectedChips,...customChips],filenames:files.map((f)=>f.name),images:imageFiles}); setLoadingStep(3); const finalResult={...direction,palette:Array.isArray(direction.palette)?direction.palette:DEFAULT_PALETTE,images:Array.isArray(direction.images)?direction.images:[],feelings:[...selectedChips,...customChips]}; setTextureSeeds((finalResult.imagery?.pollinationsPrompts||[]).map(() => Math.floor(Math.random() * 10000))); loadFonts(finalResult.headingFont||"DM Serif Display",finalResult.bodyFont||"Inter"); setResult(finalResult); setLocks({paletteLocks:{Background:false,Surface:false,Accent:false,Text:false},headingFontLocked:false,bodyFontLocked:false,imageryLocked:false,uiLanguageLocked:false}); setScreen("result"); } catch(e){ setErrorMsg(e.message||"Something went wrong. Please try again."); } finally { setStatus("idle"); } },[text,selectedChips,customChips,files]);
  const handleReshuffleImagery = async () => { if(!result||reshuffling||locks.imageryLocked)return; setReshuffling(true); try { const updated=await request("/api/refineMoodboard",{description:text,feelings:result.feelings||customChips,filenames:files.map((f)=>f.name),refinementText:"Return fresh stock-photo queries and fresh abstract texture prompts while preserving the direction.",locks:{...locks,imageryLocked:false},currentResult:result}); setResult((r)=>({...r,images:updated.images||r.images,imagery:updated.imagery||r.imagery,imageryQueries:updated.imageryQueries||updated.imagery?.pexelsQueries||r.imageryQueries})); showToast("Imagery reshuffled."); } catch(e){showToast(e.message||"Couldn't reshuffle imagery.");} finally{setReshuffling(false);} };
  const copySwatch = async (value) => { try { await navigator.clipboard.writeText(value); setCopiedSwatch(value); showToast(`${value} copied`); setTimeout(() => setCopiedSwatch((c) => c === value ? null : c), 2000); } catch { showToast("Clipboard permission was unavailable."); } };
  const recolorSwatch = async (role) => { if(!result||locks.paletteLocks[role])return; setRecolouring(role); try { const updated=await request("/api/recolorSwatch",{currentResult:result,role}); if(!updated?.hex) throw new Error("Recolour returned no hex value."); setResult((r)=>({...r,palette:r.palette.map((c)=>c.role===role?{...c,hex:updated.hex}:c)})); showToast(`${role} recoloured.`); } catch(e){showToast(e.message||"Couldn't recolour swatch.");} finally{setRecolouring(null);} };
  const toggleLock = (key) => setLocks((prev)=> key.startsWith("palette:") ? {...prev,paletteLocks:{...prev.paletteLocks,[key.slice(8)]:!prev.paletteLocks[key.slice(8)]}} : {...prev,[key]:!prev[key]});
  const openRefine=()=>{setSelectedRefineChip(null);setRefineOpen(true);};
  const regenerate = useCallback(async()=>{if(!selectedRefineChip||!result)return;setRegenerating(true);try{const updated=await request("/api/refineMoodboard",{description:text,feelings:result.feelings||customChips,filenames:files.map((f)=>f.name),refinementText:selectedRefineChip,locks,currentResult:result});setResult((r)=>({...r,...updated,images:locks.imageryLocked?r.images:(updated.images||r.images),palette:updated.palette.map((color)=>locks.paletteLocks[color.role]?r.palette.find((old)=>old.role===color.role)||color:color)}));setRefineOpen(false);showToast("Moodboard updated.");}catch(e){showToast(e.message||"Couldn't refine the moodboard.");}finally{setRegenerating(false);}},[selectedRefineChip,result,text,customChips,files,locks]);
  const handleCreateAnother=()=>{setScreen("input");setResult(null);setText("");setFiles([]);setSelectedChips([]);setCustomChips([]);setKeywordInput("");setErrorMsg(null);};
  const copyMoodboardData=async()=>{if(!result)return;const lines=[`# ${result.title||"Moodboard"}`,`\n## Project\n${result.projectName||""}`,`\n## Colors\n${(result.palette||[]).map((c)=>`- **${c.role||c.name}**: ${c.hex}`).join("\n")}`,`\n## Typography\n- Heading: ${result.headingFont||""}\n- Body: ${result.bodyFont||""}`,`\n## Visual principles\n${(result.principles||[]).map((p)=>`- **${p.title}**: ${p.copy}`).join("\n")}`,`\n## Imagery\nQueries: ${(result.imagery?.pexelsQueries||result.imageryQueries||[]).join(", ")}\nPrompts: ${(result.imagery?.pollinationsPrompts||[]).join(" | ")}\nURLs:\n${(result.images||[]).map((image)=>`- ${image.url||"Unavailable"}`).join("\n")}`].join("\n");try{await navigator.clipboard.writeText(lines);showToast("Moodboard data copied to clipboard.");}catch{showToast("Clipboard permission was unavailable.");}};
  const copyLink=()=>{setLinkCopied(true);setTimeout(()=>setLinkCopied(false),1600);};
  const showPresetLibraryToast=()=>showToast("Preset library &mdash; coming soon");
  return <div style={styles.page}><GlobalStyle/><div className="mosaic-root">{screen==="input"?<InputScreen text={text} setText={setText} files={files} removeFile={removeFile} fileInputRef={fileInputRef} triggerFilePicker={triggerFilePicker} handleFilesSelected={handleFilesSelected} selectedChips={selectedChips} toggleChip={toggleChip} customChips={customChips} keywordInput={keywordInput} setKeywordInput={setKeywordInput} addCustomChip={addCustomChip} removeCustomChip={removeCustomChip} handleTrySample={handleTrySample} canGenerate={canGenerate} status={status} loadingStep={loadingStep} handleGenerate={handleGenerate} errorMsg={errorMsg} showPresetLibraryToast={showPresetLibraryToast}/>:screen==="preview"?<ProductPreview result={result} mode={previewMode} setMode={setPreviewMode} onBack={()=>setScreen("result")} />:<ResultScreen result={result} textureSeeds={textureSeeds} onBack={()=>setScreen("input")} onNew={handleCreateAnother} copiedSwatch={copiedSwatch} copySwatch={copySwatch} copyMoodboardData={copyMoodboardData} openRefine={openRefine} reshuffling={reshuffling} handleReshuffleImagery={handleReshuffleImagery} setShareOpen={setShareOpen} locks={locks} toggleLock={toggleLock} recolourSwatch={recolorSwatch} recolouring={recolouring} onPreview={()=>setScreen("preview")} />}{toast&&<div className="mosaic-toast" style={styles.toast}>{toast}</div>}{refineOpen&&<RefineModal selectedRefineChip={selectedRefineChip} setSelectedRefineChip={setSelectedRefineChip} regenerating={regenerating} regenerate={regenerate} onClose={()=>!regenerating&&setRefineOpen(false)}/>} {shareOpen&&result&&<ShareModal projectName={result.projectName} title={result.title} linkCopied={linkCopied} copyLink={copyLink} onClose={()=>setShareOpen(false)}/>}</div></div>;
}

/* -------------- input screen -------------- */
function InputScreen({
  text, setText, files, removeFile,
  fileInputRef, triggerFilePicker, handleFilesSelected,
    selectedChips, toggleChip, customChips, keywordInput, setKeywordInput, addCustomChip, removeCustomChip,
  handleTrySample, canGenerate, status, loadingStep, handleGenerate, errorMsg, showPresetLibraryToast,
}) {
  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.wordmark}>Mosaic</div>
        <div style={styles.navLinks}>
                    <a href="#" className="mosaic-nav-link mosaic-focusable" style={styles.navLink}>My moodboards</a>
          <button type="button" className="mosaic-nav-link mosaic-focusable" style={styles.navLinkButton} onClick={showPresetLibraryToast}>Preset library</button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>AI visual direction tool</p>
          <h1 className="mosaic-heading" style={styles.heading}>What are you building?</h1>
          <p style={styles.subcopy}>
            Share your project context, research, or early ideas. Mosaic will turn it into a visual direction.
          </p>
        </div>

        <div style={styles.card}>
          {status !== "loading" ? (
            <>
              <label htmlFor="mosaic-desc" style={styles.fieldLabel}>Describe your project</label>
              <textarea
                id="mosaic-desc"
                className="mosaic-textarea mosaic-focusable"
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
                <button type="button" className="mosaic-focusable" style={styles.addSourcesBtn} onClick={triggerFilePicker}>
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
                    <div key={f.name} className="mosaic-chip-in" style={styles.fileChip}>
                      <span style={styles.fileChipIcon}>{f.type === "pdf" ? <PdfIcon /> : <ImgIcon />}</span>
                      <span style={styles.fileChipName}>{f.name}</span>
                      <button type="button" aria-label={`Remove ${f.name}`} className="mosaic-focusable" style={styles.fileChipRemove} onClick={() => removeFile(f.name)}>
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={styles.feelSection}>
                <label htmlFor="mosaic-keyword-input" style={styles.feelLabel}>Anything it should feel like?</label>
                <div style={styles.chipRow}>{PRESET_CHIPS.map((chip) => <button type="button" key={chip} className="mosaic-chip mosaic-focusable" onClick={() => toggleChip(chip)} style={{ ...styles.feelChip, ...(selectedChips.includes(chip) ? styles.feelChipSelected : {}) }}>{chip}</button>)}</div>
                <div style={styles.keywordInputRow}>
                  <input
                    id="mosaic-keyword-input"
                    type="text"
                    className="mosaic-focusable"
                    style={styles.keywordInput}
                    placeholder="Type a keyword and press Enter"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomChip();
                      }
                    }}
                  />
                  <button type="button" className="mosaic-focusable" style={styles.keywordAddBtn} onClick={addCustomChip}>
                    Add
                  </button>
                </div>

                {customChips.length > 0 && (
                  <div style={styles.chipRow}>
                    {customChips.map((chip) => (
                      <span key={chip} className="mosaic-chip-in" style={styles.customChip}>
                        {chip}
                        <button type="button" aria-label={`Remove ${chip}`} className="mosaic-focusable" style={styles.customChipRemove} onClick={() => removeCustomChip(chip)}>
                          <CloseIcon />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

              <div style={styles.actionsRow}>
                <button type="button" className="mosaic-focusable" style={{ ...styles.tryLumaBtn, color: COLORS.clay }} onClick={handleTrySample}>
                  Try creating a sample moodboard
                </button>
                <button type="button" className="mosaic-primary-btn mosaic-focusable"
                  style={{ ...styles.primaryBtn, ...(canGenerate ? {} : styles.primaryBtnDisabled) }}
                  disabled={!canGenerate} onClick={handleGenerate}>
                  Generate moodboard
                </button>
              </div>
            </>
          ) : (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingDots}>
                <span className="mosaic-dot" style={styles.dot} />
                <span className="mosaic-dot" style={styles.dot} />
                <span className="mosaic-dot" style={styles.dot} />
              </div>
              <p key={loadingStep} className="mosaic-fade" style={styles.loadingText}>
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
function ResultScreen({ result, textureSeeds, onBack, onNew, copiedSwatch, copySwatch, copyMoodboardData, openRefine, reshuffling, handleReshuffleImagery, setShareOpen, locks, toggleLock, recolourSwatch, recolouring, onPreview }) {
  const safeResult = result || {};
  const { projectName, title, rationale, imageryLabel, images = [], imagery = {}, palette = DEFAULT_PALETTE, principles = [], headingFont = "DM Serif Display", bodyFont = "Inter", headingSpecimen, bodySpecimen, feelings = [] } = safeResult;
  const textureAssets = (imagery.pollinationsPrompts || []).map((prompt, index) => ({ source: "AI Texture", prompt, url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true&seed=${textureSeeds[index] ?? 0}`, alt: prompt }));
  const combinedImages = [...images, ...textureAssets];
  const [imageItems] = useState(combinedImages);
  if (!result) return null;
  const lockButton = (label, key) => <button type="button" className="mosaic-focusable" style={styles.lockBtn} onClick={() => toggleLock(key)} aria-label={`${locks[key] ? "Unlock" : "Lock"} ${label}`}><LockIcon locked={locks[key]} /></button>;
  return <><nav style={styles.nav}><div style={styles.wordmark}>Mosaic</div><div style={styles.navLinks}><button type="button" className="mosaic-focusable" style={styles.newMoodboardBtn} onClick={onNew}>New moodboard</button></div></nav><main style={styles.main2}><button type="button" onClick={onBack} className="mosaic-link mosaic-focusable" style={styles.backLink}>← Back to project input</button><p style={styles.eyebrowResult}>Generated live from your input via Azure OpenAI — no data stored.</p><div style={styles.metaRow}><span style={styles.metaItem}><span style={styles.metaKey}>Project </span><span style={styles.metaVal}>{projectName}</span></span>{feelings.length > 0 && <><span style={styles.metaDivider} /><span style={styles.metaItem}><span style={styles.metaKey}>Inputs </span><span style={styles.metaVal}>{feelings.join(", ")}</span></span></>}</div><div className="mosaic-fade" style={styles.titleBlock}><h1 className="mosaic-title" style={{ ...styles.title, fontFamily: `'${headingFont}', 'DM Serif Display', serif` }}>{title}</h1><p style={styles.rationale}>{rationale}</p></div>
  <section style={styles.section}><div style={styles.sectionHeadRow}><h2 style={styles.sectionHeading}>Imagery direction</h2><div style={styles.sectionActions}>{lockButton("imagery", "imageryLocked")}<button type="button" className="mosaic-focusable" style={styles.reshuffleBtn} onClick={handleReshuffleImagery} disabled={reshuffling}><ShuffleIcon /> {reshuffling ? "Reshuffling…" : "Reshuffle imagery"}</button></div></div><div className="mosaic-imagery-grid">{imageItems.slice(0, 4).map((img, index) => <ImgTile key={index} img={img} area={index === 0 ? "hero" : String.fromCharCode(96 + index)} />)}</div><div className="mosaic-support-row">{imageItems.slice(4, 6).map((img, index) => <ImgTile key={index + 4} img={img} tall />)}</div><p style={styles.imageryLabel}>{imageryLabel}</p></section>
  <section style={styles.section}><h2 style={styles.sectionHeading}>Colour palette</h2><div className="mosaic-palette-grid">{palette.map((c) => { const role = c.role || c.name; const locked = !!locks.paletteLocks[role]; const busy = recolouring === role; return <div key={role} className="mosaic-swatch mosaic-focusable" role="button" tabIndex={0} onClick={() => copySwatch(c.hex)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); copySwatch(c.hex); } }} style={{ ...styles.swatch, background: c.hex, color: getLuminance(c.hex) < .5 ? "#F4F0E8" : "#252A28" }}><span style={styles.swatchTop}><span style={styles.swatchName}>{role}</span><button type="button" className="mosaic-focusable" style={styles.lockBtn} onClick={(e) => { e.stopPropagation(); toggleLock("palette:" + role); }} aria-label={locked ? "Unlock " + role : "Lock " + role}><LockIcon locked={locked} /></button></span><span style={styles.swatchHex}>{c.hex.toUpperCase()}</span><div style={styles.swatchActions}><small>{copiedSwatch === c.hex ? "Copied!" : "Click to copy"}</small><button type="button" className="mosaic-focusable" style={styles.recolourBtn} disabled={locked || busy} onClick={(e) => { e.stopPropagation(); recolourSwatch(role); }}>{busy ? "Recolouring…" : "Recolour"}</button></div></div>; })}</div></section>
  <section style={styles.section}><h2 style={styles.sectionHeading}>Type with warmth and clarity</h2><div className="mosaic-type-grid"><div className="mosaic-type-card-copy" style={styles.typeCard}><div style={styles.typeCardHead}><p style={styles.typeFontLabel}>Heading: {headingFont} · {copiedSwatch === headingFont ? "Copied!" : "Copy"}</p>{lockButton("heading font", "headingFontLocked")}</div><button type="button" className="mosaic-type-copy mosaic-focusable" onClick={() => copySwatch(headingFont)} style={styles.typeSpecimenButton}><span style={{ ...styles.typeSpecimenSerif, fontFamily: "'" + headingFont + "', serif" }}>{headingSpecimen}</span><span style={styles.typeDescriptor}>Sets the tone for this direction</span></button></div><div className="mosaic-type-card-copy" style={styles.typeCard}><div style={styles.typeCardHead}><p style={styles.typeFontLabel}>Body: {bodyFont} · {copiedSwatch === bodyFont ? "Copied!" : "Copy"}</p>{lockButton("body font", "bodyFontLocked")}</div><button type="button" className="mosaic-type-copy mosaic-focusable" onClick={() => copySwatch(bodyFont)} style={styles.typeSpecimenButton}><span style={{ ...styles.typeSpecimenSans, fontFamily: "'" + bodyFont + "', sans-serif" }}>{bodySpecimen}</span><span style={styles.typeDescriptor}>Clear, modern, highly readable</span></button></div></div></section>
  <section style={styles.section}><h2 style={styles.sectionHeading}>Visual principles</h2><div className="mosaic-principles-grid">{principles.map((p, i) => <div key={i} style={styles.principleCard}><span style={styles.principleNumber}>{String(i + 1).padStart(2, "0")}</span><h3 style={styles.principleTitle}>{p.title}</h3><p style={styles.principleCopy}>{p.copy}</p></div>)}</div></section><section style={styles.section}><h2 style={styles.sectionHeading}>UI Language</h2><p style={styles.imageryLabel}>Live preview of buttons, inputs, and components in this direction — not interactive.</p><UILanguagePreview palette={palette} bodyFont={bodyFont} headingFontWeight={result.headingFontWeight} bodyFontWeight={result.bodyFontWeight} headingLetterSpacing={result.headingLetterSpacing} bodyLetterSpacing={result.bodyLetterSpacing} /></section><div style={styles.bottomSpacer} /></main><div className="mosaic-fab" style={styles.fab}><button type="button" style={styles.fabSecondary} onClick={copyMoodboardData}><CopyIcon /> Copy moodboard data</button><button type="button" style={styles.fabSecondary} onClick={openRefine}><RefineIcon /> Refine moodboard</button><button type="button" style={styles.fabSecondary} onClick={onPreview}>Preview product UI</button><button type="button" style={styles.fabPrimary} onClick={() => setShareOpen(true)}><ShareIcon /> Share</button></div></>;
}
function ImgTile({ img, area, tall }) {
  const cls = area ? `mosaic-tile-${area}` : "mosaic-tile-support";
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cls} style={{ ...styles.imgCard, ...(tall ? { height: "100%" } : {}) }}>
      {img?.url ? (
        <><div className={`mosaic-image-skeleton${loaded ? " mosaic-image-skeleton-hidden" : ""}`} /><img src={img.url} alt={img.alt || ""} onLoad={() => setLoaded(true)} style={{ ...styles.imgTag, opacity: loaded ? 1 : 0, transition: "opacity .35s ease" }} loading="lazy" /></>
      ) : (
        <TextureFallback label={img?.query || img?.alt || "image"} />
      )}
    </div>
  );
}

function UILanguagePreview({ palette, bodyFont, headingFontWeight, bodyFontWeight, headingLetterSpacing, bodyLetterSpacing }) {
  const color = (role, fallback) => palette.find((item) => item.role === role)?.hex || fallback;
  const bg = color("Background", "#F6F3EC");
  const surface = color("Surface", "#FFFEFC");
  const accent = color("Accent", "#C98568");
  const text = color("Text", "#252A28");
  const soft = `${accent}22`;
  const border = `${text}22`;
  const accentText = getLuminance(accent) < 0.55 ? "#FFFEFC" : text;
  return <div style={{ ...styles.uiPreviewWrap, background: bg, fontFamily: `'${bodyFont}', sans-serif`, '--heading-weight': headingFontWeight || 400, '--body-weight': bodyFontWeight || 400, '--heading-tracking': headingLetterSpacing || '0em', '--body-tracking': bodyLetterSpacing || '0em' }}>
    <div className="ui-language-labels">{[["Layout", "Responsive dashboard"], ["Components", "Clear hierarchy"], ["Shape", "Soft, considered edges"], ["Spacing", "Generous rhythm"]].map(([label, value]) => <div key={label}><b>{label}</b><span>{value}</span></div>)}</div>
    <div className="ui-language-grid ui-language-specimens">
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Buttons</small><div style={styles.specimenRow}><button type="button" tabIndex={-1} style={{ ...styles.previewPrimary, background: accent, color: accentText }}>Primary</button><button type="button" tabIndex={-1} style={{ ...styles.previewSecondary, background: bg, borderColor: border, color: text }}>Secondary</button></div><button type="button" tabIndex={-1} style={{ ...styles.previewGhost, color: text }}>Ghost arrow <span>→</span></button></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Input field</small><label style={styles.specimenFieldLabel}>Email address<input readOnly tabIndex={-1} style={{ ...styles.previewInput, background: bg, borderColor: border, color: text }} value="you@studio.com" /></label></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Controls</small><div style={styles.controlsRow}><span style={{ ...styles.toggle, background: accent }}><i style={styles.toggleKnob} /></span><span style={{ ...styles.checkbox, background: accent, color: accentText }}>✓</span><span style={{ ...styles.radio, borderColor: accent }}><i style={{ background: accent }} /></span></div></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Badges &amp; tags</small><div style={styles.tagWrap}><span style={{ ...styles.previewBadge, background: accent, color: accentText }}>Active</span><span style={{ ...styles.previewBadge, background: soft, color: text }}>Draft</span><span style={{ ...styles.tag, borderColor: border, color: text }}>half-tone newsprint</span><span style={{ ...styles.tag, borderColor: border, color: text }}>photoscopy grain</span><span style={{ ...styles.tag, borderColor: border, color: text }}>ripped paper edges</span></div></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Segmented control</small><div style={{ ...styles.segmentedControl, background: bg }}><span style={{ ...styles.segmentActive, color: text }}>Overview</span><span style={styles.segmentButton}>Board</span><span style={styles.segmentButton}>Notes</span></div></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Progress &amp; slider</small><div style={styles.progressMeta}><span>Completion</span><span>62%</span></div><div style={{ ...styles.progressTrack, background: `${text}18` }}><div style={{ ...styles.progressFill, background: accent, width: "62%" }} /></div><div style={{ ...styles.sliderTrack, background: `${text}22` }}><span style={{ ...styles.sliderFill, background: text, width: "48%" }} /><i style={{ ...styles.sliderThumb, borderColor: accent, background: surface }} /></div></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>List row</small><div style={styles.listSpecimen}><span style={{ ...styles.avatar, background: text, color: bg }}>M</span><span><strong>Studio member</strong><small>Editor · online</small></span></div></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Metric tile</small><div style={{ ...styles.metricSpecimen, background: bg }}><small>Weekly reach</small><strong>18.4k</strong><span style={{ color: accent }}>▲ 12.5% this week</span></div></div>
      <div style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Notification</small><div style={{ ...styles.notificationSpecimen, background: soft, color: text }}><span style={{ ...styles.notificationDot, background: accent, color: accentText }}>i</span><span><strong>Direction saved</strong><small>Your moodboard is ready to share with the team.</small></span></div></div>
      <div className="previewContent" style={{ ...styles.specimenCard, background: surface, borderColor: border }}><small style={styles.specimenLabel}>Content card</small><div style={{ ...styles.contentSpecimen, background: bg }}><span style={{ ...styles.dashboardKicker, color: accent }}>Featured</span><strong>Ideas with intention</strong><p>Short, useful context that gives the next action a clear place to land.</p><div><span style={{ ...styles.tag, borderColor: border, color: text }}>Editorial</span><button type="button" tabIndex={-1} style={{ ...styles.previewPrimary, background: accent, color: accentText }}>Open</button></div></div></div>
    </div>
  </div>;
}

function ProductPreview({ result, mode, setMode, onBack }) {
  if (!result) return null;
  const palette = result.palette || DEFAULT_PALETTE;
  const color = (role, fallback) => palette.find((item) => item.role === role)?.hex || fallback;
  const preview = result.productPreview || { appName: result.projectName || "Product", navItems: ["Overview", "Activity", "Settings"], screenTitle: "Overview", primaryMetric: { label: "Progress", value: "-" }, secondaryMetrics: [], listItems: [], primaryCta: "Continue" };
  const accent = color("Accent", "#C98568");
  const surface = color("Surface", "#F4F0E8");
  const textColor = color("Text", "#252A28");
  const items = preview.listItems || [];
  return <><nav style={styles.nav}><div style={styles.wordmark}>Mosaic</div><div style={styles.navLinks}><button type="button" className="mosaic-focusable" style={styles.newMoodboardBtn} onClick={onBack}>Back to moodboard</button></div></nav><main style={styles.main2}><button type="button" className="mosaic-link mosaic-focusable" style={styles.backLink} onClick={onBack}>Back to moodboard</button><div style={styles.previewPageHeader}><div><p style={styles.eyebrowResult}>Product preview</p><h1 style={{...styles.previewPageTitle,fontFamily:`'${result.headingFont || "DM Serif Display"}', serif`}}>{preview.appName}</h1></div><div style={styles.segmentedControl}><button type="button" className="mosaic-focusable" style={mode === "desktop" ? styles.segmentActive : styles.segmentButton} onClick={() => setMode("desktop")}>Desktop</button><button type="button" className="mosaic-focusable" style={mode === "mobile" ? styles.segmentActive : styles.segmentButton} onClick={() => setMode("mobile")}>Mobile</button></div></div>{mode === "desktop" ? <div style={{...styles.dashboard,background:surface,color:textColor}}><aside style={styles.dashboardSidebar}><strong style={{fontFamily:`'${result.headingFont || "DM Serif Display"}', serif`}}>{preview.appName}</strong>{preview.navItems.map((item,index)=><span key={item} style={{...styles.dashboardNavItem,...(index===0?{background:`${accent}22`,color:accent}:{})}}>{item}</span>)}</aside><div style={styles.dashboardBody}><div style={styles.dashboardHeader}><div><span style={styles.dashboardKicker}>Workspace</span><h2 style={{...styles.dashboardTitle,fontFamily:`'${result.headingFont || "DM Serif Display"}', serif`}}>{preview.screenTitle}</h2></div><button type="button" style={{...styles.previewPrimary,background:accent}} tabIndex={-1}>{preview.primaryCta}</button></div><div style={styles.dashboardMetrics}><div style={{...styles.dashboardMetric,background:`${accent}20`}}><small>{preview.primaryMetric?.label}</small><strong>{preview.primaryMetric?.value}</strong></div>{(preview.secondaryMetrics || []).map((metric)=><div key={metric.label} style={{...styles.dashboardMetric,background:"rgba(255,255,255,.55)"}}><small>{metric.label}</small><strong>{metric.value}</strong></div>)}</div><div style={styles.dashboardList}><h3>Recent activity</h3>{items.map((item)=><div key={item.title} style={styles.dashboardRow}><span style={{...styles.dashboardRowDot,background:accent}}/><div><strong>{item.title}</strong><small>{item.subtitle}</small></div></div>)}</div></div></div> : <div style={styles.mobileStage}><div style={{...styles.phonePreview,border:`8px solid ${textColor}`,background:surface,color:textColor}}><div style={{...styles.phoneNotch,background:textColor}}/><span style={styles.dashboardKicker}>{preview.appName}</span><h2 style={{...styles.mobileTitle,fontFamily:`'${result.headingFont || "DM Serif Display"}', serif`}}>{preview.screenTitle}</h2><div style={{...styles.mobileMetric,background:`${accent}20`}}><small>{preview.primaryMetric?.label}</small><strong>{preview.primaryMetric?.value}</strong></div><div style={styles.mobileList}>{items.map((item)=><div key={item.title} style={styles.mobileRow}><strong>{item.title}</strong><small>{item.subtitle}</small></div>)}</div><button type="button" style={{...styles.previewPrimary,background:accent,width:"100%"}} tabIndex={-1}>{preview.primaryCta}</button></div></div>}</main></>;
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
function RefineModal({ selectedRefineChip, setSelectedRefineChip, regenerating, regenerate, onClose }) {
  return (
    <div className="mosaic-modal-backdrop" style={styles.modalBackdrop} onClick={onClose}>
      <div className="mosaic-modal-panel" style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <p style={styles.modalLabel}>What should change?</p>
          <button type="button" aria-label="Close" className="mosaic-focusable" style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={styles.refineChipRow}>
          {REFINE_CHIPS.map((chip) => {
            const selected = selectedRefineChip === chip;
            return (
              <button type="button" key={chip} className="mosaic-chip-btn mosaic-focusable" onClick={() => setSelectedRefineChip(chip)}
                style={{ ...styles.refineChip, ...(selected ? styles.refineChipSelected : {}) }}>
                {chip}
              </button>
            );
          })}
        </div>
        <button type="button" className="mosaic-focusable"
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
    <div className="mosaic-modal-backdrop" style={styles.modalBackdrop} onClick={onClose}>
      <div className="mosaic-modal-panel" style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <p style={styles.modalTitleShare}>Moodboard ready to share</p>
          <button type="button" aria-label="Close" className="mosaic-focusable" style={styles.modalClose} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={styles.shareUrlRow}>
          <span style={styles.shareUrl}>mosaic.design/m/{slug}</span>
          <button type="button" className="mosaic-focusable" style={styles.copyLinkBtn} onClick={copyLink}>
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
      :root { --dynamic-ease: cubic-bezier(0.2, 0.8, 0.2, 1); }
      body { margin: 0; }
      .mosaic-root { font-family: 'Inter', -apple-system, sans-serif; }
      .mosaic-focusable:focus-visible { outline: 2px solid #7C8D74; outline-offset: 2px; }

      .mosaic-nav-link, .mosaic-link { position: relative; text-decoration: none; }
      .mosaic-nav-link::after, .mosaic-link::after { content: ""; position: absolute; left: 0; bottom: -3px; width: 0%; height: 1px; background: currentColor; transition: width 0.2s ease; }
      .mosaic-nav-link:hover::after, .mosaic-link:hover::after { width: 100%; }

      textarea.mosaic-textarea:focus { outline: none; border-color: #97A98D; box-shadow: 0 0 0 3px rgba(124,141,116,0.16); }

      button, input, textarea, .mosaic-chip, .mosaic-chip-btn { transition-timing-function: var(--dynamic-ease); }
      .mosaic-chip, .mosaic-chip-btn { transition: background 0.15s, border-color 0.15s, color 0.15s; }
      .mosaic-primary-btn { transition: transform 0.15s, box-shadow 0.15s; transition-timing-function: var(--dynamic-ease); }
      .mosaic-primary-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(58,56,53,0.18); }

      .mosaic-swatch { transition: transform 0.18s ease, box-shadow 0.18s ease; cursor: pointer; }
      .mosaic-swatch:hover { transform: translateY(-3px); box-shadow: 0 14px 28px -16px rgba(37,42,40,0.35); }
      .mosaic-image-source { position: absolute; right: 10px; bottom: 10px; padding: 4px 7px; border-radius: 999px; background: rgba(20,22,20,0.72); color: #fff; font-size: 10px; opacity: 0; transform: translateY(4px); transition: opacity 0.2s, transform 0.2s; pointer-events: none; }
      .mosaic-image-skeleton { position: absolute; inset: 0; background: linear-gradient(110deg, #e8e3d8 8%, #f7f3eb 18%, #e8e3d8 33%); background-size: 200% 100%; animation: mosaicSkeleton 1.2s linear infinite; }
      .mosaic-image-skeleton-hidden { opacity: 0; pointer-events: none; }
      @keyframes mosaicSkeleton { to { background-position-x: -200%; } }
      .mosaic-tile-hero, .mosaic-tile-a, .mosaic-tile-b, .mosaic-tile-c, .mosaic-tile-support { position: relative; }
      .mosaic-tile-hero:hover .mosaic-image-source, .mosaic-tile-a:hover .mosaic-image-source, .mosaic-tile-b:hover .mosaic-image-source, .mosaic-tile-c:hover .mosaic-image-source, .mosaic-tile-support:hover .mosaic-image-source { opacity: 1; transform: translateY(0); }
      .mosaic-card-hover { transition: transform 0.18s, box-shadow 0.18s; transition-timing-function: var(--dynamic-ease); }
      .mosaic-card-hover:hover { transform: translateY(-2px); box-shadow: 0 16px 32px -20px rgba(37,42,40,0.3); }
      .mosaic-fab-btn { transition: transform 0.15s ease, background 0.15s ease; }
      .mosaic-fab-btn:hover { transform: translateY(-1px); }

      .mosaic-fade-in, .mosaic-chip-in { animation: mosaicChipIn 0.35s ease both; }
      @keyframes mosaicChipIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .mosaic-fade { animation: mosaicFade 0.35s ease both; }
      @keyframes mosaicFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .mosaic-dot { animation: mosaicPulse 1.1s ease-in-out infinite; }
      .mosaic-dot:nth-child(2) { animation-delay: 0.15s; }
      .mosaic-dot:nth-child(3) { animation-delay: 0.3s; }
      @keyframes mosaicPulse { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
      .mosaic-toast { animation: mosaicToastIn 0.3s ease both; }
      @keyframes mosaicToastIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
      .mosaic-modal-backdrop { animation: mosaicBackdropIn 0.2s ease both; }
      @keyframes mosaicBackdropIn { from { opacity: 0; } to { opacity: 1; } }
      .mosaic-modal-panel { animation: mosaicPanelIn 0.28s ease both; }
      @keyframes mosaicPanelIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

      @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }

      .mosaic-imagery-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; grid-template-rows: 210px 210px; gap: 14px; }
      .mosaic-tile-hero { grid-column: 1; grid-row: 1 / 3; }
      .mosaic-tile-a { grid-column: 2; grid-row: 1; }
      .mosaic-tile-b { grid-column: 3; grid-row: 1; }
      .mosaic-tile-c { grid-column: 2 / 4; grid-row: 2; }
      .mosaic-support-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; height: 220px; }

      .mosaic-palette-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .mosaic-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
      .mosaic-principles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
      .mosaic-ui-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .ui-language-labels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
      .ui-language-labels div { display: flex; flex-direction: column; gap: 5px; }
      .ui-language-labels b { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #7C8D74; }
      .ui-language-labels span { font-size: 12px; color: #5B5852; }
      .ui-language-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: start; }
      .ui-language-grid label { font-size: 11px; color: #5B5852; }
      .ui-language-specimens strong, .ui-language-specimens small { display: block; }
      .ui-language-specimens > div { transition: transform 0.28s, box-shadow 0.28s, border-color 0.28s; transition-timing-function: var(--dynamic-ease); }
      .ui-language-specimens > div:hover { transform: translateY(-6px); box-shadow: 0 16px 30px -18px rgba(37,42,40,0.42); border-color: rgba(37,42,40,0.42) !important; }
      .ui-language-specimens button, .ui-language-specimens input { pointer-events: none; }
      .ui-language-specimens .previewPrimary, .ui-language-specimens .previewSecondary { cursor: default; }
      .ui-language-grid .previewContent { grid-column: 1 / -1; }
      .previewProgress span { display: block; width: 62%; height: 100%; border-radius: inherit; }


      @media (max-width: 860px) {
        .mosaic-nav-links a { display: none; }
        .mosaic-heading, .mosaic-title { font-size: 34px !important; }
        .mosaic-imagery-grid { grid-template-columns: 1fr; grid-template-rows: none; }
        .mosaic-tile-hero, .mosaic-tile-a, .mosaic-tile-b, .mosaic-tile-c { grid-column: auto; grid-row: auto; height: 220px; }
        .mosaic-support-row { grid-template-columns: 1fr; height: auto; }
        .mosaic-support-row > div { height: 200px; }
        .mosaic-palette-grid { grid-template-columns: repeat(2, 1fr); }
        .mosaic-type-grid { grid-template-columns: 1fr; }
        .mosaic-principles-grid { grid-template-columns: 1fr; }
        .mosaic-ui-grid { grid-template-columns: 1fr; }
        .ui-language-grid { grid-template-columns: 1fr; }
        .previewPageHeader { align-items: flex-start; flex-direction: column; }
        .dashboard { min-height: 0 !important; }
        .dashboardSidebar { width: 130px !important; padding: 14px !important; }
        .dashboardBody { padding: 20px !important; }
        .dashboardHeader { flex-direction: column; gap: 16px; }
        .dashboardMetrics { flex-wrap: wrap; }
        .mosaic-fab { position: static !important; margin: 40px auto 0 !important; justify-content: center !important; flex-wrap: wrap; }
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
  navLinkButton: { fontFamily: "Inter, sans-serif", fontSize: 14.5, color: COLORS.charcoalSoft, fontWeight: 500, background: "none", border: "none", padding: 0, cursor: "pointer" },
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
  addSourcesBtn: { display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 500, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "10px 17px", fontSize: 14.5, cursor: "pointer" },
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
  keywordAddBtn: { fontWeight: 600, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 10, padding: "12px 19px", fontSize: 14.5, cursor: "pointer" },
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
  previewPageHeader: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 30 },
  previewPageTitle: { fontSize: 44, fontWeight: 400, margin: "4px 0 0", color: COLORS.charcoal },
  segmentedControl: { display: "flex", padding: 4, gap: 3, borderRadius: 12, background: "#EAE5DA" },
  segmentButton: { border: "none", background: "transparent", color: COLORS.charcoalSoft, borderRadius: 9, padding: "9px 15px", fontSize: 13.5, cursor: "pointer" },
  segmentActive: { border: "none", background: COLORS.cardBg, color: COLORS.charcoal, borderRadius: 9, padding: "9px 15px", fontSize: 13.5, fontWeight: 600, boxShadow: "0 2px 7px rgba(37,42,40,.1)" },
  dashboard: { display: "flex", minHeight: 510, borderRadius: 20, overflow: "hidden", border: `1px solid ${COLORS.hairline}` },
  dashboardSidebar: { width: 190, padding: 24, display: "flex", flexDirection: "column", gap: 8, borderRight: `1px solid ${COLORS.hairline}` },
  dashboardNavItem: { padding: "10px 12px", borderRadius: 9, fontSize: 13 },
  dashboardBody: { flex: 1, padding: 34 }, dashboardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  dashboardKicker: { fontSize: 11, textTransform: "uppercase", letterSpacing: ".1em", color: COLORS.sage }, dashboardTitle: { margin: "7px 0 0", fontSize: 30, fontWeight: 400 },
  dashboardMetrics: { display: "flex", gap: 14, margin: "30px 0" }, dashboardMetric: { minWidth: 150, padding: 18, borderRadius: 13, display: "flex", flexDirection: "column", gap: 8 },
   dashboardList: { background: "rgba(255,255,255,.44)", padding: 20, borderRadius: 14 }, dashboardRow: { display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderTop: `1px solid ${COLORS.hairline}` }, dashboardRowDot: { width: 8, height: 8, borderRadius: "50%" },
  mobileStage: { display: "flex", justifyContent: "center", padding: "10px 0 40px" }, phonePreview: { width: 340, minHeight: 610, border: "8px solid", borderRadius: 34, padding: "34px 22px 22px", boxShadow: "0 24px 60px -28px rgba(37,42,40,.45)", display: "flex", flexDirection: "column" }, phoneNotch: { width: 70, height: 5, borderRadius: 5, margin: "-20px auto 28px" }, mobileTitle: { fontSize: 28, fontWeight: 400, margin: "8px 0 22px" }, mobileMetric: { padding: 18, borderRadius: 14, display: "flex", flexDirection: "column", gap: 8 }, mobileList: { flex: 1, margin: "18px 0" }, mobileRow: { display: "flex", flexDirection: "column", gap: 4, padding: "14px 0", borderBottom: `1px solid ${COLORS.hairline}`, fontSize: 13 },
  rationale: { fontSize: 17, lineHeight: 1.6, color: COLORS.charcoalSoft, margin: 0 },
  section: { marginBottom: 64 },
  sectionHeadRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }, sectionActions: { display: "flex", alignItems: "center", gap: 8 },
  sectionHeading: { fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 26, margin: 0, color: COLORS.charcoal },
  reshuffleBtn: { display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 500, color: COLORS.charcoal, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 999, padding: "10px 17px", fontSize: 14.5, cursor: "pointer" },
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
  typeSpecimenSerif: { fontSize: 36, lineHeight: 1.25, color: COLORS.charcoal, margin: "0 0 16px" },
  typeSpecimenSans: { fontSize: 18, fontWeight: 500, lineHeight: 1.5, color: COLORS.charcoal, margin: "0 0 16px" },
  typeDescriptor: { fontSize: 13, color: COLORS.charcoalSoft, opacity: 0.8, margin: 0 },
  principleNumber: { display: "block", fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.12em", color: COLORS.sage, marginBottom: 14 },
  principleCard: { background: COLORS.cardBg, border: `1px solid ${COLORS.hairline}`, borderRadius: 16, padding: "30px 26px" },
  principleTitle: { fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: COLORS.charcoal },
  principleCopy: { fontSize: 14.5, lineHeight: 1.55, color: COLORS.charcoalSoft, margin: 0 },
  specimenCard: { border: "1px solid", borderRadius: 14, padding: "16px 14px", minHeight: 125 },
  specimenLabel: { display: "block", fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: COLORS.charcoalSoft, opacity: .72, marginBottom: 14 },
  specimenRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }, specimenFieldLabel: { fontSize: 11, color: COLORS.charcoalSoft },
  previewGhost: { border: "none", background: "transparent", padding: 0, fontSize: 12, cursor: "default" },
  controlsRow: { display: "flex", alignItems: "center", gap: 15, marginTop: 22 }, toggle: { width: 30, height: 17, borderRadius: 99, padding: 2, display: "flex", justifyContent: "flex-end" }, toggleKnob: { width: 13, height: 13, borderRadius: "50%", background: "#fff" }, checkbox: { width: 15, height: 15, borderRadius: 3, fontSize: 10, display: "grid", placeItems: "center" }, radio: { width: 15, height: 15, borderRadius: "50%", border: "2px solid", display: "grid", placeItems: "center" },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: 6 }, tag: { display: "inline-block", border: "1px solid", borderRadius: 99, padding: "4px 8px", fontSize: 10 },
  progressMeta: { display: "flex", justifyContent: "space-between", fontSize: 10, color: COLORS.charcoalSoft, marginBottom: 7 }, sliderTrack: { height: 5, borderRadius: 99, position: "relative", marginTop: 15 }, sliderFill: { display: "block", height: "100%", borderRadius: 99 }, sliderThumb: { position: "absolute", width: 13, height: 13, border: "1px solid", borderRadius: "50%", top: -4, left: "44%" },
  listSpecimen: { display: "flex", alignItems: "center", gap: 10, marginTop: 18 }, avatar: { width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11 }, metricSpecimen: { display: "flex", flexDirection: "column", gap: 3, padding: 10, fontSize: 10 }, notificationSpecimen: { display: "flex", alignItems: "flex-start", gap: 8, padding: 10, fontSize: 10 }, notificationDot: { width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", flexShrink: 0 }, contentSpecimen: { padding: 14, display: "flex", flexDirection: "column", gap: 7, fontSize: 12 },
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
  lockBtn: { border: `1px solid ${COLORS.hairline}`, background: "rgba(255,255,255,0.45)", borderRadius: 7, padding: "4px 6px", cursor: "pointer", fontSize: 12 },
  typeCardHead: { display: "flex", alignItems: "center", justifyContent: "space-between" }, typeSpecimenButton: { display: "flex", flexDirection: "column", width: "100%", textAlign: "left", padding: 0, border: "none", background: "transparent", cursor: "pointer" },
  swatchActions: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 14 },
  recolourBtn: { border: "1px solid rgba(37,42,40,0.24)", background: "rgba(255,255,255,0.45)", borderRadius: 7, padding: "7px 10px", fontSize: 12.5, cursor: "pointer" },
  swatchCopyBtn: { display: "flex", border: "none", background: "transparent", padding: 4, cursor: "pointer", color: "inherit" },
  previewPrimary: { border: "none", borderRadius: 10, padding: "10px 13px", color: "#fff", fontWeight: 600, cursor: "default" },
  previewSecondary: { border: "1px solid", borderRadius: 10, padding: "9px 13px", color: COLORS.charcoal, fontWeight: 500, cursor: "default" },
  previewInput: { display: "block", width: "100%", marginTop: 6, border: "1px solid", borderRadius: 8, padding: "9px 10px", fontFamily: "inherit" },
  previewBadge: { display: "inline-block", borderRadius: 999, padding: "5px 9px", marginRight: 6, background: COLORS.sageSoft, fontSize: 11 },
  previewProgress: { gridColumn: "1 / -1", height: 8, borderRadius: 999, background: COLORS.sageSoft, overflow: "hidden" },
  previewMetric: { borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 4 },
  previewContent: { borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 7 },
  bottomSpacer: { height: 20 },
  fab: { position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, background: COLORS.cardBg, border: `1px solid ${COLORS.hairline}`, borderRadius: 999, padding: 8, boxShadow: "0 20px 44px -20px rgba(37,42,40,0.35)", zIndex: 20 },
  fabSecondary: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 500, color: COLORS.charcoal, background: "transparent", border: "none", borderRadius: 999, padding: "12px 19px", cursor: "pointer", whiteSpace: "nowrap" },
  fabPrimary: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 600, color: "#F6F3EC", background: COLORS.charcoal, border: "none", borderRadius: 999, padding: "12px 21px", cursor: "pointer", whiteSpace: "nowrap" },
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
  regenerateBtn: { width: "100%", marginTop: 22, background: COLORS.charcoal, color: "#F6F3EC", border: "none", borderRadius: 12, padding: "15px 0", fontSize: 15.5, fontWeight: 600, cursor: "pointer" },
  regenerateBtnDisabled: { background: "#DAD6CB", color: "#A9A499", cursor: "not-allowed" },
  shareUrlRow: { display: "flex", alignItems: "center", gap: 10, background: "#FBFAF6", border: `1px solid ${COLORS.hairline}`, borderRadius: 12, padding: "10px 10px 10px 16px" },
  shareUrl: { flex: 1, fontSize: 13.5, color: COLORS.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  copyLinkBtn: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: COLORS.charcoal, background: COLORS.sageSoft, border: "1px solid #DCE4D6", borderRadius: 9, padding: "8px 13px", cursor: "pointer", whiteSpace: "nowrap" },
};
