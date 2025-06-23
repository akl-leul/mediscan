import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Loader, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { visionApi, VisionApiResponse } from '@/services/visionApi';
import { aiStudio } from '@/services/aiStudioApi';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function ScanScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<VisionApiResponse | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to continue.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setScanResult(null);
    }
  };

  const chooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setScanResult(null);
    }
  };

  const scanMedicine = async () => {
    if (!selectedImage) return;

    setScanning(true);
    try {
      // Convert image to base64
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        const base64 = base64data.split(',')[1];

        try {
          // First, use Vision API to extract text
          const visionResult = await visionApi.analyzeMedicine(base64);
          
          // Then use AI Studio to get detailed medicine information
          const aiResult = await aiStudio.analyzeMedicineText(visionResult.medicineName);
          
          const finalResult = {
            ...visionResult,
            ...aiResult
          };
          
          setScanResult(finalResult);
          
          // Save to database
          await supabase.from('scan_results').insert({
            user_id: user?.id,
            image_url: selectedImage,
            medicine_name: finalResult.medicineName,
            description: finalResult.description,
            uses: finalResult.uses,
            side_effects: finalResult.sideEffects,
            dosage: finalResult.dosage,
          });
        } catch (error) {
          Alert.alert('Scan Failed', error instanceof Error ? error.message : 'Unknown error');
        } finally {
          setScanning(false);
        }
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      setScanning(false);
      Alert.alert('Error', 'Failed to process image');
    }
  };

  const ResultCard = ({ title, content }: { title: string; content: string }) => (
    <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
      <Text style={[styles.resultTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.resultContent, { color: colors.textSecondary }]}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Medicine Scanner
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Scan any medicine to get detailed information
          </Text>
        </View>

        {!selectedImage ? (
          <View style={styles.uploadSection}>
            <View style={[styles.uploadCard, { backgroundColor: colors.surface }]}>
              <ImageIcon size={64} color={colors.textSecondary} />
              <Text style={[styles.uploadText, { color: colors.textSecondary }]}>
                Select an image of the medicine to scan
              </Text>
              <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
                Make sure the medicine name is clearly visible
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Take Photo"
                onPress={takePhoto}
                variant="primary"
              />
              <Button
                title="Choose from Gallery"
                onPress={chooseFromGallery}
                variant="outline" 
              />
            </View>
          </View>
        ) : (
          <View style={styles.imageSection}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            </View>
            
            <View style={styles.buttonContainer}>
              {!scanResult && (
                <Button
                  title={scanning ? "Scanning..." : "Scan Medicine"}
                  onPress={scanMedicine}
                  loading={scanning}
                  variant="primary"
                />
              )}
              
              <Button
                title="Choose Another Image"
                onPress={() => {
                  setSelectedImage(null);
                  setScanResult(null);
                }}
                variant="outline"
              />
            </View>
          </View>
        )}

        {scanResult && (
          <View style={styles.resultsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Scan Results
            </Text>
            
            <ResultCard title="Medicine Name" content={scanResult.medicineName} />
            <ResultCard title="Description" content={scanResult.description} />
            <ResultCard title="Uses" content={scanResult.uses} />
            <ResultCard title="Side Effects" content={scanResult.sideEffects} />
            <ResultCard title="Dosage" content={scanResult.dosage} />

            <View style={[styles.disclaimer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
                ⚠️ This information is for educational purposes only. Always consult with a healthcare professional before taking any medication.
              </Text>
            </View>
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
    backgroundColor: '#eeffee',
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
  uploadSection: {
    padding: 24,
  },
  uploadCard: {
    padding: 48,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
  },
  uploadText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  imageSection: {
    padding: 24,
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedImage: {
    width: '100%',
    height: 300,
  },
  resultsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  disclaimer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 40,
  },
});