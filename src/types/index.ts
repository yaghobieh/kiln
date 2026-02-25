import { ReactNode, ComponentType } from 'react';

/**
 * Breakpoint definition for responsive preview
 */
export interface Breakpoint {
  /** Unique identifier */
  id: string;
  /** Display name */
  label: string;
  /** Width in pixels */
  width: number;
  /** Icon type - auto-detected based on width if not provided */
  icon?: 'mobile' | 'tablet' | 'desktop' | 'wide' | 'custom';
  /** Whether this is a default breakpoint (cannot be deleted) */
  isDefault?: boolean;
}

/**
 * Default breakpoints
 */
export const DEFAULT_BREAKPOINTS: Breakpoint[] = [
  { id: 'mobile', label: 'Mobile', width: 375, icon: 'mobile', isDefault: true },
  { id: 'tablet', label: 'Tablet', width: 768, icon: 'tablet', isDefault: true },
  { id: 'desktop', label: 'Desktop', width: 1280, icon: 'desktop', isDefault: true },
];

/**
 * Get auto-detected icon based on width
 */
export function getBreakpointIcon(width: number): Breakpoint['icon'] {
  if (width <= 480) return 'mobile';
  if (width <= 1024) return 'tablet';
  if (width <= 1440) return 'desktop';
  return 'wide';
}

/**
 * Custom doc entry for Docs tab (e.g. from .kiln or kiln.config.json doc: [])
 */
export interface DocEntry {
  /** Unique id for the doc section */
  id: string;
  /** Display title */
  title: string;
  /** Inline markdown or HTML content */
  content?: string;
  /** Path to a markdown file (relative to project or .kiln) */
  file?: string;
  /** Nested doc sections */
  children?: DocEntry[];
}

/**
 * UI customization (colors, typography, layout)
 */
export interface KilnUIConfig {
  /** Primary brand color (hex) */
  primaryColor?: string;
  /** Secondary/accent color */
  secondaryColor?: string;
  /** Accent for highlights (badges, links) */
  accentColor?: string;
  /** Sidebar background (overrides theme default) */
  sidebarBg?: string;
  /** Main content background */
  contentBg?: string;
  /** Font family for the UI */
  fontFamily?: string;
  /** Border radius: 'none' | 'sm' | 'md' | 'lg' */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg';
  /** Sidebar width in px */
  sidebarWidth?: number;
}

/**
 * Kiln Configuration File (kiln.config.json)
 */
export interface KilnConfig {
  /** Title of the documentation site */
  title?: string;
  /** Description for SEO */
  description?: string;
  /** Logo path or URL (or 'default' for built-in logo) */
  logo?: string;
  /** Custom logo component */
  logoComponent?: ComponentType<{ size?: number; color?: string }>;
  /** Theme mode - 'light' is now the default */
  theme?: 'light' | 'dark' | 'system';
  /** Primary brand color (also in ui.primaryColor) */
  primaryColor?: string;
  /** Stories glob pattern */
  stories?: string[];
  /** Port for dev server */
  port?: number;
  /** Whether to show code by default */
  showCodeDefault?: boolean;
  /** Whether to enable testing panel */
  testing?: boolean;
  /** Custom breakpoints */
  breakpoints?: Breakpoint[];
  /** Allow adding custom breakpoints */
  allowCustomBreakpoints?: boolean;
  /** CSS file to import */
  cssImport?: string;
  /** Provider wrapper import */
  wrapper?: {
    from: string;
    name: string;
    props?: Record<string, unknown>;
  };
  /** Default tab when opening a story: 'canvas' or 'docs' (props shown first when docs) */
  defaultTab?: 'canvas' | 'docs';
  /** Enable the Docs tab (props + custom doc). When false, only Canvas is shown. */
  docEnable?: boolean;
  /** Custom doc structure for the Docs tab (sections from .kiln or config). */
  doc?: DocEntry[];
  /** UI customization: colors, font, borderRadius, sidebarWidth, etc. */
  ui?: KilnUIConfig;
}

export const DEFAULT_CONFIG: KilnConfig = {
  title: 'Kiln',
  description: 'Component Documentation & Showcase',
  theme: 'light',
  primaryColor: '#6366f1',
  stories: ['**/*.story.tsx', '**/*.stories.tsx'],
  port: 6006,
  showCodeDefault: false,
  testing: true,
  breakpoints: DEFAULT_BREAKPOINTS,
  allowCustomBreakpoints: true,
  docEnable: true,
  doc: [],
};

/**
 * Prop type definition for documentation
 */
export interface PropDef {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: unknown;
  description?: string;
  options?: string[] | number[] | boolean[];
  control?: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'range' | 'object' | 'array';
  min?: number;
  max?: number;
  step?: number;
}

/**
 * Story definition
 */
export interface Story<P = unknown> {
  /** Story name */
  name: string;
  /** Component to render */
  component: ComponentType<P>;
  /** Default props */
  args?: P;
  /** Prop definitions for controls and documentation */
  argTypes?: Record<string, Partial<PropDef>>;
  /** Source code to display */
  code?: string;
  /** Description of the story */
  description?: string;
  /** Tags (e.g., 'new', 'deprecated', 'beta') */
  tags?: string[];
}

/**
 * Story Group (a component with multiple stories)
 */
export interface StoryGroup {
  /** Group title (e.g., "Button") */
  title: string;
  /** Component being documented */
  component?: ComponentType;
  /** Individual stories */
  stories: Story[];
  /** Description of the component */
  description?: string;
  /** Path to the story file */
  path?: string;
  /** Icon for the component */
  icon?: ComponentType;
  /** Category for grouping */
  category?: string;
  /** Tags */
  tags?: string[];
}

/**
 * Props for KilnCanvas (the preview area)
 */
export interface KilnCanvasProps {
  /** Background color */
  background?: 'transparent' | 'light' | 'dark' | 'checker';
  /** Whether to center content */
  centered?: boolean;
  /** Padding around content */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Children to render */
  children: ReactNode;
}

/**
 * Props for KilnControls (interactive controls)
 */
export interface KilnControlDef {
  name: string;
  type: 'boolean' | 'string' | 'number' | 'select' | 'color' | 'range';
  defaultValue?: unknown;
  options?: string[] | number[];
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

/**
 * Component documentation export
 */
export interface ComponentDoc {
  name: string;
  description?: string;
  props: PropDef[];
}
