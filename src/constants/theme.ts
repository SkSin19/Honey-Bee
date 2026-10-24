export const Colors = {
  light: {
    text: '#4B4B4B',
    textSecondary: '#8A8A8A',
    background: '#FFFDF5',
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
  },
  dark: {
    text: '#F4F1E6',
    textSecondary: '#A8A392',
    background: '#17160F',
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
  },
} as const;

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  six: 64,
} as const;

export const Radius = {
  sm: 12,
  md: 18,
  lg: 22,
  pill: 999,
} as const;
