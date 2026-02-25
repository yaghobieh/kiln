/**
 * Badge – Kiln story file. Doc comes from Kiln config, not from this file.
 */

import { FC } from 'react';
import type { StoryGroup } from '@forgedevstack/kiln';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  rounded?: boolean;
}

const Badge: FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: { backgroundColor: '#e4e4e7', color: '#3f3f46' },
    primary: { backgroundColor: '#eef2ff', color: '#4f46e5' },
    success: { backgroundColor: '#dcfce7', color: '#16a34a' },
    warning: { backgroundColor: '#fef3c7', color: '#d97706' },
    danger: { backgroundColor: '#fee2e2', color: '#dc2626' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'sm' ? '2px 6px' : '4px 10px',
        fontSize: size === 'sm' ? '11px' : '12px',
        fontWeight: 500,
        borderRadius: rounded ? '9999px' : '6px',
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
};

const badgeStories: StoryGroup = {
  title: 'Badge',
  description: 'Badges are used to highlight an item\'s status for quick recognition.',
  component: Badge,
  stories: [
    {
      name: 'Default',
      component: Badge,
      args: { children: 'Badge', variant: 'default', size: 'md', rounded: false },
      argTypes: {
        variant: { options: ['default', 'primary', 'success', 'warning', 'danger'], description: 'The color variant of the badge' },
        size: { options: ['sm', 'md'], description: 'The size of the badge' },
        rounded: { description: 'Whether the badge has fully rounded corners' },
      },
      code: `<Badge>Badge</Badge>`,
      description: 'The default badge style.',
    },
    {
      name: 'Primary',
      component: Badge,
      args: { children: 'Primary', variant: 'primary', size: 'md' },
      code: `<Badge variant="primary">Primary</Badge>`,
      description: 'Primary badge for highlighting important items.',
    },
    {
      name: 'Success',
      component: Badge,
      args: { children: 'Success', variant: 'success', size: 'md' },
      code: `<Badge variant="success">Success</Badge>`,
      description: 'Success badge for positive states.',
    },
    {
      name: 'Warning',
      component: Badge,
      args: { children: 'Warning', variant: 'warning', size: 'md' },
      code: `<Badge variant="warning">Warning</Badge>`,
      description: 'Warning badge for cautionary states.',
    },
    {
      name: 'Danger',
      component: Badge,
      args: { children: 'Danger', variant: 'danger', size: 'md' },
      code: `<Badge variant="danger">Danger</Badge>`,
      description: 'Danger badge for error or critical states.',
    },
    {
      name: 'All Variants',
      component: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      ),
      code: `<Badge variant="default">Default</Badge>\n...`,
      description: 'All available badge variants.',
    },
    {
      name: 'Rounded',
      component: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="primary" rounded>New</Badge>
          <Badge variant="success" rounded>Active</Badge>
          <Badge variant="warning" rounded>Pending</Badge>
        </div>
      ),
      code: `<Badge variant="primary" rounded>New</Badge>\n...`,
      description: 'Rounded badges with pill shape.',
      tags: ['new'],
    },
  ],
};

export default badgeStories;
