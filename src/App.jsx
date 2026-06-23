import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FAQS, CATEGORIES, TIERS, PROFILES, SMART_WORDS, INTENTS } from './faqData.js';

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

// Smart words → which FAQ ids each concept term should surface.
const SMART_BY_ID = {};
for (const [term, ids] of Object.entries(SMART_WORDS)) {
  for (const id of ids) (SMART_BY_ID[id] ||= []).push(normalise(term));
}

// Pre-build a lightweight match index from each FAQ.
const INDEX = FAQS.map((faq) => {
  const phrases = [...faq.keywords, faq.category].map(normalise).filter(Boolean);
  const smart = SMART_BY_ID[faq.id] || [];
  const qwords = normalise(faq.question)
    .split(' ')
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  // Single-word tokens used for fast prefix (typeahead) matching.
  const prefixWords = [
    ...new Set([
      ...qwords,
      ...smart,
      ...phrases.flatMap((p) => p.split(' ')),
    ].filter((w) => w.length > 2 && !STOPWORDS.has(w))),
  ];
  return { faq, phrases, smart, qwords, prefixWords };
});

const FAQ_BY_ID = Object.fromEntries(FAQS.map((f) => [f.id, f]));

// Per-session storage so an attached lead + the questions opened survive a refresh
// mid-meeting (cleared when the browser tab closes).
const LEAD_KEY = 'stayful_lead';
const VIEWED_KEY = 'stayful_viewed';
function loadSession(key, fallback) {
  if (typeof sessionStorage === 'undefined') return fallback;
  try {
    const v = sessionStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

// Voice commands the presenter can speak to drive the app hands-free.
const COMMANDS = {
  next: ['next', 'next one', 'next answer'],
  back: ['back', 'previous', 'go back'],
  clear: ['clear', 'reset', 'start over', 'clear that'],
  browse: ['browse', 'browse all', 'show all', 'list'],
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

// Score every FAQ against the query text. Returns ranked matches.
// Matching is layered so even a near-miss surfaces the closest answer:
//   - exact multi-word phrase / keyword (strong)
//   - single-word keyword, category or smart-word/synonym match
//   - prefix match on the word being typed (typeahead — "comp" → compliance)
// When a lead profile is active, its relevant cards get a small boost.
function rankMatches(text, profile) {
  const t = normalise(text);
  if (!t) return [];
  const tokens = t.split(' ');
  const words = new Set(tokens);
  const lastToken = tokens[tokens.length - 1];
  const results = [];
  for (const item of INDEX) {
    let score = 0;
    for (const phrase of item.phrases) {
      if (phrase.includes(' ')) {
        if (t.includes(phrase)) score += 3 + phrase.split(' ').length;
      } else if (words.has(phrase)) {
        score += 1.5;
      }
    }
    // Smart-word / synonym hits (e.g. "compliance" → legal/tax/insurance cards)
    for (const s of item.smart) {
      if (s.includes(' ') ? t.includes(s) : words.has(s)) score += 1.4;
    }
    for (const w of item.qwords) if (words.has(w)) score += 0.5;
    // Prefix match on whatever word is currently being typed.
    if (lastToken && lastToken.length >= 2) {
      for (const w of item.prefixWords) {
        if (w !== lastToken && w.startsWith(lastToken)) {
          score += 0.6;
          break;
        }
      }
    }
    if (score > 0) {
      if (item.faq.tier === 1) score += 0.3;
      if (profile && item.faq.profiles?.includes(profile)) score += 0.4;
      results.push({ faq: item.faq, score });
    }
  }
  return results.sort((a, b) => b.score - a.score);
}

// Score below which we treat the top result as an approximate / related match
// (no exact answer existed, but this is the closest).
const CLOSEST_MATCH_THRESHOLD = 3;

// Keep only the last N words so matching tracks the current utterance.
function recentWindow(text, words = 16) {
  return text.trim().split(/\s+/).slice(-words).join(' ');
}

function TierBadge({ tier }) {
  const t = TIERS[tier];
  return (
    <span className="tier-badge" style={{ background: t.color }}>
      {t.short}
    </span>
  );
}

function IntentBadge({ intent }) {
  const i = INTENTS[intent];
  if (!i) return null;
  return (
    <span className="intent-badge" style={{ color: i.color, borderColor: i.color }}>
      {intent === 'buying' ? '▲ ' : intent === 'concern' ? '▼ ' : '• '}
      {i.short}
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

// Renders a headline/answer string, highlighting any [[voice command]] — the
// exact phrase the presenter says (with Voice ON in the deck) to move the slide.
function renderCue(text) {
  return String(text || '')
    .split(/(\[\[.+?\]\])/g)
    .map((part, i) => {
      const m = part.match(/^\[\[(.+?)\]\]$/);
      return m ? (
        <mark
          key={i}
          className="cue-phrase"
          title="Hold V and say this to move the slide"
        >
          <span className="cue-mic" aria-hidden="true">🎙</span>
          {m[1]}
        </mark>
      ) : (
        part
      );
    });
}

function AnswerPanel({ faq, expanded, onToggle }) {
  if (!faq) return null;
  return (
    <article className="answer-panel" key={faq.id}>
      <div className="answer-head">
        <TierBadge tier={faq.tier} />
        <IntentBadge intent={faq.intent} />
        <span className="category-tag">{faq.category}</span>
        <span className="qid">Q{faq.id}</span>
      </div>
      <p className="answer-question">{faq.question}</p>
      {/* The headline is the short, speakable line — lead with it. */}
      <p className="answer-headline">{renderCue(faq.headline)}</p>
      {faq.profiles && faq.profiles.length < PROFILES.length && (
        <div className="profile-tags">
          {faq.profiles.map((p) => (
            <span key={p} className="profile-tag">{p}</span>
          ))}
        </div>
      )}
      {faq.slide ? (
        <SlideCommand command={faq.slide} />
      ) : (
        <p className="verbal-only">Verbal answer — no slide</p>
      )}
      <button type="button" className="detail-toggle" onClick={onToggle}>
        {expanded ? '▾ Hide detail' : '▸ Need more detail?'}
      </button>
      {expanded && <p className="answer-full">{renderCue(faq.answer)}</p>}
    </article>
  );
}

// Opens on first load: attach the lead being met so opened questions can be logged
// to their Monday item. Skippable — skip to just browse.
function LeadModal({ onAttach, onSkip }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'looking' | 'notfound' | 'error'

  async function lookup(e) {
    e.preventDefault();
    const addr = email.trim();
    if (!addr) return;
    setStatus('looking');
    try {
      const res = await fetch('/api/lead?email=' + encodeURIComponent(addr));
      const data = await res.json();
      if (!res.ok) return setStatus('error');
      if (!data.found) return setStatus('notfound');
      onAttach({ itemId: data.item.id, name: data.item.name, email: addr });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="lead-overlay">
      <form className="lead-modal" onSubmit={lookup}>
        <h2>Who’s this meeting with?</h2>
        <p className="lead-sub">
          Enter the lead’s email to log the questions they ask straight to their Monday
          record. You can skip and just browse.
        </p>
        <input
          className="lead-input"
          type="email"
          inputMode="email"
          autoFocus
          placeholder="lead@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'notfound' || status === 'error') setStatus('idle');
          }}
        />
        {status === 'notfound' && (
          <p className="lead-msg warn">No lead found with that email on the board.</p>
        )}
        {status === 'error' && (
          <p className="lead-msg warn">Couldn’t reach Monday — try again or skip.</p>
        )}
        <div className="lead-actions">
          <button
            type="submit"
            className="lead-start"
            disabled={status === 'looking' || !email.trim()}
          >
            {status === 'looking' ? 'Looking…' : 'Start'}
          </button>
          <button type="button" className="lead-skip" onClick={onSkip}>
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [supported] = useState(!!SpeechRecognition);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(null); // faq chosen from Browse / suggestion
  const [mode, setMode] = useState('listen'); // 'listen' | 'browse'
  const [browseCat, setBrowseCat] = useState('All');
  const [profile, setProfile] = useState(''); // '' = all profiles
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false); // search input focus
  const [suggestIndex, setSuggestIndex] = useState(-1);
  const [viewed, setViewed] = useState(() => loadSession(VIEWED_KEY, [])); // FAQ ids the lead has prompted, this call
  const [lead, setLead] = useState(() => loadSession(LEAD_KEY, null)); // { itemId, name, email } | null
  const [showLeadModal, setShowLeadModal] = useState(() => !loadSession(LEAD_KEY, null));
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'sending' | 'done' | 'error'

  const recRef = useRef(null);
  const listeningRef = useRef(false);
  const finalRef = useRef('');
  const inputRef = useRef(null);

  const ranked = useMemo(() => rankMatches(query, profile), [query, profile]);
  const current = pinned || ranked[activeIndex]?.faq || null;
  const alternates = ranked.slice(0, 6);
  const suggestions = useMemo(
    () => (query.trim() ? ranked.slice(0, 6) : []),
    [query, ranked]
  );
  const topScore = ranked[0]?.score ?? 0;
  const approximate = !pinned && current && topScore < CLOSEST_MATCH_THRESHOLD;
  const showSuggest = focused && !pinned && suggestions.length > 0;

  // Buying temperature — averages the intent of the questions looked up so far.
  const temp = useMemo(() => {
    if (!viewed.length) return { pct: 0, count: 0, label: 'No reads yet' };
    const sum = viewed.reduce(
      (a, id) => a + (INTENTS[FAQ_BY_ID[id]?.intent]?.weight ?? 1),
      0
    );
    const pct = Math.round((sum / (viewed.length * 2)) * 100);
    const label =
      pct >= 66 ? 'Hot — strong buying signals'
      : pct >= 45 ? 'Warm — engaged'
      : pct >= 25 ? 'Cooling — mostly concerns'
      : 'Cold — concerns';
    return { pct, count: viewed.length, label };
  }, [viewed]);

  // Count an answer as "read" once it's been on screen briefly (ignores the
  // flicker of partial matches while typing).
  useEffect(() => {
    if (!current) return;
    const id = current.id;
    const t = setTimeout(() => {
      setViewed((v) => (v.includes(id) ? v : [...v, id]));
    }, 1200);
    return () => clearTimeout(t);
  }, [current]);

  // Persist the opened-questions list and the attached lead for this session.
  useEffect(() => {
    try {
      sessionStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    } catch {}
  }, [viewed]);
  useEffect(() => {
    try {
      if (lead) sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
      else sessionStorage.removeItem(LEAD_KEY);
    } catch {}
  }, [lead]);

  // Opening more answers (or switching lead) re-enables Submit after a send.
  useEffect(() => {
    setSubmitState((s) => (s === 'sending' ? s : 'idle'));
  }, [viewed.length, lead]);

  // Push the opened questions to the lead's Monday item as an Update.
  async function submitToMonday() {
    if (!lead || viewed.length === 0) return;
    setSubmitState('sending');
    const questions = viewed
      .map((id) => FAQ_BY_ID[id])
      .filter(Boolean)
      .map((f) => ({ question: f.question, category: f.category }));
    try {
      const res = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: lead.itemId, questions }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Submit failed');
      setSubmitState('done');
    } catch {
      setSubmitState('error');
    }
  }

  // New query → reset focus to the top match and clear any pinned card.
  useEffect(() => {
    setActiveIndex(0);
    setExpanded(false);
    setPinned(null);
    setSuggestIndex(-1);
  }, [query]);

  // Picking a suggestion focuses that card but keeps the ranked options
  // available below (and you can re-open suggestions with Back).
  function pickSuggestion(faq) {
    const idx = ranked.findIndex((r) => r.faq.id === faq.id);
    setActiveIndex(idx >= 0 ? idx : 0);
    setFocused(false);
    setSuggestIndex(-1);
    setExpanded(false);
    inputRef.current?.blur();
  }

  function goBack() {
    if (pinned) {
      setPinned(null);
      setMode('browse');
      return;
    }
    // Return to the recommended list: top match + re-open suggestions.
    setActiveIndex(0);
    setExpanded(false);
    setFocused(true);
    inputRef.current?.focus();
  }

  function onSearchKeyDown(e) {
    if (!showSuggest) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && suggestIndex >= 0 && suggestions[suggestIndex]) {
      e.preventDefault();
      pickSuggestion(suggestions[suggestIndex].faq);
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
        setQuery('');
        break;
      case 'browse':
        setMode('browse');
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

      const cmd = detectCommand(normalise(windowText));
      if (cmd) {
        handleCommand(cmd);
        finalRef.current = '';
        return;
      }
      setQuery(windowText); // voice types straight into the search bar
    };

    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('Microphone permission denied — allow mic access to use voice.');
        listeningRef.current = false;
        setListening(false);
      } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setError(`Voice error: ${e.error}`);
      }
    };

    rec.onend = () => {
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

  // "/" focuses search, Escape clears.
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement !== inputRef.current && mode === 'listen') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setQuery('');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);

  function pickCard(faq) {
    setQuery('');
    setPinned(faq);
    setExpanded(false);
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
      {showLeadModal && (
        <LeadModal
          onAttach={(l) => {
            setLead(l);
            setShowLeadModal(false);
          }}
          onSkip={() => setShowLeadModal(false)}
        />
      )}
      <header className="app-header">
        <div className="brand">
          <span className={`brand-dot${listening ? ' live' : ''}`} />
          <div>
            <h1>Stayful Sales Assistant</h1>
            <p className="subtitle">
              {mode === 'listen'
                ? 'Search or speak — the answer surfaces instantly'
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

        <div className="temp-row">
          <div className="temp-meta">
            <span className="temp-label">Buying temperature</span>
            <span className="temp-status">
              {temp.label}
              {temp.count > 0 && <span className="temp-count"> · {temp.count} read</span>}
            </span>
          </div>
          <div className="temp-bar">
            <div
              className="temp-fill"
              style={{
                width: `${temp.pct}%`,
                background:
                  temp.pct >= 66
                    ? 'rgb(93,129,86)'
                    : temp.pct >= 45
                    ? '#d99a2b'
                    : temp.pct >= 25
                    ? '#c98a4a'
                    : '#c2685a',
              }}
            />
          </div>
          {viewed.length > 0 && (
            <button type="button" className="temp-reset" onClick={() => setViewed([])}>
              Reset
            </button>
          )}
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

        <div className="lead-bar">
          <button
            type="button"
            className={`lead-chip${lead ? ' attached' : ''}`}
            onClick={() => setShowLeadModal(true)}
            title={lead ? lead.email : 'Attach a lead'}
          >
            {lead ? `● ${lead.name}` : '+ Add lead'}
          </button>
          <button
            type="button"
            className={`submit-monday${submitState === 'done' ? ' done' : ''}${
              submitState === 'error' ? ' error' : ''
            }`}
            disabled={
              !lead ||
              viewed.length === 0 ||
              submitState === 'sending' ||
              submitState === 'done'
            }
            onClick={submitToMonday}
          >
            {submitState === 'sending'
              ? 'Sending…'
              : submitState === 'done'
              ? 'Sent ✓'
              : submitState === 'error'
              ? 'Retry submit'
              : `Submit to Monday${viewed.length ? ` (${viewed.length})` : ''}`}
          </button>
        </div>
      </header>

      {mode === 'listen' ? (
        <main className="listen-view">
          <div className="search-row">
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              inputMode="search"
              placeholder="Search a question…  ( / to focus )"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              onKeyDown={onSearchKeyDown}
              autoComplete="off"
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => setQuery('')}
                title="Clear"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              className={`voice-btn${listening ? ' on' : ''}`}
              onClick={toggleListening}
              disabled={!supported}
              title="Voice"
            >
              {listening ? '● Listening' : '🎤'}
            </button>

            {showSuggest && (
              <ul className="suggest-list">
                {suggestions.map((s, i) => (
                  <li key={s.faq.id}>
                    <button
                      type="button"
                      className={`suggest-item${i === suggestIndex ? ' active' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pickSuggestion(s.faq);
                      }}
                    >
                      <span
                        className="suggest-dot"
                        style={{ background: TIERS[s.faq.tier].color }}
                      />
                      <span className="suggest-q">{s.faq.question}</span>
                      <span className="suggest-cat">{s.faq.category}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!supported && (
            <p className="error">Voice unsupported here — typing still works.</p>
          )}
          {error && <p className="error">{error}</p>}

          {approximate && (
            <p className="closest-note">
              No exact answer for that — here’s the closest match that may help.
            </p>
          )}

          {current && (pinned || activeIndex > 0) && (
            <button type="button" className="back-btn" onClick={goBack}>
              ← Back to {pinned ? 'browse' : 'options'}
            </button>
          )}

          {current ? (
            <AnswerPanel
              faq={current}
              expanded={expanded}
              onToggle={() => setExpanded((e) => !e)}
            />
          ) : (
            <div className="placeholder">
              <p>{query ? 'No match — try different words.' : 'Type or tap 🎤 to begin.'}</p>
              <p className="placeholder-sub">
                Tip: restate the lead’s question — “so you’re asking how the fees
                work?” — and the answer appears.
              </p>
            </div>
          )}

          {!pinned && alternates.length > 1 && (
            <div className="alternates">
              <span className="alternates-label">other options — tap or say “next”</span>
              <div className="alt-chips">
                {alternates.map((a, i) => (
                  <button
                    key={a.faq.id}
                    type="button"
                    className={`alt-chip${i === activeIndex ? ' active' : ''}`}
                    style={{ '--tier-color': TIERS[a.faq.tier].color }}
                    onClick={() => {
                      setActiveIndex(i);
                      setExpanded(false);
                    }}
                  >
                    <span
                      className="alt-intent-dot"
                      style={{ background: INTENTS[a.faq.intent]?.color }}
                    />
                    {renderCue(a.faq.headline)}
                  </button>
                ))}
              </div>
            </div>
          )}
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
                  <IntentBadge intent={faq.intent} />
                  <span className="category-tag">{faq.category}</span>
                </div>
                <span className="browse-q">{faq.question}</span>
                <span className="browse-h">{renderCue(faq.headline)}</span>
                {faq.profiles && faq.profiles.length < PROFILES.length && (
                  <span className="browse-profiles">{faq.profiles.join(' · ')}</span>
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
