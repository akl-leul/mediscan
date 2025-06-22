import React, { useState, useEffect } from 'react';
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
import { X, User, Phone, Calendar, Heart, AlertTriangle } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function ProfileModal({ visible, onClose, profile, onProfileUpdate }: ProfileModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    medical_conditions: '',
    allergies: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        medical_conditions: profile.medical_conditions?.join(', ') || '',
        allergies: profile.allergies?.join(', ') || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updates = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender.trim(),
        medical_conditions: formData.medical_conditions
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0),
        allergies: formData.allergies
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0),
        emergency_contact_name: formData.emergency_contact_name.trim(),
        emergency_contact_phone: formData.emergency_contact_phone.trim(),
      };

      const updatedProfile = await profileService.updateProfile(user.id, updates);
      onProfileUpdate(updatedProfile);
      onClose();
      
      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { label: 'Select Gender', value: '' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

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
            Edit Profile
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Personal Information
              </Text>
            </View>

            <TextInput
              label="Full Name"
              value={formData.full_name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, full_name: text }))}
              placeholder="Enter your full name"
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <TextInput
                  label="Phone"
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                  placeholder="+1 (555) 123-4567"
                />
              </View>
              <View style={styles.halfWidth}>
                <TextInput
                  label="Date of Birth"
                  value={formData.date_of_birth}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, date_of_birth: text }))}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={styles.genderContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Gender</Text>
              <View style={styles.genderOptions}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      {
                        backgroundColor: formData.gender === option.value 
                          ? colors.primary 
                          : colors.surface,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        {
                          color: formData.gender === option.value 
                            ? '#FFFFFF' 
                            : colors.text
                        }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Heart size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Medical Information
              </Text>
            </View>

            <TextInput
              label="Medical Conditions"
              value={formData.medical_conditions}
              onChangeText={(text) => setFormData(prev => ({ ...prev, medical_conditions: text }))}
              placeholder="Diabetes, Hypertension, etc. (comma separated)"
              multiline
              numberOfLines={3}
            />

            <TextInput
              label="Allergies"
              value={formData.allergies}
              onChangeText={(text) => setFormData(prev => ({ ...prev, allergies: text }))}
              placeholder="Peanuts, Shellfish, etc. (comma separated)"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Emergency Contact
              </Text>
            </View>

            <TextInput
              label="Emergency Contact Name"
              value={formData.emergency_contact_name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, emergency_contact_name: text }))}
              placeholder="Enter contact name"
            />

            <TextInput
              label="Emergency Contact Phone"
              value={formData.emergency_contact_phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, emergency_contact_phone: text }))}
              placeholder="+1 (555) 123-4567"
            />
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            variant="primary"
          />
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  genderContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  genderOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  genderOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});