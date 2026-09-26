import { Pressable, StyleSheet, Text } from 'react-native';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function Chip({ label, selected, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.accentSoft : theme.card,
          borderColor: selected ? theme.accent : theme.border,
          borderBottomColor: selected ? theme.accentDark : theme.border,
        },
      ]}>
      <Text
        style={[
          styles.label,
          { color: selected ? theme.onAccent : theme.textSecondary },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
  },
});
