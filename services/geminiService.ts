
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AdAnalysis, BrandIntelligence } from "../types";

export const analyzeAdDetailed = async (
  brandName: string,
  adText: string,
  base64Image?: string
): Promise<AdAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const systemInstruction = `
    You are a LinkedIn Ads Expert. Analyze this ad for a Construction Tech SaaS.
    Return a JSON response matching the schema.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      companyName: { type: Type.STRING },
      adHeadline: { type: Type.STRING },
      adType: { type: Type.STRING },
      cta: { type: Type.STRING },
      impressions: { type: Type.STRING },
      imageDescription: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          visibleText: { type: Type.STRING },
          visualElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          intent: { type: Type.STRING },
          accessibility: { type: Type.STRING },
          theme: { type: Type.STRING }
        },
        required: ["summary", "visibleText", "visualElements", "intent", "accessibility", "theme"]
      },
      metrics: {
        type: Type.OBJECT,
        properties: {
          professionalism: { type: Type.NUMBER },
          creativity: { type: Type.NUMBER },
          clarity: { type: Type.NUMBER }
        },
        required: ["professionalism", "creativity", "clarity"]
      },
      strategy: {
        type: Type.OBJECT,
        properties: {
          tone: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          valueProposition: { type: Type.STRING }
        },
        required: ["tone", "targetAudience", "valueProposition"]
      }
    },
    required: ["companyName", "adHeadline", "adType", "cta", "imageDescription", "metrics", "strategy"]
  };

  const prompt = base64Image 
    ? `You are given an image from a LinkedIn ad for ${brandName}. Describe the image carefully and precisely. Ad text for context: ${adText}`
    : `Analyze this LinkedIn ad for ${brandName}: ${adText}`;

  const parts: any[] = [{ text: prompt }];
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image.split(',')[1] || base64Image
      }
    });
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: base64Image ? "gemini-2.5-flash-image" : "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema
    }
  });

  const raw = JSON.parse(response.text);
  return {
    ...raw,
    id: Math.random().toString(36).substr(2, 9),
    brandName,
    adText,
    adUrl: "#"
  };
};

export const fetchBrandIntelligence = async (brandName: string): Promise<BrandIntelligence> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare "${brandName}" against construction tech giants like Procore, Autodesk, and Planradar. Identify LinkedIn ad tones and branding strengths.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          brandName: { type: Type.STRING },
          overallTone: { type: Type.STRING },
          commonThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
          visualLanguageScore: { type: Type.NUMBER },
          competitorComparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brand: { type: Type.STRING },
                marketShareEstimate: { type: Type.STRING },
                strength: { type: Type.STRING },
                weakness: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
};
