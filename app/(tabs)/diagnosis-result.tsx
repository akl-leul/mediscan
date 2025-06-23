import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Disease } from '@/types';
import { Button } from '@/components/Button';

export default function DiagnosisResultScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  
  // Parse the diagnosis data from params
  const diagnosisData = params.data ? JSON.parse(params.data as string) : null;

  if (!diagnosisData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            No diagnosis data available
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  const { possibleDiseases, recommendations, symptoms, diet, location } = diagnosisData;

  const DiseaseCard = ({ disease }: { disease: Disease }) => (
    <View style={[styles.diseaseCard, { backgroundColor: colors.card }]}>
      <View style={styles.diseaseHeader}>
        <Text style={[styles.diseaseName, { color: colors.text }]}>
          {disease.name}
        </Text>
        <View style={[
          styles.probabilityBadge,
          { 
            backgroundColor: disease.probability > 70 ? '#EF4444' : 
                           disease.probability > 40 ? '#F59E0B' : '#10B981'
          }
        ]}>
          <Text style={styles.probabilityText}>
            {disease.probability}%
          </Text>
        </View>
      </View>
      <Text style={[styles.diseaseDescription, { color: colors.textSecondary }]}>
        {disease.description}
      </Text>
      <View style={styles.riskIndicator}>
        <View style={[
          styles.riskDot,
          { 
            backgroundColor: disease.probability > 70 ? '#EF4444' : 
                           disease.probability > 40 ? '#F59E0B' : '#10B981'
          }
        ]} />
        <Text style={[styles.riskText, { color: colors.textSecondary }]}>
          {disease.probability > 70 ? 'High probability' : 
           disease.probability > 40 ? 'Moderate probability' : 'Low probability'}
        </Text>
      </View>
    </View>
  );

  const InfoCard = ({ title, content, icon: Icon }: { title: string; content: string; icon: any }) => (
    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
      <View style={styles.infoHeader}>
        <Icon size={20} color={colors.primary} />
        <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.infoContent, { color: colors.textSecondary }]}>{content}</Text>
    </View>
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
          Diagnosis Results
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: '#FEF2F2' }]}>
          <AlertTriangle size={20} color="#EF4444" />
          <Text style={[styles.disclaimerText, { color: '#991B1B' }]}>
            This is an AI-generated analysis for informational purposes only. Please consult a healthcare professional for proper medical diagnosis and treatment.
          </Text>
        </View>

        {/* Input Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Analysis Summary
          </Text>
          <InfoCard title="Symptoms" content={symptoms} icon={AlertTriangle} />
          <InfoCard title="Diet" content={diet} icon={CheckCircle} />
          <InfoCard title="Location" content={location} icon={Clock} />
        </View>

        {/* Possible Diseases */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Possible Conditions
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Based on the symptoms and information provided
          </Text>
          
          {possibleDiseases.map((disease: Disease, index: number) => (
            <DiseaseCard key={index} disease={disease} />
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recommendations
          </Text>
          
          <View style={[styles.recommendationsCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.recommendationsText, { color: colors.textSecondary }]}>
              {recommendations}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="New Diagnosis"
            onPress={() => router.push('/diagnosis')}
            variant="primary"
          />
          <Button
            title="Save Results"
            onPress={() => {
              // Results are already saved in the diagnosis screen
              router.push('/(tabs)')
            }}
            variant="outline"
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  disclaimer: {
    flexDirection: 'row',
    padding: 16,
    margin: 20,
    borderRadius: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  infoCard: {
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
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  diseaseCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  probabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  probabilityText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  diseaseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  riskDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendationsCard: {
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
  recommendationsText: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});