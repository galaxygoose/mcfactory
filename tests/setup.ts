import { jest } from '@jest/globals';

// Initialize providers for tests
import { OpenAIProvider } from '../src/core/providers/openaiProvider';
import { AnthropicProvider } from '../src/core/providers/anthropicProvider';
import { GeminiProvider } from '../src/core/providers/geminiProvider';
import { CohereProvider } from '../src/core/providers/cohereProvider';
import { WhisperProvider } from '../src/core/providers/whisperProvider';
import { ElevenLabsProvider } from '../src/core/providers/elevenLabsProvider';
import { LocalLLMProvider } from '../src/core/providers/localLLMProvider';
import { EmbeddingProvider } from '../src/core/providers/embeddingProvider';
import { ImageModerationProvider } from '../src/core/providers/imageModerationProvider';

// Initialize all providers
OpenAIProvider.create();
AnthropicProvider.create();
GeminiProvider.create();
CohereProvider.create();
WhisperProvider.create();
ElevenLabsProvider.create();
LocalLLMProvider.create();
EmbeddingProvider.create();
ImageModerationProvider.create();

// Mock environment variables
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.GEMINI_API_KEY = 'test-gemini-key';

// Global test utilities
global.testUtils = {
  // Mock provider response factory
  createMockProviderResponse: (output: any, tokens?: number, model?: string, provider?: string) => ({
    output,
    tokens: tokens || 100,
    model: model || 'gpt-4',
    provider: provider || 'openai'
  }),

  // Mock provider factory
  createMockProvider: (name: string = 'mock-provider') => ({
    name,
    callModel: jest.fn()
  }),

  // Reset all mocks
  resetMocks: () => {
    jest.clearAllMocks();
  }
};

// Mock axios for providers that use it
jest.mock('axios');
const mockAxios = require('axios');
mockAxios.post = jest.fn();
mockAxios.get = jest.fn();

// Mock fs for config loading
jest.mock('fs');
const mockFs = require('fs');
mockFs.existsSync = jest.fn();
mockFs.readFileSync = jest.fn();

// Extend Jest matchers if needed
expect.extend({
  toBeValidTranslationOutput(received) {
    const pass = received &&
      typeof received.translated === 'string' &&
      typeof received.targetLang === 'string' &&
      typeof received.provider === 'string';

    return {
      message: () => `expected ${received} to be a valid translation output`,
      pass
    };
  },

  toBeValidModerationResult(received) {
    const pass = received &&
      typeof received.safe === 'boolean' &&
      Array.isArray(received.categories) &&
      typeof received.confidence === 'number' &&
      typeof received.flagged === 'boolean';

    return {
      message: () => `expected ${received} to be a valid moderation result`,
      pass
    };
  }
});
