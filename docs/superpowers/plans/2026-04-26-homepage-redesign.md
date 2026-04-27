# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the public landing page (`app/page.tsx`) with a modular-ancient Hinglish aesthetic matching the Deepa's Vision brand — parchment dividers, crimson service cards, famous testimonials, animated stats, and a full SEO/CTA treatment.

**Architecture:** Eight self-contained Server Components under `components/landing/` compose the page in `app/page.tsx`. Only `StatsSection` and `WordsOfJoySection` are Client Components (they need browser APIs). Global design tokens and Navbar get small targeted updates; all interior pages (auth, chart, dosha, dashboard) are untouched.

**Tech Stack:** Next.js 16, Tailwind CSS v4, TypeScript, CVA (existing), Zustand (existing auth store)

**Base path (all file paths below are relative to):**
`/Users/vedantmadne/Desktop/SDSE-Project/.worktrees/feature-frontend-build/Frontend/astrology-app/`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `app/globals.css` | Add `--color-parchment`, `--color-blush` tokens |
| Modify | `app/layout.tsx` | Full SEO meta tags + JSON-LD schema |
| Modify | `app/page.tsx` | Compose all landing sections |
| Modify | `components/layout/Navbar.tsx` | Hinglish public nav + "Let's Sit" CTA |
| Create | `components/landing/TornDivider.tsx` | Reusable SVG wavy section divider |
| Create | `components/landing/HeroSection.tsx` | Hero with orb, bubbles, mini-stats |
| Create | `components/landing/TestimonialsSection.tsx` | Famous testimonials 4-col grid |
| Create | `components/landing/StatsSection.tsx` | Animated count-up row (client) |
| Create | `components/landing/HowItWorksSection.tsx` | 2-col text + service card |
| Create | `components/landing/ServicesSection.tsx` | 8 dark-crimson numbered cards |
| Create | `components/landing/WordsOfJoySection.tsx` | Video + text carousel (client) |
| Create | `components/landing/CtaBanner.tsx` | Full-crimson CTA strip |

---

## Task 1: Global CSS tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Add the two missing design tokens** — open `app/globals.css` and insert inside `@theme inline { ... }` after the existing `--color-error` line:

```css
  --color-parchment:  #F0E6D3;
  --color-blush:      #FDF0EC;
```

Final `@theme inline` block should look like:

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --color-bg:        #FAF7F2;
  --color-card:      #FFF8F0;
  --color-primary:   #8B2635;
  --color-primary-hover: #6E1E2A;
  --color-accent:    #D4860B;
  --color-text:      #2C1810;
  --color-muted:     #9C7E6A;
  --color-border:    #E8D5C4;
  --color-success:   #3D7A4B;
  --color-error:     #C0392B;
  --color-parchment: #F0E6D3;
  --color-blush:     #FDF0EC;
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
cd /Users/vedantmadne/Desktop/SDSE-Project/.worktrees/feature-frontend-build/Frontend/astrology-app
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add app/globals.css
git commit -m "style: add parchment and blush color tokens"
```

---

## Task 2: TornDivider component

**Files:**
- Create: `components/landing/TornDivider.tsx`

- [ ] **Create the file**

```tsx
// components/landing/TornDivider.tsx

interface TornDividerProps {
  /** CSS color string for the section above the divider */
  fromColor: string;
  /** CSS color string for the section below the divider */
  toColor: string;
  /** When true, the wave points upward (use when going from light → dark) */
  flip?: boolean;
}

