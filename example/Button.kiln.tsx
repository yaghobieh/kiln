/**
 * Button – Kiln story file. Doc comes from Kiln config, not from this file.
 */

import { FC } from 'react';
import type { StoryGroup } from '@forgedevstack/kiln';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
}) => {
  const baseStyles = {
    padding: size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px',
    fontWeight: 500,
    borderRadius: '8px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#6366f1', color: 'white' },
    secondary: { backgroundColor: '#e4e4e7', color: '#18181b' },
    outline: { backgroundColor: 'transparent', border: '1px solid #e4e4e7', color: '#18181b' },
    ghost: { backgroundColor: 'transparent', color: '#6366f1' },
    danger: { backgroundColor: '#ef4444', color: 'white' },
  };

  return (
    <button style={{ ...baseStyles, ...variantStyles[variant] }} disabled={disabled}>
      {children}
    </button>
  );
};

const buttonStories: StoryGroup = {
  title: 'Button',
  description: 'Buttons allow users to take actions and make choices with a single tap.',
  component: Button,
  stories: [
    {
      name: 'Default',
      component: Button,
      args: {
        children: 'Click me',
        variant: 'primary',
        size: 'md',
        disabled: false,
        fullWidth: false,
      },
      argTypes: {
        variant: { options: ['primary', 'secondary', 'outline', 'ghost', 'danger'], description: 'The visual style of the button' },
        size: { options: ['sm', 'md', 'lg'], description: 'The size of the button' },
        disabled: { description: 'Whether the button is disabled' },
        fullWidth: { description: 'Whether the button should take full width' },
      },
      code: `<Button variant="primary" size="md">Click me</Button>`,
      description: 'The default button style with primary variant.',
    },
    {
      name: 'Secondary',
      component: Button,
      args: { children: 'Secondary', variant: 'secondary', size: 'md', disabled: false },
      code: `<Button variant="secondary">Secondary</Button>`,
      description: 'Secondary buttons are used for less prominent actions.',
      tags: ['new'],
    },
    {
      name: 'Outline',
      component: Button,
      args: { children: 'Outline', variant: 'outline', size: 'md', disabled: false },
      code: `<Button variant="outline">Outline</Button>`,
      description: 'Outline buttons have a transparent background with a border.',
    },
    {
      name: 'Ghost',
      component: Button,
      args: { children: 'Ghost', variant: 'ghost', size: 'md', disabled: false },
      code: `<Button variant="ghost">Ghost</Button>`,
      description: 'Ghost buttons are subtle and used for less important actions.',
    },
    {
      name: 'Danger',
      component: Button,
      args: { children: 'Delete', variant: 'danger', size: 'md', disabled: false },
      code: `<Button variant="danger">Delete</Button>`,
      description: 'Danger buttons are used for destructive actions.',
    },
    {
      name: 'Sizes',
      component: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      ),
      code: `<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>`,
      description: 'Buttons come in three sizes: small, medium, and large.',
    },
    {
      name: 'Disabled',
      component: Button,
      args: { children: 'Disabled', variant: 'primary', disabled: true },
      code: `<Button disabled>Disabled</Button>`,
      description: 'Disabled buttons cannot be interacted with.',
    },
  ],
};

export default buttonStories;
