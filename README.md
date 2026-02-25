# Kiln

Component documentation and showcase tool for ForgeStack. A lightweight, blazing-fast Storybook alternative.

## Features

- **Story-based docs**: Document components with multiple stories (variants).
- **URL routing**: Every story has its own route (e.g. `/button/default`, `/card/elevated`) via [Compass](https://github.com/forgedevstack/forge-compass).
- **Theme & logo**: Customize theme (light/dark/system), primary color, and logo in `kiln.config.json` for your static site.
- **UI customization**: Override colors, font, borderRadius, sidebar width via `ui` in config.
- **Docs tab**: Toggle with `docEnable`; show props first with `defaultTab: "docs"`. Add custom doc via `doc: []` (e.g. from `.kiln`).
- **Testing**: Generate Crucible test files with `kiln test-add <file>` or `kiln test-add --all` for every component.

## Install

```bash
npm install @forgedevstack/kiln @forgedevstack/forge-compass react react-dom
```

## Quick start

1. **Init** (creates `kiln.config.json`):

   ```bash
   npx kiln init
   ```

2. **Add a story** (e.g. `src/Button.story.tsx`):

   ```tsx
   import type { StoryGroup } from '@forgedevstack/kiln';

   const buttonStories: StoryGroup = {
     title: 'Button',
     stories: [
       {
         name: 'Default',
         component: Button,
         args: { label: 'Click me' },
       },
     ],
   };
   export default buttonStories;
   ```

3. **Run dev server**:

   ```bash
   npx kiln dev
   ```

   Open the app; each story is available at `/:groupSlug/:storySlug` (e.g. `/button/default`).

## Configuration

`kiln.config.json`:

| Option           | Description                                      | Default   |
|------------------|--------------------------------------------------|-----------|
| `title`          | Site title                                       | `"Kiln"`  |
| `description`    | Site description                                 | -         |
| `logo`           | Logo URL or path (sidebar)                       | built-in  |
| `theme`          | `"light"` \| `"dark"` \| `"system"`              | `"light"` |
| `primaryColor`   | Brand color (hex)                                | `"#6366f1"` |
| `port`           | Dev server port                                  | `6006`    |
| `defaultTab`     | `"canvas"` \| `"docs"` (props first when `"docs"`) | `"canvas"` |
| `docEnable`      | Show the Docs tab (props + custom doc). When `false`, only Canvas is shown. | `true` |
| `doc`            | Custom doc sections for the Docs tab. Each entry: `{ id, title, content?, file?, children? }`. Use with content from `.kiln` or inline. | `[]` |
| `ui`             | UI overrides: `primaryColor`, `secondaryColor`, `accentColor`, `sidebarBg`, `contentBg`, `fontFamily`, `borderRadius` (`"none"` \| `"sm"` \| `"md"` \| `"lg"`), `sidebarWidth` (px). | - |
| `stories`        | Glob patterns for story files                    | `["src/**/*.kiln.tsx", ...]` |
| `cssImport`      | CSS file to import (e.g. Bear styles)            | -         |
| `wrapper`        | Provider wrapper (`from`, `name`, `props`)       | -         |

Theme, logo, and `ui` are applied in the Kiln UI. Use `doc: []` to add your own documentation sections (e.g. from `.kiln`) alongside auto-generated props:

```json
"doc": [
  { "id": "intro", "title": "Introduction", "content": "<p>Welcome to the design system.</p>" },
  { "id": "guidelines", "title": "Guidelines", "file": ".kiln/docs/guidelines.md", "children": [] }
]
```

## Testing with Crucible

Generate test files for stories (default: `*.kiln.test.ts`):

```bash
# One component
npx kiln test-add src/Button.story.tsx

# Every component (discovers story files from config)
npx kiln test-add --all
```

Run the generated tests with your stack (e.g. Crucible/Vitest).

## Testing Kiln (development)

From the Kiln repo:

1. **Build** the library:

   ```bash
   npm run build
   ```

2. **Run the example app** (uses the built `dist`; opens at http://localhost:6006):

   ```bash
   npm run example
   ```

   The example loads Button, Card, and Badge stories so you can click through the UI, theme, and docs tab.

3. **Test the CLI** in a real app: create a project with `src/**/*.story.tsx` (or `.kiln.tsx`), run `npx kiln init` then `npx kiln dev` to see Compass-routed story URLs.

## Scripts

- `kiln init` – Create `kiln.config.json`
- `kiln dev` – Start dev server (Compass routes per story)
- `kiln build` – (Planned) Static build
- `kiln preview` – (Planned) Preview static build
- `kiln test-add <storyFile>` – Generate `*.kiln.test.ts` for one story file
- `kiln test-add --all` – Generate tests for every story file (from config)

## Version

1.0.4
