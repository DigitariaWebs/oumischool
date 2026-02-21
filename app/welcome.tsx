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
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, Sparkles, Target, Users } from "lucide-react-native";
import { Image } from "expo-image";

import { COLORS } from "@/config/colors";
import { FONTS } from "@/config/fonts";
import { ASSETS } from "@/config/assets";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Bienvenue sur",
    highlight: "Oumi'School",
    description:
      "La plateforme éducative qui s'adapte à votre rythme et à vos besoins.",
    image: ASSETS.welcome1,
    icon: <Sparkles size={24} color="#6366F1" />,
    color: "#6366F1",
  },
  {
    id: "2",
    title: "Suivi",
    highlight: "Personnalisé",
    description:
      "Visualisez vos progrès en temps réel et atteignez vos objectifs pédagogiques.",
    image: ASSETS.welcome2,
    icon: <Target size={24} color="#10B981" />,
    color: "#10B981",
  },
  {
    id: "3",
    title: "Communauté",
    highlight: "Active",
    description:
      "Échangez, partagez et grandissez avec d'autres étudiants et professeurs.",
    image: ASSETS.welcome3,
    icon: <Users size={24} color="#F59E0B" />,
    color: "#F59E0B",
  },
];

const Slide = ({
  item,
  index,
  scrollX,
}: {
  item: (typeof SLIDES)[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolation.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollX.value, inputRange, [50, 0, -50], Extrapolation.CLAMP);
    return { transform: [{ translateY }] };
  });

  return (
    <View style={[styles.slide, { width }]}>
      <Animated.View style={[styles.slideContent, animatedStyle]}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}>
          {item.icon}
        </View>

        <Animated.View style={[styles.imageContainer, imageStyle]}>
          <Image
            source={item.image}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {item.title}{" "}
            <Text style={[styles.highlight, { color: item.color }]}>
              {item.highlight}
            </Text>
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const PaginationDot = ({
  index,
  scrollX,
  color,
}: {
  index: number;
  scrollX: Animated.SharedValue<number>;
  color: string;
}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(scrollX.value, inputRange, [8, 24, 8], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP);
    return { width: dotWidth, opacity, backgroundColor: color };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const Pagination = ({ scrollX }: { scrollX: Animated.SharedValue<number> }) => {
  return (
    <View style={styles.paginationContainer}>
      {SLIDES.map((slide, index) => (
        <PaginationDot key={index} index={index} scrollX={scrollX} color={slide.color} />
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

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={() => router.replace("/sign-in")}>
        <Text style={styles.skipText}>Passer</Text>
      </TouchableOpacity>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <Slide item={item} index={index} scrollX={scrollX} />}
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

        <TouchableOpacity style={[styles.button, { backgroundColor: SLIDES[currentIndex].color }]} onPress={handleNext}>
          <ArrowRight size={22} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  skipText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  slideContent: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: FONTS.fredoka,
    fontSize: 32,
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 40,
  },
  highlight: {
    fontFamily: FONTS.fredoka,
  },
  description: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});