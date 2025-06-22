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
import { Disease } from '@/types';

export default function DiagnosisScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [symptoms, setSymptoms] = useState('');
  const [diet, setDiet] = useState('');
  const [location, setLocation] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResponse | null>(null);

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

  const analyzeSyntoms = async () => {
    if (!validateForm()) return;

    setAnalyzing(true);
    try {
      const result = await aiStudio.getDiagnosis({
        symptoms: symptoms.trim(),
        diet: diet.trim(),
        location: location.trim(),
      });
      
      setDiagnosisResult(result);
      
      // Save to database
      await supabase.from('diagnosis_results').insert({
        user_id: user?.id,
        symptoms: symptoms.trim(),
        diet: diet.trim(),
        location: location.trim(),
        possible_diseases: result.possibleDiseases,
        recommendations: result.recommendations,
      });
    } catch (error) {
      Alert.alert('Analysis Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSymptoms('');
    setDiet('');
    setLocation('');
    setDiagnosisResult(null);
  };

  const DiseaseCard = ({ disease }: { disease: Disease }) => (
    <View style={[styles.diseaseCard, { backgroundColor: colors.card }]}>
      <View style={styles.diseaseHeader}>
        <Text style={[styles.diseaseName, { color: colors.text }]}>
          {disease.name}
        </Text>
        <View style={[
          styles.probabilityBadge,
          { backgroundColor: disease.probability > 50 ? '#EF4444' : '#F59E0B' }
        ]}>
          <Text style={styles.probabilityText}>
            {disease.probability}%
          </Text>
        </View>
      </View>
      <Text style={[styles.diseaseDescription, { color: colors.textSecondary }]}>
        {disease.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('diagnosis.title')}
          </Text>
        </View>

        {!diagnosisResult ? (
          <View style={styles.formSection}>
            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <Activity size={20} color={colors.primary} />
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {t('diagnosis.symptoms')}
                </Text>
              </View>
              <TextInput
                value={symptoms}
                onChangeText={setSymptoms}
                placeholder="Describe your symptoms (e.g., headache, fever, nausea)"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <UtensilsCrossed size={20} color={colors.primary} />
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {t('diagnosis.diet')}
                </Text>
              </View>
              <TextInput
                value={diet}
                onChangeText={setDiet}
                placeholder="Describe your recent diet and food intake"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputSection}>
              <View style={styles.inputHeader}>
                <MapPin size={20} color={colors.primary} />
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  {t('diagnosis.location')}
                </Text>
              </View>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your current location (city, country)"
              />
            </View>

            <Button
              title={analyzing ? t('diagnosis.analyzing') : t('diagnosis.analyze')}
              onPress={analyzeSyntoms}
              loading={analyzing}
              variant="primary"
            />
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('diagnosis.results')}
            </Text>

            <View style={[styles.disclaimer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                ⚠️ This is for informational purposes only. Please consult a healthcare professional for proper medical advice.
              </Text>
            </View>

            <Text style={[styles.subsectionTitle, { color: colors.text }]}>
              Possible Conditions
            </Text>
            
            {diagnosisResult.possibleDiseases.map((disease, index) => (
              <DiseaseCard key={index} disease={disease} />
            ))}

            <Text style={[styles.subsectionTitle, { color: colors.text }]}>
              Recommendations
            </Text>
            
            <View style={[styles.recommendationsCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.recommendationsText, { color: colors.textSecondary }]}>
                {diagnosisResult.recommendations}
              </Text>
            </View>

            <Button
              title="New Diagnosis"
              onPress={resetForm}
              variant="outline"
            />
          </View>
        )}
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
  resultsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
  },
  disclaimer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  diseaseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  probabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  probabilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  recommendationsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});