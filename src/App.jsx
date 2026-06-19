import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FAQS, CATEGORIES, TIERS, PROFILES } from './faqData.js';

// Web Speech API — runs locally in the browser. No external request.
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const STOPWORDS = new Set(
  ('the a an of to is are do you i my what how much will it in on for and or your '
    + 'me this that with at be can if there they we so just about would could does '
    + 'have has was were like want need them then our us not no yes ok okay').split(' ')
);

function normalise(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Pre-build a lightweight match index from each FAQ.
const INDEX = FAQS.map((faq) => {
  const phrases = [...faq.keywords, faq.category].map(normalise).filter(Boolean);
  const qwords = normalise(faq.question)
    .split(' ')
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return { faq, phrases, qwords };
});

// Voice commands the presenter can speak to drive the app hands-free.
const COMMANDS = {
  next: ['next', 'next one', 'next answer'],
  back: ['back', 'previous', 'go back'],
  clear: ['clear', 'reset', 'start over', 'clear that'],
  browse: ['browse', 'browse all', 'show all', 'list'],
  listen: ['listen', 'go back to listening'],
};

function detectCommand(text) {
  const t = ` ${text} `;
  for (const [cmd, phrases] of Object.entries(COMMANDS)) {
    for (const p of phrases) {
      if (t.endsWith(` ${p} `)) return cmd;
    }
  }
  return null;
}

// Score every FAQ against a window of recent speech. Returns ranked matches.
// When a lead profile is active, cards relevant to that profile get a small
// boost so the answers that matter for this lead type surface first.
function rankMatches(text, profile) {
  const t = normalise(text);
  if (!t) return [];
  const words = new Set(t.split(' '));
  const results = [];
  for (const item of INDEX) {
    let score = 0;
    for (const phrase of item.phrases) {
      if (phrase.includes(' ')) {
        // multi-word phrase match — strong signal
        if (t.includes(phrase)) score += 3 + phrase.split(' ').length;
      } else if (words.has(phrase)) {
        score += 1.5;
      }
    }
    for (const w of item.qwords) if (words.has(w)) score += 0.5;
    if (score > 0) {
      if (item.faq.tier === 1) score += 0.3; // gentle tie-break toward core
      if (profile && item.faq.profiles?.includes(profile)) score += 0.4;
      results.push({ faq: item.faq, score });
    }
  }
  return results.sort((a, b) => b.score - a.score);
}

// Keep only the last N words so matching tracks the current utterance,
// not everything said since the mic was turned on.
function recentWindow(text, words = 16) {
  const parts = text.trim().split(/\s+/);
  return parts.slice(-words).join(' ');
}

function TierBadge({ tier }) {
  const t = TIERS[tier];
  return (
    <span className="tier-badge" style={{ background: t.color }}>
      {t.short}
    </span>
  );
}

function SlideCommand({ command }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    try {
      navigator.clipboard?.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* non-critical */
    }
  }
  return (
    <button type="button" className="say-command" onClick={copy} title="Copy command">
      <span className="say-label">say this</span>
      <span className="say-text">“{command}”</span>
      <span className="say-arrow">{copied ? '✓ copied' : '→'}</span>
    </button>
  );
}

function AnswerPanel({ faq, expanded, onToggle }) {
  if (!faq) return null;
  return (
    <article className="answer-panel" key={faq.id}>
      <div className="answer-head">
        <TierBadge tier={faq.tier} />
        <span className="category-tag">{faq.category}</span>
        <span className="qid">Q{faq.id}</span>
      </div>
      <h2 className="answer-question">{faq.question}</h2>
      <p className="answer-headline">{faq.headline}</p>
      {faq.profiles && faq.profiles.length < PROFILES.length && (
        <div className="profile-tags">
          {faq.profiles.map((p) => (
            <span key={p} className="profile-tag">{p}</span>
          ))}
        </div>
      )}
      <button type="button" className="detail-toggle" onClick={onToggle}>
        {expanded ? '▾ Hide full answer' : '▸ Full answer'}
      </button>
      {expanded && <p className="answer-full">{faq.answer}</p>}
      {faq.slide ? (
        <SlideCommand command={faq.slide} />
      ) : (
        <p className="verbal-only">Verbal answer — no slide</p>
      )}
    </article>
  );
}

