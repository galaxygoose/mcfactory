// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

export interface MCFACTORYConfig {
  provider: string;
  apiKey: string;
}

export interface TranslationResult {
  text: string;
  detectedLanguage?: string;
}

export interface DetectionResult {
  isAI: boolean;
  confidence: number;
}

export interface ModerationResult {
  flagged: boolean;
  categories: string[];
}
