
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Github, Globe, Heart, Code, Smartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleEmailPress = () => {
    Linking.openURL('mailto:layfokru@gmail.com');
  };

  const handleGithubPress = () => {
    Linking.openURL('https://github.com/akl-leul');
  };

  const SkillCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <View style={[styles.skillCard, { backgroundColor: colors.card }]}>
      <View style={[styles.skillIcon, { backgroundColor: `${colors.primary}20` }]}>
        <Icon size={24} color={colors.primary} />
      </View>
      <Text style={[styles.skillTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.skillDescription, { color: colors.textSecondary }]}>{description}</Text>
    </View>
  );

  const ContactCard = ({ icon: Icon, title, subtitle, onPress }: { icon: any; title: string; subtitle: string; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.contactCard, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}20` }]}>
        <Icon size={20} color={colors.primary} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          About Developer
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.heroSection}
        >
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>LA</Text>
            </View>
          </View>
          <Text style={styles.heroName}>Leul Ayfokru</Text>
          <Text style={styles.heroTitle}>Full Stack Developer</Text>
          <Text style={styles.heroExperience}>3+ Years Experience</Text>
        </LinearGradient>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About Me
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
I'm a full-stack developer with over 3 years of experience crafting modern web and mobile applications, focused on building intuitive, scalable solutions that make a real impact.
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            MediScan AI represents my commitment to leveraging technology for healthcare innovation, 
            combining AI-powered medicine identification with intelligent health diagnosis to make healthcare more accessible.
          </Text>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Expertise
          </Text>
          <View style={styles.skillsGrid}>
            <SkillCard
              icon={Code}
              title="Web Development"
              description="React, Node.js, TypeScript, Next.js, Supabase, PostgreSQL"
            />
            <SkillCard
              icon={Smartphone}
              title="Mobile Development"
              description="React Native, Expo, iOS & Android, Flutter, Dart"
            />
            <SkillCard
              icon={Globe}
              title="Full Stack"
              description="End-to-end application development"
            />
            <SkillCard
              icon={Heart}
              title="UI/UX Design"
              description="User-centered design principles"
            />
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Get In Touch
          </Text>
          <ContactCard
            icon={Mail}
            title="Email"
            subtitle="layfokru@gmail.com"
            onPress={handleEmailPress}
          />
          <ContactCard
            icon={Github}
            title="GitHub"
            subtitle="github.com/akl-leul"
            onPress={handleGithubPress}
          />
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About MediScan AI
          </Text>
          <View style={[styles.appInfoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.appInfoText, { color: colors.textSecondary }]}>
              MediScan AI is an innovative healthcare application that combines computer vision and artificial intelligence 
              to provide instant medicine identification and health diagnosis. Built with React Native and powered by 
              Google Cloud Vision API and Google AI Studio.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with ❤️ by Leul Ayfokru
          </Text>
          <Text style={[styles.footerSubtext, { color: colors.textSecondary }]}>
            © 2025 MediScan AI. All rights reserved.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  heroExperience: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skillCard: {
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  skillIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  skillTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  skillDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
  },
  appInfoCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appInfoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});
