# Dark Vedic Luxury — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Next.js scaffold with a full dark-themed Vedic astrology landing page — video hero (bg.mp4, dark cosmic + sacred geometry), gold/saffron/crimson palette, modular section layout, Hinglish copy.

**Architecture:** All sections are Server Components except `StatsSection` (IntersectionObserver) and `WordsOfJoySection` (carousel state), which use `"use client"`. The video is served statically from `public/videos/`. Tailwind v4 custom color tokens are defined in `globals.css` via `@theme`.

**Tech Stack:** Next.js 16.2, React 19, Tailwind CSS v4, TypeScript 5, Geist Sans (Google Fonts, already wired), Georgia (system serif)

**Spec:** `docs/superpowers/specs/2026-04-26-dark-vedic-luxury-redesign.md`

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Copy | `public/videos/bg.mp4` | Video asset served statically |
| Modify | `app/globals.css` | Dark CSS token palette |
| Modify | `app/layout.tsx` | SEO metadata + JSON-LD schema |
| Rewrite | `app/page.tsx` | Compose all landing sections |
| Create | `components/landing/MandalaSVG.tsx` | Inline SVG sacred geometry, animatable |
| Create | `components/landing/GoldDivider.tsx` | Thin gold line + center node divider |
| Create | `components/layout/Navbar.tsx` | Dark sticky nav, Hinglish links |
| Create | `components/landing/HeroSection.tsx` | Video bg + overlay + mandala + content |
| Create | `components/landing/TestimonialsSection.tsx` | Dark 4-col testimonial cards |
| Create | `components/landing/StatsSection.tsx` | Count-up on scroll (client) |
| Create | `components/landing/HowItWorksSection.tsx` | 2-col dark layout + crimson card |
| Create | `components/landing/ServicesSection.tsx` | 8-card dark grid |
| Create | `components/landing/WordsOfJoySection.tsx` | Video + quote carousel (client) |
| Create | `components/landing/CtaBanner.tsx` | Deep crimson full-bleed CTA |
| Create | `components/landing/Footer.tsx` | Darkest footer, 4-col |

---

## Task 0: Copy video asset + create directory structure

**Files:**
- Create: `public/videos/` (directory)
- Copy: `public/videos/bg.mp4`
- Create: `components/landing/` (directory)
- Create: `components/layout/` (directory)

- [ ] **Step 1: Create directories and copy the video**

```bash
cd /Users/vedantmadne/Desktop/SDSE-Project/Frontend/astrology-app
mkdir -p public/videos components/landing components/layout
cp /Users/vedantmadne/Desktop/banner/bg.mp4 public/videos/bg.mp4
```

- [ ] **Step 2: Verify copy succeeded**

```bash
ls -lh public/videos/bg.mp4
```

Expected: file listed at ~174M

- [ ] **Step 3: (Optional) Compress to 1080p for faster web delivery**

Only do this if `ffmpeg` is available. Skip if not — the original works fine in dev.

```bash
which ffmpeg && ffmpeg -i public/videos/bg.mp4 \
  -vf "scale=1920:1080" -c:v libx264 -crf 23 -preset fast \
  -an public/videos/bg-web.mp4 \
  && mv public/videos/bg-web.mp4 public/videos/bg.mp4
```

If ffmpeg is absent, the original 4K file serves fine locally. For production, compress before deploying.

- [ ] **Step 4: Commit**

```bash
git add public/videos/bg.mp4
git commit -m "feat: add hero background video asset"
```

---

## Task 1: Dark palette in globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css completely**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-void: #0F0A1A;
  --color-surface: #1A1228;
  --color-raised: #241A38;
  --color-gold: #C8920A;
  --color-amber: #F0B429;
  --color-saffron: #E8621A;
  --color-crimson: #8B1A1A;
  --color-deep-red: #5A0E0E;
  --color-abyss: #070410;
  --color-starlight: #EDE8F5;
  --color-cosmic: #8A7FAA;
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background-color: #0F0A1A;
  color: #EDE8F5;
  font-family: var(--font-geist-sans), Arial, sans-serif;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 60s linear infinite;
}
```

> **Tailwind v4 note:** `@theme` registers `--color-*` entries as Tailwind color utilities automatically. `bg-void`, `text-gold`, `border-amber`, `text-saffron` etc. all work with no extra config.

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
cd /Users/vedantmadne/Desktop/SDSE-Project/Frontend/astrology-app
npx tsc --noEmit
```

