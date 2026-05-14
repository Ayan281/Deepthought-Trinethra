const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load rubric and sample data
const rubric = JSON.parse(fs.readFileSync(path.join(__dirname, 'rubric.json'), 'utf8'));
const samples = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-transcripts.json'), 'utf8'));

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// ─── PROMPT BUILDER ────────────────────────────────────────────────────────────
// Deliberately verbose and structured to extract consistent JSON
function buildPrompt(transcript) {
  return `You are an expert analyst at DeepThought, a company that places early-career Fellows inside Indian manufacturing SMEs. Your job is to analyze a supervisor's feedback transcript about a Fellow's performance.

== FELLOW MODEL ==
Fellows have TWO layers of work:
- Layer 1 (Execution): Attending meetings, tracking output, coordination, data entry — NECESSARY but not sufficient
- Layer 2 (Systems Building): Creating SOPs, trackers, dashboards, accountability structures that CONTINUE WORKING AFTER THE FELLOW LEAVES

The most important diagnostic: "If the Fellow left tomorrow, would any system they built continue running?"
- YES → Systems Building (Layer 2)
- NO → Task Execution only (Layer 1)

== RUBRIC (1-10 SCALE) ==
1 - Not Interested: Disengagement, no effort
2 - Lacks Discipline: Works only when told, no self-initiative
3 - Motivated but Directionless: Enthusiasm + confusion
4 - Careless and Inconsistent: Output varies in quality
5 - Consistent Performer: Reliable task execution
6 - Reliable and Productive: High trust, handles assigned scope well
7 - Problem Identifier: Spots patterns and problems the supervisor didn't ask about
8 - Problem Solver: Identifies AND fixes problems, builds systems
9 - Innovative and Experimental: Builds new tools, tests approaches, creates processes
10 - Exceptional Performer: Everything at 9, others learn from their work

CRITICAL BOUNDARY — 6 vs 7:
- Score 6: "He does everything I give him. Very reliable." → executes tasks within assigned scope
- Score 7: "She noticed our rejection rate goes up on Mondays and started tracking why." → expands scope independently
The difference is WHO defined the problem. A 6 solves problems others define. A 7 finds problems others haven't noticed.

== SUPERVISOR BIASES TO WATCH FOR ==
- Helpfulness bias: "She handles all my calls now" sounds like an 8, but it's actually a 5-6 (task absorption, not systems building)
- Presence bias: "He's always on the floor" gets rated higher than it deserves
- Halo effect: one big positive story coloring the whole assessment
- Dependency trap: If supervisor says "I don't know how we managed without them" — check if the Fellow is building systems or absorbing workload

== 8 KPIs TO MAP ==
1. Lead Generation: New customers identified/contacted
2. Lead Conversion: Leads that became paying customers
3. Upselling: Selling more to existing customers
4. Cross-selling: Additional products to existing customers
5. NPS: Customer satisfaction improvements
6. PAT (Profitability): Waste reduction, cost savings
7. TAT (Turnaround Time): Faster dispatch, fewer missed deadlines
8. Quality: Defect/rejection/complaint rate improvements

== 4 ASSESSMENT DIMENSIONS (for Gap Analysis) ==
1. Driving Execution: Gets things done on time, follows up without reminders, initiates work
2. Systems Building: Created trackers, processes, SOPs, templates others use independently
3. KPI Impact: Connected work to measurable business outcomes
4. Change Management: How Fellow interacts with floor team, handles resistance from experienced workers

== TRANSCRIPT TO ANALYZE ==
${transcript}

== INSTRUCTIONS ==
Analyze this transcript carefully. Apply the rubric logic above. Watch for supervisor biases. Distinguish between Layer 1 and Layer 2 work.

Return ONLY valid JSON with NO markdown, NO backticks, NO commentary before or after. Return exactly this structure:

{
  "score": {
    "value": <number 1-10>,
    "label": "<rubric label>",
    "band": "<Need Attention | Productivity | Performance>",
    "justification": "<2-3 sentences citing specific transcript evidence. Mention any supervisor biases detected.>",
    "confidence": "<low | medium | high>",
    "layerAssessment": "<brief statement about whether the Fellow is doing Layer 1, Layer 2, or both>"
  },
  "evidence": [
    {
      "quote": "<exact quote from transcript, under 30 words>",
      "signal": "<positive | negative | neutral>",
      "dimension": "<execution | systems_building | kpi_impact | change_management | relationships>",
      "interpretation": "<what this reveals about the Fellow's actual performance level>"
    }
  ],
  "kpiMapping": [
    {
      "kpi": "<one of the 8 KPIs above>",
      "evidence": "<what supervisor said that connects to this KPI>",
      "systemOrPersonal": "<system (self-sustaining) | personal (depends on Fellow being there)>"
    }
  ],
  "gaps": [
    {
      "dimension": "<execution | systems_building | kpi_impact | change_management>",
      "detail": "<what information is missing and why it matters>"
    }
  ],
  "followUpQuestions": [
    {
      "question": "<specific question the intern should ask>",
      "targetGap": "<which gap this addresses>",
      "lookingFor": "<what answer would reveal about the Fellow>"
    }
  ],
  "biasesDetected": [
    "<describe any supervisor biases you detected and how they affected the narrative>"
  ]
}

Provide 3-6 evidence quotes, 1-3 KPI mappings, 1-4 gaps, and 3-5 follow-up questions.`;
}

