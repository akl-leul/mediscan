export interface VisionApiResponse {
  medicineName: string;
  description: string;
  uses: string;
  sideEffects: string;
  dosage: string;
}

export class VisionApiService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY!;
  }

  async analyzeMedicine(imageBase64: string): Promise<VisionApiResponse> {
    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: imageBase64,
                },
                features: [
                  {
                    type: 'TEXT_DETECTION',
                    maxResults: 10,
                  },
                  {
                    type: 'LABEL_DETECTION',
                    maxResults: 10,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      
      if (data.responses && data.responses[0]) {
        const textAnnotations = data.responses[0].textAnnotations || [];
        const labelAnnotations = data.responses[0].labelAnnotations || [];
        
        // Extract text from medicine package
        const detectedText = textAnnotations.length > 0 
          ? textAnnotations[0].description 
          : '';

        // Use AI to analyze the detected text and labels
        return await this.analyzeMedicineText(detectedText, labelAnnotations);
      }

      throw new Error('No medicine detected in image');
    } catch (error) {
      console.error('Vision API Error:', error);
      throw new Error('Failed to analyze medicine. Please try again.');
    }
  }

  private async analyzeMedicineText(text: string, labels: any[]): Promise<VisionApiResponse> {
    // This would ideally use Google AI Studio to analyze the detected text
    // For now, we'll return mock data based on detected text
    const labelTexts = labels.map(label => label.description).join(', ');
    
    // Mock response - in production, this would call Google AI Studio
    return {
      medicineName: this.extractMedicineName(text),
      description: `Medicine identified from package text: ${text.substring(0, 100)}...`,
      uses: 'Consult healthcare provider for proper usage information.',
      sideEffects: 'Please refer to package insert for complete side effects information.',
      dosage: 'Follow dosage instructions on package or as prescribed by healthcare provider.',
    };
  }

  private extractMedicineName(text: string): string {
    // Simple extraction logic - in production, use more sophisticated NLP
    const words = text.split(/\s+/);
    const commonMedicineWords = ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'gel'];
    
    for (const word of words) {
      if (word.length > 3 && !commonMedicineWords.includes(word.toLowerCase())) {
        return word;
      }
    }
    
    return 'Unknown Medicine';
  }
}

export const visionApi = new VisionApiService();