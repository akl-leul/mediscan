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
    this.apiKey = process.env.EXPO_PUBLIC_GOOGLE_AI_STUDIO_API_KEY!;
  }

  async analyzeMedicine(imageBase64: string): Promise<VisionApiResponse> {
    try {
      const prompt = this.buildMedicineAnalysisPrompt(imageBase64);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
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
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: imageBase64
                    }
                  }
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
        throw new Error(`AI Studio request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('AI Studio Response:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return this.parseAiResponse(generatedText);
      }

      return this.getDefaultResponse();
    } catch (error) {
      console.error('AI Studio Error:', error);
      return this.getDefaultResponse();
    }
  }

  private buildMedicineAnalysisPrompt(imageBase64: string): string {
    return `
Analyze this medicine image and provide detailed information about the medicine shown.

Look at the image carefully and identify:
1. The medicine name (brand name and/or generic name)
2. Any visible text on the packaging
3. The type of medicine (tablet, capsule, syrup, etc.)

Provide comprehensive information in JSON format.

Respond ONLY with valid JSON in this exact format:
{
  "medicineName": "Name of the medicine identified",
  "description": "What this medicine is, its active ingredients, and how it works",
  "uses": "Medical conditions it treats, indications, and therapeutic uses",
  "sideEffects": "Common and serious side effects, contraindications, and warnings",
  "dosage": "Typical dosage forms, administration methods, and general dosing guidelines"
}

Important guidelines:
- If the medicine name is unclear, provide the best possible identification
- Include both brand and generic names when possible
- Provide comprehensive but concise information
- Always emphasize consulting healthcare professionals
- Include safety warnings and contraindications
`;
  }

  private parseAiResponse(responseText: string): VisionApiResponse {
    try {
      console.log('Parsing AI response:', responseText);
      
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        
        return {
          medicineName: parsed.medicineName || 'Medicine Detected',
          description: parsed.description || 'Medicine information analyzed from image',
          uses: parsed.uses || 'Consult healthcare provider for usage information',
          sideEffects: parsed.sideEffects || 'Consult package insert for side effects',
          dosage: parsed.dosage || 'Follow healthcare provider instructions',
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    return this.getDefaultResponse();
  }

  private getDefaultResponse(): VisionApiResponse {
    return {
      medicineName: 'Medicine Analysis',
      description: 'The image has been analyzed. For the most accurate information, please ensure the medicine name is clearly visible and try taking a clearer photo with better lighting.',
      uses: 'Unable to determine specific uses from the image. Please consult a healthcare provider or pharmacist for information about this medicine.',
      sideEffects: 'Unable to determine side effects from the image. Please refer to the package insert or consult a healthcare provider.',
      dosage: 'Unable to determine dosage from the image. Please follow package instructions or consult your healthcare provider.',
    };
  }
}

export const visionApi = new VisionApiService();