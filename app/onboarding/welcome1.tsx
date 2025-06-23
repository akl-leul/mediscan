import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function Welcome3Screen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.freepik.com/free-photo/front-view-nurses-team-hospital_23-2150796738.jpg?w=1480' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <LinearGradient
        // The fade now starts much lower on the screen
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        
        // THIS IS THE KEY CHANGE:
        // The gradient will be fully transparent until 60% down the screen,
        // then fade to black in the bottom 40%.
        locations={[0.6, 1.0]} 
        
        style={styles.gradientOverlay}
      />

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