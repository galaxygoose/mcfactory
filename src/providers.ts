// Provider initialization module
import { OpenAIProvider } from './core/providers/openaiProvider';
import { AnthropicProvider } from './core/providers/anthropicProvider';
import { GeminiProvider } from './core/providers/geminiProvider';
import { CohereProvider } from './core/providers/cohereProvider';
import { WhisperProvider } from './core/providers/whisperProvider';
import { ElevenLabsProvider } from './core/providers/elevenLabsProvider';
import { LocalLLMProvider } from './core/providers/localLLMProvider';
import { EmbeddingProvider } from './core/providers/embeddingProvider';
import { ImageModerationProvider } from './core/providers/imageModerationProvider';

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

// Export something to ensure the module is not tree-shaken
export const PROVIDER_INIT = true;
