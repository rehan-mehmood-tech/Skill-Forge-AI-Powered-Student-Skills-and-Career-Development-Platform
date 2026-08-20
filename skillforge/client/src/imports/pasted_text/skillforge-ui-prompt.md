✦ SKILLFORGE: COMPLETE SYSTEM-WIDE UI/UX FRONTEND GENERATION PROMPT
Target Framework: Production-Grade Desktop Web Application (SaaS Architecture)
Design Standard: Swiss Typography × Technical Infrastructure (Linear, Raycast, Vercel standard)
PRD Reference: PRD.md Section 6 (Frontend UI/UX Specification & Page Hierarchies)

══════════════════════════════════════════════════════════════
1. GLOBAL DESIGN TOKENS & SYSTEM ANTI-RULES (LOCKED)
══════════════════════════════════════════════════════════════
- Background Canvas: Pure Pitch Dark `#09090B` (Canvas lowest layer)
- Surface / Cards: Dark Zinc `#121215` with crisp 1px hairline border `#27272A` (Hover: `#18181B`)
- Dividers & Sub-borders: `#1C1C1F`
- Primary Typography: `Inter` (Off-white `#FAFAFA` for H1/H2/Labels, Slate `#A1A1AA` for body, Muted `#52525B` for captions)
- Metrics & Code Elements: `JetBrains Mono` for percentages, countdown timers, vectors, and status badges
- CTA Primary Button: Solid pure white `#FFFFFF` background with pitch black `#000000` text (font-semibold, rounded-lg)
- CTA Secondary Button: `#18181B` background, 1px border `#27272A`, `#E4E4E7` text
- Semantic Status Colors:
  * Green (`#22C55E`): Verified/Passed/Done
  * Red (`#EF4444`): Critical Gap/Error/Alert
  * Amber (`#F59E0B`): In-Progress/Warning/Intermediate
  * Indigo (`#6366F1`): Focus rings & active navigation left indicators ONLY
- Strict Anti-Glow Rule: ZERO colorful blur/gradients, zero glowing shadows, zero rounded corners above 12px (rounded-xl max).
- Layout Rule: Desktop-First (1440px canvas). Fix sidebar to 240px width (`sticky`, `min-h-screen`). Copilot Drawer MUST be an isolated sliding overlay (`z-50`), NEVER rendered inline breaking page content.

══════════════════════════════════════════════════════════════
2. COMPLETE MULTI-VIEW GENERATION SPECIFICATION
══════════════════════════════════════════════════════════════

Generate the complete set of views defined in PRD Section 6.2 with clear visual routing:

──────────────────────────────────────────────────────────────
VIEW 1: LANDING & AUTH FLOW (`/` & `/auth/login`, `/auth/register`)
──────────────────────────────────────────────────────────────
- TopNav: 52px height, 1px bottom border `#27272A`. Wordmark "SKILLFORGE" + `[v1.0]` mono tag. Nav links: Features, Curriculum, Mentors, Docs. Actions: "Sign In", "Get Started" (white CTA).
- Hero Section:
  * Overline: `ENGINEERING CAREER INFRASTRUCTURE` with horizontal hairline rule.
  * Two-Line Desaturated Stack: "Quantify Your Skill Gap." (`#FAFAFA`) / "Close It Systematically." (`#A1A1AA`).
  * CTAs: "Audit Skills →" (White CTA) and "View Live Demo" (Bordered Zinc).
- Technical IDE Preview Container: Split panel terminal. Left: raw skill signals; Right: evaluated target role delta output with syntax-colored JetBrains Mono output.
- Segmented Auth Modal: Role selector pill toggle (`[Student]` vs `[Mentor / Admin]`). Email, Password inputs (`#18181B`), full-width "Continue →" CTA.

──────────────────────────────────────────────────────────────
VIEW 2: STUDENT ONBOARDING STEPPER (`/onboarding`)
──────────────────────────────────────────────────────────────
- 3-Step Centered Stepper: 1. Target Role Selection → 2. Resume Upload/Parse → 3. Baseline Self-Declaration.
- Target Role Grid: Selection cards (e.g., Backend Developer, AI Engineer, DevOps Engineer, Full Stack) with active border ring `#FAFAFA`.
- Resume Drag-and-Drop Dropzone: Dashed `#27272A` border with Lucide `UploadCloud` icon and mono tag `[PDF/DOCX max 5MB]`.

──────────────────────────────────────────────────────────────
VIEW 3: STUDENT COMMAND DASHBOARD (`/dashboard`)
──────────────────────────────────────────────────────────────
- Persistent Sidebar (240px): Brand header, Nav items (`Dashboard`, `Assessments`, `Roadmap`, `Copilot`, `Profile`), user footer with name and `[student]` mono badge.
- Main Area Header: "Welcome back, Aisha", Target Role Dropdown (`Backend Developer ↓` with `[62% ready]` amber badge), and "Take Assessment" action button.
- Top Metric Grid (2 Columns, `gap-6`):
  * Card A (Overall Readiness): Mono readout `62%`, precision 4px flat progress bar, label `38% gap to target`.
  * Card B (Skill Matrix Table): 6 discrete rows (Python, Web, Git, DevOps, AI, Databases). Each row has domain name, 4px track with current fill & 1px required marker line, numerical score (`0.79`), and Delta Badge (`[+0.01]` or `[-0.38]`).
- Bottom Grid (2 Columns, `gap-6`):
  * Card C (Active Roadmap Mini-Stepper): Vertical 4-node summary with node states (Done `#FAFAFA`, Active ring `#6366F1`, Pending `#27272A`) and "View full roadmap →" link.
  * Card D (Recent Assessments Table): Domain badge, score mono, completion date, and status tags (`[Completed]`, `[In Progress]`).

