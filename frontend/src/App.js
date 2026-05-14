import React, { useState, useEffect } from 'react';
import './App.css';
import ScoreCard from './components/ScoreCard';
import EvidencePanel from './components/EvidencePanel';
import KpiPanel from './components/KpiPanel';
import GapsPanel from './components/GapsPanel';
import QuestionsPanel from './components/QuestionsPanel';
import BiasPanel from './components/BiasPanel';

const API = '';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [supervisorName, setSupervisorName] = useState('');
  const [fellowName, setFellowName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [samples, setSamples] = useState([]);
  const [activeTab, setActiveTab] = useState('score');
  const [loadingStep, setLoadingStep] = useState('');

  useEffect(() => {
    fetch(`${API}/api/samples`)
      .then(r => r.json())
      .then(d => setSamples(d.transcripts || []))
      .catch(() => {});
  }, []);

  const loadSample = (sample) => {
    setTranscript(sample.transcript);
    setSupervisorName(sample.supervisor.name);
    setFellowName(sample.fellow.name);
    setCompanyName(sample.company.name);
    setAnalysis(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setLoadingStep('Sending transcript to Ollama…');

    const steps = [
      'Extracting behavioral evidence…',
      'Mapping to rubric dimensions…',
      'Detecting supervisor biases…',
      'Computing score and justification…',
      'Generating follow-up questions…'
    ];
    let stepIdx = 0;
    const stepTimer = setInterval(() => {
      stepIdx = (stepIdx + 1) % steps.length;
      setLoadingStep(steps[stepIdx]);
    }, 2500);

    try {
      const res = await fetch(`${API}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, supervisorName, fellowName, companyName })
      });
      const data = await res.json();
      clearInterval(stepTimer);

      if (!res.ok) {
        setError(data.error + (data.detail ? '\n\n' + data.detail : ''));
      } else {
        setAnalysis(data.analysis);
        setActiveTab('score');
      }
    } catch (e) {
      clearInterval(stepTimer);
      setError('Network error: ' + e.message);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const tabs = [
    { id: 'score', label: 'Score', icon: '◎' },
    { id: 'evidence', label: 'Evidence', icon: '◈' },
    { id: 'kpi', label: 'KPI Map', icon: '◇' },
    { id: 'gaps', label: 'Gaps', icon: '△' },
    { id: 'questions', label: 'Follow-up', icon: '?' },
    { id: 'bias', label: 'Biases', icon: '⚑' },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-eye">◉◉◉</span>
          <div>
            <span className="logo-title">TRINETHRA</span>
            <span className="logo-sub">Supervisor Feedback Analyzer · DeepThought</span>
          </div>
        </div>
        <div className="header-badge">AI Draft · Human Decision</div>
      </header>

      <main className="main">
        {/* Left: Input */}
        <section className="input-section">
          <div className="section-label">01 // Context Setup</div>
          <div className="meta-row">
            <input
              className="meta-input"
              placeholder="Fellow Name"
              value={fellowName}
              onChange={e => setFellowName(e.target.value)}
            />
            <input
              className="meta-input"
              placeholder="Supervisor Name"
              value={supervisorName}
              onChange={e => setSupervisorName(e.target.value)}
            />
            <input
              className="meta-input"
              placeholder="Company"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
            />
          </div>

          <div className="section-label" style={{ marginTop: '2.5rem' }}>02 // Raw Transcript</div>
          <textarea
            className="transcript-area"
            placeholder="Paste the supervisor's call transcript here to begin analysis..."
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
          />

          <div className="input-footer">
            <div className="char-count">{transcript.length} chars registered</div>
            <button
              className="run-btn"
              onClick={runAnalysis}
              disabled={loading || !transcript.trim()}
            >
              {loading ? 'Analyzing Data...' : 'Initiate Analysis'}
            </button>
          </div>

          {loading && (
            <div className="loading-status">
              <div className="loading-bar"><div className="loading-fill" /></div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-glow)' }}>
                 {loadingStep}
              </span>
            </div>
          )}
        </section>

        {/* Right: Output */}
        <section className="output-section">
          {!analysis && !error && (
            <div className="empty-state">
              <div className="empty-icon">⌘</div>
              <p>Awaiting transcript input.<br />The system interprets, you decide.</p>
            </div>
          )}

          {error && (
            <div className="error-box" style={{ color: '#ff4444', border: '1px solid #ff4444', padding: '2rem', borderRadius: '16px' }}>
              <div className="panel-title" style={{ color: '#ff4444' }}>System Error</div>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>{error}</pre>
            </div>
          )}

          {analysis && (
            <div className="results">
              <div className="tabs">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    className={`tab ${activeTab === t.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    <span className="tab-icon">{t.icon}</span> {t.label}
                    {t.id === 'gaps' && analysis.gaps?.length > 0 && (
                      <span className="tab-badge">{analysis.gaps.length}</span>
                    )}
                    {t.id === 'evidence' && analysis.evidence?.length > 0 && (
                      <span className="tab-badge">{analysis.evidence.length}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="tab-content">
                {activeTab === 'score' && <ScoreCard score={analysis.score} />}
                {activeTab === 'evidence' && <EvidencePanel evidence={analysis.evidence} />}
                {activeTab === 'kpi' && <KpiPanel kpiMapping={analysis.kpiMapping} />}
                {activeTab === 'gaps' && <GapsPanel gaps={analysis.gaps} />}
                {activeTab === 'questions' && <QuestionsPanel questions={analysis.followUpQuestions} />}
                {activeTab === 'bias' && <BiasPanel biases={analysis.biasesDetected} />}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}