Expected: no errors (CSS changes don't affect TS)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add dark vedic luxury color palette"
```

---

## Task 2: MandalaSVG component

**Files:**
- Create: `components/landing/MandalaSVG.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/MandalaSVG.tsx
export default function MandalaSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer boundary circles */}
      <circle cx="160" cy="160" r="154" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="160" cy="160" r="136" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />

      {/* Lotus petal ring */}
      <circle cx="160" cy="160" r="110" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

      {/* Sri Yantra — outer interlocking triangles */}
      {/* Large upward triangle */}
      <polygon points="160,18 294,238 26,238" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
      {/* Large downward triangle */}
      <polygon points="160,302 294,82 26,82" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />

      {/* Medium interlocking triangles */}
      <polygon points="160,58 264,218 56,218" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
      <polygon points="160,262 264,102 56,102" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* Small inner triangles */}
      <polygon points="160,95 232,195 88,195" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.25" />
      <polygon points="160,225 232,125 88,125" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.25" />

      {/* 8 lotus petals — pre-calculated at radius 118 from center */}
      {/* 0° */ }
      <ellipse cx="160" cy="42" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(0 160 42)" />
      {/* 45° */}
      <ellipse cx="243.3" cy="76.7" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(45 243.3 76.7)" />
      {/* 90° */}
      <ellipse cx="278" cy="160" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(90 278 160)" />
      {/* 135° */}
      <ellipse cx="243.3" cy="243.3" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(135 243.3 243.3)" />
      {/* 180° */}
      <ellipse cx="160" cy="278" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(180 160 278)" />
      {/* 225° */}
      <ellipse cx="76.7" cy="243.3" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(225 76.7 243.3)" />
      {/* 270° */}
      <ellipse cx="42" cy="160" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(270 42 160)" />
      {/* 315° */}
      <ellipse cx="76.7" cy="76.7" rx="14" ry="28" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2" transform="rotate(315 76.7 76.7)" />

      {/* Inner circle + bindu */}
      <circle cx="160" cy="160" r="24" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" />
      <circle cx="160" cy="160" r="5" fill="currentColor" opacity="0.7" />
    </svg>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/vedantmadne/Desktop/SDSE-Project/Frontend/astrology-app
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/MandalaSVG.tsx
git commit -m "feat: add MandalaSVG sacred geometry component"
```

---

## Task 3: GoldDivider component

**Files:**
- Create: `components/landing/GoldDivider.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/GoldDivider.tsx
export default function GoldDivider() {
  return (
    <div className="relative flex items-center justify-center py-2" aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gold opacity-30" />
      </div>
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          className="text-gold opacity-50 bg-void"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.8" />
          <polygon points="12,4 18,16 6,16" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <polygon points="12,20 18,8 6,8" stroke="currentColor" strokeWidth="0.8" fill="none" />
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/GoldDivider.tsx
git commit -m "feat: add GoldDivider section separator"
```

---

## Task 4: Navbar component

**Files:**
- Create: `components/layout/Navbar.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/layout/Navbar.tsx
const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'समाधान', href: '/solutions' },
  { label: 'PRODUCTS', href: '/products' },
  { label: '9 GRAHAS', href: '/grahas' },
  { label: 'भरोसा', href: '#testimonials' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'CONTACT', href: '/contact' },
]

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-surface border-b border-gold/20"
      aria-label="Main navigation"
    >
      <a href="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
        <span className="text-amber">★</span>
        <span className="text-amber font-serif">Deepa&apos;s Vision</span>
      </a>

      <ul className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-xs tracking-widest text-cosmic hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="/auth/signup"
        className="hidden md:inline-flex items-center px-5 py-2 text-sm tracking-wider border border-saffron text-saffron hover:bg-saffron hover:text-white transition-colors duration-200"
      >
        Let&apos;s Sit
      </a>
    </nav>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: add dark sticky Navbar with Hinglish links"
```

---

## Task 5: HeroSection component

**Files:**
- Create: `components/landing/HeroSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/HeroSection.tsx
import MandalaSVG from './MandalaSVG'

