import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import TopBar from '@/components/TopBar';
import { SettingsProvider } from '@/lib/contexts/SettingsContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <View style={{ flex: 1 }}>
          <TopBar />
          <AppTabs />
        </View>
      </SettingsProvider>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
