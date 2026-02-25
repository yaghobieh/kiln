#!/usr/bin/env node
/**
 * Kiln CLI - Component documentation and showcase tool
 * 
 * Usage:
 *   kiln dev           - Start dev server with HMR
 *   kiln build         - Build static documentation
 *   kiln preview       - Preview built documentation
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
void __filename; // Keep for potential future use

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg: string) => console.log(`\n${colors.magenta}${colors.bright}🔥 ${msg}${colors.reset}\n`),
};

interface KilnConfig {
  title?: string;
  description?: string;
  logo?: string;
  theme?: 'light' | 'dark' | 'auto';
  primaryColor?: string;
  stories?: string[];
  port?: number;
  showCodeDefault?: boolean;
  testing?: boolean;
  /** Enable Docs tab (props + custom doc). Default true. */
  docEnable?: boolean;
  /** Custom doc structure for Docs tab (e.g. from .kiln or config). */
  doc?: Array<{ id: string; title: string; content?: string; file?: string; children?: unknown[] }>;
  /** UI customization: colors, fontFamily, borderRadius, sidebarWidth, etc. */
  ui?: Record<string, unknown>;
  cssImport?: string;
  wrapper?: {
    from: string;
    name: string;
    props?: Record<string, unknown>;
  };
  vite?: {
    resolve?: {
      alias?: Record<string, string>;
    };
  };
}

const DEFAULT_CONFIG: KilnConfig = {
  title: 'Kiln',
  description: 'Component Documentation',
  theme: 'light',
  primaryColor: '#6366f1',
  stories: ['src/**/*.kiln.tsx', 'src/**/*.story.tsx', 'src/**/*.stories.tsx'],
  port: 6006,
  showCodeDefault: false,
  testing: true,
  docEnable: true,
  doc: [],
};

const CONFIG_FILE_NAME = 'kiln.config.json';

function findConfigFile(startDir: string): string | null {
  let currentDir = startDir;
  while (currentDir !== '/') {
    const configPath = join(currentDir, CONFIG_FILE_NAME);
    if (existsSync(configPath)) {
      return configPath;
    }
    currentDir = dirname(currentDir);
  }
  return null;
}

function loadConfig(cwd: string): KilnConfig {
  const configPath = findConfigFile(cwd);
  if (configPath) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(content) };
    } catch {
      log.warn(`Could not parse ${CONFIG_FILE_NAME}, using defaults`);
    }
  }
  return DEFAULT_CONFIG;
}

function createDefaultConfig(cwd: string): void {
  const configPath = join(cwd, CONFIG_FILE_NAME);
  writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
  log.success(`Created ${CONFIG_FILE_NAME}`);
}

// Reserved for future static build functionality
// function generateStoriesIndex(cwd: string, config: KilnConfig): string { ... }

async function startDevServer(cwd: string, config: KilnConfig): Promise<void> {
  log.title('Kiln Development Server');
  log.info(`Starting on port ${config.port}...`);
  
  // Create .kiln temp directory
  const kilnDir = join(cwd, '.kiln');
  if (!existsSync(kilnDir)) {
    mkdirSync(kilnDir, { recursive: true });
  }
  
  // Build imports based on config
  const cssImportLine = config.cssImport ? `import '${config.cssImport}';` : '';
  const wrapperImportLine = config.wrapper 
    ? `import { ${config.wrapper.name} } from '${config.wrapper.from}';`
    : '';
  const wrapperProps = config.wrapper?.props 
    ? Object.entries(config.wrapper.props)
        .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
        .join(' ')
    : '';
  const wrapperStart = config.wrapper ? `<${config.wrapper.name} ${wrapperProps}>` : '';
  const wrapperEnd = config.wrapper ? `</${config.wrapper.name}>` : '';

  // Generate entry file with Compass routes (one route per story) (one route per story)
  const entryContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CompassProvider, Routes, useParams, useNavigate } from '@forgedevstack/forge-compass';
import { KilnProvider, KilnLayout } from '@forgedevstack/kiln';
${cssImportLine}
${wrapperImportLine}

const storyModules = import.meta.glob(['../src/**/*.kiln.tsx', '../src/**/*.story.tsx', '../src/**/*.stories.tsx'], { eager: true });