// ─── PARSE LLM RESPONSE ────────────────────────────────────────────────────────
function parseAnalysis(rawText) {
  // Strategy 1: Direct JSON parse
  try {
    return JSON.parse(rawText.trim());
  } catch (_) {}

  // Strategy 2: Extract JSON block from text (model added commentary)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (_) {}
  }

  // Strategy 3: Strip markdown fences
  const stripped = rawText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  try {
    return JSON.parse(stripped);
  } catch (_) {}

  // Strategy 4: Return a structured error so frontend can display it
  return {
    parseError: true,
    rawResponse: rawText,
    score: {
      value: 0,
      label: 'Parse Error',
      band: 'Unknown',
      justification: 'The model returned an unparseable response. See raw output below.',
      confidence: 'low',
      layerAssessment: 'Unable to determine'
    },
    evidence: [],
    kpiMapping: [],
    gaps: [],
    followUpQuestions: [],
    biasesDetected: []
  };
}

// ─── ROUTES ────────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: OLLAMA_MODEL, ollamaUrl: OLLAMA_URL });
});

// Get sample transcripts
app.get('/api/samples', (req, res) => {
  res.json(samples);
});

// Get rubric
app.get('/api/rubric', (req, res) => {
  res.json(rubric);
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  const { transcript, supervisorName, fellowName, companyName } = req.body;

  if (!transcript || transcript.trim().length < 50) {
    return res.status(400).json({ error: 'Transcript is too short. Please paste the full supervisor call transcript.' });
  }

  const prompt = buildPrompt(transcript);

  try {
    // Call Ollama
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,      // Low temperature for consistent structured output
          top_p: 0.9,
          num_predict: 2000      // Allow enough tokens for full JSON
        }
      })
    });

    if (!ollamaResponse.ok) {
      const errText = await ollamaResponse.text();
      throw new Error(`Ollama error ${ollamaResponse.status}: ${errText}`);
    }

    const ollamaData = await ollamaResponse.json();
    const rawText = ollamaData.response || '';

    const analysis = parseAnalysis(rawText);

    // Attach metadata
    analysis.meta = {
      model: OLLAMA_MODEL,
      supervisorName: supervisorName || 'Unknown',
      fellowName: fellowName || 'Unknown',
      companyName: companyName || 'Unknown',
      analyzedAt: new Date().toISOString(),
      transcriptLength: transcript.length,
      promptTokensApprox: Math.ceil(prompt.length / 4)
    };

    res.json({ success: true, analysis });

  } catch (err) {
    // Distinguish Ollama connection errors from parsing errors
    if (err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
      return res.status(503).json({
        error: 'Cannot connect to Ollama',
        detail: `Make sure Ollama is running: ollama serve\nThen pull a model: ollama pull ${OLLAMA_MODEL}`,
        ollamaUrl: OLLAMA_URL
      });
    }
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── START ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Trinethra Backend running on http://localhost:${PORT}`);
  console.log(`📡 Ollama URL: ${OLLAMA_URL}`);
  console.log(`🤖 Model: ${OLLAMA_MODEL}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/health`);
  console.log(`  GET  /api/samples`);
  console.log(`  POST /api/analyze\n`);
});
/ /   A I   p r o m p t   +   O l l a m a   i n t e g r a t i o n   s t a b i l i z e d  
 