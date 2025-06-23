import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Github, Heart, Code, Smartphone, BrainCircuit, PenTool } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

// A reusable animated view that fades in and slides up
const AnimatedView = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
  }, [opacity, translateY, delay]);

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};


export default function AboutScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme(); // Assuming isDarkMode is available from your context

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  // Glassmorphic Card for Skills
  const SkillCard = ({ icon: Icon, title, description }: { icon: any; title:string; description: string }) => (
    <Animated.View style={styles.skillCardContainer}>
      <BlurView
        intensity={40}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.skillCard}
      >
        <LinearGradient
          colors={[`${colors.primary}30`, `${colors.primary}10`]}
          style={styles.skillIcon}
        >
          <Icon size={28} color={colors.primary} />
        </LinearGradient>
        <Text style={[styles.skillTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.skillDescription, { color: colors.textSecondary }]}>{description}</Text>
      </BlurView>
    </Animated.View>
  );

  // Glassmorphic Card for Contact Links
  const ContactCard = ({ icon: Icon, title, subtitle, url }: { icon: any; title: string; subtitle: string; url: string }) => (
    <TouchableOpacity onPress={() => handleLinkPress(url)}>
        <BlurView
            intensity={40}
            tint={isDarkMode ? 'dark' : 'light'}
            style={[styles.contactCard, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)'}]}
        >
            <View style={[styles.contactIcon, { backgroundColor: `${colors.primary}20` }]}>
                <Icon size={22} color={colors.primary} />
            </View>
            <View style={styles.contactInfo}>
                <Text style={[styles.contactTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            </View>
        </BlurView>
    </TouchableOpacity>
  );

  const TechLogo = ({ uri, name }: { uri: string, name: string }) => (
    <View style={styles.techLogoContainer}>
        <Image source={{ uri }} style={styles.techLogo} />
        <Text style={[styles.techName, {color: colors.textSecondary}]}>{name}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
          colors={isDarkMode ? ['#2a2a2a', '#1a1a1a'] : ['#f0f4f8', '#d9e2ec']}
          style={StyleSheet.absoluteFill}
        />
      <SafeAreaView style={{flex: 1}}>
        <View style={[styles.header]}>
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
          <View style={styles.heroSection}>
             <LinearGradient
                colors={['#8E2DE2', '#4A00E0']}
                style={styles.heroGradient}
              >
                <Animated.View style={styles.heroImageContainer}>
                  <Image
                    source={{ uri: 'https://avatars.githubusercontent.com/u/102801281?v=4' }} // Replace with your actual image URL
                    style={styles.profileImage}
                  />
                  <View style={[styles.decorativeCircle, styles.circle1]} />
                  <View style={[styles.decorativeCircle, styles.circle2]} />
                </Animated.View>

              </LinearGradient>
              <AnimatedView delay={100}>
                <Text style={styles.heroName}>Leul Ayfokru</Text>
              </AnimatedView>
              <AnimatedView delay={200}>
                <Text style={styles.heroTitle}>Full Stack & AI Developer</Text>
              </AnimatedView>
          </View>

          {/* About Section */}
          <AnimatedView delay={300} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About Me
            </Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              I'm a passionate full-stack developer with 3+ years of experience building modern web and mobile applications that are scalable, user-friendly, and solve real-world problems.
            </Text>
            <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
              MediScan AI represents my commitment to leveraging technology for healthcare innovation, combining AI with intuitive design to make healthcare more accessible for everyone.
            </Text>
          </AnimatedView>

          {/* Expertise Section */}
          <View style={styles.section}>
            <AnimatedView delay={400}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                My Expertise
              </Text>
            </AnimatedView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
                <SkillCard
                  icon={Code}
                  title="Web Development"
                  description="React, Next.js, Node.js"
                />
                <SkillCard
                  icon={Smartphone}
                  title="Mobile Development"
                  description="React Native, Expo"
                />
                <SkillCard
                  icon={BrainCircuit}
                  title="AI Integration"
                  description="Google AI, Vision API"
                />
                <SkillCard
                  icon={PenTool}
                  title="UI/UX Design"
                  description="Figma, User-Centric"
                />
            </ScrollView>
          </View>

           {/* Tech Stack Section */}
           <AnimatedView delay={500} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Tech Stack
              </Text>
              <View style={styles.techGrid}>
                  <TechLogo uri="https://cdn.worldvectorlogo.com/logos/react-2.svg" name="React Native" />
                  <TechLogo uri="https://cdn.worldvectorlogo.com/logos/next-js.svg" name="Next.js" />
                  <TechLogo uri="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" name="Node.js" />
                  <TechLogo uri="https://cdn.worldvectorlogo.com/logos/typescript.svg" name="TypeScript" />
                  <TechLogo uri="https://cdn.worldvectorlogo.com/logos/expo-go.svg" name="Expo" />
                  <TechLogo uri="https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg" name="Google Cloud" />
              </View>
            </AnimatedView>


          {/* Contact Section */}
          <AnimatedView delay={600} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Get In Touch
            </Text>
            <View style={styles.contactContainer}>
                <ContactCard
                    icon={Mail}
                    title="Email"
                    subtitle="layfokru@gmail.com"
                    url="mailto:layfokru@gmail.com"
                />
                <ContactCard
                    icon={Github}
                    title="GitHub"
                    subtitle="@akl-leul"
                    url="https://github.com/akl-leul"
                />
            </View>
          </AnimatedView>

          {/* Footer */}
          <AnimatedView delay={700} style={styles.footer}>
            <Heart size={24} color={colors.primary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Crafted with passion by Leul Ayfokru
            </Text>
            <Text style={[styles.footerSubtext, { color: colors.textSecondary }]}>
              © 2025 MediScan AI
            </Text>
          </AnimatedView>
        </ScrollView>
      </SafeAreaView>
    </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroGradient: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroImageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  circle1: {
    width: 140,
    height: 140,
    zIndex: -1,
  },
  circle2: {
    width: 170,
    height: 170,
    zIndex: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  horizontalScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  skillCardContainer: {
    width: 170,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  skillCard: {
    padding: 20,
    alignItems: 'center',
    height: '100%',
  },
  skillIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  skillTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  skillDescription: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  contactContainer: {
    gap: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },
  techLogoContainer: {
    alignItems: 'center',
    gap: 8,
    width: '25%',
  },
  techLogo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  techName: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    opacity: 0.7,
  },
});