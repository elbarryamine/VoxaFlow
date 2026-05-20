---
name: Intellectual Warmth Dark
colors:
  surface: '#151311'
  surface-dim: '#151311'
  surface-bright: '#3b3936'
  surface-container-lowest: '#100e0c'
  surface-container-low: '#1d1b19'
  surface-container: '#211f1d'
  surface-container-high: '#2c2927'
  surface-container-highest: '#373432'
  on-surface: '#e7e1de'
  on-surface-variant: '#cec5ba'
  inverse-surface: '#e7e1de'
  inverse-on-surface: '#32302e'
  outline: '#978f86'
  outline-variant: '#4c463e'
  surface-tint: '#d3c4af'
  primary: '#f1e1cb'
  on-primary: '#382f20'
  primary-container: '#d4c5b0'
  on-primary-container: '#5c5141'
  inverse-primary: '#685d4c'
  secondary: '#d7c3b0'
  on-secondary: '#3b2e21'
  secondary-container: '#554738'
  on-secondary-container: '#c9b5a2'
  tertiary: '#d7e7d9'
  on-tertiary: '#26342a'
  tertiary-container: '#bbcbbd'
  on-tertiary-container: '#48564b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0e0ca'
  primary-fixed-dim: '#d3c4af'
  on-primary-fixed: '#221a0d'
  on-primary-fixed-variant: '#4f4535'
  secondary-fixed: '#f4dfcb'
  secondary-fixed-dim: '#d7c3b0'
  on-secondary-fixed: '#241a0d'
  on-secondary-fixed-variant: '#524436'
  tertiary-fixed: '#d7e7d8'
  tertiary-fixed-dim: '#bbcbbd'
  on-tertiary-fixed: '#111e16'
  on-tertiary-fixed-variant: '#3c4a40'
  background: '#151311'
  on-background: '#e7e1de'
  surface-variant: '#373432'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1200px
---

## Brand & Style
The design system embodies the quiet focus of a private library at midnight. It transitions the scholarly atmosphere of its light-mode predecessor into a high-concentration dark environment. The aesthetic is "Organic Minimalist"—eschewing the cold, blue-blacks of typical technology interfaces in favor of deep, chocolate-tinted charcoals and desaturated earth tones.

The target audience consists of researchers, writers, and deep-thinkers who require long-form legibility and a sophisticated, non-fatiguing workspace. The emotional response is one of calm, authority, and tactile permanence. The UI feels like expensive paper and ink, inverted for the evening hours.

## Colors
The palette is rooted in a "Dark Chocolate" base (#1A1816) that provides a warmer, more natural foundation than pure black. This prevents the "vibrating" text effect common in high-contrast dark modes.

- **Primary:** A soft, muted parchment-gold used sparingly for key actions and highlights.
- **Secondary:** A weathered wood tone for secondary interactions.
- **Tertiary:** A desaturated sage green for success states or subtle accents, maintaining the organic theme.
- **Neutrals:** Tonal variations of warm gray and umber are used to define surface hierarchy. Text colors are slightly cream-tinted (#E6E1DC) to reduce eye strain against the dark background.

## Typography
The typographic hierarchy relies on the interplay between the authoritative, literary *Newsreader* serif and the precise, contemporary *Hanken Grotesk* sans-serif.

Headlines use *Newsreader* with slightly tighter tracking to mimic editorial typesetting. *Hanken Grotesk* handles all functional UI elements and body copy, ensuring clarity at smaller scales. For dark mode, font weights for the sans-serif are slightly reduced (optical thinning) to account for the way light text bleeds on dark backgrounds. Large display types should utilize the "italic" variants of Newsreader for a more bespoke, high-end editorial feel when emphasizing specific content.

## Layout & Spacing
This design system employs a disciplined **fixed grid** approach for desktop, evoking the structured layout of a broadsheet newspaper or a literary journal. 

- **Grid:** A 12-column grid with generous 24px gutters.
- **Rhythm:** An 8px base unit drives all vertical spacing, but a 4px "micro-unit" is used for tight component internals (e.g., label-to-input spacing).
- **Desktop:** Centered layouts with wide margins create a sense of focus and exclusivity.
- **Mobile:** Transition to a 4-column fluid grid with 20px margins. Padding is increased within containers to ensure the "organic" feel isn't lost on smaller screens.

## Elevation & Depth
In this dark mode environment, depth is communicated through **Tonal Layering** rather than traditional drop shadows. Surfaces closer to the user are rendered in lighter shades of warm gray/brown.

- **Level 0 (Base):** The deep charcoal background (#1A1816).
- **Level 1 (Cards/Navigation):** A slightly lifted warm surface (#262320).
- **Level 2 (Modals/Popovers):** A more prominent umber tone (#332F2B).
- **Outlines:** Subtle, low-contrast borders (1px, 10% opacity white) are used to define edges where tonal shifts are too subtle. This maintains a flat, sophisticated appearance without the "heaviness" of shadows.

## Shapes
The shape language is "Soft Professional." A modest corner radius of 4px (0.25rem) is applied to most UI components like buttons and input fields, reflecting a modern but grounded sensibility. Larger containers like cards may use up to 8px to feel more approachable, but the system avoids fully rounded or pill-shaped elements to maintain its intellectual, structured character.

## Components
- **Buttons:** Primary buttons use a solid parchment fill (#D4C5B0) with dark text (#1A1816). Secondary buttons are outlined in a muted wood-tone with no fill.
- **Input Fields:** Backgrounds are slightly darker than their parent surface, featuring a 1px bottom border in the primary color when focused. 
- **Cards:** Defined by tonal shifts (Surface Level 1) and a very thin, 1px low-opacity border. No heavy shadows.
- **Chips/Tags:** Small, Hanken Grotesk labels with a subtle tertiary (sage) background at 15% opacity, creating a "pressed leaf" effect.
- **Lists:** Separated by thin, warm-gray dividers (#332F2B). Interactive list items use a subtle background highlight on hover rather than an outline.
- **Quotes:** A specific component for this design system; uses large Newsreader Italic text with a thick vertical accent bar in the secondary color.
