# SANKET Bharat
> **From Crisis Signals to Coordinated Response.**

**SANKET Bharat** is an AI-assisted crisis intelligence and response platform designed to organize fragmented incident signals, evaluate emergency information, surface explainable evidence, prioritize high-impact events, and support human-authorized response decisions across disaster-affected regions.

---

## 1. Problem

During large-scale natural hazards and localized emergencies, disaster management authorities face critical operational bottlenecks:

- **Fragmented Emergency Information**: Incident reports arrive asynchronously across disconnected channels (citizen web submissions, phone calls, social feeds, and local monitors) without unified correlation.
- **Duplicate and Noisy Signal Streams**: Multiple callers report the same localized incident with varying descriptions, overwhelming dispatch queues and obscuring isolated, unassisted emergencies.
- **Prioritization Challenges**: Estimating real-time severity, population exposure, and infrastructure risk from raw text reports is difficult without structured decision support.
- **Lack of Explainability in Automated Triage**: Black-box scoring systems fail to build operational trust because emergency dispatchers cannot inspect why an alert was flagged as critical.
- **Need for Human Accountability**: Consequential actions—such as dispatching rescue units, allocating limited supplies, or issuing evacuation advisories—require strict human authority review and an unalterable chain of custody.

---

## 2. Solution

SANKET Bharat establishes a structured, human-governed decision pathway that transforms unstructured emergency signals into validated, accountable crisis response actions.

```
Citizen / External Signal
          ↓
   Incident Intake
          ↓
    AI Evaluation
          ↓
Evidence & Explainability
          ↓
Duplicate / Suspicious Report Triage
          ↓
  Human Authority Review
          ↓
AI Recommendation Approval (Approve / Modify / Reject)
          ↓
Resource Allocation Reasoning
          ↓
Dashboard / Live Map Synchronization
          ↓
      Audit Trail
```

### Core Operating Principle: AI Assists, Authorities Decide
In SANKET Bharat, artificial intelligence functions strictly as an advisory and analytical layer. AI models categorize hazards, calculate initial confidence scores, detect duplicate patterns, and propose resource allocations. **No rescue unit is deployed, no report is permanently dismissed, and no evacuation order is issued without explicit authorization by an authenticated human operator.**

---

## 3. Key Features

