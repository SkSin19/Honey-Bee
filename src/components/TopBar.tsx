import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

export default function TopBar() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10, backgroundColor: theme.accent }]}>
      <Text style={[styles.brand, { color: theme.onAccent }]}>HoneyBee</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  brand: {
    fontSize: 20,
    fontWeight: '900',
  },
});
