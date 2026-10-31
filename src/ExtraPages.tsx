import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeAlert, BookOpen, CheckCircle2, ExternalLink, Fingerprint, Globe, GraduationCap, Link2, LockKeyhole, MessageSquareWarning, Search, ShieldAlert, ShieldCheck, Siren, Sparkles, Target, XCircle } from "lucide-react";

type Props = { page: string; onNavigate: (page: string) => void };
const patterns = [
  { name: "Urgency trap", tag: "PRESSURE TACTIC", level: "HIGH", example: "Your account will be blocked in 10 minutes. Verify now.", why: "Artificial deadlines make people act before checking the sender.", move: "Open the service's official app or type its known website yourself." },
  { name: "OTP / PIN harvesting", tag: "CREDENTIAL THEFT", level: "CRITICAL", example: "Share the OTP you just received so we can reverse the payment.", why: "Legitimate support staff should not ask you to disclose your OTP, UPI PIN, or password.", move: "Never share authentication codes. Contact your bank using its official channel." },
  { name: "Too-good-to-be-true offer", tag: "BAIT OFFER", level: "HIGH", example: "You have been selected for a free phone. Pay a small delivery fee.", why: "A surprise reward paired with a fee or personal-data request is a warning sign.", move: "Check the promotion on the brand's independently found official website." },
  { name: "Job task / deposit scam", tag: "JOB & RECRUITMENT", level: "HIGH", example: "Earn daily from home. Deposit money to unlock premium tasks.", why: "Requests to pay money to access work or withdraw earnings deserve serious scrutiny.", move: "Verify the employer, role, and recruiter independently. Do not pay to unlock wages." },
  { name: "Impersonation", tag: "TRUST EXPLOIT", level: "HIGH", example: "I'm your manager. Buy gift cards and send me the codes urgently.", why: "Scammers borrow authority or familiar identities and move the conversation to an unusual channel.", move: "Call the person using a number you already trust, not the one in the message." },
  { name: "QR / collect request confusion", tag: "PAYMENT TRICK", level: "HIGH", example: "Scan this QR to receive your refund.", why: "In many UPI flows, approving a collect request or entering a PIN authorizes money to leave your account.", move: "Read the payment screen carefully. A UPI PIN is for authorising payments, not receiving money." }
];

