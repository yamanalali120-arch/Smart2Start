# brillen.de Academy – Lernplattform

Interne Lernplattform für brillen.de Mitarbeiter zum Auswendiglernen des Optik-Handbuchs.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend/Auth/DB:** Supabase (PostgreSQL, Auth, RLS)
- **Animations:** Framer Motion, react-confetti

## Lokale Einrichtung

### 1. Repository klonen & Dependencies installieren

```bash
cd brillen-academy
npm install



# Brillen Academy

## 1. Gesamtarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js 14+)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │  Login   │ │Dashboard │ │  Learn   │ │    Admin      │   │
│  │  Page    │ │  Page    │ │  Pages   │ │    Pages      │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘   │
│       │             │            │               │           │
│  ┌────▼─────────────▼────────────▼───────────────▼───────┐  │
│  │              SHARED COMPONENTS                         │  │
│  │  shadcn/ui · Custom Components · Hooks · Providers     │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │           SERVER ACTIONS / API ROUTES                  │  │
│  │  Auth · Progress · Quiz · Admin · Content              │  │
│  └────────────────────────┬──────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                      SUPABASE                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │   Auth   │ │ Postgres │ │ Storage  │ │  Realtime     │   │
│  │  (GoTrue)│ │   (DB)   │ │ (Assets) │ │  (optional)   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│                                                              │
│  RLS Policies · Functions · Triggers · Cron (pg_cron)       │
└──────────────────────────────────────────────────────────────┘
```

## 2. Projektstruktur