function normalizeStories(stories) {
  if (!stories) return [];
  if (Array.isArray(stories)) return stories;
  return Object.entries(stories).map(([key, value]) => ({ name: key, ...value }));
}

const storyGroups = Object.entries(storyModules).map(([path, mod]) => {
  const defaultExport = mod.default;
  if (defaultExport?.title) {
    return { ...defaultExport, stories: normalizeStories(defaultExport.stories), path };
  }
  return null;
}).filter(Boolean);

function slugify(s) {
  return String(s).toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function findStoryIndices(groupSlug, storySlug) {
  if (!groupSlug || !storySlug) return null;
  const gi = storyGroups.findIndex((g) => slugify(g.title) === groupSlug);
  if (gi < 0) return null;
  const si = storyGroups[gi].stories.findIndex((s) => slugify(s.name) === storySlug);
  if (si < 0) return null;
  return { groupIndex: gi, storyIndex: si };
}

const config = ${JSON.stringify(config)};

function KilnApp() {
  const params = useParams();
  const navigate = useNavigate();
  const groupSlug = params.groupSlug;
  const storySlug = params.storySlug;
  const initialStory = React.useMemo(() => findStoryIndices(groupSlug, storySlug), [groupSlug, storySlug]);
  const onStoryChange = React.useCallback((groupIndex, storyIndex) => {
    const g = storyGroups[groupIndex];
    const s = g?.stories[storyIndex];
    if (g && s) navigate('/' + slugify(g.title) + '/' + slugify(s.name));
  }, [navigate]);

  return (
    <KilnProvider
      config={config}
      storyGroups={storyGroups}
      routeSync={{ initialStory, onStoryChange }}
    >
      <KilnLayout />
    </KilnProvider>
  );
}

function IndexRedirect() {
  const navigate = useNavigate();
  React.useEffect(() => {
    const first = storyGroups[0]?.stories[0];
    const to = first ? '/' + slugify(storyGroups[0].title) + '/' + slugify(first.name) : '/';
    navigate(to, { replace: true });
  }, [navigate]);
  return null;
}

const routes = [
  { path: '/', name: 'index', element: React.createElement(IndexRedirect) },
  { path: '/:groupSlug/:storySlug', name: 'story', component: KilnApp },
  { path: '*', name: 'catch', element: React.createElement(IndexRedirect) },
];

function App() {
  return (
    ${wrapperStart}
    <CompassProvider routes={routes}>
      <Routes />
    </CompassProvider>
    ${wrapperEnd}
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  writeFileSync(join(kilnDir, 'main.tsx'), entryContent);
  
  // Generate index.html
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title || 'Kiln'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.tsx"></script>
</body>
</html>
`;

  writeFileSync(join(kilnDir, 'index.html'), htmlContent);
  
  // Generate tailwind config for .kiln - inherits from parent project's tailwind config
  const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
import parentConfig from '../tailwind.config.js';

export default {
  ...parentConfig,
  content: [
    '../src/**/*.{js,ts,jsx,tsx}',
    './main.tsx',
  ],
};
`;

  writeFileSync(join(kilnDir, 'tailwind.config.js'), tailwindConfig);
  
  // Generate postcss config
  const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

  writeFileSync(join(kilnDir, 'postcss.config.js'), postcssConfig);

  // Build custom aliases from config
  const customAliases = config.vite?.resolve?.alias || {};
  const aliasEntries = Object.entries(customAliases)
    .map(([key, value]) => `      '${key}': resolve('${cwd}', '${value}'),`)
    .join('\n');

  // Generate vite config for .kiln
  const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '${kilnDir}',
  server: {
    port: ${config.port},
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve('${cwd}', 'src'),
${aliasEntries}
    },
  },
  css: {
    postcss: '${kilnDir}',
  },
});
`;

  writeFileSync(join(kilnDir, 'vite.config.ts'), viteConfig);
  
  // Run vite dev server
  const viteProcess = spawn('npx', ['vite', '--config', join(kilnDir, 'vite.config.ts')], {
    cwd: kilnDir,
    stdio: 'inherit',
    shell: true,
  });
  
  viteProcess.on('error', (err) => {
    log.error(`Failed to start dev server: ${err.message}`);
    process.exit(1);
  });
  
  process.on('SIGINT', () => {
    viteProcess.kill();
    process.exit(0);
  });
}

/** Generate a Crucible/Vitest test file for a story file (default: *.kiln.test.ts) */
function generateTestFile(storyPath: string, cwd: string): void {
  const base = storyPath.replace(/\.(story|stories|kiln)\.(tsx?|jsx?)$/, '');
  const testPath = `${base}.kiln.test.ts`;
  const fullTestPath = join(cwd, testPath);
  const storyImportPath = storyPath.replace(/\.(tsx?|jsx?)$/, '').replace(/^\.\//, '');
  const stem = storyImportPath.split('/').pop() ?? 'story';
  const content = `/**
 * Kiln story test - generated by \`kiln test-add\`
 * Run with your test runner (e.g. Crucible/Vitest).
 */
