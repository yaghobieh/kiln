# Changelog

## [1.0.4] - 2025-02-24

### Added

- **Story routes (Compass)**: Every story has a URL. Dev server uses `@forgedevstack/forge-compass`; routes are `/:groupSlug/:storySlug` (e.g. `/button/default`). Selecting a story updates the URL; loading a URL selects that story.
- **Docs-first option**: `kiln.config.json` supports `defaultTab: "docs"` so the Docs tab (with props table) is shown first when opening a story.
- **Theme & logo**: Projects can set `theme`, `primaryColor`, and `logo` in `kiln.config.json`; logo is shown in the sidebar when provided.
- **Crucible test generation**: `kiln test-add <storyFile>` generates a `*.kiln.test.ts` file (default naming: `name.kiln.test.ts`) for the given story.
- **README and CHANGELOG** in the repo.

### Changed

- `KilnProvider` accepts optional `routeSync: { initialStory, onStoryChange }` for URL sync with Compass.
- Generated `.kiln/main.tsx` now uses Compass (CompassProvider + routes); peer dependency `@forgedevstack/forge-compass` added.

### Fixed

- Version display in sidebar shows 1.0.4.

---

## [1.0.3]

- Previous release (config, wrapper, breakpoints, controls, etc.).
