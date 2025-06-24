import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, Stethoscope, History, TrendingUp, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { supabase } from '@/lib/supabase';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user, isLoading } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ scans: 0, diagnoses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !isLoading) {
      loadDashboardData();
    }
  }, [user, isLoading]);

  const loadDashboardData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Load recent scans and diagnoses
      const [scanResults, diagnosisResults] = await Promise.all([
        supabase
          .from('scan_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('diagnosis_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      // Combine and sort activity
      const activity = [
        ...(scanResults.data || []).map(item => ({ ...item, type: 'scan' })),
        ...(diagnosisResults.data || []).map(item => ({ ...item, type: 'diagnosis' })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setRecentActivity(activity.slice(0, 5));
      setStats({
        scans: scanResults.data?.length || 0,
        diagnoses: diagnosisResults.data?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const QuickActionCard = ({ 
    title, 
    icon: Icon, 
    onPress, 
    gradient,
    description
  }: {
    title: string;
    icon: any;
    onPress: () => void;
    gradient: string[];
    description: string;
  }) => (
    <TouchableOpacity
      style={styles.quickActionCard}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradient}
        style={styles.quickActionGradient}
      >
        <Icon size={32} color="#FFFFFF" />
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
                Good morning
              </Text>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.email?.split('@')[0] || 'User'}
              </Text>
            </View>
            <ProfileAvatar userId={user?.id} size={50} />
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Medicine Scans"
            value={stats.scans}
            icon={Scan}
            color="#3B82F6"
          />
          <StatCard
            title="Health Diagnoses"
            value={stats.diagnoses}
            icon={Stethoscope}
            color="#10B981"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <QuickActionCard
              title="Scan Medicine"
              description="Identify any medicine instantly"
              icon={Scan}
              gradient={['#667eea', '#764ba2']}
              onPress={() => router.push('/scan')}
            />
            <QuickActionCard
              title="Health Check"
              description="Get AI-powered diagnosis"
              icon={Stethoscope}
              gradient={['#f093fb', '#f5576c']}
              onPress={() => router.push('/diagnosis')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                Loading...
              </Text>
            </View>
          ) : recentActivity.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <History size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No recent activity
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                Start by scanning a medicine or getting a diagnosis
              </Text>
            </View>
          ) : (
            recentActivity.map((item: any, index) => (
              <View
                key={index}
                style={[styles.activityCard, { backgroundColor: colors.card }]}
              >
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: item.type === 'scan' ? '#EBF4FF' : '#ECFDF5' }
                ]}>
                  {item.type === 'scan' ? (
                    <Scan size={20} color="#3B82F6" />
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
                  <View style={styles.activityMeta}>
                    <Clock size={12} color={colors.textSecondary} />
                    <Text style={[styles.activityDate, { color: colors.textSecondary }]}>
                      {formatDate(item.created_at)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.activityAction}>
                  <Text style={[styles.activityActionText, { color: colors.primary }]}>
                    View
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
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
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityDate: {
    fontSize: 12,
  },
  activityAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activityActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 40,
  },
});