import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  User, 
  Heart, 
  Star, 
  Zap, 
  Shield, 
  Crown, 
  Flower, 
  Sun,
  Moon,
  Sparkles,
  Leaf,
  Coffee
} from 'lucide-react-native';

interface ProfileAvatarProps {
  userId?: string;
  size?: number;
  showBorder?: boolean;
}

const avatarIcons = [
  { icon: User, color: '#3B82F6', bg: '#EBF4FF' },
  { icon: Heart, color: '#EF4444', bg: '#FEF2F2' },
  { icon: Star, color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Zap, color: '#8B5CF6', bg: '#F3E8FF' },
  { icon: Shield, color: '#10B981', bg: '#ECFDF5' },
  { icon: Crown, color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Flower, color: '#EC4899', bg: '#FDF2F8' },
  { icon: Sun, color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Moon, color: '#6366F1', bg: '#EEF2FF' },
  { icon: Sparkles, color: '#8B5CF6', bg: '#F3E8FF' },
  { icon: Leaf, color: '#10B981', bg: '#ECFDF5' },
  { icon: Coffee, color: '#92400E', bg: '#FEF3C7' },
];

export function ProfileAvatar({ userId, size = 60, showBorder = true }: ProfileAvatarProps) {
  // Generate consistent avatar based on userId
  const getAvatarIndex = (id?: string) => {
    if (!id) return 0;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % avatarIcons.length;
  };

  const avatarIndex = getAvatarIndex(userId);
  const avatar = avatarIcons[avatarIndex];
  const IconComponent = avatar.icon;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: avatar.bg,
          borderWidth: showBorder ? 3 : 0,
          borderColor: avatar.color,
        },
      ]}
    >
      <IconComponent 
        size={size * 0.4} 
        color={avatar.color} 
        strokeWidth={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});