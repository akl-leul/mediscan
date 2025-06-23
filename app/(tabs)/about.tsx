import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Github, Heart, Code, Smartphone, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleEmailPress = () => Linking.openURL('mailto:layfokru@gmail.com');
  const handleGithubPress = () => Linking.openURL('https://github.com/akl-leul');

  // Re-styled components for the new UI
  const SkillCard = ({ icon: Icon, title, description }) => (
    <View style={styles.skillCard}>
      <View style={[styles.skillIconContainer, { backgroundColor: colors.primary }]}>
        <Icon size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.skillTitle}>{title}</Text>
      <Text style={styles.skillDescription}>{description}</Text>
    </View>
  );

  const ContactCard = ({ icon: Icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.contactCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.contactIconContainer}>
        <Icon size={24} color={colors.primary} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- NEW Immersive Header --- */}
        <LinearGradient colors={['#1e1c3a', '#3d2f6f', '#764ba2']} style={styles.heroSection}>
          <SafeAreaView style={{width: '100%'}}>
            <View style={styles.headerNav}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>About Developer</Text>
              <View style={{ width: 44 }} /> {/* Placeholder for balance */}
            </View>
          </SafeAreaView>
          
          {/* --- Profile Image and Info --- */}
          <Image
            source={{ uri: 'https://i.ibb.co/L8Wk3gV/Untitled-design-2.png' }}
            style={styles.profileImage}
          />
          <Text style={styles.heroName}>Leul Ayfokru</Text>
          <Text style={styles.heroTitle}>Full Stack Developer • 3+ Years Experience</Text>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            <Text style={styles.aboutText}>
              I'm a passionate full-stack developer specializing in creating modern, user-friendly, and scalable applications that solve real-world problems.
            </Text>
            <Text style={styles.aboutText}>
              MediScan AI is my commitment to leveraging technology for healthcare innovation, making it more accessible through AI.
            </Text>
          </View>

          {/* Skills Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expertise</Text>
            <View style={styles.skillsGrid}>
              <SkillCard icon={Code} title="Web & Backend" description="React, Node.js, Next.js" />
              <SkillCard icon={Smartphone} title="Mobile" description="React Native, Expo" />
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get In Touch</Text>
            <ContactCard icon={Mail} title="Email" subtitle="layfokru@gmail.com" onPress={handleEmailPress} />
            <ContactCard icon={Github} title="GitHub" subtitle="github.com/akl-leul" onPress={handleGithubPress} />
          </View>

          {/* App Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About MediScan AI</Text>
            <View style={styles.appInfoCard}>
              <Text style={styles.appInfoText}>
                Built with React Native and powered by Google Cloud Vision & AI Studio, MediScan AI uses computer vision and AI for instant medicine identification and health insights.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with ❤️ by Leul Ayfokru</Text>
            <Text style={styles.footerSubtext}>© 2025 MediScan AI. All rights reserved.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // --- New Header & Hero Styles ---
  heroSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  headerNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 20,
  },
  heroName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  // --- Content Styles ---
  contentContainer: {
    paddingTop: 24, // Space from the hero section
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF', // Assuming dark theme
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  // --- Re-styled "Glass" Cards ---
  skillsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  skillCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  skillIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 90, 213, 0.15)',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  appInfoCard: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  appInfoText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.7)',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
});