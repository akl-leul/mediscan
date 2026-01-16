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
      {/* 1. Using a high-resolution background image */}
      <Image
        source={{ uri: 'https://img.freepik.com/free-photo/front-view-nurses-team-hospital_23-2150796738.jpg?t=st=1750664526~exp=1750668126~hmac=c1e2364c3a35483fb2b6d0797b71625f9745e96a8d08ad87ee1c853bc6b6020d&w=1480' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* 2. Gradient overlay with adjusted locations for a better fade */}
      <LinearGradient
        colors={['transparent', '#667eea', '#764ba2']}
        // THIS IS THE KEY CHANGE:
        // The gradient is transparent for the top 50% of the screen,
        // then fades into your colors in the bottom half.
        locations={[0.5, 0.8, 1.0]} 
        style={styles.gradientOverlay}
      />
      
      {/* 3. Content container remains the same */}
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
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
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