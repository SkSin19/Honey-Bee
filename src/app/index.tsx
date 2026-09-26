import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Bee } from '@/components/Bee';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { FORMATS, SUBJECTS, prettyError, type InputFormat } from '@/lib/config';
import { analyzeProblem, type AnalyzeResult } from '@/lib/api';
import { useSettings } from '@/lib/contexts/SettingsContext';

interface PickedImage {
  uri: string;
  base64: string;
}

const Index = () => {
  const theme = useTheme();
  const { apiBaseUrl } = useSettings();

  const [image, setImage] = useState<PickedImage | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [format, setFormat] = useState<InputFormat | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyAsset = (asset: ImagePicker.ImagePickerAsset) => {
    setImage({ uri: asset.uri, base64: asset.base64 ?? '' });
    setResult(null);
    setError(null);
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to choose an image.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });
    if (!res.canceled) {
      applyAsset(res.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow camera access to take a photo.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8, base64: true });
    if (!res.canceled) {
      applyAsset(res.assets[0]);
    }
  };

  const onAnalyze = async () => {
    if (!image || !subject || !format) {
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const output = await analyzeProblem(apiBaseUrl, {
        base64: image.base64,
        format,
        subject,
      });
      setResult(output);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = Boolean(image && subject && format) && !loading;
  const mood = loading ? 'thinking' : error ? 'sad' : result?.verdict === 'error' ? 'sad' : 'happy';
  const greeting = loading
    ? 'Buzzing through your work'
    : 'Snap your work and I will check it';

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <Bee size={120} mood={mood} />
        <SpeechBubble text={greeting} />
      </View>

      {image ? (
        <View style={[styles.previewCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
          <Image source={image.uri} style={styles.preview} contentFit="cover" />
          <Pressable
            onPress={() => setImage(null)}
            style={[styles.removeButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="close" size={20} color={theme.text} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.pickerRow}>
          <PickerTile icon="camera" label="Take photo" onPress={takePhoto} />
          <PickerTile icon="images" label="Library" onPress={pickFromLibrary} />
        </View>
      )}

      <Section title="Subject">
        <View style={styles.wrap}>
          {SUBJECTS.map((item) => (
            <Chip key={item} label={item} selected={subject === item} onPress={() => setSubject(item)} />
          ))}
        </View>
      </Section>

      <Section title="Format">
        <View style={styles.wrap}>
          {FORMATS.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              selected={format === item.key}
              onPress={() => setFormat(item.key)}
            />
          ))}
        </View>
      </Section>

      <PrimaryButton label="Check it" onPress={onAnalyze} disabled={!canAnalyze} loading={loading} />

      {error ? (
        <ResultCard
          tone="danger"
          title="I could not check that"
          body={error}
          hint="Make sure the backend is running and the address in Settings is right."
        />
      ) : null}

      {result ? <Outcome result={result} /> : null}
    </ScrollView>
  );
};

const Outcome = ({ result }: { result: AnalyzeResult }) => {
  const theme = useTheme();
  const correct = result.verdict === 'correct';
  const mathErrors = result.math?.errors ?? [];

  return (
    <View
      style={[
        styles.outcome,
        {
          backgroundColor: correct ? theme.honey : theme.card,
          borderColor: correct ? theme.success : theme.danger,
        },
      ]}>
      <View style={styles.outcomeHead}>
        <Bee size={78} mood={correct ? 'happy' : 'sad'} />
        <View style={styles.outcomeHeadText}>
          <Text style={[styles.outcomeTitle, { color: correct ? theme.successDark : theme.dangerDark }]}>
            {correct ? 'Nice work' : prettyError(result.error_type)}
          </Text>
          <Text style={[styles.outcomeSub, { color: theme.textSecondary }]}>
            {correct ? 'No mistakes spotted' : 'Here is what to look at'}
          </Text>
        </View>
      </View>

      {mathErrors.map((e, i) => (
        <View key={i} style={[styles.fixRow, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Text style={[styles.fixStatement, { color: theme.text }]}>{e.statement}</Text>
          <Text style={[styles.fixLine, { color: theme.textSecondary }]}>
            You wrote <Text style={{ color: theme.danger, fontWeight: '800' }}>{e.claimed}</Text>, correct is{' '}
            <Text style={{ color: theme.successDark, fontWeight: '800' }}>{e.correct}</Text>
          </Text>
        </View>
      ))}

      {result.text?.trim() ? (
        <View style={styles.readBlock}>
          <Text style={[styles.readLabel, { color: theme.textSecondary }]}>What I read</Text>
          <Text style={[styles.readText, { color: theme.text }]}>{result.text.trim()}</Text>
        </View>
      ) : null}
    </View>
  );
};

const ResultCard = ({
  tone,
  title,
  body,
  hint,
}: {
  tone: 'danger';
  title: string;
  body: string;
  hint?: string;
}) => {
  const theme = useTheme();
  return (
    <View style={[styles.outcome, { backgroundColor: theme.card, borderColor: theme.danger }]}>
      <Text style={[styles.outcomeTitle, { color: theme.dangerDark }]}>{title}</Text>
      <Text style={[styles.readText, { color: theme.text }]}>{body}</Text>
      {hint ? <Text style={[styles.outcomeSub, { color: theme.textSecondary }]}>{hint}</Text> : null}
    </View>
  );
};

const PickerTile = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderBottomColor: theme.border,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}>
      <View style={[styles.tileIcon, { backgroundColor: theme.accentSoft }]}>
        <Ionicons name={icon} size={26} color={theme.accentDark} />
      </View>
      <Text style={[styles.tileLabel, { color: theme.text }]}>{label}</Text>
    </Pressable>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  tile: {
    flex: 1,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  tileIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 16,
    fontWeight: '800',
  },
  previewCard: {
    borderWidth: 2,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  preview: {
    width: '100%',
    height: 230,
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  outcome: {
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  outcomeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  outcomeHeadText: {
    flex: 1,
  },
  outcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  outcomeSub: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  fixRow: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.three,
    gap: 4,
  },
  fixStatement: {
    fontSize: 16,
    fontWeight: '800',
  },
  fixLine: {
    fontSize: 14,
    fontWeight: '600',
  },
  readBlock: {
    gap: 4,
  },
  readLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  readText: {
    fontSize: 15,
    lineHeight: 22,
  },
});

export default Index;