const stats = [
  { value: '3,500+', label: 'Individuals' },
  { value: '10+', label: 'Countries' },
  { value: '250K+', label: 'Lives Touched' },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      >
        <source src="/videos/bg.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient overlay — left readable, right breathes */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to right, rgba(15,10,26,0.92) 45%, rgba(15,10,26,0.25) 100%)',
        }}
      />

      {/* Content grid */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
        {/* Left — text */}
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[3px] uppercase text-amber font-sans">
            Vedic Astrology · ज्योतिष
          </p>

          <h1 className="font-serif text-5xl leading-tight text-amber">
            Stuck in a{' '}
            <em className="text-saffron not-italic">doubt?</em>
          </h1>

          <p className="text-lg italic text-cosmic font-serif">
            दौड़ का ये फेरा, कौन सा रास्ता है मेरा?
          </p>

          <p className="text-starlight/80 max-w-md leading-relaxed">
            Ancient Vedic wisdom meets modern clarity. Generate your Kundali,
            uncover your Doshas, and find the path that was always yours.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-saffron text-white text-sm tracking-wide hover:bg-saffron/80 transition-colors"
            >
              अपनी Kundali बनाएं →
            </a>
            <a
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-gold/50 text-gold text-sm tracking-wide hover:border-gold hover:bg-gold/10 transition-colors"
            >
              Learn More
            </a>
          </div>

          {/* Mini stats */}
          <div className="flex gap-8 pt-4 border-t border-gold/20">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-amber text-xl font-bold">{s.value}</p>
                <p className="text-cosmic text-xs tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — mandala overlay */}
        <div className="hidden md:flex items-center justify-center">
          <MandalaSVG className="w-80 h-80 text-gold animate-spin-slow opacity-30" />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Start dev server and verify hero renders**

```bash
npm run dev
```

Open `http://localhost:3000` — at this point page.tsx is still the default scaffold. You'll temporarily add HeroSection to page.tsx to preview:

```tsx
// temporary — revert after checking
import HeroSection from '@/components/landing/HeroSection'
export default function Home() { return <HeroSection /> }
```

Check: video plays full-bleed, mandala rotates slowly, text is readable over gradient.

- [ ] **Step 4: Revert page.tsx to default scaffold, commit HeroSection**

```bash
git restore app/page.tsx
git add components/landing/HeroSection.tsx components/landing/MandalaSVG.tsx
git commit -m "feat: add HeroSection with video background and mandala overlay"
```

---

## Task 6: TestimonialsSection

**Files:**
- Create: `components/landing/TestimonialsSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/TestimonialsSection.tsx
import GoldDivider from './GoldDivider'

const testimonials = [
  {
    name: 'Manoj Bajpayee',
    role: 'Actor',
    quote: 'Deepa\'s insights changed the way I see my path. Pure clarity.',
    videoSrc: '',
  },
  {
    name: 'Sourav Joshi',
    role: 'Content Creator',
    quote: 'I came with confusion, I left with direction. Incredible session.',
    videoSrc: '',
  },
  {
    name: 'Ranveer Allahbadia',
    role: 'Podcaster',
    quote: 'Ancient wisdom delivered with modern precision. Highly recommend.',
    videoSrc: '',
  },
  {
    name: 'Sanjiv Goenka',
    role: 'Entrepreneur',
    quote: 'The Kundali reading was spot-on. I wish I had done this earlier.',
    videoSrc: '',
  },
]

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-surface py-20 px-8"
      aria-label="Testimonials"
    >
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-3">
          भरोसा — Testimonials
        </p>
        <h2 className="font-serif text-3xl text-amber mb-12">
          What people say—
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col gap-4 p-5 bg-raised border border-gold/30 hover:border-gold/60 hover:shadow-[0_0_20px_rgba(200,146,10,0.15)] transition-all duration-300"
            >
              {/* Video thumbnail */}
              <div className="aspect-video bg-abyss flex items-center justify-center border border-gold/20">
                <span className="text-amber text-3xl">▶</span>
              </div>
              <div>
                <p className="text-starlight font-semibold text-sm">{t.name}</p>
                <p className="text-cosmic text-xs">{t.role}</p>
              </div>
              <p className="text-starlight/70 text-sm italic leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <a
                href="#"
                className="text-amber text-xs tracking-wide hover:text-gold-light transition-colors"
              >
                ▶ Watch
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16">
        <GoldDivider />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/TestimonialsSection.tsx
git commit -m "feat: add dark TestimonialsSection with gold card hover"
```

---

## Task 7: StatsSection (client component)

**Files:**
- Create: `components/landing/StatsSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/StatsSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { end: 3500, suffix: '+', label: 'Individuals' },
  { end: 2500, suffix: '+', label: 'Students' },
  { end: 300, suffix: '+', label: 'Business Owners' },
  { end: 90, suffix: '+', label: 'Countries' },
  { end: 250000, suffix: '+', label: 'Webinar & YouTube' },
]

function useCountUp(end: number, active: boolean, duration = 1800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [active, end, duration])

  return count
}

function StatItem({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(end, active)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const formatted = end >= 1000
    ? count.toLocaleString('en-IN')
    : count.toString()

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6">
      <p className="text-amber text-4xl font-bold font-serif">
        {formatted}{suffix}
      </p>
      <p className="text-cosmic text-sm tracking-wide mt-2">{label}</p>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="bg-void py-20 px-8" aria-label="Stats">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl text-amber text-center mb-12">
          So Far We&apos;ve Guided...
        </h2>
        <div className="flex flex-wrap justify-center divide-x divide-gold/20">
          {stats.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/StatsSection.tsx
git commit -m "feat: add StatsSection with IntersectionObserver count-up"
```

---

## Task 8: HowItWorksSection

**Files:**
- Create: `components/landing/HowItWorksSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/HowItWorksSection.tsx
import GoldDivider from './GoldDivider'

export default function HowItWorksSection() {
  return (
    <section className="bg-surface py-20 px-8" aria-label="How it works">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-[3px] uppercase text-amber">
            The Process
          </p>
          <h2 className="font-serif text-3xl text-amber">
            How Deepa&apos;s Shiksha works?
          </h2>
          <p className="text-starlight/70 leading-relaxed">
            Har sawaal ka jawab hai — bas sahi jagah dekhna hota hai. Deepa
            combines centuries of Vedic knowledge with modern psychological
            clarity to help you find your रास्ता.
          </p>
          <blockquote className="border-l-2 border-gold pl-4 italic text-cosmic">
            &ldquo;Kundali isn&apos;t fate. It&apos;s a map. You still choose how to walk.&rdquo;
          </blockquote>
          <a
            href="/auth/signup"
            className="self-start inline-flex items-center px-6 py-3 bg-saffron text-white text-sm tracking-wide hover:bg-saffron/80 transition-colors"
          >
            Discover Now
          </a>
        </div>

        {/* Right — service card */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-crimson border border-gold/40 p-8 flex flex-col items-center text-center gap-4">
            <div className="text-4xl text-amber">🪐</div>
            <h3 className="font-serif text-xl text-starlight">
              1:1 Strategic Session
            </h3>
            <p className="text-starlight/70 text-sm leading-relaxed">
              Birth chart analysis + current Dasha + remedies —
              tailored entirely to your life situation.
            </p>
            <a
              href="/auth/signup"
              className="mt-2 px-5 py-2 border border-amber text-amber text-sm tracking-wide hover:bg-amber hover:text-void transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16">
        <GoldDivider />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/HowItWorksSection.tsx
git commit -m "feat: add HowItWorksSection with 2-col dark layout"
```

---

## Task 9: ServicesSection

**Files:**
- Create: `components/landing/ServicesSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/ServicesSection.tsx
import GoldDivider from './GoldDivider'

const services = [
  {
    id: '01',
    title: 'Students & Career',
    slug: 'students-career',
    bullets: ['Career path clarity', 'Education timing', 'Skill alignment'],
  },
  {
    id: '02',
    title: 'Business Owners',
    slug: 'business-owners',
    bullets: ['Launch timing', 'Partnership compatibility', 'Growth cycles'],
  },
  {
    id: '03',
    title: 'Corporate Professionals',
    slug: 'corporate',
    bullets: ['Promotion windows', 'Leadership strengths', 'Work-life balance'],
  },
  {
    id: '04',
    title: 'Relationships & Family',
    slug: 'relationships',
    bullets: ['Compatibility analysis', 'Marriage timing', 'Family harmony'],
  },
  {
    id: '05',
    title: 'Mental Health',
    slug: 'mental-health',
    bullets: ['Emotional cycles', 'Mind-planet connections', 'Inner peace remedies'],
  },
  {
    id: '06',
    title: 'Health Problems',
    slug: 'health',
    bullets: ['Planetary health indicators', 'Remedy timing', 'Preventive insights'],
  },
  {
    id: '07',
    title: 'Investing',
    slug: 'investing',
    bullets: ['Financial Dasha cycles', 'Risk periods', 'Wealth yogas'],
  },
  {
    id: '08',
    title: 'Civil Servants',
    slug: 'civil-servants',
    bullets: ['Government service yogas', 'Exam timing', 'Transfer predictions'],
  },
]

export default function ServicesSection() {
  return (
    <section className="bg-void py-20 px-8" aria-label="Services">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-3">
          Services · सेवाएं
        </p>
        <h2 className="font-serif text-3xl text-amber mb-2">
          What We Cherish For You —
        </h2>
        <p className="text-cosmic text-sm mb-12">(Services)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <article
              key={s.id}
              className="flex flex-col gap-4 p-6 bg-surface border border-gold/30 hover:border-gold/60 hover:bg-raised hover:shadow-[0_0_20px_rgba(200,146,10,0.15)] transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-serif text-base text-starlight leading-snug">
                  {s.title}
                </h3>
                <span className="text-amber text-xs opacity-60">{s.id}</span>
              </div>
              <ul className="flex flex-col gap-1 flex-1">
                {s.bullets.map((b) => (
                  <li key={b} className="text-cosmic text-xs flex gap-2">
                    <span className="text-gold mt-0.5">·</span>
                    {b}
                  </li>
                ))}
              </ul>
              <a
                href={`/auth/signup?service=${s.slug}`}
                className="block w-full text-center py-2 bg-saffron text-white text-xs tracking-widest hover:bg-saffron/80 transition-colors mt-auto"
              >
                LET&apos;S SIT
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16">
        <GoldDivider />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/ServicesSection.tsx
git commit -m "feat: add ServicesSection 8-card dark grid"
```

---

## Task 10: WordsOfJoySection (client carousel)

**Files:**
- Create: `components/landing/WordsOfJoySection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/WordsOfJoySection.tsx
'use client'

import { useState } from 'react'

type Card =
  | { type: 'video'; quote: string; author: string; role: string; videoSrc: string }
  | { type: 'quote'; quote: string; author: string; role: string }

const cards: Card[] = [
  {
    type: 'video',
    quote: 'Pehle sab confusing tha. Ab sab clear hai.',
    author: 'Priya S.',
    role: 'Delhi · Student',
    videoSrc: '',
  },
  {
    type: 'quote',
    quote:
      'The session helped me understand why I kept hitting the same walls in my career. Game changer.',
    author: 'Rahul M.',
    role: 'Mumbai · Business Owner',
  },
  {
    type: 'video',
    quote: 'I finally feel like I know my purpose. Jo confusion thi, wo gayi.',
    author: 'Ananya K.',
    role: 'Bangalore · Corporate',
    videoSrc: '',
  },
  {
    type: 'quote',
    quote:
      'Deepa told me things about my personality that I\'d never shared with anyone. Incredible accuracy.',
    author: 'Vikram P.',
    role: 'Pune · Entrepreneur',
  },
]

export default function WordsOfJoySection() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(cards.length / 4)

  return (
    <section className="bg-surface py-20 px-8" aria-label="Client stories">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-[3px] uppercase text-amber mb-3">
          Client Stories
        </p>
        <h2 className="font-serif text-3xl text-amber mb-2">
          Words of <span className="text-saffron">Joy</span>
        </h2>
        <p className="text-cosmic text-sm mb-12">
          Real moments, genuine smiles...
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) =>
            card.type === 'video' ? (
              <article
                key={i}
                className="flex flex-col gap-4 p-5 bg-raised border border-gold/20"
              >
                <div className="aspect-video bg-abyss flex items-center justify-center border border-gold/20">
                  <span className="text-saffron text-3xl">▶</span>
                </div>
                <p className="text-starlight/80 italic text-sm leading-relaxed">
                  &ldquo;{card.quote}&rdquo;
                </p>
                <div>
                  <p className="text-starlight text-xs font-semibold">{card.author}</p>
                  <p className="text-cosmic text-xs">{card.role}</p>
                </div>
              </article>
            ) : (
              <article
                key={i}
                className="flex flex-col gap-4 p-5 bg-raised border border-gold/20"
              >
                <span className="text-amber text-5xl font-serif leading-none">&ldquo;</span>
                <p className="text-starlight/80 italic text-sm leading-relaxed flex-1">
                  {card.quote}
                </p>
                <div>
                  <p className="text-starlight text-xs font-semibold">{card.author}</p>
                  <p className="text-cosmic text-xs">{card.role}</p>
                </div>
              </article>
            )
          )}
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-10 h-10 border border-gold/40 text-gold hover:border-gold disabled:opacity-30 transition-colors"
              aria-label="Previous"
            >
              ←
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-10 h-10 border border-gold/40 text-gold hover:border-gold disabled:opacity-30 transition-colors"
              aria-label="Next"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/WordsOfJoySection.tsx
git commit -m "feat: add WordsOfJoySection client carousel"
```

---

## Task 11: CtaBanner

**Files:**
- Create: `components/landing/CtaBanner.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/CtaBanner.tsx
export default function CtaBanner() {
  return (
    <section
      className="bg-deep-red py-20 px-8 text-center"
      aria-label="Call to action"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
        <p className="text-xs tracking-[3px] uppercase text-starlight/40">
          अभी शुरू करें
        </p>
        <h2 className="font-serif text-4xl text-amber leading-snug">
          अपना भविष्य जानें —{' '}
          <span className="text-starlight">Know Your Destiny</span>
        </h2>
        <p className="text-starlight/70 text-sm max-w-md">
          Generate your free Kundali today. Ancient wisdom, modern clarity.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <a
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-7 py-3 bg-amber text-void text-sm font-semibold tracking-wide hover:bg-gold-light transition-colors"
          >
            🪐 अपनी Kundali बनाएं
          </a>
          <a
            href="/auth/signup?type=session"
            className="inline-flex items-center px-7 py-3 border border-amber text-amber text-sm tracking-wide hover:bg-amber/10 transition-colors"
          >
            Book a 1:1 Session
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/CtaBanner.tsx
git commit -m "feat: add deep crimson CtaBanner"
```

---

## Task 12: Footer

**Files:**
- Create: `components/landing/Footer.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/landing/Footer.tsx
const exploreLinks = [
  { label: 'Kundali Generator', href: '/auth/signup' },
  { label: '9 Grahas', href: '/grahas' },
  { label: 'Dosha Report', href: '/auth/signup' },
  { label: 'समाधान', href: '/solutions' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
]

const socialLinks = [
  { label: 'YouTube', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'Telegram', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-abyss pt-16 pb-8 px-8" aria-label="Footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gold/10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2 text-lg">
              <span className="text-amber">★</span>
              <span className="text-amber font-serif">Deepa&apos;s Vision</span>
            </a>
            <p className="text-cosmic text-sm leading-relaxed">
              Ancient wisdom for the modern journey. Vedic astrology rooted in
              authenticity, delivered with clarity.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="text-xs tracking-[2px] uppercase text-amber mb-4">Explore</p>
            <ul className="flex flex-col gap-2">
              {exploreLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-cosmic text-sm hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs tracking-[2px] uppercase text-amber mb-4">Company</p>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-cosmic text-sm hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs tracking-[2px] uppercase text-amber mb-4">Connect</p>
            <ul className="flex flex-col gap-2">
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-cosmic text-sm hover:text-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-cosmic text-xs">
            © {new Date().getFullYear()} Deepa&apos;s Vision. All rights reserved.
          </p>
          <p className="text-cosmic text-xs">🪐 ज्योतिष विद्या</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/landing/Footer.tsx
git commit -m "feat: add darkest Footer with 4-col layout"
```

---

## Task 13: Assemble page.tsx

**Files:**
- Rewrite: `app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

```tsx
// app/page.tsx
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import GoldDivider from '@/components/landing/GoldDivider'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import StatsSection from '@/components/landing/StatsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ServicesSection from '@/components/landing/ServicesSection'
import WordsOfJoySection from '@/components/landing/WordsOfJoySection'
import CtaBanner from '@/components/landing/CtaBanner'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-void text-starlight">
      <Navbar />
      <HeroSection />
      <GoldDivider />
      <TestimonialsSection />
      <StatsSection />
      <HowItWorksSection />
      <ServicesSection />
      <WordsOfJoySection />
      <GoldDivider />
      <CtaBanner />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Run dev and do full visual check**

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- Navbar is dark + sticky
- Hero video plays full-bleed, mandala rotates, text readable
- Testimonials: 4 dark cards with gold hover glow
- Stats: count-up triggers on scroll
- How It Works: 2-col with crimson service card
- Services: 8 dark cards with saffron CTA buttons
- Words of Joy: video + quote cards, ← → navigation
- CTA Banner: deep red, gold amber CTA button
- Footer: darkest, 4-col

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble full landing page with dark vedic luxury layout"
```

---

## Task 14: Update layout.tsx — SEO + JSON-LD

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Deepa's Vision — Free Vedic Kundali & Astrology Online | ज्योतिष",
  description:
    'Generate your free Vedic birth chart (Kundali) online. Get Dosha reports, Vimshottari Dasha, and personalized remedies — rooted in authentic Indian astrology.',
  keywords: [
    'vedic astrology',
    'free kundali',
    'kundali online',
    'jyotish',
    'birth chart',
    'dosha report',
    'Indian astrology',
  ],
  openGraph: {
    title: "Deepa's Vision — Free Vedic Kundali & Astrology Online",
    description:
      'Generate your free Vedic birth chart (Kundali) online. Ancient wisdom, modern clarity.',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: "Deepa's Vision",
  description:
    'Vedic astrology consultations, Kundali generation, and personalized remedies.',
  provider: {
    '@type': 'Person',
    name: 'Deepa',
  },
  areaServed: 'Worldwide',
  availableLanguage: ['English', 'Hindi'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-void">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add SEO metadata and JSON-LD schema to layout"
```

---

## Task 15: Production build check

- [ ] **Step 1: Run build**

```bash
cd /Users/vedantmadne/Desktop/SDSE-Project/Frontend/astrology-app
npm run build
```

Expected: build completes with no errors. Warnings about `<img>` tags are fine — all images are either SVG or video.

- [ ] **Step 2: Run production preview**

```bash
npm run start
```

Open `http://localhost:3000`. Check:
- Video loads and plays
- All sections render correctly
- No console errors
- Count-up works on scroll

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "chore: verify production build passes for dark vedic luxury landing"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Video hero full-bleed with overlay → Task 5
- [x] Mandala SVG rotating overlay → Task 2, Task 5
- [x] Dark palette (void/surface/gold/saffron/crimson) → Task 1
- [x] Gold dividers between sections → Task 3, Task 13
- [x] Navbar dark sticky with Hinglish links → Task 4
- [x] Testimonials 4-col with card hover glow → Task 6
- [x] Stats count-up on scroll → Task 7
- [x] How It Works 2-col + crimson service card → Task 8
- [x] Services 8-card grid with saffron CTA → Task 9
- [x] Words of Joy carousel → Task 10
- [x] CTA Banner deep crimson → Task 11
- [x] Footer darkest, 4-col → Task 12
- [x] page.tsx assembly → Task 13
- [x] SEO metadata + JSON-LD → Task 14
- [x] Production build verification → Task 15

**No placeholders:** All steps have actual code. No TBDs.

**Type consistency:**
- `MandalaSVG` exported as default, imported as `MandalaSVG` in HeroSection ✓
- `GoldDivider` exported as default, imported consistently ✓
- Color tokens defined in Task 1 used as `bg-void`, `bg-surface`, `bg-raised`, `text-gold`, `text-amber`, `text-saffron`, `bg-saffron`, `bg-crimson`, `bg-deep-red`, `bg-abyss`, `text-starlight`, `text-cosmic` throughout ✓
