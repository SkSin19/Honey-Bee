import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Mood = 'happy' | 'thinking' | 'sad';

interface Props {
  size?: number;
  mood?: Mood;
}

const DARK = '#3A2E00';

export function Bee({ size = 128, mood = 'happy' }: Props) {
  const bob = useSharedValue(0);
  const wing = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    wing.value = withRepeat(
      withTiming(1, { duration: 120, easing: Easing.linear }),
      -1,
      true,
    );
  }, [bob, wing]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value * 6 }],
  }));
  const leftWing = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-20 - wing.value * 22}deg` }],
  }));
  const rightWing = useAnimatedStyle(() => ({
    transform: [{ rotate: `${20 + wing.value * 22}deg` }],
  }));

  const bodySize = size;
  const eye = size * 0.17;
  const pupil = eye * 0.5;

  return (
    <View style={{ width: size * 1.7, height: size * 1.5, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[styles.antennae, bodyStyle, { top: size * 0.02 }]}>
        <View style={[styles.antenna, { transform: [{ rotate: '-24deg' }] }]}>
          <View style={styles.antennaTip} />
        </View>
        <View style={[styles.antenna, { transform: [{ rotate: '24deg' }] }]}>
          <View style={styles.antennaTip} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.wing,
          leftWing,
          { width: size * 0.5, height: size * 0.68, left: size * 0.16, top: size * 0.18 },
        ]}
      />
      <Animated.View
        style={[
          styles.wing,
          rightWing,
          { width: size * 0.5, height: size * 0.68, right: size * 0.16, top: size * 0.18 },
        ]}
      />

      <Animated.View style={bodyStyle}>
        <View
          style={[
            styles.body,
            { width: bodySize, height: bodySize, borderRadius: bodySize / 2 },
          ]}>
          <View style={[styles.stripe, { top: bodySize * 0.34, width: bodySize * 1.4 }]} />
          <View style={[styles.stripe, { top: bodySize * 0.62, width: bodySize * 1.4 }]} />

          <View style={[styles.face, { top: bodySize * 0.12 }]}>
            <View style={styles.eyeRow}>
              <View style={[styles.eye, { width: eye, height: eye, borderRadius: eye / 2 }]}>
                <View style={[styles.pupil, { width: pupil, height: pupil, borderRadius: pupil / 2 }]} />
              </View>
              <View style={[styles.eye, { width: eye, height: eye, borderRadius: eye / 2 }]}>
                <View style={[styles.pupil, { width: pupil, height: pupil, borderRadius: pupil / 2 }]} />
              </View>
            </View>

            <View style={styles.cheekRow}>
              <View style={[styles.cheek, { width: eye * 0.7, height: eye * 0.45 }]} />
              <View style={{ width: eye * 1.6 }} />
              <View style={[styles.cheek, { width: eye * 0.7, height: eye * 0.45 }]} />
            </View>

            <Mouth mood={mood} scale={size / 128} />
          </View>
        </View>

        <View style={[styles.stinger, { borderTopColor: DARK }]} />
      </Animated.View>
    </View>
  );
}

function Mouth({ mood, scale }: { mood: Mood; scale: number }) {
  const w = 26 * scale;
  const h = 13 * scale;
  if (mood === 'thinking') {
    const d = 10 * scale;
    return <View style={{ marginTop: 6 * scale, width: d, height: d, borderRadius: d / 2, backgroundColor: DARK }} />;
  }
  if (mood === 'sad') {
    return (
      <View
        style={{
          marginTop: 8 * scale,
          width: w,
          height: h,
          borderTopLeftRadius: w,
          borderTopRightRadius: w,
          borderWidth: 3 * scale,
          borderBottomWidth: 0,
          borderColor: DARK,
        }}
      />
    );
  }
  return (
    <View
      style={{
        marginTop: 5 * scale,
        width: w,
        height: h,
        borderBottomLeftRadius: w,
        borderBottomRightRadius: w,
        borderWidth: 3 * scale,
        borderTopWidth: 0,
        borderColor: DARK,
      }}
    />
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#FFC800',
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#EAB000',
  },
  stripe: {
    position: 'absolute',
    height: 16,
    backgroundColor: DARK,
  },
  face: {
    alignItems: 'center',
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 14,
  },
  eye: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
    borderWidth: 2,
    borderColor: DARK,
  },
  pupil: {
    backgroundColor: DARK,
  },
  cheekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cheek: {
    backgroundColor: 'rgba(255,120,90,0.55)',
    borderRadius: 999,
  },
  antennae: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 26,
    zIndex: 3,
  },
  antenna: {
    width: 4,
    height: 22,
    backgroundColor: DARK,
    borderRadius: 4,
    alignItems: 'center',
  },
  antennaTip: {
    position: 'absolute',
    top: -7,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DARK,
  },
  wing: {
    position: 'absolute',
    backgroundColor: 'rgba(210,238,255,0.85)',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(120,170,210,0.6)',
    zIndex: 0,
  },
  stinger: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 14,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
