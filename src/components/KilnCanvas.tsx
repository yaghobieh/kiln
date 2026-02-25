import { FC } from 'react';
import type { KilnCanvasProps } from '../types';
import { useKiln } from './KilnProvider';

const paddingSizes = {
  none: '0',
  sm: '16px',
  md: '32px',
  lg: '48px',
};

/**
 * KilnCanvas - Wrapper for component preview with background options
 */
export const KilnCanvas: FC<KilnCanvasProps> = ({
  background = 'transparent',
  centered = true,
  padding = 'md',
  children,
}) => {
  const { theme } = useKiln();

  const getBackgroundStyle = () => {
    switch (background) {
      case 'light':
        return { backgroundColor: '#ffffff' };
      case 'dark':
        return { backgroundColor: '#09090b' };
      case 'checker':
        return {
          backgroundColor: theme === 'dark' ? '#18181b' : '#f3f4f6',
          backgroundImage: `
            linear-gradient(45deg, ${theme === 'dark' ? '#27272a' : '#e5e7eb'} 25%, transparent 25%),
            linear-gradient(-45deg, ${theme === 'dark' ? '#27272a' : '#e5e7eb'} 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${theme === 'dark' ? '#27272a' : '#e5e7eb'} 75%),
            linear-gradient(-45deg, transparent 75%, ${theme === 'dark' ? '#27272a' : '#e5e7eb'} 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        };
      default:
        return { backgroundColor: 'transparent' };
    }
  };

  return (
    <div
      style={{
        padding: paddingSizes[padding],
        display: centered ? 'flex' : 'block',
        alignItems: centered ? 'center' : undefined,
        justifyContent: centered ? 'center' : undefined,
        minHeight: '200px',
        borderRadius: '12px',
        ...getBackgroundStyle(),
      }}
    >
      {children}
    </div>
  );
};
