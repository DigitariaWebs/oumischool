import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  SharedValue, // Import type directly
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, Check } from "lucide-react-native";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ASSETS } from "@/config/assets";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Bienvenue sur\nOumi'School",
    description:
      "La plateforme éducative qui s'adapte à votre rythme et à vos besoins.",
    image: ASSETS.welcome1,
  },
  {
    id: "2",
    title: "Suivi\nPersonnalisé",
    description:
      "Visualisez vos progrès en temps réel et atteignez vos objectifs pédagogiques.",
    image: ASSETS.welcome2,
  },
  {
    id: "3",
    title: "Communauté\nActive",
    description:
      "Échangez, partagez et grandissez avec d'autres étudiants et professeurs.",
    image: ASSETS.welcome3,
  },
];

const Slide = ({
  item,
  index,
  scrollX,
}: {
  item: (typeof SLIDES)[0];
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const rnStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    // Fade and scale for text
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );

    return {
      width,
      alignItems: "center",
      paddingHorizontal: 40,
      opacity, // Apply fade
      transform: [{ scale }], // Apply scale
    };
  });

  // Separate animation for the icon to give it depth
  const iconStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    // Parallax
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [-50, 0, 50],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View style={[styles.slide, { width }]}>
      {/* Use a container for content that applies the animations */}
      <Animated.View
        style={[
          { alignItems: "center", width: "100%", paddingHorizontal: 20 },
          rnStyle,
        ]}
      >
        <View style={styles.imageContainer}>
          <Animated.View style={iconStyle}>
            <Image
              source={item.image}
              style={{ width: 280, height: 280 }}
              contentFit="contain"
            />
          </Animated.View>
        </View>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const PaginationDot = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolation.CLAMP,
    );
    return {
      width: dotWidth,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const Pagination = ({ scrollX }: { scrollX: SharedValue<number> }) => {
  return (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, index) => (
        <PaginationDot key={index} index={index} scrollX={scrollX} />
      ))}
    </View>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/sign-in");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <Pagination scrollX={scrollX} />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          {currentIndex === SLIDES.length - 1 ? (
            <Check size={24} color={COLORS.neutral.white} />
          ) : (
            <ChevronRight size={24} color={COLORS.neutral.white} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral.white,
  },
  skipButton: {
    position: "absolute",
    top: 60, // Adjust for safe area
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: FONTS.secondary,
    fontSize: 16,
    color: COLORS.neutral[400],
  },
  slide: {
    width: width,
    height: height * 0.75, // Adjust height to leave room for footer
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 40,
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    // Removed background circle as SVGs usually have their own style or transparency
  },
  title: {
    fontFamily: FONTS.fredoka, // Using custom font
    fontSize: 32,
    color: COLORS.secondary.DEFAULT,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 40,
  },
  description: {
    fontFamily: FONTS.secondary,
    fontSize: 18,
    color: COLORS.neutral[500],
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 26,
  },
  footer: {
    height: height * 0.25,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 24,
    flexDirection: "row",
  },
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary.DEFAULT,
    marginHorizontal: 4,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
