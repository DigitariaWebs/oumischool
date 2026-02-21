import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
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
import { Image } from "expo-image"; 
import { ASSETS } from "@/config/assets";

const { width, height } = Dimensions.get("window");

// Chemins vers tes SVG
const PHOTO_1 = require("@/assets/images/1.svg");
const PHOTO_2 = require("@/assets/images/2.svg");
const PHOTO_3 = require("@/assets/images/3.svg");

export const AnimatedSplashScreen: React.FC<{
  onFinish?: () => void;
}> = ({ onFinish }) => {
  // Animation du Logo
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  
  // Animation des Textes
  const contentOpacity = useSharedValue(0);

  // Valeurs animées pour les 3 photos
  const p1 = { s: useSharedValue(0), y: useSharedValue(40), r: useSharedValue(0) };
  const p2 = { s: useSharedValue(0), y: useSharedValue(40), r: useSharedValue(0) };
  const p3 = { s: useSharedValue(0), y: useSharedValue(40), r: useSharedValue(0) };

  useEffect(() => {
    // 1. Apparition du logo
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 12 });

    // 2. Fonction d'animation pour les photos
    const animatePhoto = (photo: any, delay: number) => {
      photo.s.value = withDelay(delay, withSpring(1));
      photo.y.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          withTiming(12, { duration: 1800, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      ));
      photo.r.value = withDelay(delay, withRepeat(
        withSequence(
          withTiming(-4, { duration: 1400, easing: Easing.inOut(Easing.sin) }), 
          withTiming(4, { duration: 1400, easing: Easing.inOut(Easing.sin) })
        ), -1, true
      ));
    };

    // Lancement des photos en cascade
    animatePhoto(p1, 500);
    animatePhoto(p2, 700);
    animatePhoto(p3, 900);

    // 3. Apparition des textes
    contentOpacity.value = withDelay(1200, withTiming(1, { duration: 600 }));

    // Fin du splash
    const timer = setTimeout(() => onFinish?.(), 4500);
    return () => clearTimeout(timer);
  }, []);

  // Styles Animés
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const getPhotoStyle = (photo: any) => useAnimatedStyle(() => ({
    transform: [
      { scale: photo.s.value }, 
      { translateY: photo.y.value }, 
      { rotate: `${photo.r.value}deg` }
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Arrière-plan (Nuages simplifiés) */}
      <View style={styles.cloudsContainer}>
        <View style={[styles.cloud, { top: "10%", left: "5%", width: 100, height: 50 }]} />
        <View style={[styles.cloud, { top: "20%", right: "10%", width: 120, height: 60 }]} />
        <View style={[styles.cloud, { bottom: "15%", left: "15%", width: 80, height: 40 }]} />
      </View>

      {/* --- LOGO --- */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <View style={styles.logoCard}>
          <Image source={ASSETS.logo} style={styles.logoImage} contentFit="contain" />
        </View>
      </Animated.View>

      {/* --- PHOTOS SVG --- */}
      <View style={styles.photosWrapper}>
        <Animated.View style={[styles.photoBox, styles.sidePhoto, getPhotoStyle(p1)]}>
          <Image source={PHOTO_1} style={styles.svgImage} />
        </Animated.View>
        
        <Animated.View style={[styles.photoBox, styles.centerPhoto, getPhotoStyle(p2)]}>
          <Image source={PHOTO_2} style={styles.svgImage} />
        </Animated.View>
        
        <Animated.View style={[styles.photoBox, styles.sidePhoto, getPhotoStyle(p3)]}>
          <Image source={PHOTO_3} style={styles.svgImage} />
        </Animated.View>
      </View>

      {/* --- TEXTES DE BIENVENUE --- */}
      <Animated.View style={[styles.textContainer, contentStyle]}>
        <Text style={styles.welcomeText}>Bienvenue sur</Text>
        <Text style={styles.brandText}>Oumi'School</Text>
        
        {/* Barre de chargement stylisée */}
        <View style={styles.loadingBarContainer}>
           <Animated.View style={styles.loadingBarFill} />
        </View>
      </Animated.View>

      <Text style={styles.versionText}>v1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F0F7FF", 
    justifyContent: "center",
    alignItems: "center",
  },
  cloudsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  cloud: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 100,
    opacity: 0.5,
  },
  // Style du Logo
  logoWrapper: {
    position: "absolute",
    top: height * 0.1,
    alignItems: "center",
  },
  logoCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  // Style des Photos
  photosWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 40,
  },
  photoBox: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 6,
    overflow: "hidden",
  },
  centerPhoto: {
    width: 120,
    height: 150,
    zIndex: 10,
  },
  sidePhoto: {
    width: 90,
    height: 115,
    marginTop: 40,
  },
  svgImage: {
    width: "100%",
    height: "100%",
  },
  // Style des Textes
  textContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    color: "#94A3B8",
    fontWeight: "500",
  },
  brandText: {
    fontSize: 38,
    color: "#6366F1",
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  loadingBarContainer: {
    width: 120,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    marginTop: 20,
    overflow: "hidden",
  },
  loadingBarFill: {
    width: "60%", // On peut animer ça aussi si tu veux !
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 2,
  },
  versionText: {
    position: "absolute",
    bottom: 40,
    fontSize: 12,
    color: "#CBD5E1",
    fontWeight: "600",
  },
});