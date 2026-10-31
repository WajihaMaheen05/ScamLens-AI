import { useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Check,
  ChevronDown, CircleAlert, Clock3, FileImage, Fingerprint, ImagePlus,
  LockKeyhole, MessageSquareWarning, RefreshCw, ScanSearch, Shield,
  ShieldAlert, ShieldCheck, Sparkles, Upload, X
} from "lucide-react";
import type { Analysis } from "./types";
import ExtraPages from "./ExtraPages";

const demoAnalysis: Analysis = {
  riskLevel: "HIGH",
  headline: "This message has several strong warning signs.",
  summary: "The screenshot uses an unexpected prize claim and creates urgency to click a link. It also asks you to act before independently verifying who sent it. Treat this as suspicious unless the offer can be confirmed through an official channel.",
  signals: [
    { title: "Unexpected prize or reward", detail: "You are told you have won something you did not enter to win. Surprise-prize messages are a common way to start a phishing conversation.", severity: "HIGH" },
    { title: "Pressure to act quickly", detail: "Urgency can push people to click before checking the sender or destination.", severity: "HIGH" },
    { title: "Unverified link", detail: "The destination is not independently confirmed as an official website. Do not open it just to investigate.", severity: "MEDIUM" }
  ],
  safeActions: [
    "Do not click the link or reply to the sender.",
    "Do not share an OTP, password, UPI PIN, or payment details.",
    "Verify the offer by visiting the organisation's official website or app yourself.",
    "If you already shared payment details, contact your bank using its official number immediately."
  ],
  whatToVerify: [
    "Check whether the organisation has announced this offer on its official website.",
    "Look up the sender through a separate, trusted channel—not through the message."
  ],
  confidenceNote: "This is an AI assessment of visible screenshot content, not proof of fraud. Sender identity and link destination could not be independently verified."
};

type ResultProps = { analysis: Analysis; onReset: () => void };
function PixelMascot({ small = false }: { small?: boolean }) {
  return <div className={`mascot ${small ? "mascot-small" : ""}`} aria-label="Pixel-art ScamLens mascot">
    <div className="mascot-ear left" /><div className="mascot-ear right" />
    <div className="mascot-head">
      <div className="mascot-hair" />
      <div className="mascot-face">
        <i /><i />
        <b />
      </div>
      <div className="mascot-blush left" /><div className="mascot-blush right" />
    </div>
    <div className="mascot-body"><span>SL</span></div>
    <div className="mascot-shadow" />
  </div>;
}

