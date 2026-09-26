import { StyleSheet, Text, View } from 'react-native';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Props {
  text: string;
}

export function SpeechBubble({ text }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <View style={[styles.bubble, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.text, { color: theme.text }]}>{text}</Text>
      </View>
      <View style={[styles.tail, { borderTopColor: theme.border }]} />
      <View style={[styles.tailInner, { borderTopColor: theme.card }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  bubble: {
    borderWidth: 2,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    maxWidth: 320,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tailInner: {
    position: 'absolute',
    bottom: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
});
