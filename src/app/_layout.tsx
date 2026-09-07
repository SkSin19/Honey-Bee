import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import type { ComponentType, PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import TopBarContext from '@/lib/contexts/TopBarContext';

const TopBarProvider = TopBarContext as ComponentType<
  PropsWithChildren<{ containTopBar: boolean }>
>;

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TopBarProvider containTopBar={true}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </TopBarProvider>
    </ThemeProvider>
  );
}
