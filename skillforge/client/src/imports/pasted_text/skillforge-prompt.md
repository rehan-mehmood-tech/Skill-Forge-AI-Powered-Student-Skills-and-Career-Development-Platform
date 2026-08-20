# SkillForge — Master UI/UX & Figma Generation Prompt
**Design System Version 1.0 | Swiss-Technical Aesthetic | Production-Ready**

---

## PART 1 — FIGMA MAKE MASTER PROMPT

> Paste the block below directly into Figma AI (✦ Make). Each section is a self-contained frame brief.

---

```
✦ SKILLFORGE DESIGN SYSTEM — FIGMA MAKE MASTER PROMPT
Swiss Typography × Technical Developer Dashboard Aesthetic
Comparable references: Linear.app, Vercel Dashboard, Raycast

══════════════════════════════════════════════════════════════
DESIGN TOKENS (LOCKED — DO NOT DEVIATE)
══════════════════════════════════════════════════════════════

COLOR PALETTE:
  Canvas:           #09090B  — page background, deepest layer
  Surface 1:        #121215  — card backgrounds, panels
  Surface 2:        #18181B  — hover states, secondary cards
  Border Primary:   #27272A  — hairline 1px borders everywhere
  Border Subtle:    #1C1C1F  — section dividers
  Text Primary:     #FAFAFA  — headlines, primary labels
  Text Secondary:   #A1A1AA  — body copy, descriptions
  Text Muted:       #52525B  — metadata, timestamps
  CTA Primary:      #FFFFFF bg + #000000 text  — primary actions
  CTA Secondary:    #18181B bg + #27272A border + #E4E4E7 text
  Semantic Green:   #22C55E  — passed, ready, done
  Semantic Red:     #EF4444  — gap, critical, failed
  Semantic Amber:   #F59E0B  — in-progress, warning
  Accent Indigo:    #6366F1  — active selection ring, focus indicator ONLY (never fills)

ANTI-RULES (CRITICAL):
  - ZERO gradients on backgrounds or cards
  - ZERO glow effects, bloom, or colorful shadows
  - ZERO drop shadows except box-shadow: 0 0 0 1px #27272A (border-only)
  - ZERO rounded corners above 12px (rounded-xl maximum)
  - ZERO decorative illustrations or blobs

TYPOGRAPHY:
  Display / H1:  Inter 700 — 48px / line-height 52px / tracking -0.02em
  H2:            Inter 600 — 32px / line-height 38px / tracking -0.015em
  H3:            Inter 600 — 20px / line-height 28px / tracking -0.01em
  H4 / Label:    Inter 500 — 14px / line-height 20px / tracking 0.02em UPPERCASE
  Body:          Inter 400 — 14px / line-height 22px
  Caption:       Inter 400 — 12px / line-height 18px / color #52525B
  Mono/Score:    JetBrains Mono 500 — 13px — for all numbers, code, system tags, percentages
  Mono/Display:  JetBrains Mono 700 — 32px — for primary metric readouts

SPACING SYSTEM (4px grid):
  xs: 4px | sm: 8px | md: 12px | base: 16px | lg: 24px | xl: 32px | 2xl: 48px | 3xl: 64px

COMPONENT ATOMS:
  Badge/Tag:    height 22px | px 8px | rounded-md | border 1px #27272A | mono 11px
  Button/CTA:   height 36px | px 16px | rounded-lg | Inter 500 14px
  Card:         rounded-xl | border 1px #27272A | bg #121215 | p-6
  Input:        height 36px | px 12px | rounded-lg | border 1px #27272A | bg #18181B
  Divider:      1px solid #27272A

══════════════════════════════════════════════════════════════
VIEW 1: LANDING PAGE & AUTH FLOW
Frame: 1440 × 900px desktop
══════════════════════════════════════════════════════════════

NAVBAR (height: 52px, border-bottom: 1px #27272A, bg: #09090B/80 backdrop):
  LEFT: Wordmark "SKILLFORGE" in Inter 600 14px #FAFAFA, tracking 0.1em
        followed by mono tag "[v1.0]" in JetBrains Mono #52525B 11px
  RIGHT: Text links "Features", "For Mentors", "Docs" — Inter 400 13px #A1A1AA
         Divider 1px #27272A
         "Sign In" — CTA Secondary button
         "Get Started" — CTA Primary button (white bg)

HERO SECTION (py: 96px, max-width: 960px, centered):
  OVERLINE: "ENGINEERING CAREER INFRASTRUCTURE"
            Inter 500 11px #52525B tracking 0.15em uppercase
            preceded by a 16px horizontal rule (#27272A)

  HEADLINE (mt: 16px):
    Line 1: "Quantify Your Skill Gap." — Inter 700 56px #FAFAFA tracking -0.02em
    Line 2: "Close It Systematically." — Inter 700 56px #A1A1AA tracking -0.02em
    (Two-line stack, second line desaturated — creates motion without color)

  SUBHEADLINE (mt: 20px, max-width: 560px):
    "A deterministic skills assessment engine paired with an agentic career copilot.
     Know exactly what you're missing. Build exactly what you need."
    Inter 400 16px #71717A line-height 26px

  CTA ROW (mt: 32px, gap: 12px):
    Primary: "Assess My Skills →" — white bg, black text, rounded-lg h-10
    Secondary: "View Demo" — bordered zinc

  SOCIAL PROOF ROW (mt: 24px):
    Mono tag "[Python 0.79 / 1.0]"  "[DevOps 0.12 / 0.50]"  "[Readiness 62%]"
    Three JetBrains Mono 12px tags in a row with border dividers between them
    Label above in Inter 400 11px #52525B: "LIVE SKILL VECTOR PREVIEW"

IDE PREVIEW CARD (mt: 48px, max-width: 720px, centered):
  Card surface #121215, border 1px #27272A, rounded-xl, p-0 (no padding — flush terminal)
  Top bar strip: 32px height, bg #18181B, border-bottom #27272A
    Left: Three 8px circles (#27272A filled — not red/yellow/green)
    Center: JetBrains Mono 11px #52525B "skill_gap_analysis.py — SkillForge"
  Code body (p-6, font: JetBrains Mono 13px, line-height 22px):
    Line colors — comments: #52525B, keys: #A1A1AA, values: #FAFAFA, gap values: #EF4444
    Show 12-15 lines of realistic-looking gap analysis output:
      # Student: Aisha Khan | Target: Backend Developer
      skill_vector = {
        "python":    0.79,   # ████████░░  assessed
        "web":       0.55,   # █████░░░░░  assessed
        "databases": 0.30,   # ███░░░░░░░  assessed
        "devops":    0.12,   # █░░░░░░░░░  not assessed
        "git":       0.45,   # ████░░░░░░  assessed
        "ai":        0.00,   # ░░░░░░░░░░  pending
      }
      overall_readiness = 0.62  # ← 38% gap to target role

AUTH CARD (separate frame, 480px wide centered):
  Card: #121215, border #27272A, rounded-xl, p-8
  Header: Inter 600 20px "Sign in to SkillForge"
  Role toggle (mt: 20px):
    Segmented control — two pills "Student" and "Mentor / Admin"
    Active: bg #FAFAFA text #000000 | Inactive: bg transparent text #A1A1AA
    Both inside a #18181B rounded-lg container with border #27272A, p-1
  Form fields (mt: 24px, gap: 12px):
    Email input, Password input — standard #18181B bg
  Primary CTA (mt: 20px, w-full): "Continue →"
  Footer (mt: 16px, text-center): "No account? Register →" in #52525B 12px

══════════════════════════════════════════════════════════════
VIEW 2: STUDENT COMMAND DASHBOARD (/dashboard)
Frame: 1440 × 900px, sidebar layout
══════════════════════════════════════════════════════════════

SIDEBAR (width: 220px, bg: #09090B, border-right: 1px #27272A, py: 24px):
  Logo row (px-4): "SKILLFORGE" Inter 600 13px + "[v1.0]" mono tag
  Nav items (mt: 24px, gap: 2px):
    Each item: h-8, px-4, rounded-lg, Inter 500 13px
    Active: bg #18181B, text #FAFAFA, left accent 2px #6366F1 (the ONLY use of indigo)
    Inactive: text #71717A, hover bg #121215
    Items: ⊡ Dashboard | ▷ Assessments | ≡ Roadmap | ◎ Copilot | ◷ Profile
  Bottom: Avatar row with name + role badge "[student]" in mono 11px

MAIN AREA (flex-1, bg: #09090B, p: 32px):

  TOPBAR (flex, justify-between, align-center, mb: 32px):
    LEFT: "Good morning, Aisha" Inter 400 14px #A1A1AA
          "Aisha Khan" Inter 600 20px #FAFAFA (stacked)
    RIGHT: Target role selector (dropdown-style):
           "#18181B bg, border #27272A, rounded-lg, px-12px"
           "Backend Developer ↓" — Inter 500 13px #FAFAFA
           Mono tag "[62% ready]" in #F59E0B 11px
           "Audit Skills →" — Primary CTA button (white bg)

  ROW 1: TWO-COLUMN GRID (gap: 16px, mb: 16px):
    CARD A — Overall Readiness (col-span-1):
      Label: "OVERALL READINESS" — Inter 500 11px #52525B tracking uppercase, mb-16px
      Metric: "62%" — JetBrains Mono 700 48px #FAFAFA
      Sub: "Backend Developer" — Inter 400 13px #71717A
      Progress bar (mt-16px): full width, height 4px, bg #27272A
        Filled portion (62%) in #FAFAFA — no color
        ZERO rounded ends (flat bar — precision, not friendly)
      Footer: "38% gap to target" Inter 400 12px #52525B

    CARD B — Skill Matrix Breakdown (col-span-1):
      Label: "SKILL MATRIX" — uppercase label
      Table layout (6 rows, no outer border, row dividers only 1px #1C1C1F):
        Col 1: Domain name — Inter 500 13px #A1A1AA (30% width)
        Col 2: Thin bar (assessed vs required) — 1px precision bar (40% width)
                Assessed: #FAFAFA fill | Required marker: 1px vertical line #27272A
        Col 3: Score — JetBrains Mono 500 12px (15% width)
        Col 4: Delta badge — "[+0.01]" green or "[-0.38]" red mono 11px (15% width)
      Rows: Python | Web | Git | DevOps | AI | Databases
      IMPORTANT: DevOps row "NOT ASSESSED" state — dashed bar, #52525B text

  ROW 2: TWO-COLUMN GRID (gap: 16px):
    CARD C — Active Roadmap (col-span-1):
      Label: "ACTIVE ROADMAP" uppercase + "[Backend Developer]" mono tag right-aligned
      Mini stepper (vertical, 4 phases):
        Connector line: 1px #27272A vertical
        Node: 8px circle — Done: filled #FAFAFA | Active: ring #6366F1 | Pending: #27272A
        Phase label: Inter 500 13px + completion "3/7 topics" mono 11px #52525B
        Only 4 nodes shown; "View full roadmap →" link at bottom #A1A1AA 12px

    CARD D — Recent Activity (col-span-1):
      Label: "RECENT ASSESSMENTS"
      Table (4 rows max):
        Row: Domain badge | Score mono | Date | Status tag
        Status tags: "[Completed]" green | "[In Progress]" amber | "[Not Started]" zinc
      "Take next assessment →" link at bottom

══════════════════════════════════════════════════════════════
VIEW 3: DYNAMIC ASSESSMENT / QUIZ ENGINE
Frame: 1440 × 900px, distraction-free layout
══════════════════════════════════════════════════════════════

TOP PROGRESS BAR (position: fixed, top: 0, full width):
  Height: 3px, bg #27272A, fill #FAFAFA animated — question 4 of 12 = 33% filled

TOPBAR (height: 52px, border-bottom: 1px #27272A, px: 32px):
  LEFT: "[Python Assessment]" mono badge + "Question 4 / 12" Inter 500 13px #A1A1AA
  CENTER: Countdown — JetBrains Mono 700 20px #FAFAFA — "27:43" remaining
          When < 5 min: color switches to #F59E0B
          When < 1 min: color switches to #EF4444
  RIGHT: "Exit assessment" — text link #52525B 13px (no button chrome)

MAIN CONTENT (max-width: 720px, centered, pt: 80px):
  DIFFICULTY BADGE ROW (mb: 16px, gap: 8px):
    "[Weight: 1.5x]" — mono badge #18181B border #27272A
    "[Intermediate]" — mono badge with #F59E0B text
    "[Python — OOP]" — mono badge

  QUESTION CARD (bg: #121215, border: 1px #27272A, rounded-xl, p-8):
    Question number: "04" JetBrains Mono 700 11px #52525B tracking 0.1em
    Question text: Inter 500 18px #FAFAFA line-height 28px, mt-8px
    Example: "Which of the following correctly demonstrates the Liskov Substitution Principle
               in a Python class hierarchy?"

  ANSWER OPTIONS (mt: 24px, flex col, gap: 8px):
    Each option: #18181B bg, border 1px #27272A, rounded-lg, px-16px py-12px
    Left: Radio circle 16px (unfilled #27272A ring)
    Right: Option text Inter 400 14px #E4E4E7, option label mono "A" "B" "C" "D" in #52525B

    STATE VARIANTS:
      Default:   border #27272A, bg #18181B
      Hover:     border #52525B, bg #1C1C1F — NO color change, only border lift
      Selected:  border #FAFAFA, bg #121215 — radio filled #FAFAFA
      Correct:   border #22C55E, bg #121215 — left 3px accent bar #22C55E
      Incorrect: border #EF4444, bg #121215 — left 3px accent bar #EF4444

  BOTTOM ACTIONS (mt: 32px, flex justify-between):
    LEFT: "← Previous" CTA Secondary (disabled state: opacity 0.3, cursor-not-allowed)
    RIGHT: "Save & Next →" CTA Primary white

  AUTOSAVE INDICATOR (position: fixed, bottom: 24px, left: 50%):
    Small mono tag "[autosaved 0.3s ago]" #52525B 11px — fades in/out on save

══════════════════════════════════════════════════════════════
VIEW 4: INTERACTIVE VERTICAL TIMELINE ROADMAP
Frame: 1440 × 900px, sidebar + main
══════════════════════════════════════════════════════════════

(Reuse sidebar from Dashboard, active item = Roadmap)

MAIN AREA HEADER (mb: 32px):
  Breadcrumb: "Roadmap / Backend Developer" mono 12px #52525B
  H2: "Your Learning Roadmap" Inter 600 24px
  Row: "[Active]" green tag | "Overall Readiness 62%" mono | "Last updated 2d ago" caption
  RIGHT: "Regenerate →" CTA Secondary | "Export PDF" text link

PHASE TIMELINE CONTAINER (max-width: 800px):
  Vertical spine: 1px solid #27272A, left-offset 20px, running full height

  PHASE NODE (each phase):
    Phase marker: 8px filled circle on spine — Done: #FAFAFA | Active: ring-2 #6366F1 | Pending: #27272A
    Phase label row (ml: 40px):
      "Phase 01" mono 11px #52525B
      "Foundations: Python & Git" Inter 600 16px #FAFAFA
      "[3 / 7 topics complete]" mono 11px #22C55E right-aligned

    TOPIC NODE (collapsible, ml: 40px, mt: 12px, pl: 16px, border-left: 1px #27272A):
      Topic header (flex, cursor-pointer):
        Collapse icon "▶" / "▼" — #52525B 10px
        Topic name: Inter 500 14px #FAFAFA
        Status toggle right: "[Pending]" "[In Progress]" "[Done]"
          Each a clickable badge — pill shape, border-only, 22px height
          Pending: #27272A border, #52525B text
          In Progress: #F59E0B border, #F59E0B text, bg transparent
          Done: #22C55E border, #22C55E text, bg transparent

      EXPANDED CONTENT (mt: 12px, flex col gap: 8px):
        Sub-label: "PROJECTS" Inter 500 11px #52525B tracking uppercase
        Project chips (flex wrap, gap: 6px):
          Each chip: "#18181B bg, border #27272A, rounded-md, px-8 py-3, Inter 400 12px"
          "Build a CLI inventory system" with "→" on hover to expand brief

        Sub-label (mt: 12px): "RESOURCES" uppercase
        Resource rows (gap: 6px):
          Each: flex row — resource type badge "[course]"/"[docs]"/"[article]" mono 10px
                title Inter 400 13px #A1A1AA | "↗" icon #52525B
          Example: "[course]  Docker for Beginners — FreeCodeCamp  ↗"

  PHASE CONNECTORS: Spine line continuous between phases, 1px #27272A

  PHASE STATUS VARIANTS:
    Completed phase: Circle filled #FAFAFA, phase label text #52525B (desaturated)
    Active phase:    Circle ring #6366F1 2px + inner dot #6366F1
    Future phase:    Circle #27272A dashed, all text #52525B

══════════════════════════════════════════════════════════════
VIEW 5: AI CAREER COPILOT DRAWER
Frame: Drawer overlay on Dashboard or Roadmap
Drawer: 384px width (w-96), full viewport height, right-anchored
══════════════════════════════════════════════════════════════

DRAWER SHELL:
  bg: #0F0F12 (1 step darker than canvas for depth separation)
  border-left: 1px #27272A
  No border-radius on left edge — flush to viewport
  Box-shadow: NONE — separation via border only

DRAWER HEADER (height: 52px, border-bottom: 1px #27272A, px: 16px):
  LEFT: "Career Copilot" Inter 600 14px #FAFAFA
        "◎ online" — 6px green circle + mono 11px #22C55E
  RIGHT: "✕" close — #52525B, no button chrome

MESSAGE LIST (flex-1, overflow-y-auto, px: 16px, py: 12px, gap: 12px):

  USER MESSAGE:
    Alignment: right
    Bubble: #18181B bg, border #27272A, rounded-xl rounded-tr-sm, px-12 py-8
    Text: Inter 400 13px #E4E4E7

  ASSISTANT MESSAGE:
    Alignment: left
    NO bubble chrome — raw text flush to left edge
    Author label: "Copilot" Inter 500 11px #52525B mb-4px
    Text: Inter 400 13px #A1A1AA line-height 20px

    TOOL TRACE (inline, below response text that triggered tools):
      Container: #18181B bg, border-left 2px #27272A, pl-8, ml-0, mt-8px, rounded-r-lg
      Lines in JetBrains Mono 11px #52525B:
        "> invoking analyze_student_skills..."
        "> invoking calculate_gap (target: Backend Developer)..."
        "> invoking search_knowledge_base (query: docker fundamentals)..."
        "✓ 3 tools completed in 1.2s"  ← #22C55E for the checkmark only

    CITATION BADGES (mt: 8px, flex wrap, gap: 4px):
      Each: "#18181B bg, border #27272A, rounded-md, px-6 py-2"
      "[↗ Backend Developer Roadmap 2026]" mono 10px #71717A
      Hover: border #52525B, cursor pointer

    TYPING INDICATOR (when streaming):
      Three 4px dots — #52525B — blinking animation staggered 200ms each

INPUT AREA (border-top: 1px #27272A, p: 12px):
  Input: w-full, bg #18181B, border #27272A, rounded-lg, px-12 py-8
         placeholder "Ask about your skill gaps..." #52525B mono 12px
  Send button (absolute right inside input): "↵" Inter 500 13px #A1A1AA
  When input has content: "↵" brightens to #FAFAFA

FLOATING TRIGGER (when drawer is closed):
  Position: fixed bottom-6 right-6
  Button: 44px × 44px circle, bg #FAFAFA, text #000000
  Icon: "◎" or simple chat icon 18px
  NO glow, NO shadow — border 1px #27272A only

══════════════════════════════════════════════════════════════
END OF FIGMA MAKE MASTER PROMPT
══════════════════════════════════════════════════════════════
```

