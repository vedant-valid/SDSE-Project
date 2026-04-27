# Dark Vedic Luxury — Full Site Redesign Spec
**Date:** 2026-04-26
**Project:** Deepa's Vision — Vedic Astrology App
**Scope:** Full homepage redesign with video hero + dark theme applied site-wide
**Supersedes:** `2026-04-26-homepage-redesign-design.md` (warm light theme — replaced)

---

## 1. Design Language

### Aesthetic
- **Dark Vedic Luxury**: warm indigo-black base (`#0F0A1A`) — not cold tech-black, not warm cream. Feels like the space between stars, grounded by saffron and gold.
- **Modular + premium**: editorial grid, generous whitespace, thin gold borders. Each section is visually self-contained.
- **Astrology feel**: sacred geometry (mandala SVG overlay), gold/saffron accent palette, Georgia serif headings, Hinglish copy.
- **Tone**: devotional, authoritative, cosmic — not mystical-spooky.

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--void` | `#0F0A1A` | Page base — warm indigo-black |
| `--surface` | `#1A1228` | Cards, navbar, alternating sections |
| `--surface-raised` | `#241A38` | Hover states, active cards |
| `--gold` | `#C8920A` | Primary accent — borders, icons, section headings |
| `--gold-light` | `#F0B429` | Eyebrows, number highlights, hover glows |
| `--saffron` | `#E8621A` | CTA buttons, key accents |
| `--crimson` | `#8B1A1A` | How It Works card bg, CTA banner bg base |
| `--crimson-deep` | `#5A0E0E` | CTA banner background |
| `--text` | `#EDE8F5` | Primary text |
| `--muted` | `#8A7FAA` | Secondary text, quotes, nav links default |

### Typography
- **Display / headings**: Georgia serif — color `--gold`
- **Body / nav / labels**: Geist Sans
- **Eyebrows**: 0.7rem, 3px letter-spacing, uppercase, `--gold-light`
- **Hero H1**: 3.6rem, `--gold`
- **Hindi phrases**: inline italic, same font

### Dividers
- Thin `1px` horizontal gold lines (`--gold` at 30% opacity)
- Small yantra/mandala SVG node centered on the divider line
- Replaces torn paper SVGs from previous spec

---

## 2. Hero Section

### Video Background
- Source: `bg.mp4` (4K 3840×2160, ~59s, dark cosmic + sacred geometry footage)
- Copied to `public/videos/bg.mp4`
- `<video>` tag: `autoPlay muted loop playsInline` — no controls
- `object-fit: cover`, fills full viewport (100vw × 100vh)
- `z-index: 0`, positioned absolute behind all content

### Overlay
- `linear-gradient(to right, rgba(15,10,26,0.88) 45%, rgba(15,10,26,0.25) 100%)`
- Left side fully readable; right side lets video breathe through
- Applied as an `::after` pseudo-element or overlay `<div>` above the video

### Mandala Overlay (right column)
- SVG sacred geometry / yantra — semi-transparent gold (`--gold` at 25% opacity)
- ~320px diameter, positioned right-center of hero
- CSS: `animation: spin 60s linear infinite` — imperceptibly slow rotation
- Blends with cosmic video beneath — creates depth without obstructing

### Hero Content (left column)
- Eyebrow: `Vedic Astrology · ज्योतिष` — `--gold-light`
- H1: `Stuck in a doubt?` — "doubt" in `--saffron` italic
- Subtitle: `दौड़ का ये फेरा, कौन सा रास्ता है मेरा?` — italic, `--muted`
- Body: 1–2 sentences
- CTAs: `अपनी Kundali बनाएं →` (saffron filled) + `Learn More` (gold outlined)
- Mini-stats: 3,500+ Individuals · 10+ Countries · 250K+ Lives touched — `--gold-light` numbers

### Layout
- `min-height: 100vh`
- 2-column CSS grid: `55% text / 45% mandala`
- Mandala column: `display: flex; align-items: center; justify-content: center`

---

## 3. Page Sections

### 3.1 Navbar
- Background: `--surface` (`#1A1228`), sticky, `border-bottom: 1px solid rgba(200,146,10,0.2)`
- Logo: `★ Deepa's Vision` — `★` in `--gold`, text in `--gold-light`
- Links (uppercase, 1.5px spacing): HOME · ABOUT · समाधान · PRODUCTS · 9 GRAHAS · भरोसा · FAQs · CONTACT
  - Default: `--muted` | Hover: `--gold`
- CTA `Let's Sit`: `--saffron` outlined, fills on hover

### 3.2 Testimonials (`भरोसा`)
- Background: `--surface`
- Eyebrow: `भरोसा — Testimonials` | Heading: `What people say—`
- 4-column card grid
- Card: `--surface-raised` bg, `border: 1px solid rgba(200,146,10,0.3)`, hover: `box-shadow: 0 0 20px rgba(200,146,10,0.15)`
- Video thumbnail: near-black bg, gold `▶` play button overlay
- Names, roles, quotes in `--text` / `--muted`

