
export interface AdAnalysis {
  id: string;
  brandName: string;
  companyName: string;
  adHeadline: string;
  adText: string;
  adType: string;
  cta: string;
  impressions: string;
  adUrl: string;
  imageDescription: {
    summary: string;
    visibleText: string;
    visualElements: string[];
    intent: string;
    accessibility: string;
    theme: string;
  };
  metrics: {
    professionalism: number;
    creativity: number;
    clarity: number;
  };
  strategy: {
    tone: string;
    targetAudience: string;
    valueProposition: string;
  };
}

export interface BrandIntelligence {
  brandName: string;
  overallTone: string;
  commonThemes: string[];
  competitorComparison: {
    brand: string;
    marketShareEstimate: string;
    strength: string;
    weakness: string;
  }[];
  visualLanguageScore: number;
}
