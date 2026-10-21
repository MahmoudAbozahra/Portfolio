# Warm Wood Liquid Glass design system

## Tokens

- Ivory `#FAF8F5`: canvas and high-contrast glass interiors.
- Sand `#EAD7C3`: warm surfaces and ambient gradients.
- Caramel `#C89B73`: highlights and illustrative depth.
- Wood `#795033`: primary actions, active states, and focus accents.
- Espresso `#2A211B`: primary typography and strongest contrast.

The source of truth is `src/styles/tokens.css`. Public components must use these tokens or transparent variants derived from them. Purple, cyan, neon, arbitrary proficiency percentages, and unverified content are outside the system.

## Surfaces and type

Glass surfaces use a warm-white translucent fill, a thin wood-tinted border, one selective backdrop blur, and layered warm shadows. Blur is limited to navigation, primary cards, and modal backdrops. Georgia is used as a restrained editorial display face with the system sans stack for UI and long text; Arabic falls back to Tahoma/Arial for reliable glyph coverage.

## Motion

The aurora uses three blurred palette-only shapes on 22–31 second transform loops plus motion-value pointer parallax without React re-renders. Shared motion tokens coordinate one-time section reveals, word-stagger typography, card choreography, and spring returns. Role labels transition vertically with opacity/blur, cycle through the truthful set once, then stop. Desktop fine pointers receive a restrained four-degree tilt, six-pixel float, lift, border glow, and pointer-following warm reflection. Touch and `prefers-reduced-motion` remove or simplify continuous and 3D effects.

The floating navbar has two deliberately distinct states: full-width branding at the page top and a visibly narrower, higher-blur compact state after 82px. Its active-section pill uses shared layout animation and a transform-only page-progress line.

## Accessibility

Semantic sections, real buttons/links, visible `:focus-visible` outlines, 42–50px primary touch targets, keyboard-closing project dialogs, focus return, scroll lock, meaningful image alternatives, and readable foreground opacity are required. Project placeholders are labeled conceptual architecture and never presented as customer screenshots.

## Responsive behavior

The navigation becomes a compact disclosure menu below 820px. The hero shows only the portrait and two highlights; it collapses to one column without introducing secondary statistics above the fold. Project/skill grids step from three to two to one, contact becomes a single stacked panel, and dialogs become full-screen on small phones. RTL changes document direction and aligns major copy without reversing data meaning.
