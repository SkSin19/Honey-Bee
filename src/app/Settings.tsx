import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Bee } from '@/components/Bee';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { checkHealth } from '@/lib/api';
import { useSettings } from '@/lib/contexts/SettingsContext';

type Status = 'idle' | 'checking' | 'online' | 'offline';

const Settings = () => {
  const theme = useTheme();
  const { apiBaseUrl, setApiBaseUrl } = useSettings();
  const [status, setStatus] = useState<Status>('idle');

  const runCheck = async () => {
    setStatus('checking');
    const ok = await checkHealth(apiBaseUrl);
    setStatus(ok ? 'online' : 'offline');
  };

  const statusColor =
    status === 'online' ? theme.success : status === 'offline' ? theme.danger : theme.textSecondary;
  const statusText =
    status === 'online'
      ? 'Connected'
      : status === 'offline'
        ? 'Not reachable'
        : status === 'checking'
          ? 'Checking'
          : 'Not tested yet';

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Bee size={92} mood={status === 'offline' ? 'sad' : 'happy'} />
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.text }]}>Backend address</Text>
        <Text style={[styles.help, { color: theme.textSecondary }]}>
          On a real phone use your computer network address, for example http://192.168.1.20:8001
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
          <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        </View>
        <PrimaryButton label="Test connection" onPress={runCheck} loading={status === 'checking'} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <InfoRow label="App" value="HoneyBee" />
        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Best at" value="Lower level problems" />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
  },
  card: {
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  label: {
    fontSize: 18,
    fontWeight: '900',
  },
  help: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 52,
    borderWidth: 2,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    fontWeight: '600',
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
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '800',
  },
});

export default Settings;
