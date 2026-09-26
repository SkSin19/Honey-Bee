import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#4B4B4B',
    textSecondary: '#8A8A8A',
    background: '#FFFDF5',
    backgroundElement: '#FFF6D6',
    backgroundSelected: '#FFE9A8',
    card: '#FFFFFF',
    border: '#E8E4D8',
    accent: '#FFC800',
    accentDark: '#E0A400',
    accentSoft: '#FFF3CC',
    onAccent: '#4B3A00',
    success: '#58CC02',
    successDark: '#48A800',
    danger: '#FF4B4B',
    dangerDark: '#E23B3B',
    honey: '#FFF7DE',
    sky: '#1CB0F6',
  },
  dark: {
    text: '#F4F1E6',
    textSecondary: '#A8A392',
    background: '#17160F',
    backgroundElement: '#26241A',
    backgroundSelected: '#33301F',
    card: '#201E16',
    border: '#332F22',
    accent: '#FFC800',
    accentDark: '#B98A00',
    accentSoft: '#2C2712',
    onAccent: '#2A2000',
    success: '#58CC02',
    successDark: '#3F8F00',
    danger: '#FF5B5B',
    dangerDark: '#C93B3B',
    honey: '#241F10',
    sky: '#1CB0F6',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 12,
  md: 18,
  lg: 26,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
