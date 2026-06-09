---
name: Synthetic Intelligence System
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#ddb7ff'
  on-secondary: '#490080'
  secondary-container: '#6f00be'
  on-secondary-container: '#d6a9ff'
  tertiary: '#89ceff'
  on-tertiary: '#00344d'
  tertiary-container: '#009ada'
  on-tertiary-container: '#002d43'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb7ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6900b3'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  button:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.25rem
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
  xl: 2rem
  2xl: 3rem
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  sidebar-width: 280px
---

## Brand & Style

The design system is engineered for high-performance AI interfaces, balancing technical precision with human accessibility. The brand personality is **sophisticated, innovative, and reliable**. It avoids the "sci-fi trope" of dark, neon-heavy interfaces in favor of a **Corporate Modern** aesthetic with **Minimalist** leanings—utilizing ample white space, refined typography, and purposeful motion.

The emotional response should be one of "effortless power." Users should feel they are interacting with a tool that is highly advanced yet under their total control. The visual style leverages a "Laboratory Clean" approach: high-contrast text, subtle tonal layering, and sharp execution of interactive elements.

## Colors

The palette is anchored in a deep **Midnight Navy** background to reduce eye strain during long technical sessions. 

- **Primary (Electric Violet):** Used for primary actions, active states, and brand-critical moments.
- **Secondary (Amethyst):** Used for AI-generated content identifiers or specialized features.
- **Accent (Cyan):** Used for status indicators, data visualizations, and success states.
- **Neutrals (Slate & Slate):** A range of grays with blue undertones ensures the interface feels "cool" and technical rather than muddy or flat.

Interactive elements use high-saturation vibrance against the dark background to guide the user's eye naturally toward the most important functional paths.

## Typography

This design system utilizes a trio of typefaces to establish a clear functional hierarchy. **Geist** provides a technical, geometric edge for headlines and display text. **Inter** is the workhorse for body copy, chosen for its supreme legibility and neutral tone. **JetBrains Mono** is introduced for labels, metadata, and AI-generated code snippets to reinforce the platform's technical DNA.

Keep line lengths for body text between 45-75 characters to maintain readability. Use the Mono font sparingly for data points, version numbers, or status tags.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. The sidebar navigation remains at a fixed width (280px), while the main content area utilizes a fluid 12-column grid.

- **Desktop:** 12 columns, 24px gutters, 40px outer margins.
- **Tablet:** 8 columns, 16px gutters, 24px outer margins.
- **Mobile:** 4 columns, 16px gutters, 16px outer margins.

Spacing follows a strict 4px / 8px linear scale. Large components like cards should use `lg` (24px) padding, while tighter elements like chat bubbles use `md` (16px).

## Elevation & Depth

Depth is primarily communicated through **Tonal Layering** rather than heavy shadows. In a dark-themed AI environment, elevation is signaled by surfaces becoming progressively lighter as they "rise" toward the user.

1.  **Level 0 (Background):** #020617 (Deepest layer).
2.  **Level 1 (Cards/Sidebar):** #0F172A (Subtle lift).
3.  **Level 2 (Popovers/Modals):** #1E293B (Highest contrast).

A subtle **Indigo Glow** (15% opacity primary color) may be used behind primary action buttons or active AI chat bubbles to simulate a "functional hum." Outlines should be low-contrast (Slate-800) to keep the interface clean.

## Shapes

The design system uses a **Soft (0.25rem)** base roundedness. This "Semi-Square" approach maintains a professional, architectural feel without feeling overly playful or aggressive. 

- **Small elements (Inputs, Buttons):** 4px (0.25rem)
- **Medium elements (Cards, Modals):** 8px (0.5rem)
- **Large elements (Containers):** 12px (0.75rem)

The exception is the **Chat Bubble**, which uses a 16px radius on three corners and a 4px radius on the "anchor" corner to give it a distinct directional character.

## Components

### Buttons & Inputs
Buttons should be high-contrast with a slight gradient (Primary to Secondary) for the main CTA. Input fields are "Ghost Style"—transparent backgrounds with a 1px Slate border that illuminates to Electric Blue on focus.

### AI Model Cards
Cards should feature a `label-mono` tag at the top for "Model Type" and a primary headline. Use a subtle hover state where the border color transitions from Slate to Indigo.

### Chat Interface
- **User Bubbles:** Right-aligned, Slate-800 background, no border.
- **AI Bubbles:** Left-aligned, subtle Indigo-950 background, 1px Primary-500 border.
- **Typing Indicator:** Three animated dots using the Accent (Cyan) color.

### Sidebar Navigation
Use "Active Indicators" consisting of a 2px vertical line of the Primary color on the left edge of the active menu item. Background of the active item should be a 5% opacity tint of the Primary color.

### Code Blocks
Always monospaced. Background should be 50% darker than the main surface to provide clear separation. Use a "Copy" button in the top right of every code block.