export default function App() {
  const [listening, setListening] = useState(false);
  const [supported] = useState(!!SpeechRecognition);
  const [heard, setHeard] = useState('');
  const [ranked, setRanked] = useState([]); // [{faq, score}]
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [mode, setMode] = useState('listen'); // 'listen' | 'browse'
  const [browseCat, setBrowseCat] = useState('All');
  const [profile, setProfile] = useState(''); // '' = all profiles
  const [error, setError] = useState('');

  const profileRef = useRef('');
  profileRef.current = profile;

  const recRef = useRef(null);
  const listeningRef = useRef(false);
  const finalRef = useRef('');

  const current = ranked[activeIndex]?.faq || null;
  const alternates = ranked.slice(0, 4);

  // Whenever new top matches arrive, snap focus to the strongest one.
  function applyMatches(windowText) {
    const r = rankMatches(windowText, profileRef.current);
    if (r.length && r[0].score >= 2) {
      setRanked(r);
      setActiveIndex(0);
      setExpanded(true);
    }
  }

  function handleCommand(cmd) {
    switch (cmd) {
      case 'next':
        setActiveIndex((i) => Math.min(i + 1, Math.max(alternates.length - 1, 0)));
        break;
      case 'back':
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case 'clear':
        finalRef.current = '';
        setHeard('');
        setRanked([]);
        setActiveIndex(0);
        break;
      case 'browse':
        setMode('browse');
        break;
      case 'listen':
        setMode('listen');
        break;
      default:
        break;
    }
  }

  function startListening() {
    if (!SpeechRecognition) {
      setError('Voice isn’t supported in this browser — use Chrome or Edge.');
      return;
    }
    setError('');
    const rec = new SpeechRecognition();
    rec.lang = 'en-GB';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      const live = (finalRef.current + interim).trim();
      const windowText = recentWindow(live);
      setHeard(windowText);

      const cmd = detectCommand(normalise(windowText));
      if (cmd) {
        handleCommand(cmd);
        finalRef.current = ''; // consume so the command word doesn't pollute matching
        return;
      }
      applyMatches(windowText);
    };

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('Microphone permission denied — allow mic access to use voice.');
        listeningRef.current = false;
        setListening(false);
      } else if (e.error === 'no-speech' || e.error === 'aborted') {
        /* transient — onend will restart */
      } else {
        setError(`Voice error: ${e.error}`);
      }
    };

    rec.onend = () => {
      // Chrome ends recognition on pauses; restart if still in listening mode.
      if (listeningRef.current) {
        try {
          rec.start();
        } catch {
          /* already starting */
        }
      } else {
        setListening(false);
      }
    };

    recRef.current = rec;
    listeningRef.current = true;
    setListening(true);
    setMode('listen');
    try {
      rec.start();
    } catch {
      /* already started */
    }
  }

  function stopListening() {
    listeningRef.current = false;
    recRef.current?.stop();
    setListening(false);
  }

  function toggleListening() {
    listening ? stopListening() : startListening();
  }

  useEffect(() => {
    return () => {
      listeningRef.current = false;
      recRef.current?.stop();
    };
  }, []);

  function pickCard(faq) {
    setRanked([{ faq, score: 99 }]);
    setActiveIndex(0);
    setExpanded(true);
    setMode('listen');
  }

  const browseList = useMemo(() => {
    const list = FAQS.filter(
      (f) =>
        (browseCat === 'All' || f.category === browseCat) &&
        (profile === '' || f.profiles?.includes(profile))
    );
    return [...list].sort((a, b) => a.tier - b.tier || a.id - b.id);
  }, [browseCat, profile]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className={`brand-dot${listening ? ' live' : ''}`} />
          <div>
            <h1>Stayful Sales Assistant</h1>
            <p className="subtitle">
              {mode === 'listen'
                ? 'Hands-free · listens to the call and surfaces the answer'
                : 'Browse all answers'}
            </p>
          </div>
          <button
            type="button"
            className="mode-toggle"
            onClick={() => setMode((m) => (m === 'listen' ? 'browse' : 'listen'))}
          >
            {mode === 'listen' ? '☰ Browse' : '✕ Close'}
          </button>
        </div>

        <div className="profile-row">
          <span className="profile-label">Lead profile</span>
          <div className="profile-chips">
            <button
              type="button"
              className={`profile-chip${profile === '' ? ' active' : ''}`}
              onClick={() => setProfile('')}
            >
              All
            </button>
            {PROFILES.map((p) => (
              <button
                key={p}
                type="button"
                className={`profile-chip${profile === p ? ' active' : ''}`}
                onClick={() => setProfile((cur) => (cur === p ? '' : p))}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      {mode === 'listen' ? (
        <main className="listen-view">
          <div className="mic-row">
            <button
              type="button"
              className={`mic-btn${listening ? ' on' : ''}`}
              onClick={toggleListening}
              disabled={!supported}
            >
              <span className="mic-icon">{listening ? '●' : '🎤'}</span>
              {listening ? 'Listening — tap to stop' : 'Tap to start listening'}
            </button>
          </div>

          {!supported && (
            <p className="error">
              Voice isn’t supported here. Open in Chrome or Edge, or use Browse.
            </p>
          )}
          {error && <p className="error">{error}</p>}

          <div className={`heard${listening ? ' active' : ''}`}>
            {heard ? (
              <>
                <span className="heard-label">heard</span>
                <span className="heard-text">{heard}</span>
              </>
            ) : (
              <span className="heard-hint">
                Repeat the lead’s question back naturally — the answer appears as you speak.
              </span>
            )}
          </div>

          {current ? (
            <AnswerPanel
              faq={current}
              expanded={expanded}
              onToggle={() => setExpanded((e) => !e)}
            />
          ) : (
            <div className="placeholder">
              <p>No answer yet.</p>
              <p className="placeholder-sub">
                Start listening and restate the question — e.g. “So you’re asking how
                the fees work?”
              </p>
            </div>
          )}

          {alternates.length > 1 && (
            <div className="alternates">
              <span className="alternates-label">also matched — tap or say “next”</span>
              <div className="alt-chips">
                {alternates.map((a, i) => (
                  <button
                    key={a.faq.id}
                    type="button"
                    className={`alt-chip${i === activeIndex ? ' active' : ''}`}
                    style={{ '--tier-color': TIERS[a.faq.tier].color }}
                    onClick={() => {
                      setActiveIndex(i);
                      setExpanded(true);
                    }}
                  >
                    {a.faq.headline}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="cmd-hint">
            Say <b>“next”</b>, <b>“clear”</b> or <b>“browse”</b> to navigate hands-free.
          </p>
        </main>
      ) : (
        <main className="browse-view">
          <nav className="tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`tab${browseCat === cat ? ' active' : ''}`}
                onClick={() => setBrowseCat(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>
          <div className="browse-grid">
            {browseList.map((faq) => (
              <button
                key={faq.id}
                type="button"
                className="browse-card"
                style={{ '--tier-color': TIERS[faq.tier].color }}
                onClick={() => pickCard(faq)}
              >
                <div className="browse-card-head">
                  <TierBadge tier={faq.tier} />
                  <span className="category-tag">{faq.category}</span>
                </div>
                <span className="browse-q">{faq.question}</span>
                <span className="browse-h">{faq.headline}</span>
                {faq.profiles && faq.profiles.length < PROFILES.length && (
                  <span className="browse-profiles">
                    {faq.profiles.join(' · ')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </main>
      )}

      <footer className="app-footer">
        Confidential — internal use only · Presenter reference, not visible to the lead
      </footer>
    </div>
  );
}
