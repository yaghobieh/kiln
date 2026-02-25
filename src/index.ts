/**
 * @forgedevstack/kiln
 * Lightweight component documentation and showcase tool
 * A minimal, blazing-fast Storybook alternative for ForgeStack
 */

// Components
export { KilnProvider, useKiln, type KilnRouteSync } from './components/KilnProvider';
export { KilnLayout } from './components/KilnLayout';
export { KilnCanvas } from './components/KilnCanvas';

// Types
export type {
  KilnConfig,
  KilnUIConfig,
  DocEntry,
  Story,
  StoryGroup,
  KilnCanvasProps,
  KilnControlDef,
  PropDef,
  ComponentDoc,
} from './types';

export { DEFAULT_CONFIG } from './types';

// Utility to create a story
export const defineStory = <P,>(story: {
  name: string;
  render: React.ComponentType<P>;
  args?: P;
  code?: string;
  description?: string;
}) => ({
  name: story.name,
  component: story.render,
  args: story.args,
  code: story.code,
  description: story.description,
});

// Utility to create a story group
export const defineStories = (group: {
  title: string;
  component?: React.ComponentType;
  description?: string;
  stories: ReturnType<typeof defineStory>[];
}) => group;
