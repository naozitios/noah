# Card Hover Effects & Glassmorphism Design

**Status:** Proposed  
**Phase:** UI/UX Polish  
**Priority:** Medium  
**Component:** [BentoCard](components/bento-card.tsx), [GardenBoard](components/garden-board.tsx)

---

## Overview

Redesign card styling on the home page to use a unified base color with smooth, interactive hover effects featuring glassmorphism. Improve visual hierarchy and interactivity while maintaining text legibility.

---

## Problem

Current card design:
- Mixed colors (some green accents) create visual inconsistency
- Static on hover lacks interactivity feedback
- No depth or glassmorphism effect
- Visual hierarchy unclear

---

## Solution

### Base State
- **Background:** Unified neutral color (matches theme)
- **Border:** Subtle, consistent across all cards
- **Text:** Fully legible (default foreground color)
- **Shadow:** Minimal (matches current design)

### Hover State
- **Background:** Smooth gradient overlay (2-3 complementary colors)
- **Effect:** Glassmorphism styling
  - Semi-transparent gradient background
  - Backdrop blur effect
  - Smooth 300ms transition
- **Text:** Maintained legibility with contrast preservation
- **Animation:** Subtle scale/shadow lift on hover

---

## Technical Specifications

### Colors

**Base State:**
```
background: bg-card (theme-aware)
border: border-border
text: text-foreground
```

**Hover Gradient Options:**
- Option A: Blue → Purple → Pink (vibrant)
- Option B: Indigo → Violet (sophisticated)
- Option C: Cyan → Purple (modern)

**Choose gradient based on:**
- Dark mode: Higher saturation, lower opacity
- Light mode: Lower saturation, balanced opacity

### Glassmorphism Properties

```css
Backdrop blur: 10-20px
Background opacity: 0.3-0.4
Border: 1px solid rgba(255,255,255,0.1-0.2)
```

### Animation

```css
Transition: background-color, filter 300ms ease-out
Scale: hover:scale-[1.02] (subtle)
Shadow: hover:shadow-lg
```

### Text Contrast

- Ensure WCAG AA compliance on hover
- Test with light & dark text on gradient
- Use `text-shadow` if gradient too dark: `text-shadow: 0 0 2px rgba(0,0,0,0.3)`

---

## Acceptance Criteria

- [ ] All cards use unified base color (no green accents)
- [ ] Hover trigger smoothly transitions to gradient
- [ ] Gradient includes 2-3 colors blending smoothly
- [ ] Backdrop blur effect visible on hover
- [ ] Border appears on gradient for depth
- [ ] Text remains readable on gradient (WCAG AA)
- [ ] Animation duration 300ms
- [ ] Works on mobile (no hover, but works on active/tap)
- [ ] Consistent across light/dark themes

---

## Files to Update

- [components/bento-card.tsx](components/bento-card.tsx) - Card styling & hover logic
- [app/globals.css](app/globals.css) - Custom CSS if needed for gradient/blur
- Tailwind config - Add custom gradient if needed

---

## Design Variations

### Variant 1: Subtle Glassmorphism
- Low opacity (0.3)
- Tight blur (10px)
- Single-tone gradient (one color)
- Best for minimal aesthetics

### Variant 2: Bold Interactive
- Higher opacity (0.4-0.5)
- Stronger blur (20px)
- Multi-color gradient (3 colors)
- Best for engaging, modern feel

**Recommendation:** Start with Variant 2, adjust opacity based on feedback

---

## Out of Scope

- Individual card color customization
- Per-card gradient themes
- Animation on non-hover (scroll trigger, etc.)
- Mobile swipe gestures

---

## Success Metrics

- Hover feedback perceived as smooth & polished
- No loss of text readability
- Users spend more time exploring cards (engagement)
- No performance degradation (smooth 60fps)
