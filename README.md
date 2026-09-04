# Nova AIRA - Invisible Gmail Intelligence Layer Prototype

This project prototypes **Nova AIRA** as a Chrome Browser Extension and interactive Gmail application prototype.

AIRA is designed as an **invisible intelligence layer over Gmail** that observes email threads in real time and surfaces subtle, contextual nudges only when communication requires follow-up, clarity of ownership, or convergence.

---

## 🌟 Core Product Features & Scenarios

### 1. Scenario 1 — Delayed Response (~6h)
- **Trigger**: An email question has not received a response for several hours.
- **AIRA Nudge**: *"This might need a follow-up"*
- **Supporting Context**: *"No response for ~6h · longer than usual"*
- **Action**: Clicking **Follow up** opens Gmail's reply interface with a suggested response:
  > *"Hi Sarah, just following up on this. Could you confirm whether we should proceed with the API changes?"*

### 2. Scenario 2 — Missing Ownership
- **Trigger**: Thread ends with an action item (e.g. *"let's get this done this week"*) but no clear owner assigned.
- **AIRA Nudge**: *"This may need an owner"*
- **Supporting Context**: *"No clear owner for the next step"*
- **Action**: Clicking **Clarify ownership** surfaces an inline candidate selector (*Navatej | Sarah | Rahul*). Selecting someone generates a suggested reply draft:
  > *"Sarah, could you take this forward and coordinate the next steps?"*

### 3. Scenario 3 — Conversation Loop
- **Trigger**: Multiple back-and-forth replies without reaching a conclusion.
- **AIRA Nudge**: *"This conversation isn't converging"*
- **Supporting Context**: *"Multiple replies without a clear decision"*
- **Action**: Clicking **Summarize next step** generates a structured summary draft.

### 4. Scenario 4 — Normal Progress (Silence Principle)
- **Trigger**: Conversation is progressing normally.
- **AIRA Behavior**: **100% Invisible!** AIRA does not interrupt normal email workflows.

---

## 💡 Lightweight "Why?" Interaction
Every nudge includes a **"Why am I seeing this?"** accordion that provides clear, human-understandable context (e.g., *"Question asked 6 hours ago with no response yet"*, *"Similar API design conversations usually resolve within 2 hours"*), building trust without exposing raw technical AI logs.

---

## 🛠️ Architecture & Intelligence Layer

```
Gmail Web Interface (mail.google.com / Web Simulator)
           ↓
    Thread Parser (extracts subject, body, timestamp, candidates)
           ↓
   AIRA Intelligence Engine (evaluates rules & signals)
           ↓
    Signal Output ({ scenarioId, intervention, title, context, action, draft })
           ↓
 AIRA UI Component (Contextual inline nudge injection)
```

- **Separation of Concerns**: Pure intelligence logic is decoupled from React / DOM rendering (`src/services/airaIntelligence.ts`).
- **User Control**: AIRA **never** sends emails automatically. It populates Gmail's reply editor, allowing the user to review, edit, or discard before sending.

---

## 📦 How to Load Chrome Extension in Google Chrome

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the `extension/` folder inside this directory:
   `c:\Users\sanja\nova-app\extension`
5. Open [Gmail](https://mail.google.com), click an email thread, and test AIRA nudges directly inside real Gmail!

---

## 💻 How to Run the Web App Simulator Locally

```bash
# Install dependencies (if not already installed)
npm install

# Run dev server
npm run dev
```

Open `http://localhost:5173` to test the interactive Gmail prototype simulator.
