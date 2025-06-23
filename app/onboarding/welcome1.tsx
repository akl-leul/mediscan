import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function Welcome1Screen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. Full-screen background image */}
      <Image
        source={{ uri: 'https://img.freepik.com/free-photo/portrait-3d-male-doctor_23-2151107407.jpg?w=1480' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 2. Gradient overlay that fades into your specified colors */}
      <LinearGradient
        // Starts transparent, then fades into your original colors
        colors={['transparent', '#667eea', '#764ba2']}
        // Adjust the locations to control where the fade starts
        locations={[0, 0.5, 1]}
        style={styles.gradientOverlay}
      />
      
      {/* 3. Content container that pushes everything to the bottom */}
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Welcome to{'\n'}MediScan AI
          </Text>
          <Text style={styles.subtitle}>
            Your intelligent medical companion for medicine identification and health insights
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/onboarding/welcome2')}
            variant="secondary"
          />
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
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
    // Fills the entire screen, behind all other content
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
    // Pushes content to the bottom
    justifyContent: 'flex-end', 
    paddingHorizontal: 24,
    // Safe area padding at the bottom
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