function ResultView({ analysis, onReset }: ResultProps) {
  const risk = analysis.riskLevel || "UNCLEAR";
  const riskClass = risk.toLowerCase();
  const Icon = risk === "HIGH" ? ShieldAlert : risk === "LOW" ? ShieldCheck : Shield;
  return <section className="result-wrap">
    <div className="result-topline"><button className="text-button" onClick={onReset}><ArrowLeft size={15} /> New scan</button><span className="mono tiny">SCAN COMPLETE / 01</span></div>
    <div className={`risk-banner ${riskClass}`}>
      <div className="risk-icon"><Icon size={25} /></div>
      <div className="risk-copy"><span className="eyebrow">RISK INDICATOR</span><h2>{risk === "UNCLEAR" ? "Not enough signal" : `${risk} RISK`}</h2><p>{analysis.headline}</p></div>
      <div className="risk-stamp">AI<br/>CHECK</div>
    </div>
    <div className="result-grid">
      <div className="result-main">
        <article className="panel summary-panel">
          <div className="panel-heading"><span className="section-number">01</span><h3>What we noticed</h3><ScanSearch size={17} /></div>
          <p className="summary-text">{analysis.summary}</p>
        </article>
        <article className="panel">
          <div className="panel-heading"><span className="section-number">02</span><h3>Signals to look at</h3><MessageSquareWarning size={17} /></div>
          <div className="signals">
            {(analysis.signals || []).map((signal, i) => <div className="signal" key={i}>
              <div className={`signal-dot ${signal.severity.toLowerCase()}`} />
              <div><div className="signal-title-row"><strong>{signal.title}</strong><span className={`severity ${signal.severity.toLowerCase()}`}>{signal.severity}</span></div><p>{signal.detail}</p></div>
            </div>)}
            {(!analysis.signals || analysis.signals.length === 0) && <p className="muted">No specific warning signs were identified in the visible content.</p>}
          </div>
        </article>
      </div>
      <aside className="result-side">
        <article className="panel action-panel">
          <div className="panel-heading"><span className="section-number">03</span><h3>Your next moves</h3></div>
          <ol className="action-list">{(analysis.safeActions || []).map((item, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{item}</li>)}</ol>
        </article>
        <article className="panel verify-panel">
          <div className="panel-heading"><span className="section-number">04</span><h3>Verify independently</h3></div>
          <ul>{(analysis.whatToVerify || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
        </article>
        <div className="confidence-note"><LockKeyhole size={15}/><p>{analysis.confidenceNote}</p></div>
      </aside>
    </div>
    <div className="result-foot"><span><Check size={14}/> Analysis saved in this session only</span><button className="primary-button compact" onClick={onReset}>Scan another <ArrowRight size={15}/></button></div>
  </section>;
}

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [page, setPage] = useState("scan");

  function setSelected(next: File | undefined) {
    if (!next) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setError("Please choose a JPG, PNG, or WebP screenshot."); return;
    }
    if (next.size > 12 * 1024 * 1024) {
      setError("This image is over 12 MB. Please choose a smaller screenshot."); return;
    }
    setError(""); setAnalysis(null); setFile(next);
    setPreview(URL.createObjectURL(next));
  }
  function reset() {
    setFile(null); setPreview(""); setAnalysis(null); setContext(""); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }
  async function compressImage(source: File) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(source);
    });
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = dataUrl;
    });
    const scale = Math.min(1, 1500 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Could not prepare image")), "image/jpeg", 0.82));
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1]); reader.onerror = reject; reader.readAsDataURL(blob);
    });
  }
  async function runAnalysis() {
    if (!file) return;
    setLoading(true); setError("");
    try {
      const image = await compressImage(file);
      const response = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mimeType: "image/jpeg", context })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed. Please try again.");
      setAnalysis(data.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not connect to ScamLens. Check your connection and try again.");
    } finally { setLoading(false); }
  }
  function loadDemo() {
    setFile(null); setPreview(""); setError(""); setAnalysis(demoAnalysis);
  }

  return (
  <div className="app-shell">
    <div className="top-strip"><span><span className="live-dot"/> DIGITAL STREET-SMARTNESS, ACTIVATED</span><span className="mono">BUILD 01.26 <span className="strip-divider">/</span> GEMMA 4</span></div>
    <header className="site-header">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); reset(); }}>
        <span className="brand-mark"><Shield size={21}/><i/></span>
        <span>scamlens<span className="brand-ai">.ai</span><small>TRUST, BUT VERIFY.</small></span>
      </a>
      <nav className="main-nav"><button className={page === "scan" ? "nav-active" : ""} onClick={() => setPage("scan")}>Scanner</button><button className={page === "links" ? "nav-active" : ""} onClick={() => setPage("links")}>Link inspector</button><button className={page === "atlas" ? "nav-active" : ""} onClick={() => setPage("atlas")}>Scam atlas</button><button className={page === "lab" ? "nav-active" : ""} onClick={() => setPage("lab")}>Safety lab</button><button className={page === "help" ? "nav-active" : ""} onClick={() => setPage("help")}>Help desk</button></nav>
      <div className="header-status"><span className="status-square"/> GEMMA 4 <span className="status-separator">•</span> ONLINE</div>
    </header>

    <main>
      {page !== "scan" ? <ExtraPages page={page} onNavigate={setPage}/> : !analysis ? <>
        <section className="hero">
          <div className="hero-copy">
            <div className="kicker"><span className="kicker-icon"><Fingerprint size={14}/></span> YOUR DIGITAL SIDEKICK</div>
            <h1>Don't take<br/>the <span className="headline-accent">bait.</span></h1>
            <p className="hero-sub">That message feels a little off? Drop it here. We'll help you spot the red flags before they become a real-life problem.</p>
            <div className="hero-actions"><span><ShieldCheck size={15}/> Screenshot in. Clarity out.</span><span><LockKeyhole size={14}/> No account needed</span></div>
          </div>
          <div className="hero-art">
            <div className="art-sun"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
            <div className="art-card art-card-back"><span className="mono">UNKNOWN SENDER</span><div className="fake-lines"><i/><i/><i/></div><b>YOU WON!!!</b></div>
            <div className="art-card art-card-front"><div className="art-card-top"><span>INCOMING MESSAGE</span><span className="pixel-dot"/></div><div className="fake-avatar">?</div><div className="fake-message"><i/><i/><i/></div><div className="fake-link">CLAIM PRIZE ↗</div></div>
            <div className="mascot-stage"><PixelMascot/></div>
            <div className="art-sticker sticker-alert"><CircleAlert size={16}/><span>hmm... sus</span></div>
            <div className="art-sticker sticker-scan"><ScanSearch size={16}/><span>SCANNING</span></div>
            <span className="art-coordinate mono">35° 41' N / SAFE ZONE</span>
          </div>
        </section>

        <section className="workspace">
          <div className="workspace-head"><div><span className="eyebrow">THE MESSAGE CHECKPOINT</span><h2>Let's inspect the evidence.</h2></div><span className="step-tag"><span>01</span> / 02 &nbsp; UPLOAD</span></div>
          <div className={`dropzone ${dragging ? "dragging" : ""} ${preview ? "has-file" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setSelected(e.dataTransfer.files[0]); }}>
            {preview ? <div className="preview-layout">
              <img src={preview} alt="Screenshot selected for review"/>
              <div className="preview-info"><span className="file-chip"><FileImage size={14}/> READY TO SCAN</span><h3>{file?.name}</h3><p>{file ? `${(file.size / 1024).toFixed(0)} KB · ${file.type.split("/")[1].toUpperCase()}` : "Image selected"}</p><button className="text-button danger-text" onClick={reset}><X size={14}/> Remove image</button></div>
              <button className="change-image" onClick={() => inputRef.current?.click()}>Change <RefreshCw size={13}/></button>
            </div> : <div className="drop-inner">
              <div className="upload-graphic"><div className="upload-pixel"><ImagePlus size={25}/></div><span className="upload-spark">✳</span></div>
              <h3>Drop the suspicious screenshot here</h3><p>WhatsApp chats, emails, DMs, job offers, payment requests — we've got you.</p>
              <button className="outline-button" onClick={() => inputRef.current?.click()}><Upload size={15}/> Browse files</button>
              <span className="file-note">JPG, PNG OR WEBP <b>·</b> MAX 12 MB</span>
            </div>}
          </div>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e => setSelected(e.target.files?.[0])}/>
          <div className="context-toggle"><button onClick={() => setShowContext(!showContext)}>{showContext ? "−" : "+"} Add a little context <ChevronDown size={14} className={showContext ? "rotate" : ""}/></button><span>Optional · e.g. “This came from a number I don't know.”</span></div>
          {showContext && <textarea className="context-input" value={context} onChange={e => setContext(e.target.value)} maxLength={500} placeholder="Tell us what feels suspicious. Don't include passwords, OTPs, or private financial details."/>}
          {error && <div className="error-box"><CircleAlert size={16}/>{error}</div>}
          <div className="scan-row"><div className="privacy-note"><LockKeyhole size={15}/><span>Your image is sent securely for analysis and is not stored by this app.</span></div><button className="primary-button" disabled={!file || loading} onClick={runAnalysis}>{loading ? <><span className="button-loader"/> Reading the signals...</> : <>Analyze screenshot <ArrowRight size={16}/></>}</button></div>
          <div className="demo-row"><span>Just exploring?</span><button onClick={loadDemo}>View a sample scan <ArrowUpRight size={13}/></button></div>
        </section>
        <section className="how-section" id="how-it-works">
          <div className="section-intro"><span className="eyebrow">A LITTLE LESS GUESSWORK</span><h2>Pause. Scan. Stay sharp.</h2><p>Three simple steps between you and a more informed decision.</p></div>
          <div className="how-grid">
            <div className="how-card"><span className="how-index">01</span><div className="how-icon peach"><Upload size={20}/></div><h3>Bring the receipt</h3><p>Upload a screenshot of the message, email, offer, or payment request that made you pause.</p><span className="pixel-arrow">↘</span></div>
            <div className="how-card"><span className="how-index">02</span><div className="how-icon lilac"><ScanSearch size={20}/></div><h3>Let Gemma inspect</h3><p>Gemma 4 reads the visible content and looks for pressure tactics, suspicious links, and other warning signs.</p><span className="pixel-arrow">↘</span></div>
            <div className="how-card"><span className="how-index">03</span><div className="how-icon mint"><ShieldCheck size={20}/></div><h3>Choose your next move</h3><p>Get a risk indicator, a plain-language explanation, and practical steps to verify independently.</p><span className="pixel-arrow">✳</span></div>
          </div>
        </section>
      </> : <ResultView analysis={analysis} onReset={reset}/>}
    </main>

    {page === "scan" && <section className="safety-bar" id="safety"><div className="safety-icon"><Shield size={18}/></div><div><strong>A smart second opinion, not a verdict.</strong><p>AI can miss context or make mistakes. Never share OTPs, passwords, UPI PINs, or sensitive financial details. Verify through official channels.</p></div><span className="safety-tag">STAY SHARP <Sparkles size={13}/></span></section>}
    <footer><a className="footer-brand" href="#" onClick={e=>{e.preventDefault();setPage("scan");reset();}}><span className="footer-pixel">▦</span> scamlens.ai</a><span>MADE FOR A SAFER SIDE OF THE INTERNET <b>✳</b></span><span className="mono">POWERED BY GEMMA 4</span></footer>
  </div>
  );
}