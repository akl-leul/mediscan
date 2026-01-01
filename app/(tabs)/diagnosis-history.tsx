import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, MapPin, Activity, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { DiagnosisResult, Disease } from '@/types';

export default function DiagnosisHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDiagnosisHistory();
    }
  }, [user]);

  const loadDiagnosisHistory = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('diagnosis_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiagnosisHistory(data || []);
    } catch (error) {
      console.error('Error loading diagnosis history:', error);
      Alert.alert('Error', 'Failed to load diagnosis history');
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagnosis = async (id: string) => {
    Alert.alert(
      'Delete Diagnosis',
      'Are you sure you want to delete this diagnosis?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('diagnosis_results')
                .delete()
                .eq('id', id);

              if (error) throw error;
              setDiagnosisHistory(prev => prev.filter(item => item.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete diagnosis');
            }
          }
        }
      ]
    );
  };

  const viewDiagnosisDetails = (diagnosis: DiagnosisResult) => {
    router.push({
      pathname: '/diagnosis-result',
      params: {
        data: JSON.stringify({
          possibleDiseases: diagnosis.possible_diseases,
          recommendations: diagnosis.recommendations,
          symptoms: diagnosis.symptoms,
          diet: diagnosis.diet,
          location: diagnosis.location,
        })
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopDisease = (diseases: Disease[]) => {
    if (!diseases || diseases.length === 0) return 'No diagnosis available';
    return diseases.sort((a, b) => b.probability - a.probability)[0];
  };

  const DiagnosisCard = ({ diagnosis }: { diagnosis: DiagnosisResult }) => {
    const topDisease = getTopDisease(diagnosis.possible_diseases);
    
    return (
      <TouchableOpacity
        style={[styles.diagnosisCard, { backgroundColor: colors.card }]}
        onPress={() => viewDiagnosisDetails(diagnosis)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {typeof topDisease === 'object' ? topDisease.name : topDisease}
            </Text>
            <View style={styles.cardMeta}>
              <Calendar size={12} color={colors.textSecondary} />
              <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                {formatDate(diagnosis.created_at)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteDiagnosis(diagnosis.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {typeof topDisease === 'object' && (
          <View style={[
            styles.probabilityBadge,
            { 
              backgroundColor: topDisease.probability > 70 ? '#FEF2F2' : 
                             topDisease.probability > 40 ? '#FFFBEB' : '#ECFDF5'
            }
          ]}>
            <Text style={[
              styles.probabilityText,
              { 
                color: topDisease.probability > 70 ? '#EF4444' : 
                       topDisease.probability > 40 ? '#F59E0B' : '#10B981'
              }
            ]}>
              {topDisease.probability}% probability
            </Text>
          </View>
        )}

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Activity size={14} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={2}>
              {diagnosis.symptoms}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={14} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {diagnosis.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          Diagnosis History
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Loading history...
            </Text>
          </View>
        ) : diagnosisHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Activity size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Diagnosis History
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Your diagnosis history will appear here after you complete health assessments
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {diagnosisHistory.map((diagnosis) => (
              <DiagnosisCard key={diagnosis.id} diagnosis={diagnosis} />
            ))}
          </View>
        )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyList: {
    padding: 20,
    gap: 16,
  },
  diagnosisCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardDate: {
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  probabilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});