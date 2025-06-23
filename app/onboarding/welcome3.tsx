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
    <LinearGradient
      colors={['#4facfe', '#00f2fe']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://img.freepik.com/free-photo/front-view-nurses-team-hospital_23-2150796738.jpg?t=st=1750664526~exp=1750668126~hmac=c1e2364c3a35483fb2b6d0797b71625f9745e96a8d08ad87ee1c853bc6b6020d&w=1480' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </View>
        
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 0,
    marginTop: 60,
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  textContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
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
    flex: 0.1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
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