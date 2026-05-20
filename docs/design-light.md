---
name: Intellectual Warmth
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c1a'
  on-surface-variant: '#464741'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#777771'
  outline-variant: '#c7c7bf'
  surface-tint: '#5f5e5c'
  primary: '#020302'
  on-primary: '#ffffff'
  primary-container: '#1d1d1b'
  on-primary-container: '#868582'
  inverse-primary: '#c8c6c3'
  secondary: '#99462a'
  on-secondary: '#ffffff'
  secondary-container: '#fe9572'
  on-secondary-container: '#762c12'
  tertiary: '#020302'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1d1a'
  on-tertiary-container: '#858581'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2de'
  primary-fixed-dim: '#c8c6c3'
  on-primary-fixed: '#1c1c1a'
  on-primary-fixed-variant: '#474744'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#390b00'
  on-secondary-fixed-variant: '#7a2f15'
  tertiary-fixed: '#e4e2dd'
  tertiary-fixed-dim: '#c8c6c2'
  on-tertiary-fixed: '#1b1c19'
  on-tertiary-fixed-variant: '#474744'
  background: '#fcf9f5'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2de'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is anchored in the concept of "Intellectual Warmth." It prioritizes the user's cognitive ease and emotional comfort, moving away from the cold, sterile aesthetics of traditional SaaS. It targets a sophisticated audience that values clarity, thoughtful discourse, and a premium editorial experience.

The visual style is a blend of **Modern Minimalism** and **Editorial Elegance**. It utilizes generous whitespace—not as "empty" space, but as a structural element that allows content to breathe. The overall feel is that of a high-end digital journal: professional, approachable, and deeply focused on readability and intent.

## Colors
The palette is centered on a high-contrast yet soft relationship between its foundation and its content. 

- **Primary:** A deep, ink-like charcoal (#1D1D1B) used for maximum legibility in typography and primary iconography.
- **Secondary (Accent):** A muted burnt orange (#D97757) used sparingly for calls to action, focus states, and highlighting key insights. It provides warmth without the aggression of a standard "tech" orange.
- **Background (Parchment):** An off-white, cream-toned surface (#F9F7F2) that reduces eye strain compared to pure white and reinforces the editorial metaphor.
- **Neutral:** A desaturated taupe-grey (#706F6C) for secondary text, borders, and disabled states.

The color system avoids pure blacks and vibrant neons to maintain its sophisticated, grounded personality.

## Typography
The typography strategy is bifurcated to balance personality with utility. 

**Newsreader** is utilized for headlines and display text. Its serif letterforms provide a literary, authoritative character that feels "written" rather than "programmed." Use the medium and semi-bold weights for hierarchy.

**Manrope** serves as the functional workhorse for body copy, labels, and UI elements. It is a modern, geometric sans-serif that remains highly legible at small sizes while mirroring the roundness of the overall design language. 

Generous line heights (1.6x for body) are mandatory to ensure a relaxed reading pace.

## Layout & Spacing
The design system employs a **Fixed Grid** philosophy for desktop to maintain the integrity of the editorial layout, centering content within a 1200px max-width container. 

A 12-column system is used with 24px gutters. Spacing follows a strict 8px linear scale. On mobile, the grid collapses to a single column with 20px side margins, emphasizing vertical rhythm and readability. 

Whitespace should be intentional: use `stack-lg` between major sections to prevent visual clutter and signal a transition in thought or context.

## Elevation & Depth
Depth in the design system is communicated through **Tonal Layering** supplemented by **Ambient Shadows**. 

Instead of heavy drop shadows, surfaces use very subtle, diffused shadows with a slight tint of the primary charcoal color (e.g., `rgba(29, 29, 27, 0.04)`). This creates a "floated" effect rather than a "hovered" effect.

Primary cards and modals utilize a slightly lighter or darker background variance of the parchment base to indicate stack order. High-elevation elements, like active modals, may use a soft backdrop blur to focus the user’s attention while maintaining the warmth of the background colors.

## Shapes
The shape language is defined by **Soft Roundness**. Rounded corners are used to humanize the interface and align with the friendly yet professional tone.

- **Standard Elements:** 0.5rem (8px) for buttons, input fields, and small cards.
- **Large Containers:** 1.5rem (24px) for main content areas and large modals.
- **Interactive States:** Use a slight increase in roundness or a subtle scale-up effect to provide tactile feedback without breaking the minimalist aesthetic.

## Components

### Buttons
- **Primary:** Filled with the primary charcoal color, white text. Soft 8px corners.
- **Secondary:** Outlined in a thin 1px border of the primary color with the burnt orange used only for the text or a small icon.
- **Ghost:** No border, primary text, subtle parchment-tinted background on hover.

### Cards
Cards should have a 1px border using a lightened version of the neutral color or a very subtle ambient shadow. Backgrounds should match the parchment base unless being used to differentiate content types.

### Input Fields
Inputs use a minimal design: a subtle bottom border or a very light-toned background. Focus states are indicated by a transition to the burnt orange accent for the border or a subtle 2px glow.

### Chips & Tags
Small, pill-shaped elements with low-contrast backgrounds (e.g., a 10% opacity version of the burnt orange) and `label-sm` typography. Used for categorizing topics or metadata.

### Lists
Lists should have generous vertical padding (16px+) between items to maintain the open, airy feel of the design system. Use thin, low-opacity separators rather than heavy lines.
