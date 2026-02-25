import { FC, useState, useMemo, useCallback } from 'react';
import { useKiln } from './KilnProvider';
import type { Breakpoint, DocEntry } from '../types';
import { DEFAULT_BREAKPOINTS, getBreakpointIcon } from '../types';

/**
 * Modern, professional Kiln Layout
 * Inspired by Storybook but with a cleaner, more minimal aesthetic
 */

// ============================================================================
// Icons - Clean, consistent icon set
// ============================================================================

const Icons = {
  Mobile: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Tablet: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Desktop: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Wide: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="5" width="22" height="14" rx="2" ry="2" />
      <line x1="12" y1="9" x2="12" y2="15" />
    </svg>
  ),
  Expand: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  Code: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  ChevronRight: ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevronDown: ({ size = 12 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Component: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
      <line x1="12" y1="22" x2="12" y2="15.5" />
      <polyline points="22 8.5 12 15.5 2 8.5" />
    </svg>
  ),
  Story: ({ size = 8 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="6" />
    </svg>
  ),
  Menu: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Sun: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Copy: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Search: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Settings: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  Plus: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Docs: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Controls: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  Reset: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
};

/** Renders a single doc entry (custom doc from config.doc) */
const DocSection: FC<{
  entry: DocEntry;
  colors: Record<string, string>;
  borderRadius: number;
}> = ({ entry, colors, borderRadius }) => (
  <div
    style={{
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: colors.bgSecondary,
      borderRadius: `${borderRadius}px`,
      border: `1px solid ${colors.border}`,
    }}
  >
    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: colors.text }}>
      {entry.title}
    </h3>
    {entry.content && (
      <div
        style={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: entry.content }}
      />
    )}
    {entry.file && !entry.content && (
      <p style={{ fontSize: '13px', color: colors.textMuted }}>
        See file: <code style={{ backgroundColor: colors.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>{entry.file}</code>
      </p>
    )}
    {entry.children && entry.children.length > 0 && (
      <div style={{ marginTop: '12px', marginLeft: '12px', borderLeft: `2px solid ${colors.border}` }}>
        {entry.children.map((child) => (
          <DocSection key={child.id} entry={child} colors={colors} borderRadius={borderRadius} />
        ))}
      </div>
    )}
  </div>
);

// Get breakpoint icon component
const getBreakpointIconComponent = (bp: Breakpoint) => {
  const iconType = bp.icon || getBreakpointIcon(bp.width);
  switch (iconType) {
    case 'mobile': return Icons.Mobile;
    case 'tablet': return Icons.Tablet;
    case 'desktop': return Icons.Desktop;
    case 'wide': return Icons.Wide;
    default: return Icons.Desktop;
  }
};

// ============================================================================
// Logo Component
// ============================================================================

const KilnLogo: FC<{ size?: number; primaryColor?: string }> = ({ size = 28, primaryColor = '#6366f1' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M6 24V12C6 8 10 5 16 5C22 5 26 8 26 12V24"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <rect x="4" y="24" width="24" height="3" rx="1.5" fill={primaryColor} opacity="0.3" />
    <ellipse cx="16" cy="22" rx="6" ry="2" fill={primaryColor} opacity="0.15" />
    <path
      d="M16 21C14.5 21 13.5 19.5 13.8 18C14.1 16.5 15.2 15.5 16 14C16.8 15.5 17.9 16.5 18.2 18C18.5 19.5 17.5 21 16 21Z"
      fill={primaryColor}
    >
      <animate
        attributeName="d"
        values="M16 21C14.5 21 13.5 19.5 13.8 18C14.1 16.5 15.2 15.5 16 14C16.8 15.5 17.9 16.5 18.2 18C18.5 19.5 17.5 21 16 21Z;
                M16 21C14.8 21 13.8 19.5 14 18C14.3 16.2 15.4 15 16 13.5C16.6 15 17.7 16.2 18 18C18.2 19.5 17.2 21 16 21Z;
                M16 21C14.5 21 13.5 19.5 13.8 18C14.1 16.5 15.2 15.5 16 14C16.8 15.5 17.9 16.5 18.2 18C18.5 19.5 17.5 21 16 21Z"
        dur="0.8s"
        repeatCount="indefinite"
      />
    </path>
    <path
      d="M16 19.5C15.3 19.5 14.8 18.8 15 18C15.2 17.2 15.6 16.8 16 16C16.4 16.8 16.8 17.2 17 18C17.2 18.8 16.7 19.5 16 19.5Z"
      fill="white"
      opacity="0.8"
    >
      <animate
        attributeName="opacity"
        values="0.8;0.5;0.8"
        dur="0.5s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
);

// ============================================================================
// Main Layout Component
// ============================================================================

export const KilnLayout: FC = () => {
  const { 
    config, 
    stories, 
    activeStory, 
    setActiveStory, 
    theme, 
    toggleTheme,
    showCode,
    toggleShowCode,
    searchQuery,
    setSearchQuery,
    routeSync,
  } = useKiln();

  // UI config (colors, font, layout) – must be before state that depends on it
  const ui = config.ui || {};
  const docEnable = config.docEnable !== false;

  // State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(stories.map(s => s.title)));
  const [activeBreakpoint, setActiveBreakpoint] = useState<string>('full');
  const [liveArgs, setLiveArgs] = useState<Record<string, unknown>>({});
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'canvas' | 'docs'>(() =>
    docEnable ? (config.defaultTab ?? 'canvas') : 'canvas'
  );
  const [showControls, setShowControls] = useState(true);

  // Breakpoints
  const breakpoints: (Breakpoint & { id: string })[] = useMemo(() => {
    const bps = config.breakpoints || DEFAULT_BREAKPOINTS;
    return [
      ...bps,
      { id: 'full', label: 'Full', width: -1, icon: 'wide' as const },
    ];
  }, [config.breakpoints]);

  // Colors based on theme + config.ui overrides
  const colors = useMemo(() => {
    const primary = ui.primaryColor ?? config.primaryColor ?? '#6366f1';
    const secondary = ui.secondaryColor ?? primary;
    const accent = ui.accentColor ?? primary;
    const defaultBg = theme === 'dark' ? '#0a0a0b' : '#ffffff';
    const defaultBgSecondary = theme === 'dark' ? '#111113' : '#fafafa';
    const defaultBgTertiary = theme === 'dark' ? '#1a1a1d' : '#f4f4f5';
    return {
      bg: ui.contentBg ?? defaultBg,
      bgSecondary: ui.sidebarBg ?? defaultBgSecondary,
      bgTertiary: defaultBgTertiary,
      bgHover: theme === 'dark' ? '#1f1f23' : '#f0f0f1',
      border: theme === 'dark' ? '#27272a' : '#e4e4e7',
      borderLight: theme === 'dark' ? '#1f1f23' : '#f4f4f5',
      text: theme === 'dark' ? '#fafafa' : '#18181b',
      textSecondary: theme === 'dark' ? '#a1a1aa' : '#71717a',
      textMuted: theme === 'dark' ? '#71717a' : '#a1a1aa',
      primary,
      secondary,
      accent,
      primaryHover: theme === 'dark' ? `${primary}cc` : `${primary}dd`,
      primaryBg: theme === 'dark' ? `${primary}15` : `${primary}10`,
      primaryBorder: theme === 'dark' ? `${primary}40` : `${primary}30`,
    };
  }, [theme, config.primaryColor, ui.primaryColor, ui.secondaryColor, ui.accentColor, ui.sidebarBg, ui.contentBg]);

  const borderRadius = useMemo(() => {
    const r = ui.borderRadius ?? 'md';
    const map = { none: 0, sm: 6, md: 8, lg: 12 };
    return map[r];
  }, [ui.borderRadius]);

  const sidebarWidth = ui.sidebarWidth ?? 260;
  const fontFamily = ui.fontFamily ?? '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';

  // Toggle group expansion
  const toggleGroup = useCallback((title: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  // Filter stories based on search
  const filteredStories = useMemo(() => 
    stories.filter((group) =>
      group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.stories.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [stories, searchQuery]);

  // Get current story
  const currentGroup = activeStory ? stories[activeStory.groupIndex] : null;
  const currentStory = currentGroup && activeStory
    ? currentGroup.stories[activeStory.storyIndex]
    : null;

  // Merge live args with story args
  const mergedArgs = useMemo(() => {
    return { ...(currentStory?.args || {}), ...liveArgs };
  }, [currentStory?.args, liveArgs]);

  // Reset live args when story changes
  const handleStoryChange = useCallback((groupIndex: number, storyIndex: number) => {
    setActiveStory(groupIndex, storyIndex);
    setLiveArgs({});
  }, [setActiveStory]);

  // Reset args to defaults
  const resetArgs = useCallback(() => {
    setLiveArgs({});
  }, []);

  // Copy code to clipboard
  const copyCode = useCallback(() => {
    if (currentStory?.code) {
      navigator.clipboard.writeText(currentStory.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentStory?.code]);

  // Get prop entries with better type detection
  const propEntries = useMemo(() => {
    if (!currentStory?.args) return [];
    const args = currentStory.args as Record<string, unknown>;
    const argTypes = (currentStory.argTypes || {}) as Record<string, { options?: unknown[]; control?: string; description?: string }>;
    
    return Object.entries(args).map(([key, value]) => {
      const currentValue = (mergedArgs as Record<string, unknown>)[key];
      const argType = argTypes[key] || {};
      
      // Detect options based on common patterns or argTypes
      let options: string[] | undefined = argType.options as string[] | undefined;
      if (!options && typeof value === 'string') {
        if (key === 'variant' || key === 'color') {
          options = ['primary', 'secondary', 'success', 'warning', 'danger', 'ghost', 'outline'];
        } else if (key === 'size') {
          options = ['xs', 'sm', 'md', 'lg', 'xl'];
        }
      }
      
      return {
        name: key,
        type: typeof value,
        value: currentValue,
        defaultValue: value,
        options,
        control: argType.control,
        description: argType.description,
      };
    });
  }, [currentStory?.args, currentStory?.argTypes, mergedArgs]);

  // Get current breakpoint width
  const currentBreakpointWidth = useMemo(() => {
    if (activeBreakpoint === 'full') return '100%';
    const bp = breakpoints.find(b => b.id === activeBreakpoint);
    return bp ? `${bp.width}px` : '100%';
  }, [activeBreakpoint, breakpoints]);

  return (
    <div 
      className="kiln-layout"
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily,
        fontSize: '14px',
        lineHeight: 1.5,
      }}
    >
      <aside
        style={{
          width: sidebarOpen ? `${sidebarWidth}px` : 0,
          borderRight: sidebarOpen ? `1px solid ${colors.border}` : 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'width 0.2s ease',
          backgroundColor: colors.bgSecondary,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {config.logo ? (
            <img
              src={config.logo}
              alt={config.title || 'Logo'}
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
          ) : (
            <KilnLogo size={28} primaryColor={colors.primary} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.02em' }}>
              {config.title || 'Kiln'}
            </div>
            <div style={{ fontSize: '11px', color: colors.textMuted }}>
              Component Docs
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              left: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: colors.textMuted,
              display: 'flex',
            }}>
              <Icons.Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.bg,
                color: colors.text,
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.primary;
                e.target.style.boxShadow = `0 0 0 3px ${colors.primaryBg}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.border;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        <nav style={{ flex: 1, overflow: 'auto', padding: '0 8px 16px' }}>
          {filteredStories.length === 0 ? (
            <div style={{ padding: '20px 16px', textAlign: 'center', color: colors.textMuted, fontSize: '13px' }}>
              No components found
            </div>
          ) : (
            filteredStories.map((group) => {
              const isExpanded = expandedGroups.has(group.title);
              const groupIndex = stories.indexOf(group);
              
              return (
                <div key={group.title} style={{ marginBottom: '2px' }}>
                  <button
                    onClick={() => {
                      toggleGroup(group.title);
                      routeSync?.onGroupClick?.(groupIndex);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: colors.text,
                      fontSize: '13px',
                      fontWeight: 500,
                      gap: '8px',
                      borderRadius: '6px',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ 
                      transition: 'transform 0.15s',
                      transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                      color: colors.textMuted,
                      display: 'flex',
                    }}>
                      <Icons.ChevronDown />
                    </span>
                    <span style={{ color: colors.primary, display: 'flex' }}>
                      <Icons.Component />
                    </span>
                    <span style={{ flex: 1, textAlign: 'left' }}>{group.title}</span>
                    <span style={{ fontSize: '11px', color: colors.textMuted }}>
                      {group.stories.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <div style={{ marginLeft: '20px', borderLeft: `1px solid ${colors.borderLight}`, paddingLeft: '8px' }}>
                      {group.stories.map((story, storyIndex) => {
                        const isActive =
                          activeStory?.groupIndex === groupIndex &&
                          activeStory?.storyIndex === storyIndex;
                        return (
                          <button
                            key={story.name}
                            onClick={() => handleStoryChange(groupIndex, storyIndex)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              padding: '6px 10px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              backgroundColor: isActive ? colors.primaryBg : 'transparent',
                              color: isActive ? colors.primary : colors.textSecondary,
                              fontSize: '13px',
                              gap: '8px',
                              textAlign: 'left',
                              transition: 'background-color 0.15s, color 0.15s',
                              fontWeight: isActive ? 500 : 400,
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = colors.bgHover;
                                e.currentTarget.style.color = colors.text;
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = colors.textSecondary;
                              }
                            }}
                          >
                            <span style={{ 
                              color: isActive ? colors.primary : colors.textMuted,
                              display: 'flex',
                            }}>
                              <Icons.Story />
                            </span>
                            {story.name}
                            {story.tags?.includes('new') && (
                              <span style={{
                                fontSize: '9px',
                                padding: '1px 4px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                borderRadius: '3px',
                                fontWeight: 600,
                                marginLeft: 'auto',
                              }}>
                                NEW
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>

        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: `1px solid ${colors.border}`,
              cursor: 'pointer',
              backgroundColor: colors.bgTertiary,
              color: colors.textSecondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgHover;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgTertiary;
              e.currentTarget.style.color = colors.textSecondary;
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <span style={{ fontSize: '11px', color: colors.textMuted }}>
            Kiln v1.0.4
          </span>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div
          style={{
            padding: '8px 16px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.bgSecondary,
            gap: '16px',
            flexShrink: 0,
            minHeight: '52px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: colors.textSecondary,
                display: 'flex',
                flexShrink: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
            >
              <Icons.Menu />
            </button>
            
            {currentGroup && (
              <div style={{ 
                fontSize: '13px', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ color: colors.textMuted }}>{currentGroup.title}</span>
                <Icons.ChevronRight size={10} />
                <span style={{ fontWeight: 500, color: colors.text }}>{currentStory?.name}</span>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '2px', backgroundColor: colors.bgTertiary, padding: '3px', borderRadius: `${borderRadius}px` }}>
            <button
              onClick={() => setActiveTab('canvas')}
              style={{
                padding: '6px 14px',
                borderRadius: `${borderRadius}px`,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'canvas' ? colors.bg : 'transparent',
                  color: activeTab === 'canvas' ? colors.text : colors.textSecondary,
                  fontSize: '13px',
                  fontWeight: activeTab === 'canvas' ? 500 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s, color 0.15s',
                  boxShadow: activeTab === 'canvas' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icons.Component size={12} />
                Canvas
              </button>
            {docEnable && (
              <button
                onClick={() => setActiveTab('docs')}
                style={{
                  padding: '6px 14px',
                  borderRadius: `${borderRadius}px`,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'docs' ? colors.bg : 'transparent',
                  color: activeTab === 'docs' ? colors.text : colors.textSecondary,
                  fontSize: '13px',
                  fontWeight: activeTab === 'docs' ? 500 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s, color 0.15s',
                  boxShadow: activeTab === 'docs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Icons.Docs size={12} />
                Docs
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', backgroundColor: colors.bgTertiary, padding: '3px', borderRadius: '8px', gap: '2px' }}>
              {breakpoints.map((bp) => {
                const Icon = getBreakpointIconComponent(bp);
                const isActive = activeBreakpoint === bp.id;
                return (
                  <button
                    key={bp.id}
                    onClick={() => setActiveBreakpoint(bp.id)}
                    title={`${bp.label}${bp.width > 0 ? ` (${bp.width}px)` : ''}`}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? colors.primary : 'transparent',
                      color: isActive ? '#fff' : colors.textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = colors.text;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = colors.textSecondary;
                    }}
                  >
                    {bp.id === 'full' ? <Icons.Expand size={14} /> : <Icon size={14} />}
                  </button>
                );
              })}
            </div>
            
            <div style={{ width: '1px', height: '24px', backgroundColor: colors.border }} />
            
            <button
              onClick={() => setShowControls(!showControls)}
              title={showControls ? 'Hide controls' : 'Show controls'}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: showControls ? colors.primaryBg : colors.bgTertiary,
                color: showControls ? colors.primary : colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              <Icons.Controls />
            </button>

            <button
              onClick={toggleShowCode}
              title={showCode ? 'Hide code' : 'Show code'}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: showCode ? colors.primaryBg : colors.bgTertiary,
                color: showCode ? colors.primary : colors.textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s, color 0.15s',
              }}
            >
              <Icons.Code />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', display: 'flex' }}>
          {currentStory ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {activeTab === 'canvas' ? (
                <>
                  <div style={{ 
                    flex: 1,
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.bgTertiary,
                    overflow: 'auto',
                  }}>
                    <div style={{ 
                      width: currentBreakpointWidth,
                      maxWidth: '100%',
                      backgroundColor: colors.bg,
                      borderRadius: '12px',
                      border: `1px solid ${colors.border}`,
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      overflow: 'hidden',
                      transition: 'width 0.3s ease',
                    }}>
                      {activeBreakpoint !== 'full' && activeBreakpoint !== 'desktop' && (
                        <div style={{
                          padding: '8px 12px',
                          backgroundColor: colors.bgSecondary,
                          borderBottom: `1px solid ${colors.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.border }} />
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.border }} />
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.border }} />
                        </div>
                      )}
                      <div style={{ 
                        padding: '32px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '200px',
                      }}>
                        <currentStory.component {...mergedArgs} />
                      </div>
                    </div>
                  </div>
                  
                  {activeBreakpoint !== 'full' && (
                    <div style={{ 
                      padding: '8px', 
                      textAlign: 'center', 
                      fontSize: '12px', 
                      color: colors.textMuted,
                      backgroundColor: colors.bgSecondary,
                      borderTop: `1px solid ${colors.border}`,
                    }}>
                      {breakpoints.find(bp => bp.id === activeBreakpoint)?.label} — {currentBreakpointWidth}
                    </div>
                  )}

                  {showCode && currentStory.code && (
                    <div style={{
                      borderTop: `1px solid ${colors.border}`,
                      backgroundColor: colors.bgSecondary,
                      maxHeight: '300px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <div style={{
                        padding: '10px 16px',
                        borderBottom: `1px solid ${colors.border}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Code
                        </span>
                        <button
                          onClick={copyCode}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: `1px solid ${colors.border}`,
                            backgroundColor: colors.bg,
                            color: copied ? '#10b981' : colors.textSecondary,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            transition: 'color 0.15s',
                          }}
                        >
                          {copied ? <Icons.Check /> : <Icons.Copy />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre style={{
                        flex: 1,
                        margin: 0,
                        padding: '16px',
                        overflow: 'auto',
                        fontSize: '13px',
                        fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
                        lineHeight: 1.6,
                        backgroundColor: theme === 'dark' ? '#0d0d0f' : '#fafafa',
                      }}>
                        <code style={{ color: colors.text }}>{currentStory.code}</code>
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                /* Docs Tab */
                <div style={{ flex: 1, padding: '32px', overflow: 'auto', maxWidth: '900px', margin: '0 auto' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{currentGroup?.title}</h1>
                  {currentGroup?.description && (
                    <p style={{ fontSize: '16px', color: colors.textSecondary, marginBottom: '32px', lineHeight: 1.7 }}>
                      {currentGroup.description}
                    </p>
                  )}
                  
                  {currentStory.description && (
                    <div style={{ 
                      padding: '16px', 
                      backgroundColor: colors.bgSecondary, 
                      borderRadius: '8px', 
                      border: `1px solid ${colors.border}`,
                      marginBottom: '24px',
                    }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>{currentStory.name}</h3>
                      <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0 }}>{currentStory.description}</p>
                    </div>
                  )}

                  {propEntries.length > 0 && (
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Props</h2>
                      <div style={{ 
                        borderRadius: `${borderRadius}px`,
                        overflow: 'hidden',
                        border: `1px solid ${colors.border}`,
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead>
                            <tr style={{ backgroundColor: colors.bgSecondary }}>
                              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Name</th>
                              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Type</th>
                              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Default</th>
                              <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` }}>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {propEntries.map((prop, i) => (
                              <tr key={prop.name} style={{ backgroundColor: i % 2 === 0 ? colors.bg : colors.bgSecondary }}>
                                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: colors.primary, fontWeight: 500 }}>{prop.name}</td>
                                <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: colors.textMuted }}>{prop.type}</td>
                                <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{JSON.stringify(prop.defaultValue)}</td>
                                <td style={{ padding: '12px 16px', color: colors.textSecondary }}>{prop.description || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {config.doc && config.doc.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Documentation</h2>
                      {config.doc.map((entry) => (
                        <DocSection key={entry.id} entry={entry} colors={colors} borderRadius={borderRadius} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '16px',
              color: colors.textMuted,
            }}>
              <KilnLogo size={56} primaryColor={colors.primary} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 500, color: colors.text, marginBottom: '4px' }}>
                  Welcome to Kiln
                </div>
                <div style={{ fontSize: '14px' }}>
                  Select a component from the sidebar to get started
                </div>
              </div>
            </div>
          )}

          {showControls && currentStory && propEntries.length > 0 && activeTab === 'canvas' && (
            <div style={{
              width: '280px',
              borderLeft: `1px solid ${colors.border}`,
              backgroundColor: colors.bgSecondary,
              overflow: 'auto',
              flexShrink: 0,
            }}>
              <div style={{
                padding: '12px 16px',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Controls
                </span>
                <button
                  onClick={resetArgs}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: colors.textMuted,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.text}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.textMuted}
                >
                  <Icons.Reset size={12} />
                  Reset
                </button>
              </div>

              <div style={{ padding: '12px' }}>
                {propEntries.map((prop) => (
                  <div key={prop.name} style={{ 
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: colors.bg,
                    borderRadius: '8px',
                    border: `1px solid ${colors.borderLight}`,
                  }}>
                    <label style={{ 
                      fontSize: '12px', 
                      fontWeight: 500, 
                      color: colors.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <span>{prop.name}</span>
                      <span style={{ 
                        fontSize: '10px', 
                        color: colors.textMuted, 
                        fontFamily: 'monospace',
                        backgroundColor: colors.bgTertiary,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}>
                        {prop.type}
                      </span>
                    </label>
                    
                    {prop.type === 'boolean' ? (
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        cursor: 'pointer',
                      }}>
                        <div style={{
                          position: 'relative',
                          width: '40px',
                          height: '22px',
                        }}>
                          <input
                            type="checkbox"
                            checked={prop.value as boolean}
                            onChange={(e) => setLiveArgs({ ...liveArgs, [prop.name]: e.target.checked })}
                            style={{
                              position: 'absolute',
                              opacity: 0,
                              width: '100%',
                              height: '100%',
                              cursor: 'pointer',
                            }}
                          />
                          <div style={{
                            width: '40px',
                            height: '22px',
                            backgroundColor: prop.value ? colors.primary : colors.bgTertiary,
                            borderRadius: '11px',
                            transition: 'background-color 0.2s',
                            border: `1px solid ${prop.value ? colors.primary : colors.border}`,
                          }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              backgroundColor: '#fff',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '2px',
                              left: prop.value ? '20px' : '2px',
                              transition: 'left 0.2s',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }} />
                          </div>
                        </div>
                        <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                          {prop.value ? 'true' : 'false'}
                        </span>
                      </label>
                    ) : prop.options ? (
                      <select
                        value={String(prop.value ?? '')}
                        onChange={(e) => setLiveArgs({ ...liveArgs, [prop.name]: e.target.value })}
                        onBlur={() => {}}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${colors.border}`,
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontSize: '13px',
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23${colors.textMuted.slice(1)}' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 12px center',
                          paddingRight: '36px',
                        }}
                      >
                        {prop.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : prop.type === 'number' ? (
                      <input
                        type="number"
                        value={prop.value as number}
                        onChange={(e) => setLiveArgs({ ...liveArgs, [prop.name]: Number(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${colors.border}`,
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={String(prop.value)}
                        onChange={(e) => setLiveArgs({ ...liveArgs, [prop.name]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${colors.border}`,
                          backgroundColor: colors.bg,
                          color: colors.text,
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
