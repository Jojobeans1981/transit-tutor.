
# 🚇 TRANSIT TUTOR: S.O.D.A.

## Surface Operations Dispatcher Academy

Terminal

**Architected by Prometheus Workforce Analytics**  
*"Using AI to fortify the human advantage. Empowering Human Excellence through Intelligent Innovation."*

---

## 🛡️ CANDIDATE FIELD MANUAL (User Guide)

**Target Audience:** Dispatcher Candidates & Field Personnel  
**Objective:** Achieve mastery of NYC DOT protocols, radio codes, and shop logistics through high-fidelity simulation.

### 1. Accessing the Terminal

* **Registration:** If this is your first shift, select **"Register Here"**.
* **Rank Assignment:** New users begin as **Rank 1 Candidates**. Your telemetry (XP, score history, and metrics) is saved to your local terminal session.
* **Rank Progression:** As you complete simulations, you accrue XP. Reaching XP thresholds will increase your Rank, unlocking higher status on the Academy Leaderboard.

### 2. System Monitor (Dashboard)

* **Operational Analytics:** Review your 
* readiness history via the telemetry graph.
* **Core Indices:** Monitor your proficiency across six key domains:
* **Radio Prof:** Your mastery of 10-codes and clear-voice procedures.
* **Protocol Comp:** Adherence to S.O.D.A. standard operating procedures.
* **Response Spd:** Your ability to log incidents accurately under time pressure.
* **Mission Log:** Check your active weekly goals. Completing these (e.g., "5 Operational Drills") provides significant XP boosts.

### 3. Tactical Simulation (Quiz)

* **Initiation:** Select **"Simulate"** from the navigation bar.
* **Parameter Selection:** Choose a topic (e.g., "Snow Emergency Response" or "Radio 10-Codes").
* **The Sequence:** You will face 5 high-pressure scenarios.
* **Correction Cycle:** After submitting a response, the system provides a **Reference Data Node**. This excerpt from the official DOT manual explains the correct procedure and cites the specific section for further study.

### 4. Tactical Liaison (AI Chat)

* **Data Node Selection:** Before querying, select a category (e.g., **RADIO**, **SAFETY**, or **E-SHOP**). This focuses the AI's logic on that specific sub-section of the manual.
* **Consultation:** Ask the liaison for clarification on complex codes or equipment handling procedures.

---

## ⚡ COMMAND LEVEL DIRECTIVE (Admin Guide)

**Target Audience:** Senior Dispatchers, Training Officers, and Shop Leads  
**Objective:** Protocol ingestion, archive maintenance, and personnel oversight.

### 1. Authorized Access

* **Command Credentials:** To access Admin tools, a user must register with a username containing the string `admin` (e.g., `admin_j_miller`). This unlocks the **Command Center** node in the sidebar.

### 2. Protocol Ingestion Pipeline

The Academy utilizes a high-speed ingestion engine to convert static PDF manuals into searchable training data.

1. **Preparation:** Run the provided 
2. `parseManuals()` JavaScript script on your local machine against your source PDFs.
3. **Parser Output:** The script generates a `sts_master_data.csv` file with two columns: `title` and `content`.
4. **Upload:**
    * Navigate to the **Command Center**.
    * Select **"Ingest Parser Output"** and upload your CSV.
    * The **Prometheus Data Validator** will scan the stream for corruption or formatting errors.

### 3. Batch Review & Classification

Uploaded data enters the **Batch Review Queue** before being pushed to the live library:

* **Classification:** Admins must assign a category to each data chunk (e.g., "Logistics" for E-Shop parts data).
* **Visual Indicators:** This determines the color-coding (e.g., Green for Safety) and the Alpha-Bullet (e.g., 'S' for Protocols) that candidates see in their library.
* **Commitment:** Click **"Commit to Library"** to sync the data across the Academy node.

### 4. Archive Oversight

* **Statistics:** Monitor "Archive Statistics" to ensure all mandatory shop manuals are fully ingested.
* **System Health:** Verify the "Storage Status" is **OPTIMAL** before concluding your shift.

---

**WE MOVE NY.**  
*Prometheus Workforce Analytics: Built for humans, by humans.*
next version ready
