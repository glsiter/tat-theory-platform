// Design system utilities for TAT Theory Platform

import type { ThemeColors, AnimationConfig } from '@/types/components'

// TAT Theory color palette
export const tatColors: ThemeColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  accent: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}

// Animation presets
export const animations: Record<string, AnimationConfig> = {
  fadeIn: {
    duration: 300,
    easing: 'ease-in-out'
  },
  slideUp: {
    duration: 250,
    easing: 'ease-out'
  },
  slideDown: {
    duration: 250,
    easing: 'ease-out'
  },
  scaleIn: {
    duration: 200,
    easing: 'ease-out'
  },
  bounce: {
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
}

// Spacing scale
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
}

// Typography scale
export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
}

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Utility functions
export const getColorValue = (color: keyof ThemeColors, shade: number): string => {
  return tatColors[color][shade] || tatColors.gray[500]
}

export const generateGradient = (
  startColor: string,
  endColor: string,
  direction: string = 'to right'
): string => {
  return `linear-gradient(${direction}, ${startColor}, ${endColor})`
}

export const createShadow = (
  x: number = 0,
  y: number = 4,
  blur: number = 6,
  spread: number = -1,
  color: string = 'rgba(0, 0, 0, 0.1)'
): string => {
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`
}

// TAT Theory specific color mappings
export const tatThemeMapping = {
  theory: tatColors.primary[600],
  mindMap: tatColors.secondary[600],
  analysis: tatColors.accent[600],
  research: tatColors.warning[600],
  application: tatColors.error[600],
}

// Component size mappings
export const componentSizes = {
  button: {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
  },
  input: {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 0.75rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1rem', fontSize: '1.125rem' },
  },
  card: {
    sm: { padding: '1rem' },
    md: { padding: '1.5rem' },
    lg: { padding: '2rem' },
  }
}

// Accessibility helpers
export const a11y = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  srOnly: 'sr-only',
  skipLink: 'absolute left-[-10000px] top-auto w-1 h-1 overflow-hidden focus:left-6 focus:top-7 focus:w-auto focus:h-auto focus:overflow-visible',
}

export default {
  colors: tatColors,
  animations,
  spacing,
  typography,
  breakpoints,
  getColorValue,
  generateGradient,
  createShadow,
  tatThemeMapping,
  componentSizes,
  a11y,
}