import React from 'react';
import { render } from '@testing-library/react';
import stories from './${stem}';

describe(stories.title ?? 'Story', () => {
  it('renders default story', () => {
    const def = stories.stories?.[0];
    if (!def?.component) throw new Error('No default story');
    const Component = def.component;
    const props = (def.args ?? {}) as Record<string, unknown>;
    const { container } = render(React.createElement(Component, props));
    expect(container).toBeInTheDocument();
  });
});
`;
  writeFileSync(fullTestPath, content);
  log.success(`Created ${testPath}`);
}

/** Discover all story files from config and generate tests for each */
function generateAllTests(cwd: string, config: KilnConfig): void {
  const patterns = config.stories ?? ['src/**/*.kiln.tsx', 'src/**/*.story.tsx', 'src/**/*.stories.tsx'];
  const files = fg.sync(patterns, { cwd, absolute: false });
  const storyFiles = files.filter((f) => /\.(story|stories|kiln)\.(tsx?|jsx?)$/.test(f));
  if (storyFiles.length === 0) {
    log.warn('No story files found. Add stories matching: ' + patterns.join(', '));
    return;
  }
  log.info(`Found ${storyFiles.length} story file(s). Generating tests...`);
  for (const file of storyFiles) {
    generateTestFile(file, cwd);
  }
}

// Main CLI
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const cwd = process.cwd();
  
  switch (command) {
    case 'init': {
      createDefaultConfig(cwd);
      log.info('Run `npx kiln dev` to start the development server');
      break;
    }
    
    case 'dev': {
      const config = loadConfig(cwd);
      await startDevServer(cwd, config);
      break;
    }
    
    case 'build': {
      log.title('Building Kiln Documentation');
      log.info('Static build not implemented yet');
      break;
    }
    
    case 'preview': {
      log.title('Previewing Kiln Documentation');
      log.info('Preview not implemented yet');
      break;
    }

    case 'test-add': {
      const isAll = args.includes('--all');
      const storyFile = args.slice(1).find((a) => a !== '--all') ?? '';
      if (isAll) {
        const config = loadConfig(cwd);
        generateAllTests(cwd, config);
        break;
      }
      if (!storyFile) {
        log.error('Usage: kiln test-add <storyFile> (e.g. src/Button.story.tsx) or kiln test-add --all');
        process.exit(1);
      }
      if (!existsSync(join(cwd, storyFile))) {
        log.error(`File not found: ${storyFile}`);
        process.exit(1);
      }
      generateTestFile(storyFile, cwd);
      break;
    }
    
    default: {
      console.log(`
${colors.magenta}${colors.bright}🔥 Kiln${colors.reset} - Component Documentation Tool

${colors.bright}Usage:${colors.reset}
  kiln init        Create kiln.config.json
  kiln dev         Start development server (Compass routes per story)
  kiln build       Build static documentation
  kiln preview     Preview built documentation
  kiln test-add <file>   Generate *.kiln.test.ts for one story file
  kiln test-add --all    Generate tests for every story file (from config)

${colors.bright}Options:${colors.reset}
  --port <num>   Override port (default: 6006)
  --help         Show this help
`);
    }
  }
}

main().catch((err) => {
  log.error(err.message);
  process.exit(1);
});

