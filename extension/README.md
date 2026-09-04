# Nova AIRA - Gmail Chrome Extension Prototype

This directory contains the Chrome Extension prototype for **AIRA (Invisible Intelligence Layer for Gmail)**.

AIRA observes Gmail email threads and surfaces subtle, contextual nudges directly inside the user's Gmail workflow when communication stalls, loses ownership, or loops — without feeling like a separate application or annoying chatbot.

---

## 🚀 How to Install & Test the Extension in Google Chrome

### Step 1: Open Chrome Extensions Page
1. Open Google Chrome.
2. Navigate to `chrome://extensions` in your address bar (or go to **Menu (3 dots) -> Extensions -> Manage Extensions**).

### Step 2: Enable Developer Mode
1. In the top right corner of `chrome://extensions`, toggle **Developer mode** to **ON**.

### Step 3: Load Unpacked Extension
1. Click the **Load unpacked** button in the top left.
2. Select the `extension` folder inside this repository:
   `c:\Users\sanja\nova-app\extension`
3. You will see **AIRA - Invisible Gmail Intelligence Layer** added to your Chrome extensions!

---

## 🧪 Testing Scenarios Live on Gmail

1. Open [Gmail](https://mail.google.com).
2. Open any email thread.
3. Click the **AIRA extension icon** in your Chrome toolbar.
4. Select one of the 4 prototype scenarios:
   - **1. Delayed Response (~6h)**: Displays "This might need a follow-up" + "Why am I seeing this?" + "Follow up" action.
   - **2. Missing Ownership**: Displays "This may need an owner" + "Clarify ownership" pill selector.
   - **3. Conversation Loop**: Displays "This conversation isn't converging" + "Summarize next step" action.
   - **4. Normal Progress (Silent AIRA)**: AIRA stays **100% invisible** (Silence is part of the product).
5. Click **Follow up** or **Confirm & Draft Reply** — AIRA will open Gmail's native reply editor and pre-fill the suggested draft text!

---

## 🎨 Interactive Web Prototype Simulator

You can also run the full interactive Gmail prototype simulator locally without opening Chrome Extensions:

```bash
npm run dev
```
Open `http://localhost:5173` in your browser. Click on any email thread (or use the AIRA Scenario Switcher bar at the top) to test all 4 scenarios, "Why am I seeing this?" drawers, ownership assignment, and reply drafting workflows in real-time!
