import React, { useMemo, useRef, useState, useEffect } from 'react';
import { FAQS, CATEGORIES, TIERS } from './faqData.js';

// Web Speech API — local only, no external request.
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

function normalise(s) {
  return s.toLowerCase().normalize('NFKD').replace(/[^\w\s]/g, ' ');
}

function matches(faq, query) {
  if (!query) return true;
  const haystack = normalise(
    `${faq.question} ${faq.answer} ${faq.category} ${faq.slide || ''}`
  );
  // Every whitespace-separated term must appear somewhere — gives useful
  // instant filtering as the presenter types.
  return normalise(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function CopyCommand({ command }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    try {
      navigator.clipboard?.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable — non-critical */
    }
  }

  return (
    <button
      type="button"
      className="say-command"
      onClick={copy}
      title="Click to copy the voice command"
    >
      <span className="say-label">say this</span>
      <span className="say-text">“{command}”</span>
      <span className="say-arrow">{copied ? '✓ copied' : '→'}</span>
    </button>
  );
}

function FaqCard({ faq }) {
  const tier = TIERS[faq.tier];
  return (
    <article className="card" style={{ '--tier-color': tier.color }}>
      <div className="card-head">
        <span className="tier-badge" style={{ background: tier.color }}>
          {tier.short}
        </span>
        <span className="category-tag">{faq.category}</span>
        <span className="qid">Q{faq.id}</span>
      </div>
      <h2 className="question">{faq.question}</h2>
      <p className="answer">{faq.answer}</p>
      {faq.slide && <CopyCommand command={faq.slide} />}
    </article>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    return FAQS.filter(
      (faq) =>
        (activeCat === 'All' || faq.category === activeCat) &&
        matches(faq, query)
    );
  }, [query, activeCat]);

  const catCounts = useMemo(() => {
    const counts = { All: FAQS.length };
    for (const c of CATEGORIES) if (c !== 'All') counts[c] = 0;
    for (const f of FAQS) counts[f.category] = (counts[f.category] || 0) + 1;
    return counts;
  }, []);

  function startVoice() {
    if (!SpeechRecognition) {
      setVoiceError('Voice input is not supported in this browser.');
      return;
    }
    setVoiceError('');
    const rec = new SpeechRecognition();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setQuery(transcript.trim());
    };
    rec.onerror = (e) => {
      setVoiceError(
        e.error === 'not-allowed'
          ? 'Microphone permission denied.'
          : `Voice error: ${e.error}`
      );
      setListening(false);
    };
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function toggleVoice() {
    listening ? stopVoice() : startVoice();
  }

  // Keyboard shortcut: "/" focuses search.
  useEffect(() => {
    function onKey(e) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setQuery('');
        inputRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-dot" />
          <div>
            <h1>Stayful Sales Assistant</h1>
            <p className="subtitle">Second-screen FAQ &amp; slide-cue reference</p>
          </div>
        </div>

        <div className="search-row">
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            inputMode="search"
            placeholder="Search FAQs…  (press / to focus)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            className={`voice-btn${listening ? ' listening' : ''}`}
            onClick={toggleVoice}
            title="Voice search"
          >
            {listening ? '● Listening…' : '🎤 Voice'}
          </button>
        </div>
        {voiceError && <p className="voice-error">{voiceError}</p>}

        <nav className="tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`tab${activeCat === cat ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
              <span className="tab-count">{catCounts[cat] ?? 0}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="results">
        <div className="results-meta">
          {filtered.length} of {FAQS.length} shown
        </div>
        {filtered.length === 0 ? (
          <p className="empty">No matches. Try different keywords.</p>
        ) : (
          <div className="grid">
            {filtered.map((faq) => (
              <FaqCard key={faq.id} faq={faq} />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        Confidential — internal use only · Presenter reference, not visible to the
        lead
      </footer>
    </div>
  );
}
