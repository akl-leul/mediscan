import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scan, Stethoscope, History } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      // Load recent scans and diagnoses
      const [scanResults, diagnosisResults] = await Promise.all([
        supabase
          .from('scan_results')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('diagnosis_results')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const activity = [
        ...(scanResults.data || []).map(item => ({ ...item, type: 'scan' })),
        ...(diagnosisResults.data || []).map(item => ({ ...item, type: 'diagnosis' })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRecentActivity(activity.slice(0, 5));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ 
    title, 
    icon: Icon, 
    onPress, 
    backgroundColor 
  }: {
    title: string;
    icon: any;
    onPress: () => void;
    backgroundColor: string;
  }) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor }]}
      onPress={onPress}
    >
      <Icon size={32} color="#FFFFFF" />
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
            {t('dashboard.welcome')}
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <QuickActionCard
            title={t('dashboard.scanMedicine')}
            icon={Scan}
            backgroundColor={colors.primary}
            onPress={() => router.push('/scan')}
          />
          <QuickActionCard
            title={t('dashboard.getDiagnosis')}
            icon={Stethoscope}
            backgroundColor="#10B981"
            onPress={() => router.push('/diagnosis')}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('dashboard.recentActivity')}
          </Text>
          
          {loading ? (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.noActivityText, { color: colors.textSecondary }]}>
                Loading...
              </Text>
            </View>
          ) : recentActivity.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <History size={48} color={colors.textSecondary} />
              <Text style={[styles.noActivityText, { color: colors.textSecondary }]}>
                {t('dashboard.noActivity')}
              </Text>
            </View>
          ) : (
            recentActivity.map((item: any, index) => (
              <View
                key={index}
                style={[styles.activityCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.activityIcon}>
                  {item.type === 'scan' ? (
                    <Scan size={20} color={colors.primary} />
                  ) : (
                    <Stethoscope size={20} color="#10B981" />
                  )}
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {item.type === 'scan' 
                      ? item.medicine_name 
                      : 'Health Diagnosis'
                    }
                  </Text>
                  <Text style={[styles.activityDate, { color: colors.textSecondary }]}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
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
  welcomeText: {
    fontSize: 18,
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  quickActionCard: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 16,
  },
  noActivityText: {
    fontSize: 16,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
  },
});