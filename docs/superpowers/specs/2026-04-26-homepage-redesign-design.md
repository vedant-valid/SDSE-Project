# Homepage Redesign — Design Spec
**Date:** 2026-04-26  
**Project:** Deepa's Vision — Vedic Astrology App  
**Scope:** Full homepage (landing page) redesign + global design system update

---

## 1. Design Language

### Aesthetic
- **Modular-ancient**: traditional Indian visual language (parchment textures, torn-paper dividers, mandala motifs) fused with clean modern layout grids
- **Tone**: warm, trustworthy, spiritual — not mystical/dark
- **Language**: Full Hinglish throughout — Hindi words/phrases mixed naturally into English sentences in headings, nav, CTAs, and body copy

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--crimson` | `#8B1A1A` | Primary brand, buttons, headings, service cards |
| `--crimson-dark` | `#6E1310` | Hover states |
| `--gold` | `#C8860A` | Accents, eyebrows, italic highlights |
| `--cream` | `#FAF7F2` | Page background |
| `--parchment` | `#F0E6D3` | Alternating section backgrounds |
| `--blush` | `#FDF0EC` | Words of Joy section bg |
| `--text` | `#2C1810` | Body text |
| `--muted` | `#7A5C46` | Secondary text, quotes |

### Typography
- **Display / headings**: Georgia serif (or system serif fallback)
- **Body / nav / labels**: Geist Sans (existing)
- **Section eyebrows**: 0.7rem, 3px letter-spacing, uppercase, `--gold`
- **Hero headline**: 3.6rem, `--crimson`
- **Hindi phrases**: inline, same font, italic where flavour text

### Torn Paper Dividers
- SVG wavy paths between alternating sections (white ↔ parchment ↔ blush)
- Used at: Hero→Testimonials, Testimonials→Stats, Stats→How it Works, How it Works→Services, Services→Words of Joy
- Reusable `<TornDivider>` component accepting `fromColor` and `toColor` props

---

## 2. Page Sections (top → bottom)

### 2.1 Navbar
- **Sticky**, white background, 1px bottom border
- **Logo**: `★ Deepa's Vision` — star in gold, text in crimson
- **Links** (uppercase, 1.5px letter-spacing): HOME · ABOUT · समाधान · PRODUCTS · 9 GRAHAS · भरोसा · FAQs · CONTACT
- **CTA button**: `Let's Sit` — outlined crimson, fills on hover
- Mobile: hamburger menu (out of scope for this spec)

### 2.2 Hero
- **Layout**: 2-column (text left, orb right), min-height 88vh, white background
- **Left column**:
  - Eyebrow: `Vedic Astrology · ज्योतिष`
  - H1: `Stuck in a doubt?` — "doubt" in gold italic
  - Subtitle: `दौड़ का ये फेरा, कौन सा रास्ता है मेरा?` (italic, muted)
  - Body: 1–2 sentences describing the app
  - CTAs: `अपनी Kundali बनाएं →` (primary) + `Learn More` (outline) → link to `/auth/signup` and `/about`
  - Mini-stats row: 3,500+ Individuals · 10+ Countries · 250K+ Lives touched
- **Right column**:
  - Warm radial gradient orb (cream→gold→amber)
  - Floating emotion bubbles: Confusion, Worry, Anger, Arrogance, Laziness, Self pity, Delusion
  - Silhouette meditation figure (SVG or CSS shape, crimson tinted)
- **SEO**: H1 contains "Vedic Astrology" + "Kundali"; meta description targets "free kundali generator India"

### 2.3 Famous Testimonials (`भरोसा`)
- **Background**: parchment (`#F0E6D3`)
- **Eyebrow**: `भरोसा — Testimonials`
- **Heading**: `What people say—`
- **Layout**: 4-column grid of cards
- **Card structure**: video thumbnail placeholder (dark, aspect-ratio 16:9) → name → role → pull quote → `▶ Watch` link
- **Placeholder names**: Manoj Bajpayee, Sourav Joshi, Ranveer Allahbadia, Sanjiv Goenka
- Videos swappable: `src` prop accepts YouTube embed URL or local video path

### 2.4 Stats Counter
- **Background**: white
- **Heading**: `So Far We've Guided...`
- **Layout**: 5-column flex row, dividers between columns
- **Stats**: 3,500+ individuals · 2,500+ Students · 300+ Business owners · 90+ Countries · 250,000+ in webinars/YT
- **Animation**: count-up on scroll into view (IntersectionObserver)

