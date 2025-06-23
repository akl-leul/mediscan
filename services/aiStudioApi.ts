import { Disease } from '@/types';

export interface DiagnosisRequest {
  symptoms: string;
  diet: string;
  location: string;
}

export interface DiagnosisResponse {
  possibleDiseases: Disease[];
  recommendations: string;
}

export interface MedicineAnalysisResponse {
  medicineName: string;
  description: string;
  uses: string;
  sideEffects: string;
  dosage: string;
}

export class AiStudioService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_AI_STUDIO_API_KEY!;
  }

  async getDiagnosis(request: DiagnosisRequest): Promise<DiagnosisResponse> {
    try {
      const prompt = this.buildDiagnosisPrompt(request);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return this.parseAiResponse(generatedText);
      }

      throw new Error('No response from AI service');
    } catch (error) {
      console.error('AI Studio API Error:', error);
      throw new Error('Failed to get diagnosis. Please try again.');
    }
  }

  async analyzeMedicineText(medicineName: string): Promise<MedicineAnalysisResponse> {
    try {
      const prompt = this.buildMedicinePrompt(medicineName);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return this.parseMedicineResponse(generatedText, medicineName);
      }

      throw new Error('No response from AI service');
    } catch (error) {
      console.error('AI Studio API Error:', error);
      return this.getFallbackMedicineInfo(medicineName);
    }
  }

  private buildDiagnosisPrompt(request: DiagnosisRequest): string {
    return `
As a medical AI assistant, analyze the following patient information and provide possible diagnoses:

Symptoms: ${request.symptoms}
Diet: ${request.diet}
Location: ${request.location}

Please provide:
1. A list of 3-5 possible diseases with probability percentages (0-100%)
2. Brief descriptions for each disease
3. General health recommendations

Format your response as JSON:
{
  "diseases": [
    {
      "name": "Disease Name",
      "probability": 75,
      "description": "Brief description"
    }
  ],
  "recommendations": "General recommendations text"
}

Important: This is for informational purposes only and should not replace professional medical advice.
    `;
  }

  private buildMedicinePrompt(medicineName: string): string {
    return `
As a pharmaceutical AI assistant, provide detailed information about the medicine: "${medicineName}"

Please provide:
1. Medicine name (corrected if needed)
2. Description of what this medicine is
3. Common uses and indications
4. Common side effects
5. General dosage information

Format your response as JSON:
{
  "medicineName": "Corrected medicine name",
  "description": "What this medicine is and how it works",
  "uses": "Common uses and medical conditions it treats",
  "sideEffects": "Common side effects and warnings",
  "dosage": "General dosage information and administration"
}

Important: This is for educational purposes only. Always consult healthcare professionals for medical advice.
    `;
  }

  private parseAiResponse(responseText: string): DiagnosisResponse {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          possibleDiseases: parsed.diseases || [],
          recommendations: parsed.recommendations || 'Please consult a healthcare provider for proper diagnosis.',
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback response
    return {
      possibleDiseases: [
        {
          name: 'Unable to determine',
          probability: 0,
          description: 'Insufficient information for diagnosis',
        },
      ],
      recommendations: 'Please consult a healthcare provider for proper medical evaluation.',
    };
  }

  private parseMedicineResponse(responseText: string, originalName: string): MedicineAnalysisResponse {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          medicineName: parsed.medicineName || originalName,
          description: parsed.description || 'Medicine information not available',
          uses: parsed.uses || 'Consult healthcare provider for usage information',
          sideEffects: parsed.sideEffects || 'Consult package insert for side effects',
          dosage: parsed.dosage || 'Follow healthcare provider instructions',
        };
      }
    } catch (error) {
      console.error('Failed to parse medicine response:', error);
    }

    return this.getFallbackMedicineInfo(originalName);
  }

  private getFallbackMedicineInfo(medicineName: string): MedicineAnalysisResponse {
    return {
      medicineName: medicineName,
      description: 'This appears to be a pharmaceutical product. For detailed information, please consult the package insert or speak with a healthcare professional.',
      uses: 'Please consult a healthcare provider or pharmacist for information about this medicine\'s uses and indications.',
      sideEffects: 'Please refer to the package insert or consult a healthcare provider for complete side effects information.',
      dosage: 'Follow the dosage instructions on the package or as prescribed by your healthcare provider.',
    };
  }
}

export const aiStudio = new AiStudioService();