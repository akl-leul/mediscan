import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform, Modal, FlatList, TextInput as RNTextInput } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Search, X, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece',
  'Grenada', 'Guatemala', 'Guinea', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique',
  'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Samoa', 'San Marino', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe'
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  formContainer: {
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  form: {
    marginBottom: 24,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'ios' ? 150 : 50,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  countryInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    justifyContent: 'center',
  },
  countryText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  countryItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  countryItemText: {
    fontSize: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: {
    backgroundColor: '#FFFFFF',
  },
  stepDotCompleted: {
    backgroundColor: '#10b981',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { signUp } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(COUNTRIES);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string;
    country?: string;
    gender?: string;
  }>({});

  const totalSteps = 4;

  const validateCurrentStep = () => {
    const newErrors: any = {};

    switch (currentStep) {
      case 1:
        if (!name.trim()) {
          newErrors.name = 'Name is required';
        }
        if (!email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
          newErrors.email = 'Email is invalid';
        }
        break;
      
      case 2:
        if (!password) {
          newErrors.password = 'Password is required';
        } else if (password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        }
        if (!confirmPassword) {
          newErrors.confirmPassword = 'Confirm password is required';
        } else if (password !== confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      
      case 3:
        if (!phoneNumber.trim()) {
          newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber.trim().replace(/[\s-]/g, ''))) {
          newErrors.phoneNumber = 'Phone number is invalid';
        }
        if (!country.trim()) {
          newErrors.country = 'Country is required';
        }
        break;
      
      case 4:
        if (!gender) {
          newErrors.gender = 'Gender is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({}); // Clear errors for next step
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors for previous step
    }
  };

  const handleRegister = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    try {
      const { error } = await signUp(
        email.trim(),
        password,
        {
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
          country: country.trim(),
          gender: gender
        }
      );
      if (error) {
        Alert.alert('Registration Failed', error);
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! You are now signed in.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              error={errors.name}
            />

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              error={errors.email}
              keyboardType="email-address"
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.form}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.form}>
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              error={errors.phoneNumber}
            />

            <TouchableOpacity
              style={[styles.countryInput, { borderColor: errors.country ? '#ef4444' : colors.border, backgroundColor: colors.background }]}
              onPress={() => setShowCountryPicker(true)}
            >
              <Text style={[styles.countryText, { color: country ? colors.text : colors.textSecondary }]}>
                {country || 'Select your country'}
              </Text>
            </TouchableOpacity>
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>
        );

      case 4:
        return (
          <View style={styles.form}>
            <View style={styles.pickerContainer}>
              <Text style={[styles.pickerLabel, { color: colors.text }]}>Gender</Text>
              <View style={[styles.pickerWrapper, { borderColor: errors.gender ? '#ef4444' : colors.border, backgroundColor: colors.background }]} >
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={[styles.picker, { color: colors.text }]}
                  dropdownIconColor={colors.text}
                >
                  <Picker.Item label="Select Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>
              {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Create Password';
      case 3: return 'Contact Details';
      case 4: return 'Additional Information';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Let\'s start with your basic information';
      case 2: return 'Create a secure password for your account';
      case 3: return 'Add your contact information';
      case 4: return 'Last step! Tell us a bit more about yourself';
      default: return '';
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join MediScan AI and start your health journey
              </Text>
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {[...Array(totalSteps)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.stepDot,
                    index + 1 < currentStep && styles.stepDotCompleted,
                    index + 1 === currentStep && styles.stepDotActive
                  ]}
                />
              ))}
            </View>

            <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
              <Text style={styles.stepTitle}>{getStepTitle()}</Text>
              <Text style={styles.stepDescription}>{getStepDescription()}</Text>
              
              {renderStep()}

              {/* Navigation Buttons */}
              <View style={styles.navigationButtons}>
                {currentStep > 1 && (
                  <View style={styles.navButton}>
                    <Button
                      title="Previous"
                      onPress={handlePrevious}
                      variant="secondary"
                    />
                  </View>
                )}
                
                <View style={styles.navButton}>
                  {currentStep < totalSteps ? (
                    <Button
                      title="Next"
                      onPress={handleNext}
                    />
                  ) : (
                    <Button
                      title={loading ? "Creating Account..." : "Create Account"}
                      onPress={handleRegister}
                      loading={loading}
                      variant="primary"
                    />
                  )}
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                  Already have an account?{' '}
                  <Link href="/auth/login" style={{ color: colors.primary }}>
                    Sign In
                  </Link>
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
            <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <RNTextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search countries..."
              placeholderTextColor={colors.textSecondary}
              value={countrySearch}
              onChangeText={(text) => {
                setCountrySearch(text);
                const filtered = COUNTRIES.filter(country =>
                  country.toLowerCase().includes(text.toLowerCase())
                );
                setFilteredCountries(filtered);
              }}
            />
          </View>

          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.countryItem, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setCountry(item);
                  setShowCountryPicker(false);
                  setCountrySearch('');
                  setFilteredCountries(COUNTRIES);
                }}
              >
                <Text style={[styles.countryItemText, { color: colors.text }]}>{item}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </Modal>
    </LinearGradient>
  );
}