### 2.5 How Deepa's Shiksha Works
- **Background**: parchment
- **Layout**: 2-column (text left, card right)
- **Left**: eyebrow + heading `How Deepa's Shiksha works?` + Hinglish body + blockquote + `Discover Now` CTA → `/auth/signup`
- **Right**: single service card — icon + `1:1 Strategic Session` + formula description + `Learn More` button
- **Card**: white bg, 1px border, centered

### 2.6 Services Grid (`सेवाएं`)
- **Background**: white
- **Eyebrow**: `Services · सेवाएं`
- **Heading**: `What We Cherish For You —`
- **Sub**: `(Services)`
- **Layout**: 4×2 grid (8 cards)
- **Card**: dark crimson bg, white text, top-right number badge, bullet list, `LET'S SIT` button (white bg, crimson text, full-width)
- **Services**: Students & Career · Business Owners · Corporate Professionals · Relationships & Family · Mental Health · Health Problems · Investing · Civil Servants
- **CTA**: each card button links to `/auth/signup?service={slug}`

### 2.7 Words of Joy
- **Background**: blush (`#FDF0EC`)
- **Eyebrow**: `Client Stories`
- **Heading**: `Words of Joy` — "Joy" in crimson
- **Sub**: `Real moments, genuine smiles...`
- **Layout**: 4-column grid — 2 video cards + 2 text-quote cards
- **Video cards**: dark thumbnail + play button overlay + quote + avatar row below
- **Text cards**: large `"` + quote + avatar row
- **Navigation**: ← → arrow buttons below grid
- **Videos**: swappable via props

### 2.8 CTA Banner
- **Background**: crimson (full bleed)
- **Eyebrow**: `अभी शुरू करें` (white/40% opacity)
- **Heading**: `अपना भविष्य जानें — Know Your Destiny`
- **Sub**: `Generate your free Kundali today. Ancient wisdom, modern clarity.`
- **CTAs**: `🪐 अपनी Kundali बनाएं` (white filled) + `Book a 1:1 Session` (ghost outline)
- Both link to `/auth/signup`

### 2.9 Footer
- **Background**: near-black `#1A0A0A`
- **Layout**: 4-column grid — brand blurb · Explore links · Company links · Connect (social)
- **Brand**: `★ Deepa's Vision` + tagline `Ancient wisdom for the modern journey`
- **Bottom bar**: copyright + `🪐 ज्योतिष विद्या`

---

## 3. SEO Requirements

- `<title>`: `Deepa's Vision — Free Vedic Kundali & Astrology Online | ज्योतिष`
- `<meta name="description">`: `Generate your free Vedic birth chart (Kundali) online. Get Dosha reports, Vimshottari Dasha, and personalized remedies — rooted in authentic Indian astrology.`
- `<meta name="keywords">`: `vedic astrology, free kundali, kundali online, jyotish, birth chart, dosha report, Indian astrology`
- Open Graph tags: title, description, image (placeholder for now)
- Semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`, `aria-label` on sections
- H1 on page: exactly one — the hero headline
- H2 for each section heading
- Structured data: `LocalBusiness` or `Service` JSON-LD schema

---

## 4. Component Architecture

All new components live in `components/landing/`:

```
components/landing/
  TornDivider.tsx        # SVG wavy divider, fromColor + toColor props
  HeroSection.tsx        # Full hero with orb, bubbles, mini-stats
  TestimonialsSection.tsx # Famous testimonials 4-col grid
  StatsSection.tsx       # Animated counter row
  HowItWorksSection.tsx  # 2-col text + card
  ServicesSection.tsx    # 8-card grid
  WordsOfJoySection.tsx  # Video + text carousel
  CtaBanner.tsx          # Full-crimson CTA strip
```

`app/page.tsx` assembles all sections in order. Each section is a self-contained Server Component (no `"use client"`) except `StatsSection` (needs IntersectionObserver) and `WordsOfJoySection` (needs carousel state).

---

## 5. Files Changed

| File | Change |
|---|---|
| `app/page.tsx` | Full rewrite — compose landing sections |
| `app/layout.tsx` | Add SEO meta tags, JSON-LD schema |
| `app/globals.css` | Add `--blush`, `--parchment` tokens; torn-divider keyframe |
| `components/layout/Navbar.tsx` | Update links to Hinglish, add `Let's Sit` CTA |
| `components/landing/*` | 8 new components (see above) |

Existing `components/ui/*`, `components/chart/*`, auth pages, dashboard — **untouched**.

---

## 6. Out of Scope

- Mobile responsiveness (future sprint)
- Actual video embedding (placeholder slots only — user will swap)
- Admin CMS for testimonials
- Animations beyond stat count-up
