/**
 * Card – Kiln story file. Doc comes from Kiln config (config.doc), not from this file.
 */

import { FC } from 'react';
import type { StoryGroup } from '@forgedevstack/kiln';

interface CardProps {
  title?: string;
  description?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const Card: FC<CardProps> = ({
  title,
  description,
  variant = 'elevated',
  padding = 'md',
  children,
}) => {
  const paddingValues = { sm: '12px', md: '20px', lg: '28px' };
  const variantStyles: Record<string, React.CSSProperties> = {
    elevated: {
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: 'none',
    },
    outlined: {
      backgroundColor: '#ffffff',
      border: '1px solid #e4e4e7',
      boxShadow: 'none',
    },
    filled: {
      backgroundColor: '#f4f4f5',
      border: 'none',
      boxShadow: 'none',
    },
  };

  return (
    <div
      style={{
        borderRadius: '12px',
        padding: paddingValues[padding],
        ...variantStyles[variant],
      }}
    >
      {title && (
        <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#18181b' }}>
          {title}
        </h3>
      )}
      {description && (
        <p style={{ fontSize: '14px', color: '#71717a', margin: 0, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

const cardStories: StoryGroup = {
  title: 'Card',
  description: 'Cards contain content and actions about a single subject.',
  component: Card,
  stories: [
    {
      name: 'Default',
      component: Card,
      args: {
        title: 'Card Title',
        description: 'This is a description of the card content.',
        variant: 'elevated',
        padding: 'md',
      },
      argTypes: {
        variant: { options: ['elevated', 'outlined', 'filled'], description: 'The visual style of the card' },
        padding: { options: ['sm', 'md', 'lg'], description: 'The padding inside the card' },
      },
      code: `<Card title="Card Title" description="...">\n</Card>`,
      description: 'The default elevated card with shadow.',
    },
    {
      name: 'Outlined',
      component: Card,
      args: {
        title: 'Outlined Card',
        description: 'Cards with borders instead of shadows.',
        variant: 'outlined',
        padding: 'md',
      },
      code: `<Card variant="outlined" title="Outlined Card">\n</Card>`,
      description: 'Outlined cards use a border instead of elevation.',
    },
    {
      name: 'Filled',
      component: Card,
      args: {
        title: 'Filled Card',
        description: 'Cards with a filled background.',
        variant: 'filled',
        padding: 'md',
      },
      code: `<Card variant="filled" title="Filled Card">\n</Card>`,
      description: 'Filled cards have a subtle background color.',
    },
    {
      name: 'With Custom Content',
      component: () => (
        <Card variant="elevated" padding="lg">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
              }}
            >
              JD
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#18181b' }}>John Doe</div>
              <div style={{ fontSize: '13px', color: '#71717a' }}>Software Engineer</div>
            </div>
          </div>
        </Card>
      ),
      code: `<Card variant="elevated" padding="lg">\n  ...\n</Card>`,
      description: 'Cards can contain any custom content.',
      tags: ['new'],
    },
  ],
};

export default cardStories;
