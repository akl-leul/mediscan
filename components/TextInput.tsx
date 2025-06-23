import React, { useState } from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

// Add new props for icon and other RNTextInput props
interface TextInputProps extends React.ComponentProps<typeof RNTextInput> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function TextInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  icon,
  ...props // Pass other RNTextInput props
}: TextInputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  // Define colors for different states
  const getBorderColor = () => {
    if (error) return '#FF5A5F'; // A vibrant error red
    if (isFocused) return 'rgba(128, 90, 213, 1)'; // A glowing purple on focus
    return 'rgba(255, 255, 255, 0.3)'; // Default subtle border
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: 'rgba(255,255,255,0.8)' }]}>
          {label}
        </Text>
      )}
      
      {/* The main input container with dynamic styles */}
      <View 
        style={[
          styles.inputContainer,
          { 
            borderColor: getBorderColor(),
            // Add a subtle inner shadow/glow when focused
            shadowColor: isFocused ? 'rgba(128, 90, 213, 0.8)' : 'transparent',
            shadowRadius: isFocused ? 10 : 0,
            shadowOpacity: 0.8,
          }
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <RNTextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          spellCheck={false}
          {...props} // Apply remaining props like keyboardType, etc.
        />
      </View>

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1.5,
    height: 56, // Fixed height for a consistent look
    paddingHorizontal: 12,
    transition: 'border-color 0.3s', // Note: transition property is web-only
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    height: '100%',
  },
  errorText: {
    color: '#FF5A5F',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});