──────────────────────────────────────────────────────────────
VIEW 4: ASSESSMENT DOMAIN PICKER (`/assessments`)
──────────────────────────────────────────────────────────────
- Header: "Verified Skill Benchmarks" with subtitle "Select a technical domain to evaluate your baseline competency."
- 6 Bento Domain Cards: Python OOP, Web Development, Git & Workflows, Cloud & DevOps, AI & Foundations, Database Engineering.
- Each Card contains: Question count (`12 Questions`), Time limit (`30m`), difficulty tag (`[Intermediate]`), previous score readout, and CTA "Begin Assessment →".

──────────────────────────────────────────────────────────────
VIEW 5: DYNAMIC TIMED QUIZ INTERFACE (`/assessments/:id/take`)
──────────────────────────────────────────────────────────────
- Distraction-Free Layout: No sidebar. Top 3px fixed white progress bar.
- Topbar: `[Python Assessment]` badge, Question counter `Question 04 / 12`, center Countdown Timer `27:43` (JetBrains Mono 700, amber when <5m, red when <1m), right "Exit" link.
- Question Card (720px max-width centered): Difficulty tag row (`[Weight: 1.5x]`, `[Intermediate]`), Question text in clean Inter 500 18px.
- Answer Options (A, B, C, D): Distinct `#18181B` cards with left radio indicator, hover border lift, selected state (`#FAFAFA` border), and bottom autosave badge `[autosaved 0.3s ago]`.
- Bottom Navigation: "← Previous" secondary button, "Save & Next →" primary white CTA.

──────────────────────────────────────────────────────────────
VIEW 6: ASSESSMENT RESULTS & DELTA BREAKDOWN (`/assessments/:id/results`)
──────────────────────────────────────────────────────────────
- Summary Card: Large Score readout `78.5%` (`0.79 / 1.00`), Domain tag, breakdown of correct vs incorrect answers.
- Skill Vector Impact Callout: Visual indicator showing profile vector update (`Python: 0.65 → 0.79`).
- Next Action CTA: "View Updated Roadmap →" and "Review Incorrect Explanations".

──────────────────────────────────────────────────────────────
VIEW 7: INTERACTIVE VERTICAL TIMELINE ROADMAP (`/roadmap`)
──────────────────────────────────────────────────────────────
- Header: Target Role benchmark "Backend Developer", Readiness score `62%`, actions: "Regenerate Roadmap", "Export PDF".
- Full Vertical Stepper: 1px continuous spine line `#27272A`.
- 4 Sequential Phases: Phase 01: Foundations → Phase 02: Core Systems → Phase 03: Applied Architecture → Phase 04: Capstone.
- Collapsible Topic Nodes: Expand/collapse toggle, Topic Title, Optimistic Status Toggle pill (`[Pending]`, `[In Progress]`, `[Done]`).
- Expanded Content:
  * Projects Section: Project Brief chips with hover preview (e.g., `Build a Multi-Threaded Cache Engine`).
  * Learning Resources: Resource rows with type tags (`[course]`, `[docs]`, `[article]`) and external launch icons `↗`.

──────────────────────────────────────────────────────────────
VIEW 8: AI CAREER COPILOT DRAWER & FULL-PAGE VIEW (`/copilot`)
──────────────────────────────────────────────────────────────
- Right-Anchored Drawer (400px width, `z-50`, fixed full height, 1px left border `#27272A`, `#0F0F12` background):
  * Header: "Career Copilot" with `● online` green pulse and close `✕` icon.
  * Chat Message Stream: User bubbles (right-aligned `#18181B`), Copilot responses (flush left text).
  * Agent Tool Trace Block: JetBrains Mono terminal block showing live executions (`> invoking calculate_gap...`, `> searching pgvector knowledge base...`, `✓ 3 tools completed in 1.2s`).
  * Grounded Citations: Clickable resource badges (`[↗ Backend Roadmap 2026]`).
  * Input Bar: Fixed bottom input with monospace placeholder "Ask about your skill gaps..." and send button `↵`.

──────────────────────────────────────────────────────────────
VIEW 9: STUDENT PROFILE & RESUME MANAGEMENT (`/profile`)
──────────────────────────────────────────────────────────────
- Profile Overview: Avatar upload, Full Name, Email, Bio, Experience Level.
- Resume Parsing Section: Active uploaded file badge, "Re-upload Resume" button, extracted skill chips list (`python`, `express`, `docker`, `postgresql`).
- Complete Skill Vector Inspector: Direct readouts of stored JSONB vector.

──────────────────────────────────────────────────────────────
VIEW 10: MENTOR & ADMIN COMMAND PANEL (`/admin/students` & `/admin/resources`)
──────────────────────────────────────────────────────────────
- Admin Topbar: Global stats (Total Enrolled Students, Average Cohort Readiness, Critical Gap Areas).
- Student Audit Directory Table: Filterable data table with columns: Student Name, Email, Target Role, Overall Readiness Progress Bar, Last Assessment Date, Action ("Inspect Profile →").
- Student Deep-Dive Drawer/Modal: Read-only access to student skill radar, complete roadmap status, and a "Send Recommendation Note" rich text input.
- Learning Resource CRUD Manager: Table of verified curriculum resources with Add/Edit/Delete actions and domain tagging.

══════════════════════════════════════════════════════════════
3. STRUCTURAL INTEGRITY DIRECTIVE
══════════════════════════════════════════════════════════════
- No overlapping components: Every section must use strict Auto-Layout frames with explicit vertical/horizontal padding.
- Ensure all screens are fully interconnected via sidebar links and primary CTA buttons.