✦ SKILLFORGE: LANDING PAGE STORYTELLING, HERO TEXT ANIMATIONS & ADAPTIVE PERSONALIZATION DIRECTIVE

Upgrade the Landing Page and State Architecture to feature rich, narrative-driven content for general Computer Science students, dynamic text animations, and role-based personalization upon login.

══════════════════════════════════════════════════════════════
1. HERO SECTION: MULTIPLE TEXT ANIMATIONS & GENERALIZED CS HOOK
══════════════════════════════════════════════════════════════

● ROTATING DYNAMIC TYPEWRITER HEADLINE:
  - Line 1 (Static, Crisp White #FAFAFA): 
    "From Generalist CS Student To"
  - Line 2 (Dynamic Rotating Animated Text with Terminal Cursor `▋`):
    Cycle between the following target tracks (staggered 2.5s loop with smooth character reveal):
    1. `Production Backend Engineer.`
    2. `Applied AI & ML Specialist.`
    3. `Cloud & DevOps Architect.`
    4. `Full-Stack Systems Developer.`
  - Sub-Headline (Generalized CS Storytelling, #A1A1AA, max-w-2xl):
    "CS degree programs teach syntax and algorithms, but tech hiring evaluates production readiness. SkillForge identifies your exact technical blind spots across System Architecture, Cloud, Databases, and AI — then generates a personalized, grounded execution roadmap."

● HERO CALL-TO-ACTION & LIVE VECTOR SIMULATOR:
  - Dual CTAs: "Audit Your Skillset →" (Solid white #FFFFFF button) and "Explore 2026 CS Benchmarks" (Bordered zinc #18181B).
  - Generalized Terminal Code Preview Widget (`cs_competency_audit.py`):
    Display a realistic, multi-domain evaluation preview across common core CS pillars:
    ```python
    # Target Evaluation: Engineering Competency Matrix
    student_profile = {
        "core_cs_foundations": 0.82,  # Algorithms, DS, Memory
        "system_architecture": 0.35,  # APIs, Concurrency [CRITICAL GAP]
        "cloud_infrastructure": 0.20, # Docker, CI/CD, K8s [CRITICAL GAP]
        "modern_databases":    0.48,  # Indexing, Query Optimization
        "applied_ai_systems":  0.15   # Embeddings, Vector Search [GAP]
    }
    status = "Diagnosis Complete: 48% Readiness Delta Detected"
    ```

══════════════════════════════════════════════════════════════
2. EXPANDED STORYTELLING SECTIONS (DEEP NARRATIVE ARC)
══════════════════════════════════════════════════════════════

Add 3 structured, high-density editorial storytelling sections below the Hero:

● SECTION 1: THE CS GRADUATE DILEMMA (THE DUAL TRAPS)
  - Bento Grid (2 Cards) contrasting the realities of CS education:
    * Card A (The Shallow Generalist): "10 different 2-hour crash courses on YouTube, 5 half-finished starter apps, 0 understanding of deployment, indexing, or unit testing."
    * Card B (The Over-Specialized Novice): "Mastered basic frontend framework syntax, but unable to configure a reverse proxy, debug an N+1 database query, or write concurrent Python code."
  - Value Anchor: "SkillForge replaces guesswork with deterministic skill-gap quantification."

● SECTION 2: THE 4-PILLAR METHODOLOGY (HOW IT WORKS)
  - Step 01: Multi-Domain Benchmarking (Dynamic, weighted assessments across 6 core technical verticals).
  - Step 02: Deterministic Gap Analysis (Mathematical vector delta calculation against verified industry job requirements).
  - Step 03: Phased Interactive Roadmap (A structured sequence: Foundations → Core Systems → Applied Engineering → Capstone).
  - Step 04: Grounded AI Copilot (An autonomous RAG agent citing technical documentation rather than hallucinating generic advice).

● SECTION 3: SOCIAL PROOF & STATS BANNER
  - Metric 01: `6 Core Domains` (Python, Web, Git, DevOps, AI, Databases)
  - Metric 02: `Zero Hallucinations` (Grounded in curated engineering roadmaps)
  - Metric 03: `SDG 4 & 8 Aligned` (Bridging the university-to-workplace transition)

══════════════════════════════════════════════════════════════
3. ADAPTIVE PERSONALIZATION ARCHITECTURE (PUBLIC VS LOGGED-IN)
══════════════════════════════════════════════════════════════

Implement conditional UI rendering based on the user's authentication and onboarding state:

● STATE A: PUBLIC / UNLOGGED VISITOR
  - Landing page shows broad, universal CS engineering messaging, generalized code snippets, and standard "Sign In / Register" CTAs.

● STATE B: LOGGED-IN & TARGET ROLE CONFIGURED (PERSONALIZED EXPERIENCE)
  - If the student selects a specific career goal during onboarding (e.g., `AI Engineer` or `Backend Developer`):
    1. Navigation Bar adapts: Displays a live personalized status badge `[Active Track: {target_role}]` and user avatar.
    2. Hero / Welcome Banner morphs: Dynamically updates to "Welcome back, {full_name}. Here is your customized sprint toward {target_role}."
    3. Live Gap Card adapts: The code widget automatically switches from general CS foundations to the user's specific skill vector (e.g., showing exact Python, PyTorch, pgvector scores for AI Engineer).
    4. Primary CTA shifts: Converts from "Audit Your Skillset" to "Resume Phase {active_phase}: {phase_title} →".