| Feature | Implementation in Codebase |
|---|---|
| **Emergency Report Submission** | Accessible at `/report`. A multi-step citizen intake form capturing emergency type (Flood, Fire, Earthquake, Cyclone, Landslide, Other), severity rating, location description, GPS/simulated coordinates, affected population estimate, reporter details, and optional photo attachment. Includes client-side AI preview estimating triage confidence and detecting duplicate proximity in real time. |
| **Shared Incident State** | Implemented via `IncidentProvider` in [`lib/incident-context.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-context.tsx). Synchronizes active incidents, the verification queue, the audit trail, resource metrics, and selection state across all application routes with browser `localStorage` persistence. |
| **Admin Control Center** | Accessible at `/admin`. An operational command center featuring live KPI counters, active incident data tables, quick-action verification triggers, AI decision review panels, resource readiness summaries, live activity feeds, and system alerts. |
| **Verification Queue** | Dedicated triage queue in the Admin Control Center for reviewing unverified citizen reports. Allows dispatchers to evaluate incoming signals, AI confidence indicators, and duplicate counts before taking action. |
| **Human-in-the-Loop Review** | Built into [`components/evidence-explainability.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/components/evidence-explainability.tsx) and [`components/ai-recommendation-approval.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/components/ai-recommendation-approval.tsx). Prevents autonomous execution and enforces review of AI-generated inferences. |
| **Approve / Reject / Modify / Escalate Workflows** | Granular authority actions: operators can **Approve** a recommendation as proposed, **Reject** an ungrounded alert, **Modify** resource allocations and operational directives via an inline editor, or **Escalate** low-confidence signals for field reconnaissance. |
| **Evidence & Explainability** | Renders detailed factor breakdowns and structured supporting evidence items (source, timestamp, location, reliability rating, and supporting/contradicting flags) explaining *why* an incident was classified at a given severity. |
| **Duplicate Report Detection** | Correlates incoming reports against existing incidents, computing duplicate probability scores and providing a one-click *Mark duplicate* consolidation workflow. |
| **Suspicious Report Handling** | Quarantines low-confidence or anomalous submissions into a `Needs Human Review` status, ensuring potential misinformation is investigated without being silently lost. |
| **AI Recommendation Approval** | Interactive review module that explicitly decouples the raw AI proposal from the final human-authorized decision state. |
| **Resource Allocation Reasoning** | "Why this allocation?" analytical panel breaking down decisions by incident severity, affected population, hazard type, distance, standby resource capacity, response priority tier, and key allocation factors. |
| **Audit Trail** | Implemented in [`components/audit-trail.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/components/audit-trail.tsx). A chronological, tamper-evident log capturing timestamp, incident ID, action, actor name and type (AI vs. Human), status transitions, original AI proposal, final human decision, override flags, and operational justifications. |
| **Live Disaster Map** | Accessible at `/live-map`. Interactive vector canvas rendered using `d3-geo` with geographic projection fitted to India state boundaries (`india-states.json`). Displays coordinate-projected incident markers, pulsating priority rings, severity filters, hazard filters, incident detail flyouts, and live alert feeds. |
| **Severity-Based Incident Visualization** | Consistent color-coded visual hierarchy across critical (`#ff4d5e`), high (`#ff9800`), moderate (`#eab308`), and low (`#06b6d4`) severity tiers. |
| **AI Advisory Stream** | Live operational ticker (`AlertFeed`) providing timestamped system updates and severity-tagged advisory notices across the command center. |
| **Dashboard Analytics** | Accessible at `/dashboard`. Data visualizations powered by Recharts: Incident Trend Area Charts, Severity Distribution Donut/Pie Charts, Response Time SLA Bar Charts, and Regional Pressure Heatmaps. |
| **Social-Source Signal Simulation** | Implemented in [`components/social-source-simulation.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/components/social-source-simulation.tsx). Scripted multi-channel signal simulation demonstrating intake across 4 channels (WhatsApp, Instagram, X/Twitter, and Facebook) with an interactive *Link as supporting evidence* action that indexes signals into active incident dossiers. |
| **Multilingual Support** | Implemented via `LanguageProvider` in [`lib/i18n/i18n-context.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/i18n/i18n-context.tsx) and centralized dictionary in [`lib/i18n/translations.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/i18n/translations.ts). Fully supports **English (`en`)** and **Hindi (`hi`)** across navigation, hero, forms, headers, and UI labels. |

---

## 4. Technology Stack

The project is built entirely on modern web technologies without external backend dependencies for the prototype:

### Frontend
- **Framework**: Next.js 16.3.0 (App Router, Turbopack)
- **UI & Runtime**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`, `tailwindcss`, `tw-animate-css`) with custom CSS tokens in `app/globals.css`
- **UI Primitives**: `@base-ui/react` (1.5.0), `shadcn` (4.8.0), `class-variance-authority`, `clsx`, `tailwind-merge`
- **Icons**: `lucide-react` (1.16.0)
- **Charting & Visualizations**: `recharts` (3.10.1)
- **Geospatial Projection**: `d3-geo` (3.1.1) with GeoJSON data (`india-states.json`)
- **3D Graphics**: `three` (0.185.1), `@react-three/fiber` (9.7.0), `@react-three/drei` (10.7.8) for the interactive 3D hero globe
- **Animations**: `framer-motion` (13.0.0) for page transitions, disclosure accordions, and UI motion
- **Analytics**: `@vercel/analytics` (1.6.1)

### State Management
- **React Context API**:
  - `IncidentProvider` ([`lib/incident-context.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-context.tsx)): Shared global incident state, verification queue, audit trail, readiness counters, and dispatcher mutations.
  - `LanguageProvider` ([`lib/i18n/i18n-context.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/i18n/i18n-context.tsx)): Centralized bilingual localization (`en` / `hi`).
