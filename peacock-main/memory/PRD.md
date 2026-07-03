# Peacock Blouse House — Cinematic 3D Landing Page

## Original Problem Statement
Build a fully scroll-animated, 3D interactive landing page for a clothing brand
called "Peacock Blouse House." The entire site should feel cinematic — every
scroll action should trigger camera zooms, parallax shifts, and smooth
transitions. Dark, luxurious jewel-tone palette (emerald, sapphire, gold).
Sections: Hero (3D procedural peacock with iridescent shader + feather-by-feather
reveal + brand text), About Us (panel-by-panel reveal + particles), Cloth Quality
(fabric close-ups + counting stats), Why Choose Us (feature cards with 3D tilt),
Footer (peacock feather divider + newsletter signup).

## Tech Stack
- React 19 + CRA (craco) + Tailwind (existing template)
- three@0.170, @react-three/fiber@9, @react-three/drei@10 for 3D
- lenis for smooth momentum scroll
- gsap installed (currently using RAF-driven scroll linking; can swap)
- FastAPI + MongoDB backend for newsletter persistence
- sonner for toasts, lucide-react for icons
- Fonts: Cormorant Garamond (serif headings) + Manrope (body)

## User Choices
- Procedurally generated peacock (feathers via custom GLSL iridescent shader on planes)
- Placeholder brand copy (user will supply later)
- Ambient sound toggle (muted by default, procedural WebAudio drone)
- Newsletter persisted to MongoDB (Neon Postgres was requested but platform only
  supports Mongo)
- Cormorant Garamond + Manrope typography

## Architecture
- `frontend/src/App.js` — main container: Preloader → CustomCursor → AmbientToggle
  → SmoothScroll → sections → Toaster
- `frontend/src/components/Preloader.jsx` — full-screen dark preloader with
  animated peacock-eye motif and progress bar
- `frontend/src/components/CustomCursor.jsx` — gold dot + tracked ring cursor
  (hidden on touch devices)
- `frontend/src/components/AmbientToggle.jsx` — WebAudio ambient drone toggle
- `frontend/src/components/SmoothScroll.jsx` — Lenis wrapper (respects
  prefers-reduced-motion)
- `frontend/src/components/ParticleField.jsx` — canvas 2D particle backdrop
- `frontend/src/components/peacock/Feather.jsx` — single feather plane +
  custom GLSL vertex + fragment shader (iridescent eye pattern)
- `frontend/src/components/peacock/PeacockModel.jsx` — feather fan + body/head/crest
- `frontend/src/components/peacock/Peacock3D.jsx` — R3F Canvas + camera rig
  (scroll-linked zoom-in) + shared featherProgressRef
- `frontend/src/components/sections/Hero.jsx` — pinned 260vh section with sticky
  content; scroll drives peacock camera + feather progress; title below fan
- `frontend/src/components/sections/AboutUs.jsx` — panel reveal with particles
- `frontend/src/components/sections/ClothQuality.jsx` — fabric parallax gallery
  + counting stats
- `frontend/src/components/sections/WhyChooseUs.jsx` — 4 tilt-on-mousemove
  feature cards
- `frontend/src/components/sections/FooterSection.jsx` — shimmering divider,
  newsletter form (POSTs to /api/newsletter), contact, social
- `frontend/src/hooks/useReveal.js` — IntersectionObserver-based reveal hook

Backend endpoints (`/app/backend/server.py`):
- `POST /api/newsletter` — { email } → creates NewsletterSignup in Mongo (409 on dup)
- `GET  /api/newsletter/count` → { count }
- Existing `/api/`, `/api/status` retained.

## Implemented Features
- 3D procedural peacock with iridescent GLSL shader (peacock "eye" rings)
- Feather-by-feather staggered reveal from center outward (~3.2s)
- Scroll-linked camera dolly (Z 6.5 → 0.5) + subtle X/Y drift + FOV widen
- Lenis smooth momentum scroll (touch + wheel)
- Custom gold cursor (dot + smoothed ring) with hover expansion
- Muted-by-default WebAudio ambient toggle (top-right)
- Panel-by-panel IntersectionObserver reveals across all sections
- Counting-up stats (100% / 42 / 7) with cubic ease
- Fabric gallery with per-item parallax scroll
- Feature cards with mousemove-driven 3D tilt + cursor-follow glow
- Newsletter form persisting to MongoDB with dedup handling
- Shimmering peacock-eye feather divider in footer
- Preloader with progress bar + spinning peacock-eye motif
- Grain overlay + vignette + jewel-tone radial backdrops

## Next Action Items (Backlog)
- P1: Optional user-provided brand copy replacement
- P1: Optional GSAP ScrollTrigger pinning refinements (currently RAF-driven)
- P1: Optional GLB asset support if user provides a peacock model
- P2: Real ambient audio file (currently procedural drone via WebAudio)
- P2: Product/collection preview grid section
- P2: E-commerce integration (Stripe) if user requests
- P2: Reduced motion fallback for hero (static poster image)
- P2: Newsletter admin dashboard endpoint

## Test Credentials
None — the app has no authentication.