function LinkInspector() {
  const [url, setUrl] = useState("");
  const [checked, setChecked] = useState(false);
  const result = useMemo(() => {
    if (!checked || !url.trim()) return null;
    let parsed: URL | null = null;
    try { parsed = new URL(/^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`); } catch { return { invalid: true, host: "", flags: ["This does not look like a valid web address."], note: "Check the spelling. Do not open a link just to test it." }; }
    const host = parsed.hostname.toLowerCase(); const flags: string[] = [];
    if (parsed.protocol !== "https:") flags.push("The address does not use HTTPS.");
    if (parsed.username || parsed.password) flags.push("The address contains embedded login information.");
    if (/\d{1,3}(\.\d{1,3}){3}/.test(host)) flags.push("The host is an IP address rather than a familiar domain name.");
    if (host.split(".").length >= 5) flags.push("The domain has an unusually deep subdomain structure.");
    if (host.includes("xn--")) flags.push("The domain uses encoded characters; check carefully for look-alike spelling.");
    if (/(login|verify|secure|wallet|claim|prize|gift|support|update)/i.test(parsed.pathname + parsed.search)) flags.push("The path or query uses words often seen in account or reward lures. This alone does not prove anything.");
    if (!flags.length) flags.push("No basic structural warning was detected by these checks.");
    return { invalid: false, host, flags, note: "This is a format-only inspection. ScamLens has not visited the link, checked its reputation, or confirmed who controls the domain. A clean result does not mean a link is safe." };
  }, [url, checked]);
  return <div className="extra-page"><div className="page-kicker"><Link2 size={15}/> TOOL 01 / LINK INSPECTOR</div><h1>Look before<br/><em>you click.</em></h1><p className="page-lead">Inspect the shape of a suspicious URL without opening it. This tool checks basic patterns only—it does not certify a site as safe.</p><div className="tool-panel"><label htmlFor="url-entry">SUSPICIOUS WEB ADDRESS</label><div className="url-input-row"><Globe size={18}/><input id="url-entry" value={url} onChange={e => {setUrl(e.target.value);setChecked(false);}} placeholder="example.com/verify-account"/><button onClick={() => setChecked(true)} disabled={!url.trim()}>Inspect URL <ArrowRight size={15}/></button></div><p className="micro-note"><LockKeyhole size={13}/> The address is inspected locally in your browser; it is not opened.</p></div>{result && <div className="inspection-result"><div className="panel-heading"><span className="section-number">RESULT</span><h3>{result.invalid ? "Address needs checking" : result.host}</h3>{result.invalid ? <XCircle/> : <ShieldAlert/>}</div><ul>{result.flags.map((f,i)=><li key={i}>{f}</li>)}</ul><p>{result.note}</p></div>}<div className="caution-card"><ShieldCheck/><div><b>Remember</b><p>HTTPS only encrypts the connection. It does not prove that a website is honest or belongs to the organisation it claims to represent.</p></div></div></div>;
}

function ScamAtlas() {
  const [active, setActive] = useState(0);
  const item = patterns[active];
  return <div className="extra-page"><div className="page-kicker"><BookOpen size={15}/> FIELD GUIDE / SCAM ATLAS</div><h1>Know the<br/><em>playbook.</em></h1><p className="page-lead">A field guide to common manipulation patterns. Learn the tactic, recognise the clue, and choose a safer next step.</p><div className="atlas-layout"><div className="atlas-list">{patterns.map((p,i)=><button key={p.name} className={active===i?"atlas-item active":"atlas-item"} onClick={()=>setActive(i)}><span className="mono">0{i+1}</span><span>{p.name}</span><ArrowRight size={14}/></button>)}</div><article className="atlas-detail"><div className="atlas-tag">{item.tag} <span>{item.level} SIGNAL</span></div><h2>{item.name}</h2><blockquote>“{item.example}”</blockquote><h3>WHY IT WORKS</h3><p>{item.why}</p><h3>YOUR COUNTERMOVE</h3><p>{item.move}</p><div className="atlas-foot"><Fingerprint size={16}/> PATTERN FILE 0{active+1} / 06</div></article></div></div>;
}

const quizBank = [
  {
    q: "A caller claims to be from your bank and asks for your OTP to stop a fraudulent transaction. What should you do?",
    a: ["Share it quickly", "Hang up and call your bank using its official number", "Ask them to send a verification link"],
    correct: 1,
    why: "Never disclose an OTP, PIN or password. End the call and contact your bank through a trusted channel."
  },
  {
    q: "A recruiter offers you a remote job but asks for a refundable registration fee. What is safest?",
    a: ["Pay because the fee is refundable", "Send your ID documents first", "Verify the employer and role independently before sharing anything"],
    correct: 2,
    why: "Upfront fees for employment are a serious warning sign. Verify the company through independently found contact details."
  },
  {
    q: "Someone sends you a QR code and says scanning it will credit a refund to your UPI account. What do you do?",
    a: ["Scan it and enter your UPI PIN", "Do not approve unexpected payment requests; verify with the merchant", "Forward it to friends"],
    correct: 1,
    why: "A UPI PIN authorises a payment. You do not need to enter it to receive money."
  },
  {
    q: "You receive a message saying your electricity will be disconnected in 15 minutes unless you click a link. What should you do?",
    a: ["Click immediately", "Reply with your consumer number", "Check with the electricity provider using its official website or app"],
    correct: 2,
    why: "Urgent threats are commonly used to stop people thinking carefully. Verify the claim through an independent official channel."
  },
  {
    q: "A friend messages you from a new number asking for emergency money. What is the safest response?",
    a: ["Transfer the money immediately", "Call your friend on their saved number to confirm", "Ask them to send their bank details"],
    correct: 1,
    why: "Scammers can impersonate people you know. Confirm unusual requests through a separate, trusted communication channel."
  },
  {
    q: "You receive an email saying you won a prize, but must pay a processing fee to claim it. What should you do?",
    a: ["Pay the small fee", "Share your card details", "Treat it as suspicious and verify the promotion independently"],
    correct: 2,
    why: "Unexpected prizes combined with advance fees are a common bait tactic. Do not pay or share financial details."
  },
  {
    q: "A website address looks like your bank's name but has an extra letter. What should you do?",
    a: ["Log in because it looks familiar", "Avoid it and type the bank's known official address yourself", "Try your password to see if it works"],
    correct: 1,
    why: "Look-alike domains can imitate trusted organisations. Navigate using a known official address rather than a message link."
  },
  {
    q: "A person claiming to be customer support asks you to install a remote-access app. What should you do?",
    a: ["Install it so they can help", "Share your screen and banking app", "Decline and contact the company through its official support channel"],
    correct: 2,
    why: "Remote-access tools can expose sensitive information and allow unauthorised control. Never install them at an unsolicited caller's request."
  },
  {
    q: "You receive an unexpected attachment named 'Refund_Receipt.apk'. What is the safest action?",
    a: ["Install it to view the receipt", "Do not install it; verify the refund through the official app", "Forward it to your contacts"],
    correct: 1,
    why: "APK files can install applications outside normal app-store safeguards. An unexpected refund attachment is not a reason to install software."
  },
  {
    q: "A social media account promises to double your money if you transfer funds today. What should you do?",
    a: ["Invest a small amount first", "Ask for a guaranteed return in writing", "Avoid sending money and independently verify the organisation and offer"],
    correct: 2,
    why: "Guaranteed or unusually high returns paired with urgency are major warning signs. Do not transfer money based on social media promises."
  },
  {
    q: "You accidentally shared an OTP with someone who called you. What should you do first?",
    a: ["Wait to see whether money disappears", "Immediately contact your bank through its official channel and secure affected accounts", "Delete the call history"],
    correct: 1,
    why: "Act quickly. Contact the bank, secure your account, change compromised credentials where relevant, and monitor transactions."
  },
  {
    q: "A QR code is displayed at a shop counter, but someone has pasted another QR sticker over it. What should you do?",
    a: ["Pay without checking", "Scan both codes", "Ask the merchant to verify the correct payment QR before paying"],
    correct: 2,
    why: "A substituted QR code may redirect payment to another account. Confirm the recipient name and payment details with the merchant."
  },
  {
    q: "An email from 'IT Support' asks you to send your password to prevent your account from being disabled. What should you do?",
    a: ["Send it because it is an internal team", "Never share your password; report and verify the request with IT independently", "Send only half the password"],
    correct: 1,
    why: "Legitimate IT teams should not need your password. Verify unexpected account warnings through a trusted internal channel."
  },
  {
    q: "A buyer sends you a payment screenshot but the money has not appeared in your account. What should you do?",
    a: ["Hand over the item because the screenshot is proof", "Check your own bank or UPI app for the actual credit", "Send the buyer a refund"],
    correct: 1,
    why: "Screenshots can be edited or refer to failed transactions. Confirm the actual credit in your own account before releasing goods."
  },
  {
    q: "You clicked a suspicious link and entered your password. What is the safest next step?",
    a: ["Ignore it if the page looked normal", "Change the password using the official website or app and secure any reused accounts", "Send the link to others to check"],
    correct: 1,
    why: "Change the exposed password through the genuine service, enable multi-factor authentication where available, and change it anywhere else it was reused."
  }
];

function shuffleQuestions<T,>(items: T[]): T[] {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function SafetyLab() {
  const [initialDeck] = useState(() => shuffleQuestions(quizBank));
  const [questions, setQuestions] = useState(initialDeck.slice(0, 5));
  const [deck, setDeck] = useState(initialDeck.slice(5));
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(5).fill(undefined));
  const [submitted, setSubmitted] = useState(false);
  const [round, setRound] = useState(1);

  const score = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.correct ? 1 : 0),
    0
  );

  function startNextRound() {
    let nextDeck = deck;

    // When the remaining questions run low, reshuffle the full bank.
    if (nextDeck.length < 5) {
      nextDeck = shuffleQuestions(quizBank);
    }

    setQuestions(nextDeck.slice(0, 5));
    setDeck(nextDeck.slice(5));
    setAnswers(Array(5).fill(undefined));
    setSubmitted(false);
    setRound(current => current + 1);
  }

  return (
    <div className="extra-page">
      <div className="page-kicker">
        <GraduationCap size={15} /> TRAINING MODE / SAFETY LAB
      </div>

      <h1>
        Train your<br />
        <em>scam sense.</em>
      </h1>

      <p className="page-lead">
        Five new situations every round. Choose your response, learn from your
        mistakes, and build better digital safety instincts.
      </p>

      <div className="quiz-status">
        <span>ROUND {String(round).padStart(2, "0")}</span>
        <span>QUESTION BANK / {quizBank.length} SCENARIOS</span>
      </div>

      <div className="quiz-panel">
        {questions.map((q, i) => (
          <section className="quiz-question" key={`${round}-${i}`}>
            <div className="quiz-count">
              SCENARIO 0{i + 1} / 05
            </div>

            <h3>{q.q}</h3>

            <div className="quiz-options">
              {q.a.map((option, j) => {
                const isSelected = answers[i] === j;
                const isCorrect = q.correct === j;
                const isWrongSelection = submitted && isSelected && !isCorrect;

                let optionClass = "";

                if (isSelected && !submitted) optionClass = "selected";
                if (submitted && isCorrect) optionClass = "correct";
                if (isWrongSelection) optionClass = "incorrect";

                return (
                  <button
                    type="button"
                    key={j}
                    disabled={submitted}
                    className={optionClass}
                    onClick={() => {
                      setAnswers(old => {
                        const next = [...old];
                        next[i] = j;
                        return next;
                      });
                    }}
                  >
                    <span>{String.fromCharCode(65 + j)}</span>
                    {option}
                    {isSelected && !submitted && (
                      <strong className="answer-picked">SELECTED</strong>
                    )}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="quiz-feedback">
                {answers[i] === q.correct ? (
                  <strong className="feedback-correct">✓ CORRECT ANSWER</strong>
                ) : (
                  <strong className="feedback-wrong">✕ NOT QUITE</strong>
                )}

                {answers[i] !== q.correct && (
                  <p>
                    <b>Your answer:</b>{" "}
                    {answers[i] === undefined ? "Not answered" : q.a[answers[i]]}
                  </p>
                )}

                <p>
                  <b>Correct answer:</b> {q.a[q.correct]}
                </p>

                <p>
                  <b>Why:</b> {q.why}
                </p>
              </div>
            )}
          </section>
        ))}

        <div className="quiz-bottom">
          {submitted ? (
            <>
              <strong>YOUR SCORE: {score} / 5</strong>
              <button type="button" onClick={startNextRound}>
                Next question set <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <>
              <span>
                {answers.filter(a => a !== undefined).length} OF 5 ANSWERED
              </span>

              <button
                type="button"
                disabled={answers.some(a => a === undefined)}
                onClick={() => setSubmitted(true)}
              >
                Submit answers <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmergencyDesk() {
 return <div className="extra-page"><div className="page-kicker"><Siren size={15}/> RESPONSE CENTER / INDIA</div><h1>If it went<br/><em>wrong.</em></h1><p className="page-lead">If you have already clicked, shared information, or sent money, act quickly. Keep evidence and use official reporting channels.</p><div className="emergency-grid"><article className="emergency-card urgent"><span>01 / MONEY SENT</span><h2>Contact your bank now.</h2><p>Call your bank using the number on its official website or card. Ask them to report and attempt to stop the transaction. Do not use a number sent by the suspicious contact.</p></article><article className="emergency-card"><span>02 / INDIA CYBER FRAUD</span><h2>Call 1930.</h2><p>For financial cyber fraud in India, report promptly through the national helpline and complete the complaint process on the official portal.</p><a href="https://cybercrime.gov.in/" target="_blank" rel="noreferrer">National Cyber Crime Reporting Portal <ExternalLink size={13}/></a></article><article className="emergency-card"><span>03 / SAVE EVIDENCE</span><h2>Keep the trail.</h2><p>Save screenshots, phone numbers, UPI IDs, transaction IDs, timestamps, emails, and URLs. Do not delete the conversation before preserving relevant evidence.</p></article><article className="emergency-card"><span>04 / SECURE ACCOUNTS</span><h2>Lock down access.</h2><p>Change compromised passwords from a trusted device, enable multi-factor authentication, sign out unknown sessions, and contact the affected service provider.</p></article></div><div className="caution-card"><ShieldAlert/><div><b>Do not wait for an AI result in an emergency.</b><p>ScamLens is an educational support tool, not an emergency service, bank, police authority, or legal adviser. Use official channels directly.</p></div></div></div>;
}

export default function ExtraPages({page,onNavigate}:Props) {
 return <div className="extra-wrap"><div className="extra-top"><button className="text-button" onClick={()=>onNavigate("scan")}><ArrowLeft size={14}/> Back to scanner</button><span className="mono tiny">SCAMLENS / FIELD TOOLS</span></div>{page==="links"?<LinkInspector/>:page==="atlas"?<ScamAtlas/>:page==="lab"?<SafetyLab/>:<EmergencyDesk/>}</div>;
}
