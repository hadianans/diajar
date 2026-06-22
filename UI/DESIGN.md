---
name: Diajar Narrative
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#784b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#996100'
  on-tertiary-container: '#ffeedd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 1.25rem
  margin-desktop: 2.5rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
---

## Brand & Style
The design system is centered on a "Mindful Growth" philosophy. It targets students and lifelong learners who require a focused environment free from the cognitive overload typical of traditional educational platforms. The emotional response is one of calm confidence and steady progress.

The style is **Modern Corporate** with a **Minimalist** soul. It prioritizes clarity and breathability through heavy whitespace and a soft, tactile interface. By combining the precision of SaaS design with the warmth of a wellness app, this design system transforms the learning process from a chore into a restorative ritual.

## Colors
The palette uses color as a functional signifier rather than just decoration. 

- **Primary (Soft Blue):** Used for primary actions, active navigation, and "Trust" touchpoints. It represents the stability of the institution.
- **Secondary (Gentle Green):** Dedicated exclusively to progress, completion states, and "Growth" milestones to provide positive reinforcement.
- **Tertiary (Amber):** Reserved for "Focus" moments, such as upcoming deadlines or points of interest that require attention without causing alarm.
- **Neutrals:** A range of warm grays (with a hint of blue-gold tinting) are used for surfaces and borders to keep the UI grounded and approachable.

## Typography
Inter is used for its exceptional legibility and neutral, systematic tone. 

- **Headlines:** Use tight letter-spacing and bold weights to create a strong visual anchor for lesson titles and module names.
- **Body:** Use a slightly increased line height (1.5x) to prevent eye fatigue during long reading sessions.
- **Labels:** Uppercase is avoided to maintain a friendly, conversational tone; instead, use semi-bold weights for hierarchy in meta-data (e.g., "10 mins left", "Level 1").

## Layout & Spacing
This design system utilizes a **Fluid Grid** with a mobile-first priority. 

- **Mobile:** A 4-column grid with 20px (1.25rem) side margins. Components are largely full-width to maximize readability.
- **Desktop:** A 12-column centered grid with a max-width of 1280px. Content is often contained in an 8-column central column for better focus, with 4 columns reserved for navigation or supplementary resources.
- **Vertical Rhythm:** Use a strict 8px-based spacing scale. Components are separated by "stack" units to ensure the UI feels "airy" and organized.

## Elevation & Depth
Depth is created using **Tonal Layers** and **Ambient Shadows**. 

Avoid harsh black shadows. Use soft, diffused shadows with a subtle blue tint (`hex #0F172A` at 5-8% opacity) to make cards appear to float gently above the background. 

- **Level 0 (Background):** `#FAFAFA` — The base canvas.
- **Level 1 (Cards/Containers):** White background with a subtle border (`1px solid #E2E8F0`).
- **Level 2 (Active/Hover):** Applied to buttons or expanded cards. Increase shadow spread and remove the border to imply physical lift.

## Shapes
The shape language is "Generously Rounded." 

Standard components (Cards, Inputs) use a **16px (1rem)** corner radius. Smaller elements like Buttons or Tags use **8px (0.5rem)**. This curvature softens the overall aesthetic, making the educational content feel less intimidating and more approachable. Large media elements (lesson thumbnails) should use the `rounded-xl` (24px) setting to create a friendly, "window-like" feel.

## Components
- **Primary Buttons:** High-contrast Blue background, white text, 8px radius. Use a subtle inner-glow for a tactile feel.
- **Course Cards:** White background, 16px radius, soft ambient shadow. Include a linear progress bar at the bottom using the Secondary Green color.
- **Chips/Tags:** Used for categories (e.g., "Science", "Beginner"). Use a tinted background (e.g., 10% opacity of the category color) with matching high-contrast text.
- **Input Fields:** 16px radius, light gray background (`#F1F5F9`) with no border until focused. On focus, use a 2px Primary Blue border.
- **Lists:** Use "In-set" lists where items are separated by whitespace rather than lines, emphasizing the clean, minimalist aesthetic.
- **Progress Ring:** A custom component for dashboards. Use a thick stroke with the Secondary Green to visualize course completion.