- **Client-Side Persistence**: `localStorage` and `sessionStorage` serialization for preserving state across page navigation and reloads.

### Data & Models
- **TypeScript Schemas** ([`lib/incident-types.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-types.ts)):
  - `Incident`: Core schema holding geographical coordinates, disaster type, severity, verification status, AI recommendations, assigned teams, factor lists, and evidence references.
  - `EvidenceItem`: Individual corroborating evidence units with source attribution, timestamps, location metadata, and reliability levels.
  - `AiRecommendation` & `AllocationFactors`: Analytical data structures detailing operational justifications, resource distributions, and risk criteria.
  - `HumanDecision`: Structured record of human authority interventions, approvals, overrides, and timestamps.
  - `AuditEntry`: Schema tracking system and human actions, status deltas, and rationale.
- **Canonical Datasets** ([`lib/incident-data.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-data.ts), [`lib/site-data.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/site-data.ts)): Curated sample incidents across Indian states (Guwahati flood, Puri cyclone, Wayanad landslide, Chamoli cloudburst, etc.), response SLA benchmarks, and regional readiness statistics.

### Build & Development
- **Package Manager**: `npm` (compatible with `pnpm`)
- **Compiler**: TypeScript 5.7.3 (`npx tsc --noEmit`)
- **Bundler**: Next.js Turbopack (`next dev`, `next build`)

---

## 5. Project Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           User Interfaces                               │
│   / (Home)  •  /report  •  /live-map  •  /dashboard  •  /ai-analysis    │
│                     /admin  •  /privacy-policy                          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Shared Incident & I18n Context                       │
│       IncidentProvider (Incidents, Queue, Audit, Resources, Stats)      │
│            LanguageProvider (English / Hindi Translations)              │
│                Local Storage & Session State Layer                      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Incident, Evidence & Decision Models                  │
│       Incident  •  EvidenceItem  •  AiRecommendation  •  HumanDecision  │
│                  ResourceAllocation  •  AuditEntry                      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          Operational Modules                            │
│  Verification Queue • Evidence Explainability • Allocation Reasoning    │
│  D3-Geo India Map • Recharts Visualizations • Three.js 3D Globe Scene   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Audit Trail & Governance                          │
│   Immutable-style chronological log of AI outputs & Human decisions     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Cross-Route Incident Flow
1. **Intake**: A citizen or dispatcher submits a report at `/report`.
2. **Context Dispatch**: `addReport()` generates an incident ID (`INC-XXXX`), calculates initial confidence heuristics, builds an evidence record, appends it to the `verificationQueue`, and logs a new `AuditEntry`.
3. **Queue Triage**: The report instantly appears in `/admin` under the Verification Queue and Incident Management table.
4. **Deep-Dive Analysis**: Clicking *View* navigates to `/ai-analysis?id=INC-XXXX`, loading the incident's exposure models, duplicate probability, and evidence explainability cards.
5. **Human Decision**: Approving, rejecting, or modifying the recommendation in `/admin` or `/ai-analysis` invokes `updateAiRecommendationDecision()` or `verifyQueueItem()`.
6. **State Synchronization**: The incident's status updates across `/live-map` (markers re-rendered at coordinates) and `/dashboard` (KPIs and critical lists recalculated).
7. **Accountability**: Every transition is appended to the `auditTrail` table displayed on `/admin`.

---

## 6. Application Routes

| Route | Purpose |
|---|---|
| `/` | Landing page featuring the platform overview, interactive 3D WebGL globe, architecture walkthrough, features, statistics, and FAQ. |
| `/report` | Citizen emergency report intake interface with dynamic AI triage preview, coordinate geolocation helper, and immediate queue integration. |
| `/live-map` | Fullscreen geospatial disaster intelligence canvas displaying coordinate-projected incidents on India's boundary map, severity filters, hazard filters, and alert stream. |
| `/dashboard` | Executive analytics command center featuring incident volume trends, severity distribution, SLA bar charts, state pressure heatmaps, and critical incident trackers. |
| `/ai-analysis` | Deep-dive analytical workspace for inspecting model confidence, population exposure, duplicate/authenticity integrity checks, evidence explainability, and scripted social signals. |
| `/admin` | Operational human-in-the-loop control room containing the verification queue, incident management table, AI recommendation approval desk, resource overview, and audit trail. |
| `/privacy-policy` | Data governance and privacy disclosure detailing client-side prototype scope versus statutory requirements for future production deployments. |

---

## 7. Incident Lifecycle

```
[Report Created] (/report intake or simulated ingestion)
       ↓
[Pending Human Review] (Status: pending · Verification: Needs Human Review)
       ↓
[Verification / Triage] (Dispatcher evaluates signal in Verification Queue)
       ↓
[AI Analysis & Exposure Evaluation] (Severity assessment, duplicate matching, risk scoring)
       ↓
[Evidence Review] (Inspection of supporting/contradicting corroboration)
       ↓
[AI Recommendation Generated] (Advisory action, resource allocations, operational justification)
       ↓
[Human Authority Decision] (Operator executes: Approved / Rejected / Modified / Escalated)
       ↓
[Resource & Status Update] (Status becomes: dispatched / escalating / monitoring / contained)
       ↓
[Audit Entry Recorded] (Immutable log entry with timestamp, actor, status delta, and reason)
```

### Supported Lifecycle Statuses (from [`lib/incident-types.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-types.ts))
- **Incident Status (`IncidentStatus`)**: `pending` → `escalating` | `dispatched` | `monitoring` → `contained` | `resolved`
- **Verification Status (`VerificationStatus`)**: `Needs Human Review` | `Pending` | `Verified` | `Rejected` | `Duplicate` | `Suspicious` | `Likely Genuine`
- **Human Decision (`HumanDecision['status']`)**: `Pending` | `Approved` | `Rejected` | `Modified`

