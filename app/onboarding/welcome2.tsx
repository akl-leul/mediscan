import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function Welcome2Screen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. Full-screen background image */}
      <Image
        source={{ uri: 'https://img.freepik.com/free-photo/medicine-bottle-spilling-colorful-pills-depicting-addiction-risks-generative-ai_188544-12529.jpg?w=1480' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 2. Gradient overlay that fades into your original colors */}
      <LinearGradient
        // Starts transparent, then fades into the pink/red gradient
        colors={['transparent', '#f093fb', '#f5576c']}
        // Control the fade to start lower on the screen
        locations={[0.4, 0.8, 1.0]}
        style={styles.gradientOverlay}
      />
      
      {/* 3. Content container pushes everything to the bottom */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Scan & Identify{'\n'}Medicines
          </Text>
          <Text style={styles.subtitle}>
            Simply take a photo of any medicine and get instant detailed information about its uses, dosage, and side effects
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={() => router.push('/onboarding/welcome3')}
            variant="secondary"
          />
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fallback color
  },
  backgroundImage: {
    // Fills the entire screen behind other content
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    // Sits on top of the image to provide the colored fade effect
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
});