---

## PART 2 — TAILWIND CSS TOKEN MAPPING & COMPONENT TREE

### 2.1 Tailwind Config Extension (`tailwind.config.ts`)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Canvas layers
        canvas:   "#09090B",
        surface:  { DEFAULT: "#121215", hover: "#18181B" },
        // Borders
        border:   { DEFAULT: "#27272A", subtle: "#1C1C1F" },
        // Text
        text: {
          primary:   "#FAFAFA",
          secondary: "#A1A1AA",
          muted:     "#52525B",
          disabled:  "#3F3F46",
        },
        // Semantic
        success: "#22C55E",
        danger:  "#EF4444",
        warning: "#F59E0B",
        accent:  "#6366F1",   // Focus rings and active nav ONLY
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display":  ["48px", { lineHeight: "52px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2":       ["32px", { lineHeight: "38px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "h3":       ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label":    ["11px", { lineHeight: "16px", letterSpacing: "0.08em",  fontWeight: "500" }],
        "body":     ["14px", { lineHeight: "22px", fontWeight: "400" }],
        "caption":  ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "metric":   ["32px", { lineHeight: "36px", fontWeight: "700" }],  // mono only
        "code":     ["13px", { lineHeight: "22px", fontWeight: "500" }],  // mono only
        "badge":    ["11px", { lineHeight: "16px", fontWeight: "500" }],  // mono only
      },
      borderRadius: {
        // MAXIMUM is xl (12px) — never 2xl or full except for avatars
        sm:  "4px",
        md:  "6px",
        lg:  "8px",
        xl:  "12px",
      },
      spacing: {
        // 4px grid system
        "px": "1px",
        "0.5": "2px",
        "1":   "4px",
        "2":   "8px",
        "3":   "12px",
        "4":   "16px",
        "6":   "24px",
        "8":   "32px",
        "12":  "48px",
        "16":  "64px",
      },
      boxShadow: {
        // ONLY border-style shadows — no elevation or glow
        card:    "0 0 0 1px #27272A",
        input:   "0 0 0 1px #27272A",
        focus:   "0 0 0 2px #6366F1",
        none:    "none",
      },
      keyframes: {
        "cursor-blink": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        "fade-in":      { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { transform: "scale(0.7)", opacity: "0.4" },
          "40%":            { transform: "scale(1.0)",  opacity: "1.0" },
        },
      },
      animation: {
        "cursor-blink":   "cursor-blink 1s step-end infinite",
        "fade-in":        "fade-in 0.15s ease-out",
        "slide-in-right": "slide-in-right 0.2s ease-out",
        "dot-bounce":     "dot-bounce 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### 2.2 Design Token Constants (`src/lib/tokens.ts`)

```typescript
export const tokens = {
  colors: {
    canvas:          "bg-canvas",
    surface:         "bg-surface",
    surfaceHover:    "bg-surface-hover",
    borderDefault:   "border-border",
    borderSubtle:    "border-border-subtle",
    textPrimary:     "text-text-primary",
    textSecondary:   "text-text-secondary",
    textMuted:       "text-text-muted",
  },
  status: {
    done:       { text: "text-success",   border: "border-success"  },
    inProgress: { text: "text-warning",   border: "border-warning"  },
    pending:    { text: "text-text-muted", border: "border-border"  },
    gap:        { text: "text-danger",    border: "border-danger"   },
  },
} as const;
```

---

### 2.3 Shared Component Primitives (`src/components/ui/`)

#### `Badge.tsx`
```tsx
// Usage: <Badge variant="mono" status="done">Completed</Badge>
type BadgeVariant = "default" | "mono" | "status";
type BadgeStatus  = "done" | "inProgress" | "pending" | "gap" | "neutral";

const statusStyles: Record<BadgeStatus, string> = {
  done:       "text-success border-success",
  inProgress: "text-warning border-warning",
  pending:    "text-text-muted border-border",
  gap:        "text-danger border-danger",
  neutral:    "text-text-secondary border-border",
};

export function Badge({
  children,
  variant = "default",
  status = "neutral",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  status?: BadgeStatus;
}) {
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] leading-4",
        variant === "mono" ? "font-mono" : "font-sans font-medium",
        statusStyles[status],
        "bg-surface",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
```

#### `Button.tsx`
```tsx
type ButtonVariant = "primary" | "secondary" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary:   "bg-white text-black hover:bg-zinc-100 font-semibold",
  secondary: "bg-surface text-text-secondary border border-border hover:bg-surface-hover hover:text-text-primary",
  ghost:     "text-text-muted hover:text-text-secondary",
};

export function Button({
  children,
  variant = "secondary",
  disabled,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm transition-colors duration-150",
        variantStyles[variant],
        (disabled || loading) ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {loading && <LoadingDots />}
      {children}
    </button>
  );
}
```

#### `Card.tsx`
```tsx
export function Card({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={["bg-surface border border-border rounded-xl p-6", className].join(" ")}>
      {label && (
        <p className="font-mono text-[11px] tracking-widest uppercase text-text-muted mb-4">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}
```

#### `LoadingDots.tsx`
```tsx
export function LoadingDots() {
  return (
    <span className="inline-flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-text-muted animate-dot-bounce"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </span>
  );
}
```

---

### 2.4 Full Component Tree by View

```
src/
├── components/
│   ├── ui/                          ← Primitive atoms
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Divider.tsx
│   │   ├── LoadingDots.tsx
│   │   ├── ErrorBoundary.tsx        ← Wraps every route
│   │   └── ProgressBar.tsx          ← Flat, monochrome
│   │
│   ├── layout/
│   │   ├── AppShell.tsx             ← Sidebar + main area
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx               ← Landing nav
│   │   └── Topbar.tsx               ← Dashboard topbar
│   │
│   ├── dashboard/
│   │   ├── ReadinessGauge.tsx       ← Circular or bar metric
│   │   ├── SkillMatrixTable.tsx     ← 6-row precision table
│   │   ├── RoadmapMiniStepper.tsx   ← 4-node preview
│   │   └── RecentAssessments.tsx
│   │
│   ├── assessment/
│   │   ├── QuizErrorBoundary.tsx    ← MANDATORY per PRD §7.5
│   │   ├── CountdownTimer.tsx       ← useEffect with clearInterval
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerOption.tsx
│   │   ├── ProgressTopBar.tsx       ← 3px fill bar
│   │   └── AutosaveIndicator.tsx
│   │
│   ├── roadmap/
│   │   ├── PhaseNode.tsx
│   │   ├── TopicNode.tsx            ← Collapsible
│   │   ├── StatusToggle.tsx         ← Optimistic UI
│   │   ├── ProjectChip.tsx
│   │   ├── ResourceCard.tsx
│   │   └── VerticalSpine.tsx        ← 1px line connector
│   │
│   └── copilot/
│       ├── CopilotDrawer.tsx        ← Zustand: agentDrawerStore
│       ├── CopilotTrigger.tsx       ← Fixed FAB
│       ├── MessageBubble.tsx
│       ├── ToolTrace.tsx            ← Mono trace block
│       ├── CitationBadge.tsx
│       └── TypingIndicator.tsx
│
├── stores/                          ← Zustand domain slices (no monolith)
│   ├── authStore.ts
│   ├── skillStore.ts                ← skillVector, gapReport
│   ├── roadmapStore.ts
│   └── agentDrawerStore.ts          ← isOpen, messages, isStreaming
│
└── pages/
    ├── Landing.tsx
    ├── auth/Login.tsx
    ├── auth/Register.tsx
    ├── Onboarding.tsx
    ├── dashboard/Dashboard.tsx
    ├── assessments/AssessmentPicker.tsx
    ├── assessments/QuizPage.tsx
    ├── assessments/ResultsPage.tsx
    ├── roadmap/RoadmapPage.tsx
    ├── copilot/CopilotPage.tsx
    ├── profile/ProfilePage.tsx
    └── admin/
        ├── AdminDashboard.tsx
        ├── StudentDirectory.tsx
        ├── StudentDetail.tsx
        ├── ResourceManager.tsx
        └── QuestionBank.tsx
```

---

### 2.5 Zustand Store Patterns (PRD §7.5 compliance)

```typescript
// src/stores/skillStore.ts
import { create } from "zustand";

interface SkillState {
  skillVector: Record<string, number> | null;
  gapReport: GapReport | null;
  isLoading: boolean;
  fetchSkillData: (signal: AbortSignal) => Promise<void>;
}

export const useSkillStore = create<SkillState>((set) => ({
  skillVector: null,
  gapReport: null,
  isLoading: false,
  fetchSkillData: async (signal) => {
    set({ isLoading: true });
    try {
      const [vector, gap] = await Promise.all([
        api.getSkillVector({ signal }),
        api.getLatestGapReport({ signal }),
      ]);
      if (!signal.aborted) {
        set({ skillVector: vector, gapReport: gap, isLoading: false });
      }
    } catch (err) {
      if (!signal.aborted) set({ isLoading: false });
    }
  },
}));

// Usage in Dashboard.tsx
useEffect(() => {
  const controller = new AbortController();
  fetchSkillData(controller.signal);
  return () => controller.abort();   // ← MANDATORY cleanup per PRD §7.5.1
}, [fetchSkillData]);
```

---

## PART 3 — MICRO-INTERACTION & STATE SPECIFICATIONS

### 3.1 Empty States

Every empty state follows the same structural pattern:
- Icon: Lucide icon, 24px, `text-text-muted` — no color
- Headline: Inter 500 14px `text-text-secondary`
- Body: Inter 400 13px `text-text-muted`, max-width 280px centered
- CTA: Single action button

| View | Empty Trigger | Icon | Headline | Body | CTA |
|---|---|---|---|---|---|
| Skill Matrix | No assessments taken | `BarChart2` | "No skill data yet" | "Complete at least one domain assessment to populate your skill vector." | "Start Assessment →" (primary) |
| Active Roadmap | No roadmap generated | `Map` | "No roadmap generated" | "Set a target role and we'll compute a personalized learning path from your gap analysis." | "Generate Roadmap →" (primary) |
| Copilot Drawer | First open / no history | `MessageSquare` | "Ask anything about your career path" | "Copilot can analyze your gaps, suggest resources, and generate your roadmap in real time." | — (show 3 suggested starter prompts as clickable chips) |
| Assessment History | No assessments | `ClipboardList` | "No assessments taken" | "Pick a domain to assess below." | "View Domains →" |
| Admin Student List | No students | `Users` | "No students enrolled" | "Students will appear here after they register with the Student role." | — |

**Suggested starter prompts for Copilot empty state:**
```
"[What's my biggest skill gap for Backend Dev?]"
"[Generate a 3-month learning plan for me]"
"[Which assessment should I take next?]"
```
These render as clickable Badge components that populate the input on click.

---

### 3.2 Loading States

| Component | Loading Pattern |
|---|---|
| Skill Matrix rows | Skeleton: replace bar with `#18181B` animated pulse block, 80px × 4px |
| Readiness metric | "—%" in `text-text-muted` mono, no spinner |
| Question card | Skeleton card: title block 3 lines, 4 option blocks — all `#18181B` pulse |
| Roadmap phases | Skeleton spine: 4 node circles + lines, no text |
| Copilot response | `<TypingIndicator />` — 3 dots staggered bounce |
| Page-level (route) | Top-of-page 2px progress line `#FAFAFA`, indeterminate shimmer |
| Submit button | Disable immediately + swap text to `<LoadingDots />`, re-enable on response |

**Skeleton pulse animation:**
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.7; }
}
.skeleton { animation: skeleton-pulse 1.5s ease-in-out infinite; }
```

---

### 3.3 Active / Interactive States

#### Answer Option — State Machine
```
[Default] → hover → [Hover: border lift to #52525B]
         → click → [Selected: border #FAFAFA, radio filled]
         → submit → [Correct: border #22C55E + left accent bar]
                  → [Incorrect: border #EF4444 + left accent bar + correct answer revealed]
```
Transition: `transition-colors duration-150` — fast, no spring physics.

#### Status Toggle (Roadmap topic)
Optimistic UI contract:
```typescript
// StatusToggle.tsx
const cycle: Record<TaskStatus, TaskStatus> = {
  pending:     "in_progress",
  in_progress: "done",
  done:        "pending",
};

const handleToggle = async () => {
  const previousStatus = status;
  const nextStatus = cycle[status];
  
  // 1. Optimistic update immediately (Zustand)
  updateTopicStatus(topicId, nextStatus);
  
  try {
    // 2. Fire PATCH in background
    await api.updateTopicStatus(topicId, nextStatus);
  } catch {
    // 3. Rollback on failure + show toast
    updateTopicStatus(topicId, previousStatus);
    toast.error("Status update failed — rolled back.");
  }
};
```

#### Roadmap Topic Node — Collapse/Expand
- Toggle icon rotates 90° on expand: `transition-transform duration-150`
- Content slides down: `animate-in slide-in-from-top-1 duration-150`
- Height animated via `grid-rows` trick (no `height: auto` transition issues):
  ```css
  .topic-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 150ms ease-out;
  }
  .topic-content.open {
    grid-template-rows: 1fr;
  }
  .topic-content > * { overflow: hidden; }
  ```

#### Copilot Drawer — Open/Close
```tsx
// Slide in from right, no backdrop (non-blocking)
<div
  className={[
    "fixed right-0 top-0 h-full w-96 bg-[#0F0F12] border-l border-border z-50",
    "transition-transform duration-200 ease-out",
    isOpen ? "translate-x-0" : "translate-x-full",
  ].join(" ")}
>
```

---

### 3.4 Error States

| State | Visual Treatment |
|---|---|
| API error (non-auth) | Toast notification — bottom-center, `#18181B` bg, `#EF4444` left border 2px, message in Inter 400 13px, auto-dismiss 4s |
| Auth token expired | Redirect to `/auth/login` with query `?reason=session_expired`, show info Banner on login page |
| Assessment submit failure | Inline error below submit button — `#EF4444` text, "Failed to submit. Your answers are saved locally. Try again." — retry button shown |
| Roadmap generation failure | Replace loading state with error card: Lucide `AlertTriangle` + message + "Retry Generation" secondary CTA |
| Quiz timer expired | Auto-submit triggered; if that fails, modal overlay: "Time's up — submission failed. Contact support." |
| `<ErrorBoundary>` caught | Full-route fallback: white text "Something went wrong" + Lucide `RefreshCw` + "Reload page" primary button |

**Toast implementation contract:**
```typescript
// ZERO toast libraries with animation bloat — use a simple Zustand queue
interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "info";
  duration?: number;
}
// Renders at bottom-center, stacks upward, max 3 visible
```

---

### 3.5 Countdown Timer — Critical Implementation

Per PRD §7.5.2, this is a **code-review blocker** if cleanup is missing:

```tsx
// components/assessment/CountdownTimer.tsx
export function CountdownTimer({
  totalSeconds,
  onExpire,
}: {
  totalSeconds: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);  // ← MANDATORY cleanup
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  const colorClass =
    remaining < 60  ? "text-danger"  :
    remaining < 300 ? "text-warning" :
    "text-text-primary";

  return (
    <span className={["font-mono text-xl font-bold tabular-nums", colorClass].join(" ")}>
      {mins}:{secs}
    </span>
  );
}
```

---

### 3.6 Focus & Accessibility States

- All focusable elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`
- Skip-to-content link: visually hidden, appears on first Tab press (`sr-only focus:not-sr-only`)
- Reduced motion: all animations wrapped in `@media (prefers-reduced-motion: reduce)` — durations drop to `1ms`
- Color contrast: all text on surface meets WCAG AA minimum (4.5:1 for body, 3:1 for large text)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

---

### 3.7 Responsive Behavior

The design is desktop-first but responsive. Breakpoints:

| Breakpoint | Layout Change |
|---|---|
| `< 1024px` | Sidebar collapses to icon-only (44px wide), tooltips on hover |
| `< 768px` | Sidebar becomes bottom tab bar (5 icons), top topbar persists |
| `< 640px` | Cards stack single-column, quiz becomes full-screen with no sidebar |
| Copilot Drawer | On `< 768px`, transitions from side drawer to bottom sheet (full width, 60vh height) |

---

### 3.8 SkillMatrixTable — Precision Bar Specification

```tsx
// The precision bar for each skill domain row
function PrecisionBar({
  current,
  required,
}: {
  current: number;   // 0.0 - 1.0
  required: number;  // 0.0 - 1.0
}) {
  return (
    <div className="relative w-full h-1 bg-border rounded-none overflow-visible">
      {/* Current score fill */}
      <div
        className="absolute left-0 top-0 h-full bg-text-primary"
        style={{ width: `${current * 100}%` }}
      />
      {/* Required threshold marker — a 1px vertical line */}
      <div
        className="absolute top-[-3px] h-[7px] w-px bg-border-subtle"
        style={{ left: `${required * 100}%` }}
      />
    </div>
  );
}
```

---

### 3.9 Semantic Color Usage Summary

| Color | Hex | Usage |
|---|---|---|
| `#22C55E` | Green | Done status, passing score, readiness indicators, "online" dot |
| `#EF4444` | Red | Skill gap values, incorrect answer, error states, critical alerts |
| `#F59E0B` | Amber | In-progress status, timer warning, intermediate difficulty badge |
| `#6366F1` | Indigo | **ONLY**: active nav indicator (2px left bar), focus rings |
| `#FAFAFA` | White | Primary text, selected state fills, CTA background |

**Rule:** Never use semantic colors as backgrounds. They are text and border colors only. The only exception is the primary CTA button (`bg-white`).

---

*End of SkillForge Master UI/UX & Figma Generation Prompt*
*Design System v1.0 | Swiss-Technical Aesthetic*