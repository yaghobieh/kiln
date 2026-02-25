/**
 * Example Kiln App with Compass routing.
 * - Click a group (e.g. Card) → /card (redirects to first story)
 * - Click a story (e.g. Outlined) → /card/outlined
 * - Doc comes from Kiln config (config.doc), not from story files.
 */

import React from 'react';
import { CompassProvider, Routes, useParams, useNavigate } from '@forgedevstack/forge-compass';
import { KilnProvider, KilnLayout } from '@forgedevstack/kiln';
import type { StoryGroup } from '@forgedevstack/kiln';

import buttonStories from './Button.kiln';
import cardStories from './Card.kiln';
import badgeStories from './Badge.kiln';

const storyGroups: StoryGroup[] = [buttonStories, cardStories, badgeStories];

function slugify(s: string): string {
  return String(s).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function findStoryIndices(groupSlug: string, storySlug: string): { groupIndex: number; storyIndex: number } | null {
  if (!groupSlug || !storySlug) return null;
  const gi = storyGroups.findIndex((g) => slugify(g.title) === groupSlug);
  if (gi < 0) return null;
  const si = storyGroups[gi].stories.findIndex((s) => slugify(s.name) === storySlug);
  if (si < 0) return null;
  return { groupIndex: gi, storyIndex: si };
}

const config = {
  title: 'My Component Library',
  description: 'Documentation for my components',
  primaryColor: '#d97706',
  theme: 'dark' as const,
  docEnable: true,
  defaultTab: 'docs' as const,
  doc: [
    {
      id: 'intro',
      title: 'Introduction',
      content: '<p>This is the <strong>Kiln</strong> example. Doc is configured in Kiln (<code>config.doc</code>), not inside story files.</p><p>Use the <strong>Canvas</strong> tab to preview components and the <strong>Docs</strong> tab to see props and this custom doc.</p>',
    },
    {
      id: 'usage',
      title: 'Usage',
      content: '<p>Story files are <code>*.kiln.tsx</code> (e.g. <code>Card.kiln.tsx</code>). They export a <code>StoryGroup</code> with <code>title</code>, <code>stories</code>, and optional <code>description</code>. All documentation beyond that lives in Kiln config.</p>',
    },
  ],
};

function IndexRedirect() {
  const { navigate } = useNavigate();
  React.useEffect(() => {
    const first = storyGroups[0]?.stories[0];
    const to = first ? `/${slugify(storyGroups[0].title)}/${slugify(first.name)}` : '/';
    navigate(to, { replace: true });
  }, [navigate]);
  return null;
}

function GroupRedirect() {
  const { groupSlug } = useParams<{ groupSlug: string }>();
  const { navigate } = useNavigate();
  React.useEffect(() => {
    if (!groupSlug) return;
    const gi = storyGroups.findIndex((g) => slugify(g.title) === groupSlug);
    if (gi < 0) {
      navigate('/', { replace: true });
      return;
    }
    const first = storyGroups[gi].stories[0];
    const to = first ? `/${groupSlug}/${slugify(first.name)}` : `/`;
    navigate(to, { replace: true });
  }, [groupSlug, navigate]);
  return null;
}

function KilnApp() {
  const params = useParams<{ groupSlug: string; storySlug: string }>();
  const { navigate } = useNavigate();
  const groupSlug = params.groupSlug ?? '';
  const storySlug = params.storySlug ?? '';
  const initialStory = React.useMemo(
    () => findStoryIndices(groupSlug, storySlug),
    [groupSlug, storySlug]
  );
  const onStoryChange = React.useCallback(
    (groupIndex: number, storyIndex: number) => {
      const g = storyGroups[groupIndex];
      const s = g?.stories[storyIndex];
      if (g && s) navigate(`/${slugify(g.title)}/${slugify(s.name)}`);
    },
    [navigate]
  );
  const onGroupClick = React.useCallback(
    (groupIndex: number) => {
      const g = storyGroups[groupIndex];
      if (g) navigate(`/${slugify(g.title)}`);
    },
    [navigate]
  );

  return (
    <KilnProvider
      config={config}
      storyGroups={storyGroups}
      routeSync={{ initialStory, onStoryChange, onGroupClick }}
    >
      <KilnLayout />
    </KilnProvider>
  );
}

function App() {
  return (
    <CompassProvider
      routes={[
        { path: '/', name: 'index', element: React.createElement(IndexRedirect) },
        { path: '/:groupSlug', name: 'group', element: React.createElement(GroupRedirect) },
        { path: '/:groupSlug/:storySlug', name: 'story', component: KilnApp },
        { path: '*', name: 'catch', element: React.createElement(IndexRedirect) },
      ]}
    >
      <Routes />
    </CompassProvider>
  );
}

export default App;
