# Card Hover Effects - Design Spec

## Base State

```
Background: bg-card
Border: border-border (subtle 1px)
Text: text-foreground
Shadow: shadow-sm
```

## Hover State

### Gradient Options

**Option 1: Vibrant** (Recommended)
```
Gradient: linear-gradient(135deg, 
  rgba(99, 102, 241, 0.35) 0%,
  rgba(139, 92, 246, 0.35) 50%,
  rgba(236, 72, 153, 0.35) 100%)
```

**Option 2: Sophisticated**
```
Gradient: linear-gradient(135deg,
  rgba(79, 70, 229, 0.35) 0%,
  rgba(109, 40, 217, 0.35) 100%)
```

**Option 3: Modern**
```
Gradient: linear-gradient(135deg,
  rgba(6, 182, 212, 0.35) 0%,
  rgba(139, 92, 246, 0.35) 100%)
```

### Glassmorphism Effects

```css
backdrop-filter: blur(12px);
background: [gradient above]
border: 1px solid rgba(255, 255, 255, 0.15);
```

### Animation

```css
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### On Hover

```css
transform: scale(1.02);
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## Text Legibility

- Keep text color unchanged: `text-foreground`
- Light mode: Gradient opacity 0.35 maintains contrast
- Dark mode: Gradient opacity 0.35 maintains contrast
- Fallback: Add optional `text-shadow: 0 0 1px rgba(0,0,0,0.2)` if gradient too bright

## Implementation

Apply to:
- `.bento-card` wrapper
- `:hover` pseudo-class or `group-hover` for Tailwind

Example Tailwind classes:
```
hover:backdrop-blur-[12px]
hover:bg-gradient-to-br
hover:from-indigo-500/35
hover:via-purple-500/35
hover:to-pink-500/35
hover:border-white/15
hover:scale-[1.02]
hover:shadow-xl
transition-all duration-300
```

## Dark/Light Mode

**Light Mode:**
- Gradient opacity: 0.30 (lower opacity for light bg)
- Border opacity: 0.12
- Backdrop blur: 12px

**Dark Mode:**
- Gradient opacity: 0.35 (standard opacity)
- Border opacity: 0.15
- Backdrop blur: 12px
