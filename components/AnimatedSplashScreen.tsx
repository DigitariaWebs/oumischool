import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import {
  Book,
  GraduationCap,
  School,
  Pencil,
  Ruler,
  Laptop,
  Brain,
  Calculator,
  Backpack,
  Library,
  Notebook,
  Palette,
  Microscope,
  Globe,
  Music,
  Trophy,
  Star,
  Clock,
  Map,
  User,
  Atom,
  Beaker,
  Briefcase,
  Compass,
  FileText,
  Folder,
  Gamepad,
  Heart,
  Lightbulb,
  MessageCircle,
} from "lucide-react-native";
import { COLORS } from "@/config/colors";
import { ASSETS } from "@/config/assets";

const { width, height } = Dimensions.get("window");

// Configuration
const CONFIG = {
  INITIAL_ICONS_COUNT: 5,
  INITIAL_INTERVAL_MS: 300,
  TOTAL_ICONS_TO_FILL: 80, // Increased count
  BURST_INTERVAL_MS: 20, // Faster filling
  ICON_SIZE: 32,
};

// Icon pool
const ICONS = [
  Book,
  GraduationCap,
  School,
  Pencil,
  Ruler,
  Laptop,
  Brain,
  Calculator,
  Backpack,
  Library,
  Notebook,
  Palette,
  Microscope,
  Globe,
  Music,
  Trophy,
  Star,
  Clock,
  Map,
  User,
  Atom,
  Beaker,
  Briefcase,
  Compass,
  FileText,
  Folder,
  Gamepad,
  Heart,
  Lightbulb,
  MessageCircle,
];

// Color pool (flattened values from COLORS)
const COLOR_POOL = [
  COLORS.primary.DEFAULT,
  COLORS.primary[400],
  COLORS.primary[700],
  COLORS.secondary.DEFAULT,
  COLORS.secondary[400],
  COLORS.secondary[700],
  COLORS.success,
  COLORS.warning,
  COLORS.error,
  COLORS.info,
  "#FF6B6B",
  "#4ECDC4",
  "#FFD166",
  "#06D6A0",
  "#118AB2", // Extra vibrant colors
];

type IconItem = {
  id: string;
  Icon: React.ElementType;
  x: number;
  y: number;
  color: string;
  delay: number;
};

interface AnimatedSplashScreenProps {
  onFinish?: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onFinish,
}) => {
  const [icons, setIcons] = useState<IconItem[]>([]);
  const logoOpacity = useSharedValue(0);
  const iconCounter = React.useRef(0);

  // Check if new position overlaps with existing icons or center logo
  const isOverlapping = React.useCallback(
    (x: number, y: number, existingIcons: IconItem[]) => {
      const size = CONFIG.ICON_SIZE;
      const padding = 5; // Minimal padding between icons

      // Check collision with center logo area (approx 160x160 box in center)
      const centerX = width / 2;
      const centerY = height / 2;
      const logoRadius = 80;

      // Check if point is inside center logo circle
      const distToCenter = Math.sqrt(
        Math.pow(x - centerX + size / 2, 2) +
          Math.pow(y - centerY + size / 2, 2),
      );
      if (distToCenter < logoRadius) {
        return true;
      }

      // Check collision with other icons
      for (const icon of existingIcons) {
        const dx = Math.abs(x - icon.x);
        const dy = Math.abs(y - icon.y);
        if (dx < size + padding && dy < size + padding) {
          return true;
        }
      }
      return false;
    },
    [],
  );

  // Helper to generate a random icon props
  const generateRandomIcon = React.useCallback(
    (id: string, currentIcons: IconItem[]): IconItem => {
      const Icon = ICONS[Math.floor(Math.random() * ICONS.length)];
      const color = COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)];

      // Try to find a non-overlapping spot
      let x = 0;
      let y = 0;
      let attempts = 0;
      const maxAttempts = 10; // Try 10 times to find a free spot

      do {
        const padding = 20;
        x =
          Math.floor(Math.random() * (width - CONFIG.ICON_SIZE - padding * 2)) +
          padding;
        y =
          Math.floor(
            Math.random() * (height - CONFIG.ICON_SIZE - padding * 2),
          ) + padding;
        attempts++;
      } while (isOverlapping(x, y, currentIcons) && attempts < maxAttempts);

      return { id, Icon, x, y, color, delay: 0 };
    },
    [isOverlapping],
  );

  useEffect(() => {
    // 1. Fade in Logo
    logoOpacity.value = withTiming(1, { duration: 800 });

    let timeoutIds: NodeJS.Timeout[] = [];

    // 2. Schedule first 5 icons (0.4s interval)
    const initialPhaseDelay = 1000; // Wait a bit after logo starts fading

    for (let i = 0; i < CONFIG.INITIAL_ICONS_COUNT; i++) {
      const ms = initialPhaseDelay + i * CONFIG.INITIAL_INTERVAL_MS;
      const timeout = setTimeout(() => {
        // Using template literal for ID
        const id = `icon-${iconCounter.current++}`;
        setIcons((prev) => [...prev, generateRandomIcon(id, prev)]);
      }, ms);
      timeoutIds.push(timeout);
    }

    // 3. Schedule Burst (fill screen)
    // Start after the initial phase finishes
    const burstStartTime =
      initialPhaseDelay +
      CONFIG.INITIAL_ICONS_COUNT * CONFIG.INITIAL_INTERVAL_MS;

    const startBurst = setTimeout(() => {
      // We want to add remaining icons quickly
      const remaining = CONFIG.TOTAL_ICONS_TO_FILL - CONFIG.INITIAL_ICONS_COUNT;

      let burstCount = 0;
      const burstInterval = setInterval(() => {
        if (burstCount >= remaining) {
          clearInterval(burstInterval);
          // 4. Finish
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 1000); // Hold for a second after full
          return;
        }

        const id = `icon-${iconCounter.current++}`;
        setIcons((prev) => [...prev, generateRandomIcon(id, prev)]);
        burstCount++;
      }, CONFIG.BURST_INTERVAL_MS);
    }, burstStartTime);

    timeoutIds.push(startBurst);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [logoOpacity, onFinish, generateRandomIcon]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoOpacity.value }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      {/* Render Icons */}
      {icons.map((item) => (
        <Animated.View
          key={item.id}
          entering={FadeIn.duration(300)}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            zIndex: 1,
          }}
        >
          <item.Icon
            size={CONFIG.ICON_SIZE}
            color={item.color}
            strokeWidth={2}
          />
        </Animated.View>
      ))}

      {/* Center Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image source={ASSETS.logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  logoContainer: {
    zIndex: 10,
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    // Transparent background
  },
  logo: {
    width: 140,
    height: 140,
  },
});
