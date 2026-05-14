# Trinethra — Supervisor Feedback Analyzer

> A Trinethra module for DeepThought's PDGMS platform.  
> AI-assisted analysis of supervisor call transcripts → structured Fellow performance assessment using Ollama.  
> **The AI suggests. The intern decides.**

---

## What It Does

A psychology intern pastes a supervisor's call transcript. The tool sends it to a locally-running Ollama LLM and returns:

- **Rubric Score (1-10)** with justification citing specific transcript evidence
- **Extracted Evidence** — behavioral quotes tagged as positive/negative/neutral, mapped to assessment dimensions
- **KPI Mapping** — which of 8 business KPIs the Fellow's work connects to, and whether each is a *self-sustaining system* or *personally dependent*
- **Gap Analysis** — which assessment dimensions the transcript didn't cover
- **Follow-up Questions** — targeted questions for the next call, each linked to a specific gap
- **Bias Detection** — supervisor narrative patterns (helpfulness bias, presence bias, halo effect, dependency trap) that may be inflating or deflating the score

---

## Architecture

```
Browser (React) ──► Express API (Node.js) ──► Ollama (local LLM)
     :3000               :5000                    :11434
```

- **Frontend**: Reactjs , tailwind css`
- **Backend**: Express.js — receives transcript, builds a structured prompt, calls Ollama, parses JSON response
- **LLM**: Ollama running locally — no cloud, no API key, no cost

---

## Setup Instructions

### Prerequisites
- Node.js v18+ installed
- Ollama installed from [ollama.com](https://ollama.com)

### Step 1 — Install & start Ollama

```bash
# After installing from ollama.com locally on PC:
ollama pull llama3.2      

ollama pull phi3          

# Start Ollama 
ollama serve
```

### Step 2 — Backend

```bash
cd backend
npm install
node server.js
# → Running on http://localhost:5000
```

### Step 3 — Frontend

```bash
cd frontend
npm install
npm start
# → Opens http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## Which Model I Used and Why

**Model: `llama3.2` (3B parameters)**

Chosen because:
-instructed by DeepThough Team
- Runs well on 8GB RAM laptops without a GPU
- Follows structured JSON instructions reliably for a 3B model
- Fast enough for the 10-minute intern workflow (30–90 seconds per analysis)
- Strong instruction following vs. older alternatives like Mistral 7B at similar size

If your machine is slow, use `phi3` — set `OLLAMA_MODEL=phi3` in `backend/.env`.

---

## Environment Variables (optional)

Create `backend/.env`:

```
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
PORT=5000
```

---

## Design Challenges Tackled

### Challenge 1: One Prompt or Many?

**Decision: One structured prompt.**

Reasoning: The 8 output sections (score, evidence, KPIs, gaps, questions, biases) are interdependent — the score justification references evidence, the questions reference gaps. Splitting into multiple calls would require stitching context across calls, doubling latency, and introducing inconsistency.

Tradeoff accepted: One big prompt is harder to tune. Compensated by:
- Explicit section-by-section instructions in the prompt
- Low temperature (0.1) for consistent output
- A 3-strategy JSON parser (direct parse → regex extract → markdown strip)

### Challenge 2: Structured Output Reliability

LLMs frequently add commentary, wrap JSON in markdown, or drop fields. My approach:

1. Prompt explicitly says: *"Return ONLY valid JSON with NO markdown, NO backticks, NO commentary"*
2. Low temperature (0.1) reduces creative deviations
3. `parseAnalysis()` in `server.js` tries 3 strategies in sequence:
   - Direct `JSON.parse()`
   - Regex extract of `{...}` block
   - Strip markdown fences and re-parse
4. If all fail: returns a `parseError: true` object so the frontend shows the raw response instead of crashing

### Challenge 4: Showing Uncertainty

The tool is designed so the intern can't mistake the AI output for a verdict:
- Confidence level shown explicitly on the score card (low/medium/high)
- Persistent "AI draft — intern decides" footer on all results
- "View raw JSON" toggle shows the model's full reasoning
- Tabs separate evidence, score, gaps, biases — intern must actively navigate each section
- Evidence quotes link back to the original transcript ("LOCATE ↓" button)

### Challenge 5: Gap Detection

Detecting what the transcript *doesn't say* is harder than extraction. My approach:

The prompt defines 4 dimensions and instructs the model to check each. Key framing used:
> "Check whether the supervisor covered these 4 dimensions. If a dimension is missing, it's a gap."

The model flags gaps in the `gaps[]` array. Each gap includes a dimension ID and a plain-language explanation of what's missing and why it matters.

---

## What I'd Improve With More Time

1. **Side-by-side view** — split screen showing transcript on the left and analysis on the right, with highlighted evidence spans synced across both
2. **Multiple prompt runs + consensus** — run the same transcript 3 times with different random seeds, compare scores, flag when model disagrees with itself (shows inherent uncertainty)
3. **Intern edit mode** — let the intern accept/reject each evidence quote and adjust the score with a note; save the finalized assessment to a local history
4. **Model benchmark page** — run all 3 sample transcripts automatically and show whether the model scored within ±1 of expected range
5. **Transcript chunking** — very long transcripts (>3000 tokens) may exceed context window on smaller models; add automatic chunking with summary stitching

---

## Sample Transcripts

Three sample transcripts are pre-loaded (click the sample buttons in the UI). Each has a "scoring trap":

| Fellow | Company | Trap | Expected Score |
|--------|---------|------|---------------|
| Karthik Narayanan | Veerabhadra Auto | Positive supervisor, mostly Layer 1 work | 6–7 |
| Meena Krishnamurthy | Lakshmi Textiles | Critical supervisor, genuine Layer 2 systems | 7–8 |
| Anil Menon | Prabhat Foods | Glowing supervisor, dependency trap (not systems) | 5–6 |

If the tool scores all three correctly (within ±1), the prompt engineering is working.

---

## Git History

This project was built incrementally:
- `feat: project scaffold — backend + frontend structure`
- `feat: backend — Ollama integration + prompt builder`
- `feat: backend — JSON parser with 3 fallback strategies`
- `feat: frontend — transcript input + sample loader`
- `feat: frontend — ScoreCard + EvidencePanel components`
- `feat: frontend — KPI, Gaps, Questions, Bias panels`
- `feat: frontend — tab navigation + loading states`
- `docs: README with architecture and design decisions`

---

*Built for the DeepThought Software Developer Internship assignment.*
