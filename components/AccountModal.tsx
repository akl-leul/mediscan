import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, Shield } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AccountModal({ visible, onClose }: AccountModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  
  // Email form
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const validateEmail = () => {
    if (!newEmail) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(newEmail)) {
      setEmailError('Email is invalid');
      return false;
    }
    if (newEmail === user?.email) {
      setEmailError('New email must be different from current email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    const errors: { current?: string; new?: string; confirm?: string } = {};
    
    if (!currentPassword) {
      errors.current = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.new = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.new = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirm = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      errors.confirm = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await profileService.updateEmail(newEmail);
      Alert.alert(
        'Email Update Requested',
        'Please check both your current and new email addresses for confirmation links.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await profileService.updatePassword(newPassword);
      Alert.alert(
        'Password Updated',
        'Your password has been updated successfully.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ 
    tab, 
    label, 
    icon: Icon 
  }: { 
    tab: 'email' | 'password'; 
    label: string; 
    icon: any;
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === tab ? colors.primary : colors.surface,
          borderColor: colors.border,
        }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Icon 
        size={16} 
        color={activeTab === tab ? '#FFFFFF' : colors.text} 
      />
      <Text
        style={[
          styles.tabButtonText,
          { color: activeTab === tab ? '#FFFFFF' : colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Account Settings
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TabButton tab="email" label="Email" icon={Mail} />
          <TabButton tab="password" label="Password" icon={Lock} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'email' ? (
            <View style={styles.section}>
              <View style={styles.currentInfo}>
                <Text style={[styles.currentLabel, { color: colors.textSecondary }]}>
                  Current Email
                </Text>
                <Text style={[styles.currentValue, { color: colors.text }]}>
                  {user?.email}
                </Text>
              </View>

              <TextInput
                label="New Email Address"
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Enter new email address"
                error={emailError}
              />

              <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
                <Shield size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  You'll receive confirmation emails at both your current and new email addresses. 
                  Click the links in both emails to complete the change.
                </Text>
              </View>

              <Button
                title="Update Email"
                onPress={handleUpdateEmail}
                loading={loading}
                variant="primary"
              />
            </View>
          ) : (
            <View style={styles.section}>
              <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
                error={passwordErrors.current}
              />

              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
                error={passwordErrors.new}
              />

              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                error={passwordErrors.confirm}
              />

              <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
                <Shield size={16} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Choose a strong password with at least 6 characters. 
                  Include a mix of letters, numbers, and symbols for better security.
                </Text>
              </View>

              <Button
                title="Update Password"
                onPress={handleUpdatePassword}
                loading={loading}
                variant="primary"
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    gap: 20,
  },
  currentInfo: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  currentLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});