```
brillen-academy/
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
├── components.json                    # shadcn/ui config
│
├── public/
│   ├── icons/
│   │   ├── badge-beginner.svg
│   │   ├── badge-solid.svg
│   │   ├── badge-master.svg
│   │   └── logo.svg
│   └── images/
│       └── hero-glasses.webp
│
├── supabase/
│   ├── migrations/
│   │   ├── 00001_create_profiles.sql
│   │   ├── 00002_create_chapters.sql
│   │   ├── 00003_create_lessons.sql
│   │   ├── 00004_create_questions.sql
│   │   ├── 00005_create_progress.sql
│   │   ├── 00006_create_quiz_attempts.sql
│   │   ├── 00007_create_review_queue.sql
│   │   ├── 00008_create_badges.sql
│   │   ├── 00009_create_streaks.sql
│   │   ├── 00010_rls_policies.sql
│   │   └── 00011_functions_triggers.sql
│   └── seed/
│       ├── seed_chapters.sql
│       ├── seed_lessons.sql
│       ├── seed_questions.sql
│       └── seed_badges.sql
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root Layout
│   │   ├── page.tsx                   # Redirect to /login or /dashboard
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/
│   │   │   ├── layout.tsx             # Auth layout (centered, no nav)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── set-password/
│   │   │   │   └── page.tsx
│   │   │   └── auth-callback/
│   │   │       └── route.ts
│   │   │
│   │   ├── (app)/
│   │   │   ├── layout.tsx             # App layout (nav, sidebar, auth guard)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── learn/
│   │   │   │   ├── page.tsx           # Chapter roadmap
│   │   │   │   ├── [chapterSlug]/
│   │   │   │   │   ├── page.tsx       # Lessons list
│   │   │   │   │   └── [lessonSlug]/
│   │   │   │   │       └── page.tsx   # Lesson content + quiz
│   │   │   ├── quiz/
│   │   │   │   └── [lessonId]/
│   │   │   │       └── page.tsx
│   │   │   ├── review/
│   │   │   │   └── page.tsx
│   │   │   ├── progress/
│   │   │   │   └── page.tsx
│   │   │   └── profile/
│   │   │       └── page.tsx
│   │   │
│   │   └── (admin)/
│   │       ├── layout.tsx             # Admin layout + guard
│   │       ├── admin/
│   │       │   ├── page.tsx           # Admin dashboard
│   │       │   ├── users/
│   │       │   │   └── page.tsx
│   │       │   ├── content/
│   │       │   │   └── page.tsx
│   │       │   └── analytics/
│   │       │       └── page.tsx
│
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   └── avatar.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   ├── reset-password-form.tsx
│   │   │   └── set-password-form.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── welcome-card.tsx
│   │   │   ├── stats-grid.tsx
│   │   │   ├── xp-level-card.tsx
│   │   │   ├── streak-card.tsx
│   │   │   ├── mastery-radar.tsx
│   │   │   ├── recent-activity.tsx
│   │   │   ├── daily-goal-card.tsx
│   │   │   ├── weak-topics-card.tsx
│   │   │   └── strong-topics-card.tsx
│   │   │
│   │   ├── learn/
│   │   │   ├── chapter-roadmap.tsx
│   │   │   ├── chapter-node.tsx
│   │   │   ├── lesson-list.tsx
│   │   │   ├── lesson-card.tsx
│   │   │   ├── lesson-content.tsx
│   │   │   ├── knowledge-card.tsx
│   │   │   ├── mnemonic-card.tsx
│   │   │   └── chapter-test-gate.tsx
│   │   │
│   │   ├── quiz/
│   │   │   ├── quiz-engine.tsx
│   │   │   ├── question-single-choice.tsx
│   │   │   ├── question-multiple-choice.tsx
│   │   │   ├── question-true-false.tsx
│   │   │   ├── question-matching.tsx
│   │   │   ├── question-ordering.tsx
│   │   │   ├── question-flashcard.tsx
│   │   │   ├── question-fill-blank.tsx
│   │   │   ├── quiz-progress-bar.tsx
│   │   │   ├── quiz-result.tsx
│   │   │   ├── answer-feedback.tsx
│   │   │   └── xp-reward-animation.tsx
│   │   │
│   │   ├── review/
│   │   │   ├── review-queue.tsx
│   │   │   └── review-card.tsx
│   │   │
│   │   ├── progress/
│   │   │   ├── mastery-overview.tsx
│   │   │   ├── topic-mastery-bar.tsx
│   │   │   ├── progress-timeline.tsx
│   │   │   └── badge-gallery.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── user-table.tsx
│   │   │   ├── create-user-dialog.tsx
│   │   │   ├── content-manager.tsx
│   │   │   ├── analytics-dashboard.tsx
│   │   │   ├── team-weakness-chart.tsx
│   │   │   └── user-detail-sheet.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── app-header.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   └── footer.tsx
│   │   │
│   │   └── shared/
│   │       ├── loading-spinner.tsx
│   │       ├── empty-state.tsx
│   │       ├── error-boundary.tsx
│   │       ├── page-header.tsx
│   │       ├── confetti.tsx
│   │       └── animated-counter.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server client
│   │   │   ├── admin.ts               # Service role client
│   │   │   └── middleware.ts          # Auth middleware helper
│   │   │
│   │   ├── constants.ts
│   │   ├── utils.ts                   # cn() etc
│   │   ├── xp.ts                      # XP/Level calculations
│   │   ├── mastery.ts                 # Mastery calculations
│   │   ├── spaced-repetition.ts       # SRS logic
│   │   └── validators.ts             # Zod schemas
│   │
│   ├── actions/
│   │   ├── auth.ts                    # Server actions for auth
│   │   ├── progress.ts               # Server actions for progress
│   │   ├── quiz.ts                    # Server actions for quiz
│   │   ├── review.ts                 # Server actions for review
│   │   ├── admin.ts                  # Server actions for admin
│   │   │   └── content.ts               # Server actions for content
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-progress.ts
│   │   ├── use-quiz.ts
│   │   ├── use-streak.ts
│   │   └── use-mastery.ts
│   │
│   ├── types/
│   │   ├── database.ts               # Supabase generated types
│   │   ├── content.ts                # Content types
│   │   ├── quiz.ts                   # Quiz types
│   │   ├── progress.ts              # Progress types
│   │   └── admin.ts                  # Admin types
│   │
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── toast-provider.tsx
│   │
│   └── middleware.ts                  # Next.js middleware
│
└── README.md
```
