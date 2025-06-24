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

      if (!response.ok) {
        throw new Error(`Vision API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Vision API Response:', data);
      
      if (data.responses && data.responses[0]) {
        const textAnnotations = data.responses[0].textAnnotations || [];
        const labelAnnotations = data.responses[0].labelAnnotations || [];
        
        // Extract text from medicine package
        const detectedText = textAnnotations.length > 0 
          ? textAnnotations[0].description 
          : '';

        console.log('Detected text:', detectedText);
        console.log('Detected labels:', labelAnnotations.map(l => l.description));

        // Use AI to analyze the detected text and labels
        return await this.analyzeMedicineText(detectedText, labelAnnotations);
      }

      // Return default response instead of throwing error
      return this.getDefaultResponse();
    } catch (error) {
      console.error('Vision API Error:', error);
      // Return default response instead of throwing error
      return this.getDefaultResponse();
    }
  }

  private async analyzeMedicineText(text: string, labels: any[]): Promise<VisionApiResponse> {
    // If we have meaningful text, try to extract medicine information
    if (text && text.length > 10) {
      const medicineName = this.extractMedicineName(text);
      const labelTexts = labels.map(label => label.description).join(', ');
      
      // Try to get more detailed information using AI Studio
      try {
        const { aiStudio } = await import('./aiStudioApi');
        const aiResult = await aiStudio.analyzeMedicineText(medicineName);
        return aiResult;
      } catch (aiError) {
        console.error('AI Studio error:', aiError);
        // Fallback to basic analysis
        return this.createBasicResponse(medicineName, text, labelTexts);
      }
    }
    
    return this.getDefaultResponse();
  }

  private extractMedicineName(text: string): string {
    // Improved medicine name extraction
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const commonMedicineWords = ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'gel', 'mg', 'ml', 'dose'];
    const excludeWords = ['for', 'use', 'only', 'external', 'internal', 'keep', 'store', 'away', 'children'];
    
    // Look for potential medicine names in the first few lines
    for (const line of lines.slice(0, 5)) {
      const words = line.split(/\s+/);
      for (const word of words) {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '');
        if (cleanWord.length > 3 && 
            !commonMedicineWords.includes(cleanWord.toLowerCase()) &&
            !excludeWords.includes(cleanWord.toLowerCase()) &&
            /^[A-Z]/.test(cleanWord)) {
          return cleanWord;
        }
      }
    }
    
    // If no good candidate found, return the first meaningful word
    const words = text.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length > 4) {
        return cleanWord;
      }
    }
    
    return 'Unknown Medicine';
  }

  private createBasicResponse(medicineName: string, text: string, labels: string): VisionApiResponse {
    return {
      medicineName: medicineName,
      description: `Medicine identified from package. Detected text includes: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`,
      uses: 'Please consult the package insert or a healthcare provider for detailed usage information.',
      sideEffects: 'Please refer to the package insert for complete side effects information. Common side effects may vary.',
      dosage: 'Follow the dosage instructions on the package or as prescribed by your healthcare provider.',
    };
  }

  private getDefaultResponse(): VisionApiResponse {
    return {
      medicineName: 'Medicine Not Clearly Detected',
      description: 'The image quality may not be sufficient for accurate text detection. Please try taking a clearer photo with better lighting, ensuring the medicine name is clearly visible.',
      uses: 'Unable to determine specific uses from the image. Please consult a healthcare provider or pharmacist for information about this medicine.',
      sideEffects: 'Unable to determine side effects from the image. Please refer to the package insert or consult a healthcare provider.',
      dosage: 'Unable to determine dosage from the image. Please follow package instructions or consult your healthcare provider.',
    };
  }
}

export const visionApi = new VisionApiService();