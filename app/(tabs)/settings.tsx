import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Moon, 
  Sun, 
  Monitor, 
  Globe, 
  LogOut, 
  ChevronRight, 
  User,
  Settings as SettingsIcon,
  Shield
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileModal } from '@/components/ProfileModal';
import { AccountModal } from '@/components/AccountModal';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types';
import { storage } from '@/lib/storage';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, mode, setMode } = useTheme();
  const { signOut, user } = useAuth();
  
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  ];

  const themes = [
    { key: 'light', label: t('settings.light'), icon: Sun },
    { key: 'dark', label: t('settings.dark'), icon: Moon },
    { key: 'system', label: t('settings.system'), icon: Monitor },
  ];

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      const profile = await profileService.getProfile(user.id);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleThemeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
  };

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    await storage.setItem('language', languageCode);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );

  const SettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    selected,
    onPress,
    showChevron = true,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    selected?: boolean;
    onPress: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        selected && { backgroundColor: colors.surface }
      ]}
      onPress={onPress}
    >
      <View style={styles.settingsItemLeft}>
        <Icon size={20} color={colors.primary} />
        <View style={styles.settingsItemText}>
          <Text style={[styles.settingsItemTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingsItemSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showChevron && <ChevronRight size={16} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const ProfileCard = () => (
    <TouchableOpacity
      style={[styles.profileCard, { backgroundColor: colors.card }]}
      onPress={() => setProfileModalVisible(true)}
    >
      <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
        <User size={24} color="#FFFFFF" />
      </View>
      <View style={styles.profileInfo}>
        <Text style={[styles.profileName, { color: colors.text }]}>
          {userProfile?.full_name || 'Complete your profile'}
        </Text>
        <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
          {user?.email}
        </Text>
        {userProfile?.full_name && (
          <Text style={[styles.profileStatus, { color: colors.primary }]}>
            Profile Complete
          </Text>
        )}
      </View>
      <ChevronRight size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('settings.title')}
          </Text>
        </View>

        <View style={styles.profileSection}>
          <ProfileCard />
        </View>

        <SettingsSection title="Account">
          <SettingsItem
            icon={Shield}
            title="Account Security"
            subtitle="Update email and password"
            onPress={() => setAccountModalVisible(true)}
          />
        </SettingsSection>

        <SettingsSection title={t('settings.theme')}>
          {themes.map((theme, index) => (
            <SettingsItem
              key={theme.key}
              icon={theme.icon}
              title={theme.label}
              selected={mode === theme.key}
              onPress={() => handleThemeChange(theme.key as any)}
            />
          ))}
        </SettingsSection>

        <SettingsSection title={t('settings.language')}>
          {languages.map((language) => (
            <SettingsItem
              key={language.code}
              icon={Globe}
              title={language.name}
              subtitle={language.nativeName}
              selected={i18n.language === language.code}
              onPress={() => handleLanguageChange(language.code)}
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsItem
            icon={LogOut}
            title={t('settings.signOut')}
            onPress={handleSignOut}
            showChevron={false}
          />
        </SettingsSection>
      </ScrollView>

      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        profile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />

      <AccountModal
        visible={accountModalVisible}
        onClose={() => setAccountModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionContent: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    marginLeft: 16,
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});