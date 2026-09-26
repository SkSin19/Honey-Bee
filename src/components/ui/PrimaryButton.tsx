import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'accent' | 'success' | 'danger';
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, disabled, loading, tone = 'accent', style }: Props) {
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);
  const inactive = disabled || loading;

  const face =
    tone === 'success' ? theme.success : tone === 'danger' ? theme.danger : theme.accent;
  const edge =
    tone === 'success' ? theme.successDark : tone === 'danger' ? theme.dangerDark : theme.accentDark;

  const faceColor = inactive ? theme.backgroundSelected : face;
  const edgeColor = inactive ? theme.border : edge;
  const textColor = inactive ? theme.textSecondary : tone === 'accent' ? theme.onAccent : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[{ borderRadius: Radius.md, backgroundColor: edgeColor }, style]}>
      <View
        style={[
          styles.face,
          { backgroundColor: faceColor, marginBottom: pressed || inactive ? 0 : 5 },
        ]}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: {
    borderRadius: Radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
