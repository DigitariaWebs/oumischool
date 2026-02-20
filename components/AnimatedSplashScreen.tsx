import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { COLORS } from "@/config/colors";
import { ASSETS } from "@/config/assets";

const { width, height } = Dimensions.get("window");

export const AnimatedSplashScreen: React.FC<{
  onFinish?: () => void;
}> = ({ onFinish }) => {
  // Animations
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const childrenY = useSharedValue(30);
  const childrenOpacity = useSharedValue(0);
  const waveHand = useSharedValue(0);
  const dotsOpacity = useSharedValue(0);

  useEffect(() => {
    // Animation du logo
    logoOpacity.value = withTiming(1, { duration: 600 });
    logoScale.value = withSpring(1, { damping: 10, stiffness: 100 });

    // Animation des enfants qui courent
    childrenOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    childrenY.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(20, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(30, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );

    // Animation de la main qui fait coucou
    waveHand.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(15, { duration: 300 }),
          withTiming(-15, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        3,
        false,
      ),
    );

    // Points de chargement
    dotsOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));

    // Fin du splash
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const childrenStyle = useAnimatedStyle(() => ({
    opacity: childrenOpacity.value,
    transform: [{ translateY: childrenY.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${waveHand.value}deg` }],
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Fond avec nuages */}
      <View style={styles.cloudsContainer}>
        <View style={[styles.cloud, styles.cloud1]} />
        <View style={[styles.cloud, styles.cloud2]} />
        <View style={[styles.cloud, styles.cloud3]} />
      </View>

      {/* Logo animé */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image source={ASSETS.logo} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      {/* Enfants qui courent */}
      <Animated.View style={[styles.childrenContainer, childrenStyle]}>
        {/* Premier enfant */}
        <View style={[styles.child, styles.child1]}>
          <View style={styles.childHead} />
          <View style={styles.childBody} />
          <View style={[styles.childArm, styles.childArmLeft]} />
          <View style={[styles.childArm, styles.childArmRight]} />
          <View style={[styles.childLeg, styles.childLegLeft]} />
          <View style={[styles.childLeg, styles.childLegRight]} />
        </View>

        {/* Deuxième enfant avec main qui fait coucou */}
        <Animated.View style={[styles.child, styles.child2, waveStyle]}>
          <View style={styles.childHead}>
            <View style={styles.eye} />
            <View style={[styles.eye, styles.eyeRight]} />
            <View style={styles.smile} />
          </View>
          <View style={styles.childBody} />
          <View style={[styles.childArm, styles.childArmLeft, styles.wavingArm]} />
          <View style={[styles.childArm, styles.childArmRight]} />
          <View style={[styles.childLeg, styles.childLegLeft]} />
          <View style={[styles.childLeg, styles.childLegRight]} />
        </Animated.View>

        {/* Troisième enfant qui court */}
        <View style={[styles.child, styles.child3]}>
          <View style={styles.childHead} />
          <View style={styles.childBody} />
          <View style={[styles.childArm, styles.childArmLeft]} />
          <View style={[styles.childArm, styles.childArmRight]} />
          <View style={[styles.childLeg, styles.childLegLeft]} />
          <View style={[styles.childLeg, styles.childLegRight]} />
        </View>
      </Animated.View>

      {/* Message de bienvenue */}
      <Animated.View style={[styles.welcomeContainer, dotsStyle]}>
        <Text style={styles.welcomeText}>Bienvenue sur</Text>
        <Text style={styles.welcomeSubtext}>Oumi'School</Text>
      </Animated.View>

      {/* Points de chargement */}
      <Animated.View style={[styles.loadingContainer, dotsStyle]}>
        <View style={[styles.loadingDot, styles.loadingDot1]} />
        <View style={[styles.loadingDot, styles.loadingDot2]} />
        <View style={[styles.loadingDot, styles.loadingDot3]} />
      </Animated.View>

      {/* Version */}
      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  
  // Nuages
  cloudsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  cloud: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cloud1: {
    width: 80,
    height: 40,
    top: "15%",
    left: "10%",
  },
  cloud2: {
    width: 100,
    height: 45,
    top: "25%",
    right: "15%",
  },
  cloud3: {
    width: 70,
    height: 35,
    bottom: "30%",
    left: "20%",
  },

  // Logo
  logoContainer: {
    position: "absolute",
    top: height * 0.15,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
  },

  // Enfants
  childrenContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 20,
    marginTop: 100,
  },
  child: {
    width: 50,
    height: 80,
    position: "relative",
  },
  child1: {
    transform: [{ translateY: 5 }],
  },
  child2: {
    width: 55,
    height: 85,
  },
  child3: {
    transform: [{ translateY: 8 }],
  },
  childHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFE5B4",
    position: "absolute",
    top: 0,
    left: 10,
    borderWidth: 1,
    borderColor: "#F1C9A4",
  },
  childBody: {
    width: 34,
    height: 40,
    backgroundColor: "#6366F1",
    position: "absolute",
    top: 25,
    left: 8,
    borderRadius: 10,
    opacity: 0.8,
  },
  childArm: {
    width: 12,
    height: 4,
    backgroundColor: "#FFE5B4",
    position: "absolute",
    top: 30,
    borderRadius: 2,
  },
  childArmLeft: {
    left: 2,
    transform: [{ rotate: "-20deg" }],
  },
  childArmRight: {
    right: 2,
    transform: [{ rotate: "20deg" }],
  },
  childLeg: {
    width: 10,
    height: 4,
    backgroundColor: "#6366F1",
    position: "absolute",
    bottom: 8,
    borderRadius: 2,
    opacity: 0.8,
  },
  childLegLeft: {
    left: 12,
    transform: [{ rotate: "10deg" }],
  },
  childLegRight: {
    right: 12,
    transform: [{ rotate: "-10deg" }],
  },
  wavingArm: {
    transform: [{ rotate: "60deg" }],
    left: -5,
  },
  
  // Visage
  eye: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1E293B",
    position: "absolute",
    top: 10,
    left: 8,
  },
  eyeRight: {
    left: 18,
  },
  smile: {
    width: 12,
    height: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: "#1E293B",
    borderTopWidth: 0,
    position: "absolute",
    top: 16,
    left: 9,
  },

  // Message de bienvenue
  welcomeContainer: {
    position: "absolute",
    top: height * 0.45,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontFamily: "Fredoka",
    fontSize: 32,
    color: "#6366F1",
    fontWeight: "600",
  },

  // Loading
  loadingContainer: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    bottom: height * 0.15,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingDot1: {
    backgroundColor: "#6366F1",
  },
  loadingDot2: {
    backgroundColor: "#8B5CF6",
  },
  loadingDot3: {
    backgroundColor: "#A855F7",
  },

  // Version
  versionText: {
    position: "absolute",
    bottom: 30,
    fontSize: 11,
    color: "#CBD5E1",
  },
});