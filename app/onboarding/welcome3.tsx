import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';

// Dimensions can be kept but aren't strictly necessary with the new layout
const { width, height } = Dimensions.get('window');

export default function Welcome3Screen() {
  const router = useRouter();
  // useTheme is kept in case your custom Button component relies on it
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. Full-screen background image */}
      <Image
        source={{ uri: 'https://img.freepik.com/free-photo/front-view-nurses-team-hospital_23-2150796738.jpg?w=1480' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 2. Gradient overlay that fades from bottom to top */}
      <LinearGradient
        // Fades from transparent at the top to a dark shade at the bottom
        colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.gradientOverlay}
      />

      {/* 3. Content is pushed to the bottom */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            AI Health{'\n'}Diagnosis
          </Text>
          <Text style={styles.subtitle}>
            Get personalized health insights based on your symptoms, diet, and location with our advanced AI technology
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Start Your Journey"
            onPress={() => router.push('/auth/register')}
            variant="secondary"
          />
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fallback background color
  },
  backgroundImage: {
    // This makes the image fill the entire screen, behind all other content
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    // This gradient sits on top of the image to provide the fade effect
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    // Pushes content to the bottom
    justifyContent: 'flex-end', 
    paddingHorizontal: 24,
    // Adds padding at the very bottom of the screen
    paddingBottom: 50, 
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32, // Space between text and button
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