export function TornDivider({ fromColor, toColor, flip = false }: TornDividerProps) {
  return (
    <div style={{ background: fromColor, lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 55"
        preserveAspectRatio="none"
        style={{ display: "block", height: 55, width: "100%" }}
        aria-hidden="true"
      >
        {flip ? (
          <path
            d="M0,55 L0,25 Q60,5 120,27 Q180,47 240,22 Q300,2 360,28 Q420,50 480,24 Q540,4 600,26 Q660,47 720,22 Q780,2 840,28 Q900,50 960,24 Q1020,4 1080,27 Q1140,47 1200,22 Q1260,2 1340,28 L1440,20 L1440,55 Z"
            fill={toColor}
          />
        ) : (
          <path
            d="M0,0 L0,32 Q55,55 110,38 Q165,22 220,40 Q280,58 340,34 Q400,12 460,38 Q520,58 580,35 Q640,14 700,38 Q760,58 820,34 Q880,12 940,36 Q1000,58 1060,32 Q1120,8 1180,34 Q1240,58 1320,38 L1440,30 L1440,0 Z"
            fill={toColor}
          />
        )}
      </svg>
    </div>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/TornDivider.tsx
git commit -m "feat: add TornDivider landing component"
```

---

## Task 3: Update Navbar

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Replace the entire file** with this version — it adds a Hinglish public nav (unauthenticated) while keeping the authenticated dashboard nav exactly as-is:

```tsx
// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

const PUBLIC_NAV = [
  { label: "Home",     href: "/" },
  { label: "About",    href: "/#about" },
  { label: "समाधान",  href: "/#services" },
  { label: "9 Grahas", href: "/#grahas" },
  { label: "भरोसा",   href: "/#testimonials" },
  { label: "FAQs",     href: "/#faqs" },
  { label: "Contact",  href: "/#contact" },
];

export function Navbar() {
  const { isAuthenticated, hydrated, user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-[var(--color-primary)]">
          <Star size={18} className="text-[var(--color-accent)]" fill="currentColor" />
          Deepa&apos;s Vision
        </Link>

        {/* Skeleton prevents auth flash */}
        {!hydrated ? (
          <div className="h-8 w-52 rounded-lg bg-[var(--color-border)] animate-pulse" />
        ) : isAuthenticated ? (
          /* ── Authenticated nav ── */
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">Dashboard</Link>
            <Link href="/chart"     className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">Birth Chart</Link>
            <Link href="/dosha"     className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">Dosha</Link>
            {user?.role === "admin" && (
              <Link href="/admin" className="text-sm text-[var(--color-accent)] hover:opacity-80 transition-opacity">Admin</Link>
            )}
            <span className="text-sm text-[var(--color-muted)]">{user?.name ?? user?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          /* ── Public / landing nav ── */
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              {PUBLIC_NAV.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-xs tracking-widest uppercase text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-none tracking-widest text-xs uppercase"
              )}
            >
              Let&apos;s Sit
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: update Navbar with Hinglish public nav and Let's Sit CTA"
```

---

## Task 4: HeroSection

**Files:**
- Create: `components/landing/HeroSection.tsx`

- [ ] **Create the file**

```tsx
// components/landing/HeroSection.tsx
import Link from "next/link";

const BUBBLES = [
  { label: "Confusion",   style: { top: "14%",  left: "8%" } },
  { label: "Worry",       style: { top: "8%",   right: "18%" } },
  { label: "Anger",       style: { top: "30%",  left: "2%" } },
  { label: "Arrogance",   style: { top: "28%",  right: "6%" } },
  { label: "Laziness",    style: { top: "52%",  left: "6%" } },
  { label: "Self pity",   style: { top: "50%",  right: "4%" } },
  { label: "Delusion",    style: { top: "70%",  left: "18%" } },
  { label: "Impatience",  style: { top: "68%",  right: "10%" } },
];

const MINI_STATS = [
  { num: "3,500+",  label: "Individuals guided" },
  { num: "10+",     label: "Countries" },
  { num: "250K+",   label: "Lives touched" },
];

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[88vh] flex-col items-center justify-center gap-12 bg-white px-6 py-20 md:flex-row md:px-20"
      aria-label="Hero"
    >
      {/* Left — text */}
      <div className="flex-1 max-w-xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[var(--color-accent)]">
          Vedic Astrology · ज्योतिष
        </p>

        <h1
          className="mb-4 text-5xl font-bold leading-tight text-[var(--color-primary)]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Stuck in a{" "}
          <em style={{ color: "#B8860B", fontStyle: "normal" }}>doubt?</em>
        </h1>

        <p className="mb-3 text-lg italic text-[var(--color-muted)]">
          दौड़ का ये फेरा, कौन सा रास्ता है मेरा?
        </p>

        <p className="mb-8 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
          Deepa&apos;s Vision helps you discover your true path through authentic
          Vedic astrology — your Kundali, Doshas, and Dasha decoded with clarity,
          not fear.
        </p>

        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            href="/auth/signup"
            className="bg-[var(--color-primary)] text-white px-7 py-3 text-sm font-medium tracking-wide hover:bg-[var(--color-primary-hover)] transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            अपनी Kundali बनाएं →
          </Link>
          <Link
            href="/#about"
            className="border border-[var(--color-primary)] text-[var(--color-primary)] px-6 py-3 text-sm font-medium tracking-wide hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Learn More
          </Link>
        </div>

        {/* Mini stats */}
        <div className="flex gap-8">
          {MINI_STATS.map(({ num, label }) => (
            <div key={label}>
              <div
                className="text-2xl font-bold text-[var(--color-primary)]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {num}
              </div>
              <div className="text-xs text-[var(--color-muted)] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — orb with emotion bubbles */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 380, height: 380 }}
        >
          {/* Warm radial orb */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, #FDEBD0 0%, #F9C97C 40%, #F0A030 70%, transparent 100%)",
            }}
          />

          {/* Silhouette meditation figure */}
          <div
            className="absolute"
            style={{
              bottom: 55,
              width: 90,
              height: 120,
              background: "var(--color-primary)",
              opacity: 0.18,
              borderRadius: "50% 50% 48% 52% / 60% 60% 40% 40%",
            }}
          />

          {/* Floating bubbles */}
          {BUBBLES.map(({ label, style }) => (
            <span
              key={label}
              className="absolute rounded-full px-3 py-1.5 text-xs italic"
              style={{
                ...style,
                background: "rgba(255,220,150,0.82)",
                color: "#6B3A00",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/HeroSection.tsx
git commit -m "feat: add HeroSection landing component"
```

---

## Task 5: TestimonialsSection

**Files:**
- Create: `components/landing/TestimonialsSection.tsx`

- [ ] **Create the file**

```tsx
// components/landing/TestimonialsSection.tsx

const TESTIMONIALS = [
  {
    name: "Manoj Bajpayee",
    role: "Actor",
    quote:
      "Manoj focused on his other income sources during Sade Sati — guided that the period would not support him in the field, so instead of struggling, he chose to grow elsewhere.",
  },
  {
    name: "Sourav Joshi",
    role: "Youtuber, Vlogger & Artist",
    quote:
      "Sourav mentioned many times that he took major decisions considering astrology and settled things accordingly.",
  },
  {
    name: "Ranveer Allahbadia",
    role: "Youtuber & Podcaster",
    quote:
      "Ranveer follows astrology a lot in his profession — his office, home, and meditation practices are all influenced by it.",
  },
  {
    name: "Sanjiv Goenka",
    role: "Billionaire & Investor",
    quote:
      "For investing in land and selected projects, he often consults his astrologer.",
  },
];

export function TestimonialsSection() {
  return (
    <section
      className="px-6 py-20 md:px-20"
      style={{ background: "var(--color-parchment)" }}
      id="testimonials"
      aria-label="Famous testimonials"
    >
      <p className="mb-2 text-center text-xs uppercase tracking-[3px] text-[var(--color-accent)]">
        भरोसा — Testimonials
      </p>
      <h2
        className="mb-12 text-center text-4xl text-[var(--color-primary)]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        What people say—
      </h2>

      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map(({ name, role, quote }) => (
          <article
            key={name}
            className="flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid var(--color-border)" }}
          >
            {/* Video placeholder — swap src later */}
            <div
              className="flex items-center justify-center text-xs tracking-widest uppercase"
              style={{
                height: 160,
                background: "linear-gradient(135deg, #3D2010 0%, #6B3A00 100%)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              [ Video ]
            </div>

            <div className="flex flex-1 flex-col p-4">
              <p className="mb-1 font-semibold text-[var(--color-text)]">{name}</p>
              <p className="mb-3 text-xs text-[var(--color-accent)]">{role}</p>
              <p className="flex-1 text-xs italic leading-relaxed text-[var(--color-muted)]">
                &ldquo;{quote}&rdquo;
              </p>
              <button
                className="mt-3 self-start text-xs underline text-[var(--color-primary)] cursor-pointer bg-none border-none p-0"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ▶ Watch
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/TestimonialsSection.tsx
git commit -m "feat: add TestimonialsSection landing component"
```

---

## Task 6: StatsSection (client — count-up animation)

**Files:**
- Create: `components/landing/StatsSection.tsx`

- [ ] **Create the file**

```tsx
// components/landing/StatsSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { end: 3500,   suffix: "+",  label: "individuals",   sub: "(Relationships, Marriages & Birth issues)" },
  { end: 2500,   suffix: "+",  label: "Students",      sub: "in career" },
  { end: 300,    suffix: "+",  label: "Business",      sub: "& factory owners" },
  { end: 90,     suffix: "+",  label: "Clients",       sub: "over 10 countries" },
  { end: 250000, suffix: " +", label: "individuals in",sub: "Webinars, YT & 1-1 sessions" },
];

function useCountUp(end: number, duration = 1800, triggered: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, end, duration]);
  return count;
}

function StatItem({ end, suffix, label, sub, triggered }: typeof STATS[0] & { triggered: boolean }) {
  const count = useCountUp(end, 1800, triggered);
  const display = end >= 1000 ? count.toLocaleString("en-IN") : count;
  return (
    <div className="flex-1 min-w-[140px] px-6 py-4 text-center" style={{ borderRight: "1px solid var(--color-border)" }}>
      <div
        className="text-4xl font-bold text-[var(--color-primary)]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {display}{suffix}
      </div>
      <div className="mt-1 text-sm font-medium text-[var(--color-text)]">{label}</div>
      <div className="mt-0.5 text-xs text-[var(--color-muted)]">{sub}</div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white px-6 py-20 md:px-20" aria-label="Statistics">
      <h2
        className="mb-12 text-center text-4xl text-[var(--color-primary)]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        So Far We&apos;ve Guided
        <em style={{ color: "#B8860B", fontStyle: "normal" }}>...</em>
      </h2>
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center" style={{ borderLeft: "1px solid var(--color-border)" }}>
        {STATS.map((s) => (
          <StatItem key={s.label + s.sub} {...s} triggered={triggered} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/StatsSection.tsx
git commit -m "feat: add StatsSection with count-up animation"
```

---

## Task 7: HowItWorksSection

**Files:**
- Create: `components/landing/HowItWorksSection.tsx`

- [ ] **Create the file**

```tsx
// components/landing/HowItWorksSection.tsx
import Link from "next/link";

export function HowItWorksSection() {
  return (
    <section
      className="flex flex-col gap-12 px-6 py-20 md:flex-row md:items-center md:px-20"
      style={{ background: "var(--color-parchment)" }}
      id="about"
      aria-label="How Deepa's Vision works"
    >
      {/* Left — text */}
      <div className="flex-1 max-w-lg">
        <p className="mb-3 text-xs uppercase tracking-[3px] text-[var(--color-accent)]">
          How it works
        </p>
        <h2
          className="mb-5 text-4xl leading-snug text-[var(--color-primary)]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          How Deepa&apos;s{" "}
          <span style={{ color: "#B8860B" }}>Shiksha</span> works?
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
          With years of experience in{" "}
          <strong className="text-[var(--color-primary)]">वैदिक Astrology</strong>,{" "}
          <strong className="text-[var(--color-primary)]">Numerology</strong>, and{" "}
          <strong className="text-[var(--color-primary)]">Lal Kitab</strong>, Deepa&apos;s
          Vision offers{" "}
          <strong className="text-[var(--color-primary)]">कर्मिक उपाय</strong> and guides
          you toward the right{" "}
          <strong className="text-[var(--color-primary)]">करियर</strong> and{" "}
          <strong className="text-[var(--color-primary)]">जीवन मार्ग</strong> — not through
          भय, but with clarity and meaningful solutions to enrich your जीवन.
        </p>

        {/* Pull quote */}
        <blockquote
          className="my-6 border-l-4 border-[var(--color-primary)] pl-5 py-3 text-sm italic text-[var(--color-text)]"
          style={{ background: "#FDF5EC" }}
        >
          &ldquo;Simply we will tell you → What you can do better than others, और you
          can outsmart the race &amp; Troubles&rdquo;
        </blockquote>

        <Link
          href="/auth/signup"
          className="inline-block bg-[var(--color-primary)] text-white px-7 py-3 text-sm font-medium tracking-wide hover:bg-[var(--color-primary-hover)] transition-colors"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Discover Now
        </Link>
      </div>

      {/* Right — service card */}
      <div className="flex-1 flex justify-center">
        <div
          className="w-full max-w-sm p-10 text-center bg-white"
          style={{ border: "1px solid var(--color-border)" }}
        >
          <div className="mb-4 text-5xl">🪬</div>
          <h3
            className="mb-3 text-xl text-[var(--color-primary)]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            1:1 Strategic Session
          </h3>
          <p className="mb-6 text-xs leading-relaxed text-[var(--color-muted)]">
            By sitting calmly in a 1-1 Discussion which works on the formula —{" "}
            <em>Session = Strategy + Direction − (Chaos × Doubts)</em>.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-[var(--color-primary)] text-white px-6 py-2.5 text-xs uppercase tracking-wider hover:bg-[var(--color-primary-hover)] transition-colors"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/HowItWorksSection.tsx
git commit -m "feat: add HowItWorksSection landing component"
```

---

## Task 8: ServicesSection

**Files:**
- Create: `components/landing/ServicesSection.tsx`

- [ ] **Create the file**

```tsx
// components/landing/ServicesSection.tsx
import Link from "next/link";

const SERVICES = [
  {
    num: 1, slug: "students-career",
    title: "Students & Career",
    items: ["Choosing the right education field", "Career hurdles or planning a switch", "Hobbies & passions", "Choosing the best for you"],
  },
  {
    num: 2, slug: "business-owners",
    title: "Business Owners",
    items: ["Expansion and Franchise", "Partnerships and collaborations", "Downfalls & solutions", "Is it worth the risk?"],
  },
  {
    num: 3, slug: "corporate-professionals",
    title: "Corporate Professionals",
    items: ["Job or Role switch", "New opportunities", "Foreign settlements", "How long to stay in the job?"],
  },
  {
    num: 4, slug: "relationships-family",
    title: "Relationships & Family",
    items: ["Resolving marriage issues", "Family disputes and resolutions", "Stress", "Childcare planning"],
  },
  {
    num: 5, slug: "mental-health",
    title: "Mental Health",
    items: ["Depression and frustration", "Insomnia", "Lack of confidence", "Poor decision-making"],
  },
  {
    num: 6, slug: "health-problems",
    title: "Health Problems",
    items: ["Heart problems (stent)", "Diabetes", "Stress", "Eating habits"],
  },
  {
    num: 7, slug: "investing",
    title: "Investing",
    items: ["Stock market, Land & property investments", "Knowing where to invest — stocks, land, gold, or other assets"],
  },
  {
    num: 8, slug: "civil-servants",
    title: "Civil Servants",
    items: ["Postings and transfer orders", "Workplace-related matters"],
  },
];

export function ServicesSection() {
  return (
    <section className="bg-white px-6 py-20 md:px-20" id="services" aria-label="Services">
      <p className="mb-2 text-center text-xs uppercase tracking-[3px] text-[var(--color-accent)]">
        Services · सेवाएं
      </p>
      <h2
        className="mb-1 text-center text-4xl text-[var(--color-primary)]"
        style={{ fontFamily: "Georgia, serif" }}
      >
        What We Cherish For You —
      </h2>
      <p className="mb-12 text-center text-sm italic text-[var(--color-muted)]">(Services)</p>

      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ num, slug, title, items }) => (
          <article
            key={slug}
            className="relative flex flex-col p-6"
            style={{ background: "var(--color-primary)" }}
          >
            {/* Number badge */}
            <span
              className="absolute top-4 right-4 text-lg font-bold"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {num}
            </span>

            <h3
              className="mb-4 font-bold text-white"
              style={{ fontFamily: "Georgia, serif", fontSize: "1rem" }}
            >
              {title}
            </h3>

            <ul className="flex-1 space-y-1">
              {items.map((item) => (
                <li key={item} className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
                  · {item}
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
              <Link
                href={`/auth/signup?service=${slug}`}
                className="block w-full py-2 text-center text-xs font-bold uppercase tracking-widest bg-white text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              >
                LET&apos;S SIT
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/ServicesSection.tsx
git commit -m "feat: add ServicesSection with 8 crimson cards"
```

---

## Task 9: WordsOfJoySection (client — carousel)

**Files:**
- Create: `components/landing/WordsOfJoySection.tsx`

- [ ] **Create the file**

```tsx
// components/landing/WordsOfJoySection.tsx
"use client";

import { useState } from "react";

type Card =
  | { type: "video"; name: string; role: string; quote: string; initial: string }
  | { type: "text";  name: string; role: string; quote: string; initial: string };

const CARDS: Card[] = [
  { type: "video", name: "Pallavi",      role: "Manager, Taj Hotels",  initial: "P", quote: "I didn't believe in remedies at first, but suddenly it all makes sense." },
  { type: "video", name: "Ritu Godhii",  role: "Entrepreneur",         initial: "R", quote: "Outstanding quality and professional service. Highly recommend to everyone." },
  { type: "text",  name: "Emily R.",     role: "CEO, StartupXYZ",      initial: "E", quote: "Professional team that delivered exceptional results on time and within budget." },
  { type: "text",  name: "David T.",     role: "Creative Director",    initial: "D", quote: "Incredible attention to detail and creative solutions that exceeded our goals." },
  { type: "video", name: "Anita S.",     role: "Homemaker, Delhi",     initial: "A", quote: "The Dosha report explained so much about my family struggles. Life-changing." },
  { type: "text",  name: "Vikram M.",    role: "Business Owner",       initial: "V", quote: "After my 1:1 session I had complete clarity on which business to pursue." },
];

const PAGE_SIZE = 4;

export function WordsOfJoySection() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(CARDS.length / PAGE_SIZE);
  const visible = CARDS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section
      className="px-6 py-20 md:px-20"
      style={{ background: "var(--color-blush)" }}
      aria-label="Client testimonials"
    >
      {/* Heading */}
      <p className="mb-2 text-center text-xs uppercase tracking-[3px] text-[var(--color-accent)]">
        Client Stories
      </p>
      <h2
        className="mb-3 text-center text-4xl"
        style={{ fontFamily: "Georgia, serif", color: "#1A0A0A" }}
      >
        Words of{" "}
        <em style={{ color: "var(--color-primary)", fontStyle: "normal" }}>Joy</em>
      </h2>
      <p className="mb-12 text-center text-sm italic text-[var(--color-muted)]">
        Real moments, genuine smiles, and heartfelt memories — these are the little sparks
        that light up our lives with joy.
      </p>

      {/* Cards */}
      <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((card, i) => (
          <div
            key={card.name + i}
            className="flex flex-col overflow-hidden bg-white"
            style={{ border: "1px solid var(--color-border)" }}
          >
            {card.type === "video" ? (
              <>
                {/* Video placeholder */}
                <div
                  className="relative flex items-center justify-center"
                  style={{ height: 200, background: "#2C1810" }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                    style={{ background: "var(--color-primary)" }}
                  >
                    <span className="ml-1 text-white text-sm">▶</span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="mb-4 text-xs italic leading-relaxed text-[var(--color-muted)]">
                    &ldquo;{card.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: "var(--color-primary)" }}
                    >
                      {card.initial}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text)]">{card.name}</p>
                      <p className="text-xs text-[var(--color-accent)]">{card.role}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 text-4xl leading-none text-[var(--color-primary)]">&ldquo;</span>
                <p className="flex-1 text-xs italic leading-relaxed text-[var(--color-muted)]">
                  {card.quote}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: "#B8860B" }}
                  >
                    {card.initial}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text)]">{card.name}</p>
                    <p className="text-xs text-[var(--color-accent)]">{card.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination arrows */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border text-lg disabled:opacity-30"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
          aria-label="Previous"
        >
          ←
        </button>
        <span className="text-xs text-[var(--color-muted)]">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border text-lg disabled:opacity-30"
          style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
          aria-label="Next"
        >
          →
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/WordsOfJoySection.tsx
git commit -m "feat: add WordsOfJoySection carousel component"
```

---

## Task 10: CtaBanner

**Files:**
- Create: `components/landing/CtaBanner.tsx`

- [ ] **Create the file**

```tsx
// components/landing/CtaBanner.tsx
import Link from "next/link";

export function CtaBanner() {
  return (
    <section
      className="px-6 py-24 text-center"
      style={{ background: "var(--color-primary)" }}
      aria-label="Call to action"
    >
      <p className="mb-3 text-xs uppercase tracking-[3px]" style={{ color: "rgba(255,255,255,0.45)" }}>
        अभी शुरू करें
      </p>
      <h2
        className="mb-4 text-4xl leading-tight text-white"
        style={{ fontFamily: "Georgia, serif" }}
      >
        अपना भविष्य जानें —
        <br />
        <span className="text-2xl font-normal italic">Know Your Destiny</span>
      </h2>
      <p className="mb-10 text-sm italic" style={{ color: "rgba(255,255,255,0.65)" }}>
        Generate your free Kundali today. Ancient wisdom, modern clarity.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/auth/signup"
          className="bg-white px-8 py-3 text-sm font-bold tracking-wide hover:bg-[var(--color-bg)] transition-colors"
          style={{ color: "var(--color-primary)", fontFamily: "Georgia, serif" }}
        >
          🪐 अपनी Kundali बनाएं
        </Link>
        <Link
          href="/auth/signup"
          className="px-8 py-3 text-sm tracking-wide transition-colors"
          style={{
            border: "1.5px solid rgba(255,255,255,0.55)",
            color: "white",
            fontFamily: "Georgia, serif",
          }}
        >
          Book a 1:1 Session
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add components/landing/CtaBanner.tsx
git commit -m "feat: add CtaBanner landing component"
```

---

## Task 11: SEO — update layout.tsx

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Replace the entire file**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deepa's Vision — Free Vedic Kundali & Astrology Online | ज्योतिष",
  description:
    "Generate your free Vedic birth chart (Kundali) online. Get Dosha reports, Vimshottari Dasha, and personalized remedies — rooted in authentic Indian astrology.",
  keywords: [
    "vedic astrology", "free kundali", "kundali online", "jyotish",
    "birth chart", "dosha report", "Indian astrology", "kundali generator",
    "vedic birth chart", "manglik dosha", "sade sati",
  ],
  openGraph: {
    title: "Deepa's Vision — Free Vedic Kundali & Astrology Online",
    description:
      "Authentic Vedic birth chart, Dosha analysis, and Dasha predictions — rooted in ancient Indian wisdom.",
    type: "website",
    locale: "en_IN",
    siteName: "Deepa's Vision",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deepa's Vision — Free Vedic Kundali",
    description: "Generate your Kundali free. Ancient wisdom, modern clarity.",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Deepa's Vision",
  description:
    "Vedic astrology service offering personalized Kundali, Dosha reports, and 1:1 strategic sessions.",
  url: "https://deepas-vision.vercel.app",
  serviceType: "Vedic Astrology",
  areaServed: { "@type": "Country", name: "India" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Astrology Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Vedic Birth Chart" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Dosha Report" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "1:1 Strategic Session" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Commit**

```bash
git add app/layout.tsx
git commit -m "seo: add full meta tags, Open Graph, and JSON-LD schema"
```

---

## Task 12: Compose page.tsx — assemble all sections

**Files:**
- Modify: `app/page.tsx`

- [ ] **Replace the entire file**

```tsx
// app/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { TornDivider } from "@/components/landing/TornDivider";
import { HeroSection } from "@/components/landing/HeroSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { WordsOfJoySection } from "@/components/landing/WordsOfJoySection";
import { CtaBanner } from "@/components/landing/CtaBanner";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main>
        {/* 1. Hero */}
        <HeroSection />

        {/* white → parchment */}
        <TornDivider fromColor="#ffffff" toColor="#F0E6D3" />

        {/* 2. Famous Testimonials */}
        <TestimonialsSection />

        {/* parchment → white */}
        <TornDivider fromColor="#F0E6D3" toColor="#ffffff" flip />

        {/* 3. Stats */}
        <StatsSection />

        {/* white → parchment */}
        <TornDivider fromColor="#ffffff" toColor="#F0E6D3" />

        {/* 4. How It Works */}
        <HowItWorksSection />

        {/* parchment → white */}
        <TornDivider fromColor="#F0E6D3" toColor="#ffffff" flip />

        {/* 5. Services */}
        <ServicesSection />

        {/* white → blush */}
        <TornDivider fromColor="#ffffff" toColor="#FDF0EC" />

        {/* 6. Words of Joy */}
        <WordsOfJoySection />

        {/* blush → crimson */}
        <TornDivider fromColor="#FDF0EC" toColor="#8B2635" />

        {/* 7. CTA Banner */}
        <CtaBanner />
      </main>

      <footer
        className="px-6 py-12 md:px-20"
        style={{ background: "#1A0A0A", color: "rgba(255,255,255,0.55)" }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-4">
          <div>
            <p className="mb-2 text-base font-semibold text-white" style={{ fontFamily: "Georgia, serif" }}>
              ★ Deepa&apos;s Vision
            </p>
            <p className="text-xs leading-relaxed italic">
              Ancient wisdom for the modern journey.
              <br />
              Vedic Astrology · Numerology · Lal Kitab
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[2px]" style={{ color: "#C8860A" }}>Explore</h4>
            {["Birth Chart", "Dosha Report", "9 Grahas", "Dashboard"].map((l) => (
              <a key={l} href="#" className="mb-2 block text-xs hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[2px]" style={{ color: "#C8860A" }}>Company</h4>
            {["About", "FAQs", "Contact", "Privacy"].map((l) => (
              <a key={l} href="#" className="mb-2 block text-xs hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="mb-3 text-xs uppercase tracking-[2px]" style={{ color: "#C8860A" }}>Connect</h4>
            {["YouTube", "Instagram", "WhatsApp"].map((l) => (
              <a key={l} href="#" className="mb-2 block text-xs hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
        <div
          className="mx-auto mt-10 flex max-w-6xl justify-between border-t pt-6 text-xs"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <span>© {new Date().getFullYear()} Deepa&apos;s Vision · Built with ancient wisdom</span>
          <span>🪐 ज्योतिष विद्या</span>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Visual check** — open http://localhost:3000 and scroll through all 7 sections. Verify:
  - Hero has orb, bubbles, two CTAs, mini-stats
  - Torn-paper dividers appear between every section
  - Testimonials: 4 dark video placeholder cards on parchment bg
  - Stats: numbers count up as you scroll into view
  - Services: 8 crimson cards, each with LET'S SIT button
  - Words of Joy: carousel arrows work (← →)
  - CTA banner: full-crimson with Hinglish heading
  - Footer: 4-column dark footer

- [ ] **Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose landing page with all 7 sections and SEO footer"
```

---

## Self-Review

**Spec coverage check:**
- [x] Hinglish throughout — nav, hero, CTAs, service names, section eyebrows
- [x] All 7 homepage sections implemented
- [x] Torn-paper SVG dividers between sections
- [x] SEO: title, description, keywords, OG, Twitter, JSON-LD
- [x] Stats count-up animation (IntersectionObserver)
- [x] Services: 8 crimson numbered cards with LET'S SIT CTA
- [x] Testimonials: video placeholder slots (user swaps src later)
- [x] Words of Joy: pagination carousel
- [x] CTA banner: `अपनी Kundali बनाएं` + `Book a 1:1 Session`
- [x] Navbar: public Hinglish nav + Let's Sit; authenticated nav unchanged
- [x] Interior pages (auth, chart, dosha, dashboard) — zero files touched

**Placeholder scan:** No TBDs, no TODOs. Video slots are intentionally placeholder by design (spec §2.3 and §2.7 explicitly say "swap later"). All code is complete.

**Type consistency:** `TornDivider` props (`fromColor`, `toColor`, `flip`) used identically in Task 2 and Task 12. `StatsSection` internal `StatItem` types match. No name drift.
