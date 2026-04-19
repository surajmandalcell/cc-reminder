import { useEffect, useRef } from 'react';
import type { ExpoWebGLRenderingContext } from 'expo-gl';
import { GLView } from 'expo-gl';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import type { AppPalette } from '@/constants/Colors';

type Props = {
  palette: AppPalette;
  phase: number;
};

export function OpenGLHero({ palette, phase }: Props) {
  const frameRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const glow = useSharedValue(0.9);

  useEffect(() => {
    mountedRef.current = true;
    glow.value = withRepeat(
      withTiming(1.08, {
        duration: 2200,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );

    return () => {
      mountedRef.current = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [glow]);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow.value }],
    opacity: glow.value - 0.12,
  }));

  async function onContextCreate(gl: ExpoWebGLRenderingContext) {
    const [{ Renderer }, THREE] = await Promise.all([import('expo-three'), import('three')]);

    const renderer = new Renderer({ gl }) as unknown as {
      setSize: (width: number, height: number) => void;
      setClearColor: (color: number, alpha?: number) => void;
      render: (scene: unknown, camera: unknown) => void;
    };
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.z = 7.5;

    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    const keyLight = new THREE.PointLight(0x7dd3fc, 12, 30);
    keyLight.position.set(-3, 3.4, 4.4);
    const fillLight = new THREE.PointLight(0x2dd4bf, 9, 30);
    fillLight.position.set(3.2, -1.5, 5.5);
    scene.add(ambient, keyLight, fillLight);

    const group = new THREE.Group();

    const card = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 2.8, 0.18, 4, 4, 2),
      new THREE.MeshPhysicalMaterial({
        color: 0x1d4ed8,
        metalness: 0.62,
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      }),
    );

    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 1.9),
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        emissive: 0x1e40af,
        emissiveIntensity: 0.55,
      }),
    );
    panel.position.z = 0.11;

    const chip = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 0.46, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9, roughness: 0.15 }),
    );
    chip.position.set(-1.15, 0.45, 0.12);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.045, 12, 80),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.45 }),
    );
    ring.rotation.x = 1.2;

    const ringTwo = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.035, 12, 60),
      new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.32 }),
    );
    ringTwo.rotation.y = 0.9;

    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      const stride = index * 3;
      particlePositions[stride] = (Math.random() - 0.5) * 8;
      particlePositions[stride + 1] = (Math.random() - 0.5) * 6;
      particlePositions[stride + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.72 }),
    );

    group.add(card, panel, chip, ring, ringTwo);
    scene.add(group, particles);

    const clock = new THREE.Clock();

    const render = () => {
      if (!mountedRef.current) {
        return;
      }

      const elapsed = clock.getElapsedTime() + phase * 0.2;
      group.rotation.y = Math.sin(elapsed * 0.55) * 0.28;
      group.rotation.x = Math.cos(elapsed * 0.35) * 0.12;
      group.position.y = Math.sin(elapsed * 0.9) * 0.18;
      ring.rotation.z += 0.004;
      ringTwo.rotation.x += 0.006;
      particles.rotation.y += 0.0015;

      renderer.render(scene, camera);
      gl.endFrameEXP();
      frameRef.current = requestAnimationFrame(render);
    };

    render();
  }

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.shell, { backgroundColor: palette.cardAlt, borderColor: palette.border }]}>
        <Animated.View style={[styles.webGlow, overlayStyle, { backgroundColor: palette.glow }]} />
        <Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(240)} style={styles.webStack}>
          <View style={[styles.webCardBack, { backgroundColor: palette.hero, borderColor: palette.border }]} />
          <View style={[styles.webCardMid, { backgroundColor: palette.card, borderColor: palette.border }]} />
          <View style={[styles.webCardFront, { backgroundColor: palette.text }]}> 
            <View style={styles.webLines}>
              <View style={[styles.webChip, { backgroundColor: palette.background }]} />
              <View style={[styles.webLine, { backgroundColor: palette.cardAlt }]} />
              <View style={[styles.webLineShort, { backgroundColor: palette.hero }]} />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.shell, { backgroundColor: palette.cardAlt, borderColor: palette.border }]}>
      <Animated.View style={[styles.webGlow, overlayStyle, { backgroundColor: palette.glow }]} />
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: 300,
    borderRadius: 26,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glView: {
    width: '100%',
    height: '100%',
  },
  webGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.72,
  },
  webStack: {
    width: 260,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webCardBack: {
    position: 'absolute',
    width: 224,
    height: 136,
    borderRadius: 22,
    borderWidth: 1,
    transform: [{ rotate: '-8deg' }, { translateX: -18 }, { translateY: 16 }],
  },
  webCardMid: {
    position: 'absolute',
    width: 234,
    height: 144,
    borderRadius: 24,
    borderWidth: 1,
    transform: [{ rotate: '6deg' }, { translateX: 12 }, { translateY: 8 }],
  },
  webCardFront: {
    width: 244,
    height: 150,
    borderRadius: 24,
    padding: 22,
    justifyContent: 'space-between',
  },
  webLines: {
    gap: 14,
  },
  webChip: {
    width: 44,
    height: 34,
    borderRadius: 10,
  },
  webLine: {
    width: 132,
    height: 12,
    borderRadius: 999,
  },
  webLineShort: {
    width: 92,
    height: 12,
    borderRadius: 999,
  },
});