import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';

const TopBar = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
          backgroundColor: theme.accent,
        },
      ]}>
      <Text style={styles.brand}>HoneyBee</Text>
      <View style={[styles.badge, { backgroundColor: theme.card }]}>
        <View style={[styles.dot, { backgroundColor: theme.accentDark }]} />
        <Text style={[styles.badgeText, { color: theme.text }]}>beta</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  brand: {
    color: '#4B3A00',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
});

export default TopBar;
