import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, MapPin, UtensilsCrossed } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { aiStudio, DiagnosisResponse } from '@/services/aiStudioApi';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function DiagnosisScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  
  const [symptoms, setSymptoms] = useState('');
  const [diet, setDiet] = useState('');
  const [location, setLocation] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const validateForm = () => {
    if (!symptoms.trim()) {
      Alert.alert('Validation Error', 'Please describe your symptoms');
      return false;
    }
    if (!diet.trim()) {
      Alert.alert('Validation Error', 'Please describe your recent diet');
      return false;
    }
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter your location');
      return false;
    }
    return true;
  };

  const analyzeSymptoms = async () => {
    if (!validateForm()) return;

    setAnalyzing(true);
    try {
      const result = await aiStudio.getDiagnosis({
        symptoms: symptoms.trim(),
        diet: diet.trim(),
        location: location.trim(),
      });
      
      // Save to database
      await supabase.from('diagnosis_results').insert({
        user_id: user?.id,
        symptoms: symptoms.trim(),
        diet: diet.trim(),
        location: location.trim(),
        possible_diseases: result.possibleDiseases,
        recommendations: result.recommendations,
      });

      // Navigate to results page with data
      router.push({
        pathname: '/diagnosis-result',
        params: {
          data: JSON.stringify({
            ...result,
            symptoms: symptoms.trim(),
            diet: diet.trim(),
            location: location.trim(),
          })
        }
      });
      
    } catch (error) {
      Alert.alert('Analysis Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Health Diagnosis
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Get AI-powered health insights based on your symptoms
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Activity size={20} color={colors.primary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Symptoms
              </Text>
            </View>
            <TextInput
              value={symptoms}
              onChangeText={setSymptoms}
              placeholder="Describe your symptoms (e.g., headache, fever, nausea, fatigue)"
              multiline
              numberOfLines={4}
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Be as specific as possible about what you're experiencing
            </Text>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <UtensilsCrossed size={20} color={colors.primary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Recent Diet
              </Text>
            </View>
            <TextInput
              value={diet}
              onChangeText={setDiet}
              placeholder="Describe your recent meals and food intake over the past 24-48 hours"
              multiline
              numberOfLines={4}
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Include any unusual foods or changes in your diet
            </Text>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <MapPin size={20} color={colors.primary} />
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Location
              </Text>
            </View>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Enter your current location (city, country)"
            />
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              This helps identify region-specific health conditions
            </Text>
          </View>

          <View style={[styles.warningCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.warningText, { color: '#92400E' }]}>
              ⚠️ This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.
            </Text>
          </View>

          <Button
            title={analyzing ? "Analyzing..." : "Analyze Symptoms"}
            onPress={analyzeSymptoms}
            loading={analyzing}
            variant="primary"
          />
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  formSection: {
    padding: 24,
    gap: 24,
  },
  inputSection: {
    gap: 12,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    marginTop: -8,
  },
  warningCard: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});