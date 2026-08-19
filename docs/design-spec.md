# Atlas design spec

## Product surface

Atlas is a local-first travel tracker for people who want to mark countries, keep memories, and steadily complete a 195-country collection. The first screen is an operational dashboard, not a marketing page: map workspace, progress ring, recent journal, and a compact route cue.

## Visual system

- Background: true deep navy ink `#07131f`; no warm white or beige surfaces.
- Surfaces: blue-green `#0c1d2a` / `#102635`, fine translucent mint borders.
- Accent: mint `#69d2c6` for visited state and progress; coral `#f48f77` for next-action emphasis; violet and gold are secondary semantic accents.
- Typography: Manrope for display and DM Sans for readable UI chrome. Dense labels use uppercase tracking; controls are deliberately 10–13px.
- Container model: one map workspace, one progress workspace, open metric strip, editorial memory cards, and a single drawer/modal for detail. No nested card grids.
- Motion: drawer and modal entrance, hover expansion for map points, subtle CTA lift. Reduced-motion CSS is included.

## Core states

1. Overview: map, progress, stats, memories, next route.
2. Countries: searchable/filterable list with visited toggles.
3. Journal: memory feed and creation flow.
4. Goals: progress, milestones, and achievements.
5. Country drawer: selected country status, memories, and quick actions.

## Data decision

The base collection uses the 193 UN member states plus Holy See and State of Palestine (195 total). This is a product definition, not a claim about disputed borders. The UI deliberately avoids drawing political boundaries and uses a stylized continent map.
