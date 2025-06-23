import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
// I'll use text for icons, but you'd import actual Google/Apple icons here
import { ArrowLeft, Mail, Lock } from 'lucide-react-native'; 
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { signUp } = useAuth();
  
  // --- All state and functionality remains unchanged ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; }>({});

  const validateForm = () => { /* ... no changes ... */ };
  const handleRegister = async () => { /* ... no changes ... */ };
  // --- End of unchanged functionality ---

  return (
    <LinearGradient
      colors={['#1e1c3a', '#3d2f6f', '#764ba2']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Join the Future</Text>
              <Text style={styles.subtitle}>
                Create your MediScan AI account
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.form}>
                <TextInput
                  icon={<Mail size={20} color="rgba(255,255,255,0.6)" />}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  icon={<Lock size={20} color="rgba(255,255,255,0.6)" />}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  secureTextEntry
                  error={errors.password}
                />
                <TextInput
                  icon={<Lock size={20} color="rgba(255,255,255,0.6)" />}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  secureTextEntry
                  error={errors.confirmPassword}
                />
                <Button
                  title={loading ? "Creating Account..." : "Create Account"}
                  onPress={handleRegister}
                  loading={loading}
                  variant="primary"
                  style={{marginTop: 16}}
                />
              </View>

              {/* --- NEW: "OR" Divider --- */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* --- NEW: Social Login Buttons --- */}
              <View style={styles.socialLoginContainer}>
                {/* Note: You would replace the Text with an actual Icon component */}
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                  <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>G</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                  <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold'}}>A</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{' '}
                  <Link href="/auth/login" asChild>
                    <Text style={styles.linkText}>
                      Sign In
                    </Text>
                  </Link>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: 32,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  form: {
    gap: 20,
  },
  // --- NEW STYLES ---
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 16,
    fontWeight: '600',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  // --- END NEW STYLES ---
  footer: {
    alignItems: 'center',
    // Removed marginTop to be handled by social buttons container margin
  },
  footerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  linkText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});