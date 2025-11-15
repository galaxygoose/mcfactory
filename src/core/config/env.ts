// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

import { MCFactoryEnvironment } from '../../types';

export class EnvConfig {
  static get(): MCFactoryEnvironment {
    return {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      COHERE_API_KEY: process.env.COHERE_API_KEY,
      ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
      LOCAL_MODEL_PATH: process.env.LOCAL_MODEL_PATH
    };
  }
}
