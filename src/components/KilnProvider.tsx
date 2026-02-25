import { createContext, useContext, useState, useMemo, useEffect, ReactNode, FC } from 'react';
import type { KilnConfig, StoryGroup } from '../types';
import { DEFAULT_CONFIG } from '../types';

interface KilnContextValue {
  config: KilnConfig;
  stories: StoryGroup[];
  activeStory: { groupIndex: number; storyIndex: number } | null;
  setActiveStory: (groupIndex: number, storyIndex: number) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showCode: boolean;
  toggleShowCode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  routeSync?: KilnRouteSync;
}

const KilnContext = createContext<KilnContextValue | null>(null);

export interface KilnRouteSync {
  /** Initial story indices from URL (e.g. from Compass useParams) */
  initialStory: { groupIndex: number; storyIndex: number } | null;
  /** Called when user selects a story so host can navigate (e.g. /card/outlined) */
  onStoryChange?: (groupIndex: number, storyIndex: number) => void;
  /** Called when user clicks a group in the sidebar so host can navigate (e.g. /card) */
  onGroupClick?: (groupIndex: number) => void;
}

interface KilnProviderProps {
  children: ReactNode;
  config?: Partial<KilnConfig>;
  stories?: StoryGroup[];
  storyGroups?: StoryGroup[];
  /** When using routing (e.g. Compass), sync active story with URL */
  routeSync?: KilnRouteSync;
}

/**
 * Get initial theme based on config and system preference
 */
function getInitialTheme(configTheme: KilnConfig['theme']): 'light' | 'dark' {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kiln-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }

  // Use config theme
  if (configTheme === 'light' || configTheme === 'dark') {
    return configTheme;
  }

  // System preference
  if (configTheme === 'system' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Default to light
  return 'light';
}

/**
 * KilnProvider - Wraps your Kiln documentation app
 */
export const KilnProvider: FC<KilnProviderProps> = ({
  children,
  config: userConfig,
  stories: propStories,
  storyGroups: propStoryGroups,
  routeSync,
}) => {
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...userConfig }), [userConfig]);
  const stories = useMemo(() => propStories || propStoryGroups || [], [propStories, propStoryGroups]);

  const initialFromRoute = routeSync?.initialStory ?? null;
  const [activeStory, setActiveStoryState] = useState<{ groupIndex: number; storyIndex: number } | null>(() => {
    if (initialFromRoute && stories[initialFromRoute.groupIndex]?.stories[initialFromRoute.storyIndex]) {
      return initialFromRoute;
    }
    return stories.length > 0 ? { groupIndex: 0, storyIndex: 0 } : null;
  });

  useEffect(() => {
    if (!initialFromRoute || !stories.length) return;
    const group = stories[initialFromRoute.groupIndex];
    if (group?.stories[initialFromRoute.storyIndex]) {
      setActiveStoryState(initialFromRoute);
    }
  }, [initialFromRoute?.groupIndex, initialFromRoute?.storyIndex, stories]);
  
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => getInitialTheme(config.theme));
  const [showCode, setShowCode] = useState(config.showCodeDefault ?? false);
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for system theme changes
  useEffect(() => {
    if (config.theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config.theme]);

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kiln-theme', theme);
    }
  }, [theme]);

  const setActiveStory = (groupIndex: number, storyIndex: number) => {
    setActiveStoryState({ groupIndex, storyIndex });
    routeSync?.onStoryChange?.(groupIndex, storyIndex);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleShowCode = () => {
    setShowCode((prev) => !prev);
  };

  const value = useMemo(
    () => ({
      config,
      stories,
      activeStory,
      setActiveStory,
      theme,
      setTheme,
      toggleTheme,
      showCode,
      toggleShowCode,
      searchQuery,
      setSearchQuery,
      routeSync,
    }),
    [config, stories, activeStory, theme, showCode, searchQuery, routeSync]
  );

  return (
    <KilnContext.Provider value={value}>
      <div 
        className={theme === 'dark' ? 'kiln-dark' : 'kiln-light'}
        style={{
          colorScheme: theme,
        }}
      >
        {children}
      </div>
    </KilnContext.Provider>
  );
};

/**
 * Hook to access Kiln context
 */
export const useKiln = (): KilnContextValue => {
  const context = useContext(KilnContext);
  if (!context) {
    throw new Error('useKiln must be used within a KilnProvider');
  }
  return context;
};
