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
      console.log('Sending diagnosis request to AI Studio...');
      
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
              maxOutputTokens: 2048,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI Studio request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI Studio diagnosis response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return this.parseAiResponse(generatedText);
      }

      throw new Error('No valid response from AI service');
    } catch (error) {
      console.error('AI Studio API Error:', error);
      return this.getFallbackDiagnosis(request);
    }
  }

  async analyzeMedicineText(medicineName: string): Promise<MedicineAnalysisResponse> {
    try {
      const prompt = this.buildMedicinePrompt(medicineName);
      console.log('Sending medicine analysis request to AI Studio...');
      
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

      if (!response.ok) {
        throw new Error(`AI Studio request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('AI Studio medicine response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return this.parseMedicineResponse(generatedText, medicineName);
      }

      throw new Error('No valid response from AI service');
    } catch (error) {
      console.error('AI Studio API Error:', error);
      return this.getFallbackMedicineInfo(medicineName);
    }
  }

  private buildDiagnosisPrompt(request: DiagnosisRequest): string {
    return `
You are a medical AI assistant. Based on the following patient information, provide a medical analysis in JSON format.

Patient Information:
- Symptoms: ${request.symptoms}
- Recent Diet: ${request.diet}
- Location: ${request.location}

Please analyze this information and provide:
1. A list of 3-5 possible medical conditions with probability percentages
2. Brief descriptions for each condition
3. General health recommendations

Respond ONLY with valid JSON in this exact format:
{
  "diseases": [
    {
      "name": "Condition Name",
      "probability": 75,
      "description": "Brief medical description of the condition"
    }
  ],
  "recommendations": "Detailed health recommendations and next steps"
}

Important guidelines:
- Base probabilities on symptom correlation and medical knowledge
- Include both common and less common conditions that match symptoms
- Provide actionable recommendations
- Always recommend consulting healthcare professionals for serious symptoms
- Consider dietary and environmental factors from location
`;
  }

  private buildMedicinePrompt(medicineName: string): string {
    return `
You are a pharmaceutical AI assistant. Provide detailed information about the medicine: "${medicineName}"

Analyze this medicine name and provide comprehensive information in JSON format.

Respond ONLY with valid JSON in this exact format:
{
  "medicineName": "Corrected or confirmed medicine name",
  "description": "What this medicine is, its active ingredients, and how it works",
  "uses": "Medical conditions it treats, indications, and therapeutic uses",
  "sideEffects": "Common and serious side effects, contraindications, and warnings",
  "dosage": "Typical dosage forms, administration methods, and general dosing guidelines"
}

Important guidelines:
- If the medicine name seems misspelled, provide the correct name
- Include generic and brand name information when relevant
- Provide comprehensive but concise information
- Always emphasize consulting healthcare professionals
- Include safety warnings and contraindications
`;
  }

  private parseAiResponse(responseText: string): DiagnosisResponse {
    try {
      console.log('Parsing AI diagnosis response:', responseText);
      
      // Extract JSON from response - look for content between first { and last }
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        
        if (parsed.diseases && Array.isArray(parsed.diseases)) {
          return {
            possibleDiseases: parsed.diseases.map((disease: any) => ({
              name: disease.name || 'Unknown Condition',
              probability: Math.min(Math.max(disease.probability || 0, 0), 100),
              description: disease.description || 'No description available',
            })),
            recommendations: parsed.recommendations || 'Please consult a healthcare provider for proper diagnosis and treatment.',
          };
        }
      }
    } catch (error) {
      console.error('Failed to parse AI diagnosis response:', error);
    }

    // Fallback response
    return this.getFallbackDiagnosis({
      symptoms: 'Various symptoms',
      diet: 'Not specified',
      location: 'Not specified'
    });
  }

  private parseMedicineResponse(responseText: string, originalName: string): MedicineAnalysisResponse {
    try {
      console.log('Parsing AI medicine response:', responseText);
      
      // Extract JSON from response
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        
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

  private getFallbackDiagnosis(request: DiagnosisRequest): DiagnosisResponse {
    return {
      possibleDiseases: [
        {
          name: 'General Health Assessment Needed',
          probability: 50,
          description: 'Based on the symptoms described, a comprehensive medical evaluation is recommended to determine the underlying cause.',
        },
        {
          name: 'Viral Infection',
          probability: 30,
          description: 'Common viral infections can cause various symptoms and are often self-limiting with proper rest and care.',
        },
        {
          name: 'Stress-Related Symptoms',
          probability: 20,
          description: 'Physical symptoms can sometimes be related to stress, anxiety, or lifestyle factors.',
        },
      ],
      recommendations: `Based on your symptoms (${request.symptoms}), it's important to:

1. **Seek Medical Attention**: Consult with a healthcare provider for proper evaluation and diagnosis
2. **Monitor Symptoms**: Keep track of symptom progression and any new developments
3. **Stay Hydrated**: Maintain adequate fluid intake
4. **Rest**: Ensure adequate sleep and avoid strenuous activities
5. **Diet**: Consider your recent diet (${request.diet}) and maintain balanced nutrition
6. **Location Factors**: Be aware of any environmental factors in your area (${request.location}) that might contribute to symptoms

**Important**: This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.`,
    };
  }

  private getFallbackMedicineInfo(medicineName: string): MedicineAnalysisResponse {
    return {
      medicineName: medicineName,
      description: 'This appears to be a pharmaceutical product. The specific details about this medicine require verification from official medical sources.',
      uses: 'Please consult a healthcare provider, pharmacist, or the official package insert for accurate information about this medicine\'s therapeutic uses and indications.',
      sideEffects: 'Side effects can vary by individual. Please refer to the official package insert, consult your healthcare provider, or speak with a pharmacist for complete safety information.',
      dosage: 'Dosage instructions should be followed exactly as prescribed by your healthcare provider or as indicated on the official package labeling. Do not exceed recommended doses.',
    };
  }
}

export const aiStudio = new AiStudioService();