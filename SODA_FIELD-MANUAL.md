# 🛡️ S.O.D.A. OPERATIONAL FIELD MANUAL

**Surface Operations Dispatcher Academy (NYC DOT)**

This manual contains the standard operating procedures for the Transit Tutor platform. Personnel are required to familiarize themselves with their respective directives.

---

## 🧑‍✈️ CANDIDATE FIELD MANUAL

**Objective:** Operational readiness and protocol mastery.

### 1. TERMINAL ACCESS

* **Initialization:** Register your unique Academy ID via the "Register" portal.
* **Rank Progression:** All telemetry (XP and scores) is logged locally. Advancing your rank increases your standing in the Academy Leaderboard.

### 2. THE SYSTEM MONITOR (Dashboard)

* **Telemetry Graph:** Tracks your historical readiness. Ensure your trajectory remains positive.
* **Core Performance Indices:** Monitor your proficiency in Radio Codes, Protocol Compliance, and Safety Standards.
* **Mission Log:** Check for active weekly directives. Completion of these tasks provides critical XP boosts.

### 3. TACTICAL SIMULATION (Quiz)

* **Simulate Tab:** Select a topic node (e.g., Snow Emergency, 10-Codes).
* **The Sequence:** Complete the 5-part scenario chain.
* **Reference Nodes:** After each response, study the **Reference Data Node**. These are direct excerpts from the DOT master manual.

### 4. TACTICAL LIAISON (AI Chat)

* **Data Node Selection:** You must select a specific category (ADMIN, RADIO, S.O.D.A, etc.) before querying.
* **Contextual Logic:** The Liaison answers based on the selected manual section to ensure accurate shop-floor responses.

---

## ⚡ COMMAND LEVEL DIRECTIVE (Admin)

**Objective:** Ingestion, validation, and training oversight.

### 1. COMMAND AUTHORIZATION

* **Access Level:** To unlock Admin tools, register with a username containing the string `admin`.

### 2. PROTOCOL INGESTION PIPELINE

* **The Parser:** Use the external `parseManuals()` script to extract data from shop PDFs.
* **The CSV:** Upload the generated `sts_master_data.csv` (headers: `title`, `content`) via the **Command Center**.

### 3. BATCH VALIDATION

* **Review Queue:** Extracted chunks must be reviewed for accuracy before being pushed to the live Library.
* **Classification:** Assign categories to chunks to determine their color-coding (e.g., Blue for Radio, Orange for S.O.D.A.).
* **Commit:** Clicking "Commit to Library" pushes the protocols to all active Candidate terminals.

### 4. TELEMETRY OVERSIGHT

* **Archive Stats:** Monitor the "Total Library Chunks" to ensure the Academy database is comprehensive.
* **Compliance Status:** Ensure "Storage Status" remains **OPTIMAL** to avoid data corruption in the simulation layer.

---

**WE MOVE NY.**
*Prometheus Workforce Analytics: Using AI to keep humans Employed.*
