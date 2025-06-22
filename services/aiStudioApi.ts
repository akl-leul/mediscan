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

export class AiStudioService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_AI_STUDIO_API_KEY!;
  }

  async getDiagnosis(request: DiagnosisRequest): Promise<DiagnosisResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
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

  private buildPrompt(request: DiagnosisRequest): string {
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
}

export const aiStudio = new AiStudioService();