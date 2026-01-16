import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: object; // Allow passing extra styles
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading, 
  disabled,
  style 
}: ButtonProps) {
  const { colors } = useTheme(); // Still useful for non-primary variants if needed

  // The content of the button (text or loader)
  const ButtonContent = (
    <>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[
          styles.text,
          // Secondary and outline text is also white for contrast on dark UIs
          (variant === 'secondary' || variant === 'outline') && { color: '#FFFFFF' }
        ]}>
          {title}
        </Text>
      )}
    </>
  );

  // The primary button is special and uses a LinearGradient
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.button, styles.primaryShadow, (disabled || loading) && { opacity: 0.6 }, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          // A vibrant, futuristic gradient
          colors={['#a259ff', '#6c55f2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {ButtonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Secondary and Outline buttons use a simpler TouchableOpacity with glass/border styles
  const getButtonStyle = () => {
    const baseStyle = [styles.button, (disabled || loading) && { opacity: 0.5 }, style];
    
    if (variant === 'secondary') {
      // Glassmorphism style
      baseStyle.push(styles.secondaryButton);
    } else if (variant === 'outline') {
      // Holographic outline style
      baseStyle.push(styles.outlineButton);
    }
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {ButtonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Base container for all buttons
  button: {
    width: '100%',
    minHeight: 56, // Matches the new TextInput height
    borderRadius: 16, // Matches the new TextInput border radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- Primary Button Styles ---
  primaryShadow: {
    // Add a glow effect for the primary button
    shadowColor: '#a259ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  // --- Secondary "Glass" Button Style ---
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  // --- Outline Button Style ---
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  // --- Text Style ---
  text: {
    fontSize: 18,
    fontWeight: '700', // Bolder font for a more confident look
    color: '#FFFFFF', // Default text color is white for primary button
  },
});