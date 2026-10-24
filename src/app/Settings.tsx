import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Constants from 'expo-constants';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { checkHealth } from '@/lib/api';
import { useSettings } from '@/lib/contexts/SettingsContext';

type Status = 'idle' | 'checking' | 'online' | 'offline';

const STATUS_TEXT: Record<Status, string> = {
  idle: 'Not tested yet',
  checking: 'Checking…',
  online: 'Connected',
  offline: 'Not reachable',
};

export default function Settings() {
  const theme = useTheme();
  const { apiBaseUrl, setApiBaseUrl } = useSettings();
  const [status, setStatus] = useState<Status>('idle');

  const runCheck = async () => {
    setStatus('checking');
    setStatus((await checkHealth(apiBaseUrl)) ? 'online' : 'offline');
  };

  const statusColor =
    status === 'online' ? theme.success : status === 'offline' ? theme.danger : theme.textSecondary;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Backend address</Text>
        <Text style={[styles.help, { color: theme.textSecondary }]}>
          On a real phone, use your computer&apos;s network address, e.g. http://192.168.1.20:8001
        </Text>
        <TextInput
          value={apiBaseUrl}
          onChangeText={(text) => {
            setApiBaseUrl(text);
            setStatus('idle');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="http://localhost:8001"
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
          ]}
        />
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{STATUS_TEXT[status]}</Text>
        </View>
        <PrimaryButton label="Test connection" onPress={runCheck} loading={status === 'checking'} />
      </View>

      <Text style={[styles.footer, { color: theme.textSecondary }]}>
        HoneyBee v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  label: {
    fontSize: 17,
    fontWeight: '800',
  },
  help: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
  },
});
