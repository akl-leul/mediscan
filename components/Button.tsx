import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    if (variant === 'primary') {
      baseStyle.push({ backgroundColor: colors.primary });
    } else if (variant === 'secondary') {
      baseStyle.push({ backgroundColor: colors.surface });
    } else if (variant === 'outline') {
      baseStyle.push({ 
        backgroundColor: 'transparent', 
        borderWidth: 1, 
        borderColor: colors.border 
      });
    }

    if (disabled || loading) {
      baseStyle.push({ opacity: 0.5 });
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    if (variant === 'primary') {
      return { color: '#FFFFFF' };
    }
    return { color: colors.text };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});