---

## 8. Data Sources

### Current Prototype Inputs
The current implementation operates on client-side synthetic and user-generated inputs:
- **Citizen Web Intake**: User submissions entered via the `/report` form.
- **Canonical Incident Dataset**: 47 pre-seeded incidents across India with realistic telemetry, impact counts, and evidence factors stored in [`lib/incident-data.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-data.ts).
- **Simulated Social-Source Signals**: Scripted emergency messages representing multi-channel social feeds (WhatsApp, Instagram, X/Twitter, Facebook) in [`components/social-source-simulation.tsx`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/components/social-source-simulation.tsx).
- **Geographic Data**: Static GeoJSON vector boundaries for Indian states (`public/geo/india-states.json`).

### Planned / Future Integrations
*The following external sources represent planned production adapters and are not actively connected in this repository:*
- **GDACS (Global Disaster Alert and Coordination System)**: Automated international disaster telemetry feeds.
- **USGS / NCS Earthquake Feeds**: Real-time seismic sensor and shake-map integration.
- **IMD (India Meteorological Department)**: Cyclone tracks, precipitation radar, and weather warnings.
- **CWC (Central Water Commission)**: Live river gauge telemetry and flood level telemetry.
- **Official Emergency Response Support System (ERSS / 112)**: Direct two-way dispatch gateway with state emergency operations centers.
- **Official WhatsApp Emergency Bot**: Secure, authenticated citizen chatbot intake.

---

## 9. AI / Intelligence Layer

The intelligence layer in the current prototype demonstrates the analytical concepts and user experience required for crisis decision support:

- **Incident Evaluation**: Ingests incident parameters (description length, keywords, hazard category) and outputs confidence scores and priority tiers.
- **Priority & Exposure Indicators**: Calculates risk scores based on affected population figures, infrastructure fragility factors, and escalation trends.
- **Evidence Correlation**: Synthesizes multi-source corroboration (satellite passes, gauge telemetry, camera observations, citizen clusters) into structured support/contradiction ratings.
- **Duplicate & Suspicious Signal Triage**: Analyzes report proximity and text overlap to calculate duplicate probabilities and flag anomalies for manual scrutiny.
- **Explainable Recommendations**: Outlines step-by-step reasoning behind proposed actions rather than returning raw numeric values.
- **Resource Allocation Reasoning**: Evaluates hazard severity, site distance, population scale, and unit availability to propose specific rescue teams and medical units.

> [!NOTE]
> **Prototype Logic vs. Production ML Models**: The current repository implements frontend heuristics, deterministic scoring algorithms, and structured UX mockups to model AI workflows. It does not run live deep-learning inference servers or large multimodal language models. AI outputs represent design demonstrations, and no claims of validated real-world statistical accuracy are made.

---

## 10. Human-in-the-Loop Governance

Consequential emergency operations directly affect human lives, public safety, and critical municipal resources. SANKET Bharat enforces human oversight at every decision boundary:

1. **No Autonomous Dispatch**: AI recommendations remain unexecuted until an authorized operator reviews and approves them.
2. **Authority Controls**:
   - **Approve**: Confirms the AI-generated recommendation and updates the operational dispatch status.
   - **Reject**: Quarantines an ungrounded or erroneous recommendation with recorded justification.
   - **Modify (Override)**: Opens an inline editing buffer allowing the operator to adjust directives, troop counts, or target zones before execution.
   - **Escalate**: Flags low-confidence or conflicting signals for high-priority manual verification.
3. **Traceable Accountability**: Any deviation or override by an operator is tagged as a `Human override` in the audit log.

---

## 11. Auditability & Compliance

Every state change and decision event is logged to the centralized audit trail. Each `AuditEntry` contains the exact fields defined in [`lib/incident-types.ts`](file:///c:/Users/hp/Downloads/disaster-response-platform%20%281%29/lib/incident-types.ts):

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique audit identifier (e.g., `AUD-9010`) |
| `incident` | `string` | Associated incident or report ID (e.g., `INC-4821`) |
| `action` | `string` | Human-readable title of the action taken |
| `actor` | `string` | Identifier or role of the actor (e.g., `Admin · Control Room`) |
| `actorType` | `'AI' \| 'Human'` | Distinguishes automated model events from human authority actions |
| `timestamp` | `string` | Timestamp or relative time of the logged event |
| `previousStatus` | `string` | Lifecycle status prior to the transition |
| `newStatus` | `string` | Resulting lifecycle status after the transition |
| `aiRecommendation` | `string` | Content of the original AI proposal |
| `humanDecision` | `string` | Final action authorized by the human operator |
| `reason` | `string` | Operational justification provided for the decision |
| `isOverride` | `boolean?` | Flag indicating whether the human decision overrode the AI recommendation |

---

## 12. UI & Design System

SANKET Bharat features a high-contrast, dark-mode command center interface designed for operational clarity:

- **Color Language**: Deep navy-slate background (`#050816` / `var(--background)`) paired with high-visibility accents:
  - Cyan (`var(--accent)` / `#06b6d4`): AI insights, telemetry, and primary callouts.
  - Electric Blue (`var(--primary)` / `#3b6cff`): System navigation and primary actions.
  - Emerald Green (`var(--success)`): Verified statuses, active teams, and high reliability indicators.
  - Amber (`var(--warning)`): Warnings, moderate severity, and pending human reviews.
  - Coral Red (`var(--danger)` / `var(--destructive)`): Critical emergencies and urgent alerts.
- **Glassmorphism & Surface Depth**: Subtle translucent card panels (`.glass`, `.glass-hover`, backdrop blur) with thin neon borders (`border-border/70`).
- **Typography**: Clean, geometric typography utilizing **Geist Sans** for UI legibility and **Geist Mono** for timestamps, incident IDs, telemetry, and coordinates.
- **Micro-Animations**: Staggered scroll reveals, glowing interactive pills, animated metric counters, and smooth drawer transitions via Framer Motion.
- **Interactive Visualizations**: High-performance 3D Earth scene rendered via Three.js/R3F on the landing page and an SVG Mercator-projected map of India with interactive pin selection on the Live Map.

---

## 13. Folder Structure

```
disaster-response-platform/
├── app/                               # Next.js App Router pages and layout
│   ├── admin/                         # /admin - Command center & verification queue
│   │   └── page.tsx
│   ├── ai-analysis/                   # /ai-analysis - Deep-dive analysis & evidence
│   │   └── page.tsx
│   ├── dashboard/                     # /dashboard - Analytics & SLA charts
│   │   └── page.tsx
│   ├── live-map/                      # /live-map - Geospatial incident canvas
│   │   └── page.tsx
│   ├── privacy-policy/                # /privacy-policy - Data governance disclosure
│   │   └── page.tsx
│   ├── report/                        # /report - Emergency intake form
│   │   └── page.tsx
│   ├── globals.css                    # Design system tokens and custom utilities
│   ├── layout.tsx                     # Root layout, persistent navbar, footer & providers
│   └── page.tsx                       # Landing page (hero, features, workflow, stats, FAQ)
├── components/                        # Reusable UI components
│   ├── dashboard/                     # Command header, Recharts widgets, critical lists
│   │   ├── charts.tsx
│   │   ├── command-header.tsx
│   │   ├── critical-incidents.tsx
│   │   └── widget.tsx
│   ├── globe/                         # Three.js / React Three Fiber 3D globe
│   │   ├── globe-scene.tsx
│   │   └── globe.tsx
│   ├── map/                           # D3-Geo canvas, markers, filters, legend & feed
│   │   ├── alert-feed.tsx
│   │   ├── incident-detail.tsx
│   │   ├── incident-marker.tsx
│   │   ├── india-map-canvas.tsx
│   │   ├── map-filters.tsx
│   │   └── map-legend.tsx
│   ├── motion/                        # Framer Motion reveal wrappers & background glow
│   │   ├── ambient-background.tsx
│   │   ├── counter.tsx
│   │   ├── cursor-glow.tsx
│   │   ├── preloader.tsx
│   │   └── reveal.tsx
│   ├── sections/                      # Landing page sections (hero, features, how-it-works)
│   ├── ui/                            # Buttons, cards, tabs, accordions & badges
│   ├── ai-recommendation-approval.tsx # Recommendation review & allocation reasoning
│   ├── audit-trail.tsx                # Logged decision history & accountability table
│   ├── evidence-explainability.tsx    # Factor breakdown & supporting evidence cards
│   ├── language-selector.tsx          # Bilingual language switcher (EN / हिन्दी)
│   ├── navbar.tsx                     # Responsive navigation bar with mobile drawer
│   ├── report-verification-workflow.tsx # Verification pathway & queue actions
│   └── social-source-simulation.tsx   # Scripted multi-channel social signal stream
├── lib/                               # Application state, data & utilities
│   ├── i18n/                          # Internationalization context & translation dicts
│   │   ├── i18n-context.tsx
│   │   └── translations.ts
│   ├── geo.ts                         # 3D spherical trigonometry & arc helpers
│   ├── incident-context.tsx           # React Context for incident state & actions
│   ├── incident-data.ts               # Canonical incident, queue & audit seed datasets
│   ├── incident-types.ts              # TypeScript interfaces and type definitions
│   ├── india-map.ts                   # D3 Mercator projection & mapping helpers
│   ├── site-data.ts                   # Static landing page content & SLA metrics
│   └── utils.ts                       # Class merging utility (clsx + tailwind-merge)
├── public/                            # Static assets
│   ├── geo/
│   │   └── india-states.json          # India state boundary GeoJSON for d3-geo map
│   └── textures/
│       └── earth-map.png              # 3D globe surface texture
├── next.config.mjs                    # Next.js build configuration
├── package.json                       # Project dependencies and npm scripts
├── postcss.config.mjs                 # PostCSS & Tailwind configuration
└── tsconfig.json                      # TypeScript configuration
```

---

## 14. Installation & Setup

### Prerequisites
- **Node.js**: Version 18.18.0 or later (Node.js 20+ recommended)
- **Package Manager**: `npm` (version 9+) or `pnpm` (version 8+)

### 1. Clone the Repository
```bash
git clone https://github.com/[your-org]/disaster-response-platform.git
cd disaster-response-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Type Checking
```bash
npx tsc --noEmit
```

### 5. Production Build
```bash
npm run build
npm run start
```

### Environment Variables
The current client-side prototype requires **no mandatory environment variables** to run. All mock data, maps, and state management operate in-browser.

---

## 15. Current Prototype Scope & Limitations

To maintain technical integrity and transparency, the current repository scope and boundaries are outlined below:

- **Client-Side State Management**: Application state resides in memory and browser `localStorage`/`sessionStorage`. Clearing browser storage restores default canonical datasets.
- **Synthetic Datasets**: The 47 pre-configured incidents, timeline checkpoints, and readiness counters are synthetic scenarios created to demonstrate user experience and operational flows.
- **Simulated Signal Feeds**: The multi-channel social stream simulates incoming WhatsApp, Instagram, X, and Facebook messages; it does not connect to live social media APIs.
- **No Live External Telemetry**: Sensor readings (e.g., river water levels, seismic sensors) and satellite overlays are pre-configured demonstrations, not real-time feeds.
- **Non-Operational Prototype**: The platform is **not connected to live emergency dispatch networks (112, 101, 108, or NDRF)**. It must not be used for reporting real-world emergencies.

---

## 16. Production Evolution

Deploying SANKET Bharat into an active government or municipal emergency operations center would require the following production architecture:

```
[Citizen Apps / 112 / WhatsApp / IMD / CWC Feeds]
                        │
                        ▼ (TLS 1.3 / API Gateway)
┌─────────────────────────────────────────────────────────────┐
│             Event Ingestion & Message Broker                │
│                 (Apache Kafka / RabbitMQ)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          Microservices & ML Inference Pipelines             │
│   • NLP Hazard Classification & Duplicate Clustering         │
│   • Geospatial Geohashing & Anonymization                   │
│   • Computer Vision Damage Assessment (EXIF-stripped)       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│        Persistent Distributed Database & Storage            │
│   • PostgreSQL (PostGIS) for spatial incident tracking      │
│   • S3-Compatible Encrypted Object Store (AES-256)          │
│   • Redis for live caching & WebSocket pub/sub              │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               Authority Web Command Center                  │
│   • Role-Based Access Control (RBAC) & SSO (Gov/SAML)       │
│   • Tamper-evident, cryptographically signed audit logs     │
│   • Real-Time WebSockets for multi-operator sync            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│             Emergency Dispatch Gateway                      │
│   • CAP (Common Alerting Protocol) broadcast broadcast      │
│   • ERSS 112 / SDMA CAD (Computer Aided Dispatch) API       │
└─────────────────────────────────────────────────────────────┘
```

1. **Persistent Backend & Database**: High-availability PostgreSQL cluster with PostGIS extensions for spatial queries, replacing in-browser context storage.
2. **Authentication & RBAC**: Multi-factor authentication and strict Role-Based Access Control (Super Admin, District Emergency Officer, Field Responder, Read-Only Observer).
3. **Event-Driven Ingestion**: Scalable message broker (Kafka or RabbitMQ) capable of processing tens of thousands of incoming signals per minute during severe crises.
4. **Validated ML Pipeline**: Production-grade models trained on historical disaster datasets, evaluated under human oversight, and hosted on dedicated inference endpoints.
5. **Secure Media & Telemetry Pipelines**: Automatic PII redaction, face/license plate blurring, and EXIF metadata sanitization upon image ingestion.
6. **CAD & ERSS Integration**: Direct integration with National Emergency Response Support System (ERSS 112) for dispatching field units.

---

## 17. Security, Privacy & Data Governance

The architecture is built around data protection principles:

- **Citizen Data Minimization**: Intake forms collect only information necessary for emergency triage.
- **Ephemeral Storage in Prototype**: No citizen data entered in the prototype leaves the user's browser.
- **Geospatial Privacy**: High-precision coordinates should be restricted to verified field dispatchers, while public-facing dashboards aggregate data into generalized regional heatmaps.
- **Tamper-Evident Auditing**: All consequential actions must be permanently logged with operator ID, timestamp, and justification to support post-incident analysis.
- **Responsible AI Transparency**: Explanations accompany all AI inferences to prevent uncritical reliance on automated outputs.

---

## 18. Demonstration Flow

To experience the complete end-to-end workflow of SANKET Bharat:

1. **Submit an Incident**:
   - Navigate to `/report`.
   - Select an emergency hazard (e.g., *Flood*), select severity (*Critical*), enter location (*Guwahati, Assam*), and provide a description.
   - Observe the real-time AI confidence preview and click **Submit Emergency Report**.
2. **Inspect in Admin Control Center**:
   - Navigate to `/admin`.
   - Locate the newly submitted report at the top of the **Verification Queue**.
   - Note the unverified status and pending human review badge.
3. **Review Inferences & Evidence**:
   - Navigate to `/ai-analysis` (or click *Inspect* from the Admin table).
   - Review the AI confidence score, population exposure estimates, duplicate probability check, and step-by-step decision explanation.
   - Expand the **Supporting Evidence** panel to inspect corroborated sensor and citizen telemetry.
4. **Link Social Evidence**:
   - On `/ai-analysis`, view the **Social Source Signals** panel.
   - Click **Link as supporting evidence** on a relevant simulated signal (e.g., WhatsApp or X/Twitter).
5. **Authorize Recommendation**:
   - In the **AI Recommendation Approval** panel, review the proposed operational directive and resource breakdown.
   - Choose to **Approve**, **Reject**, or **Modify** the action plan.
6. **Verify State Updates**:
   - Open `/live-map` to observe the incident marker projected onto India's geographic map.
   - Open `/dashboard` to inspect updated KPI aggregates, severity pie charts, and SLA graphs.
7. **Inspect the Audit Trail**:
   - Return to `/admin` and scroll to the **Audit Trail**.
   - Verify that your action, role, previous status, new status, original AI recommendation, and operational reason were logged.

---

## 19. Codebase Verification

The codebase has been verified against TypeScript and Next.js production build checks:

- **TypeScript Compilation (`npx tsc --noEmit`)**:
  - **Status**: Passed (0 errors, clean compile)
- **Production Build (`npm run build`)**:
  - **Status**: Compiled successfully with Next.js 16.3.0 (Turbopack)
  - **Routes Prerendered**:
    - `○ /` (Homepage)
    - `○ /admin` (Admin Control Center)
    - `○ /ai-analysis` (AI Analysis & Evidence)
    - `○ /dashboard` (Analytics Dashboard)
    - `○ /live-map` (National Disaster Map)
    - `○ /privacy-policy` (Data Governance Policy)
    - `○ /report` (Emergency Submission Flow)
    - `○ /_not-found` (404 Page)

---

## 20. Future Roadmap

- [ ] **Phase 1: External Telemetry Ingestion**
  - Integrate live REST and WebSocket feeds from GDACS, USGS, and IMD.
- [ ] **Phase 2: Production Backend & Persistence**
  - Implement a PostgreSQL/PostGIS database layer with Prisma or Drizzle ORM.
  - Implement RBAC authentication for disaster management personnel.
- [ ] **Phase 3: Real-Time Event Bus**
  - Add WebSocket support for real-time multi-operator synchronization across command desks.
- [ ] **Phase 4: Multilingual Expansion**
  - Expand translation dictionaries across additional scheduled languages (Bengali, Tamil, Telugu, Marathi, Odia, Assamese).
- [ ] **Phase 5: Emergency System Handshake**
  - Implement CAP (Common Alerting Protocol) export adapters for integration with State Emergency Operations Centres (SEOC).

---

## 21. Repository & Demo Links

- **GitHub Repository**: `[Add repository URL]`
- **Live Platform Demo**: `[Add deployment URL]`
- **Demonstration Video**: `[Add video URL]`

---

## 22. Disclaimer

> **SANKET Bharat is an AI-assisted crisis intelligence and response prototype.**
> AI outputs are intended to support, not replace, authorized human decision-making. External data integrations, live sensor feeds, and production infrastructure are future deployment components unless explicitly implemented in this repository. SANKET Bharat is not connected to active 112/108 emergency dispatch networks.
