import { useState, type ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Bee } from '@/components/Bee';
import { Chip } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { analyzeProblem, type AnalyzeResult } from '@/lib/api';
import { FORMATS, SUBJECTS, prettyError, type InputFormat, type Subject } from '@/lib/config';
import { useSettings } from '@/lib/contexts/SettingsContext';

interface PickedImage {
  uri: string;
  base64: string;
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.8,
  base64: true,
};

export default function Home() {
  const theme = useTheme();
  const { apiBaseUrl } = useSettings();

  const [image, setImage] = useState<PickedImage | null>(null);
  const [subject, setSubject] = useState<Subject>('Math');
  const [format, setFormat] = useState<InputFormat>('handwritten');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectImage = (next: PickedImage | null) => {
    setImage(next);
    setResult(null);
    setError(null);
  };

  const pick = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', `Allow ${source === 'camera' ? 'camera' : 'photo'} access to continue.`);
      return;
    }
    const res =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
        : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (res.canceled) {
      return;
    }
    const asset = res.assets[0];
    if (!asset.base64) {
      Alert.alert('Could not read image', 'Please try a different photo.');
      return;
    }
    selectImage({ uri: asset.uri, base64: asset.base64 });
  };

  const onCheck = async () => {
    if (!image) {
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await analyzeProblem(apiBaseUrl, { base64: image.base64, format, subject }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const mood = loading ? 'thinking' : error || result?.verdict === 'error' ? 'sad' : 'happy';

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Bee size={72} mood={mood} />
        <Text style={[styles.heroText, { color: theme.textSecondary }]}>
          {loading ? 'Checking your work…' : 'Snap your work and I will check it'}
        </Text>
      </View>

      {image ? (
        <View style={[styles.preview, { borderColor: theme.border }]}>
          <Image source={image.uri} style={styles.previewImage} contentFit="cover" />
          <Pressable
            onPress={() => selectImage(null)}
            accessibilityLabel="Remove photo"
            style={[styles.removeButton, { backgroundColor: theme.card }]}>
            <Ionicons name="close" size={18} color={theme.text} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.pickerRow}>
          <PickerTile icon="camera" label="Take photo" onPress={() => pick('camera')} />
          <PickerTile icon="images" label="Library" onPress={() => pick('library')} />
        </View>
      )}

      <Section title="Subject">
        {SUBJECTS.map((item) => (
          <Chip key={item} label={item} selected={subject === item} onPress={() => setSubject(item)} />
        ))}
      </Section>

      <Section title="Format">
        {FORMATS.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            selected={format === item.key}
            onPress={() => setFormat(item.key)}
          />
        ))}
      </Section>

      <PrimaryButton label="Check it" onPress={onCheck} disabled={!image} loading={loading} />

      {error ? (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.danger }]}>
          <Text style={[styles.cardTitle, { color: theme.dangerDark }]}>Could not check that</Text>
          <Text style={[styles.body, { color: theme.text }]}>{error}</Text>
          <Text style={[styles.muted, { color: theme.textSecondary }]}>
            Make sure the backend is running and the address in Settings is right.
          </Text>
        </View>
      ) : null}

      {result ? <Outcome result={result} /> : null}
    </ScrollView>
  );
}

function Outcome({ result }: { result: AnalyzeResult }) {
  const theme = useTheme();
  const correct = result.verdict === 'correct';
  const text = result.text?.trim();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: correct ? theme.success : theme.danger },
      ]}>
      <View style={styles.outcomeHead}>
        <Ionicons
          name={correct ? 'checkmark-circle' : 'alert-circle'}
          size={28}
          color={correct ? theme.success : theme.danger}
        />
        <Text style={[styles.cardTitle, { color: correct ? theme.successDark : theme.dangerDark }]}>
          {correct ? 'Nice work, no mistakes spotted' : prettyError(result.error_type)}
        </Text>
      </View>

      {result.math?.errors?.map((e, i) => (
        <View key={i} style={[styles.fixRow, { backgroundColor: theme.background }]}>
          <Text style={[styles.fixStatement, { color: theme.text }]}>{e.statement}</Text>
          <Text style={[styles.muted, { color: theme.textSecondary }]}>
            You wrote <Text style={{ color: theme.danger, fontWeight: '800' }}>{e.claimed}</Text>, correct
            is <Text style={{ color: theme.successDark, fontWeight: '800' }}>{e.correct}</Text>
          </Text>
        </View>
      ))}

      {text ? (
        <View style={{ gap: Spacing.one }}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>What I read</Text>
          <Text style={[styles.body, { color: theme.text }]}>{text}</Text>
        </View>
      ) : null}
    </View>
  );
}

function PickerTile({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.7 : 1 },
      ]}>
      <Ionicons name={icon} size={26} color={theme.accentDark} />
      <Text style={[styles.tileLabel, { color: theme.text }]}>{label}</Text>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: Spacing.two }}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{title}</Text>
      <View style={styles.wrap}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
  },
  heroText: {
    fontSize: 15,
    fontWeight: '600',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  tile: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  tileLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  preview: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 230,
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.three,
    right: Spacing.three,
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
  },
  outcomeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  fixRow: {
    borderRadius: Radius.sm,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  fixStatement: {
    fontSize: 15,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  muted: {
    fontSize: 14,
  },
});