### 3.3 Stats Counter
- Background: `--void` (no section break — seamless with page)
- Heading: `So Far We've Guided...` — `--gold`
- Numbers: `--gold-light`, large bold
- Dividers: `1px` vertical gold lines between columns
- Count-up animation on IntersectionObserver scroll trigger

### 3.4 How It Works
- Background: `--surface`
- Layout: 2-column — text left, card right
- Service card: `--crimson` bg (`#8B1A1A`), white text, `border: 1px solid rgba(200,146,10,0.4)` — rich and warm on dark

### 3.5 Services Grid (`सेवाएं`)
- Background: `--void`
- Eyebrow + heading pattern
- 4×2 grid (8 cards)
- Card: `--surface` bg, `border: 1px solid rgba(200,146,10,0.3)`, hover → `--surface-raised` + gold glow
- Number badge top-right: `--gold-light`
- `LET'S SIT` button: `--saffron`, full-width

### 3.6 Words of Joy
- Background: `--surface`
- 4-column grid: 2 video cards + 2 text-quote cards
- Quote cards: `--surface-raised`, `"` in `--gold`, 4rem
- Video cards: near-black thumbnail, `--saffron` play button
- Navigation: `←` `→` in gold

### 3.7 CTA Banner
- Background: `--crimson-deep` (`#5A0E0E`) — full bleed
- Eyebrow: `अभी शुरू करें` — white 40% opacity
- Heading: `अपना भविष्य जानें — Know Your Destiny` — `--gold-light`
- Primary CTA: `--gold-light` filled, `#0F0A1A` text — premium inversion
- Ghost CTA: gold outlined, white text

### 3.8 Footer
- Background: `#070410` — darkest on page, ground the experience
- 4-column: brand blurb · Explore · Company · Connect
- Logo: `★ Deepa's Vision` in `--gold`
- Links: `--muted` default, `--gold` hover
- Bottom bar: copyright + `🪐 ज्योतिष विद्या`

---

## 4. Component Architecture

```
public/
  videos/
    bg.mp4                    # Copied from /Users/vedantmadne/Desktop/banner/

components/layout/
  Navbar.tsx                  # Dark sticky nav (updated from previous spec)

components/landing/
  HeroSection.tsx             # Video bg + mandala overlay + content
  MandalaSVG.tsx              # Sacred geometry SVG, animatable
  GoldDivider.tsx             # Thin gold line + yantra node
  TestimonialsSection.tsx     # Dark card grid
  StatsSection.tsx            # Count-up (client component)
  HowItWorksSection.tsx       # 2-col dark layout
  ServicesSection.tsx         # 8-card dark grid
  WordsOfJoySection.tsx       # Carousel (client component)
  CtaBanner.tsx               # Deep crimson full-bleed strip
  Footer.tsx                  # Darkest footer
```

`app/page.tsx` — full rewrite composing all sections.
`app/globals.css` — replace light palette with dark token set.
`app/layout.tsx` — update metadata title/description, add JSON-LD schema.
`next.config.ts` — no changes needed (video served from `/public`).

---

## 5. Key Implementation Notes

- **Video file**: must be copied to `public/videos/bg.mp4` (Next.js serves `public/` statically). Do not reference the Desktop path directly.
- **Video performance**: add `preload="none"` to avoid blocking initial paint; swap to `preload="auto"` if user reports slow hero load.
- **Mandala SVG**: inline SVG preferred over `<img>` — allows CSS color inheritance and animation. Use a yantra or Sri Chakra-inspired geometric pattern built from `<circle>`, `<polygon>`, `<line>` primitives.
- **No glassmorphism**: Option B deliberately avoids frosted blur — solid dark surfaces with gold borders read more expensive and are simpler to implement.
- **Client components**: only `StatsSection` and `WordsOfJoySection` need `"use client"` (IntersectionObserver + carousel state). Everything else is Server Components.
- **`bg-void` Tailwind token**: define in `globals.css` as `--void: #0F0A1A` and extend Tailwind config if needed, or use inline `style` for the exact value.

---

## 6. SEO (unchanged from previous spec)
- `<title>`: `Deepa's Vision — Free Vedic Kundali & Astrology Online | ज्योतिष`
- `<meta name="description">`: `Generate your free Vedic birth chart (Kundali) online. Get Dosha reports, Vimshottari Dasha, and personalized remedies — rooted in authentic Indian astrology.`
- Semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- One H1 on page (hero headline)
- H2 for each section heading
- `LocalBusiness` JSON-LD schema in `layout.tsx`

---

## 7. Out of Scope
- Mobile responsiveness
- Actual video content swapping via CMS
- Dark/light mode toggle (site is dark-only)
- Animations beyond stat count-up and mandala rotation
