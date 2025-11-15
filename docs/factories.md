# Factories

MCF Factories are the core processing units that implement the factory pattern to provide standardized AI operations. Each factory handles a specific type of AI task while maintaining consistent interfaces and provider routing.

## Factory Pattern Overview

### What are Factories?

Factories in MCF are specialized classes that:

- Encapsulate AI processing logic for specific tasks
- Route requests to appropriate providers automatically
- Handle input/output transformation and validation
- Provide consistent error handling and logging
- Support configuration and customization

### Factory Interface

All factories implement the `Factory<TInput, TOutput>` interface:

```typescript
interface Factory<TInput, TOutput> {
  run(input: TInput, options?: FactoryOptions): Promise<TOutput>;
}

interface FactoryOptions {
  provider?: string; // "openai", "anthropic", etc.
  debug?: boolean;
  metadata?: Record<string, any>;
}
```

## Available Factories

### TranslationFactory

Handles text translation between languages using various AI providers.

#### Input/Output Shapes
```typescript
interface TranslationInput {
  text: string;
  sourceLang?: string;
  targetLang: string;
  preserveFormat?: boolean;
}

interface TranslationOutput {
  translated: string;
  sourceLang?: string;
  targetLang: string;
  provider: string;
  tokens?: number;
}
```

#### Example Usage
```typescript
import { TranslationFactory } from '../core/factories/TranslationFactory';

const factory = new TranslationFactory();

const result = await factory.run({
  text: "Hello, how are you?",
  targetLang: "es",
  preserveFormat: true
}, {
  provider: "openai",
  debug: true
});

console.log(result.translated); // "Hola, ¿cómo estás?"
console.log(result.provider); // "openai"
console.log(result.tokens); // 15
```

### DetectionFactory

Provides AI content detection capabilities including text analysis and voice authentication.

#### Input/Output Shapes
```typescript
// AI Text Detection
interface AIDetectionInput {
  text: string;
}

interface AIDetectionOutput {
  isAI: boolean;
  confidence: number;
  features?: {
    entropy?: number;
    perplexity?: number;
    stylometry?: Record<string, number>;
  };
}

// Fake Voice Detection
interface FakeVoiceDetectionInput {
  audioBuffer: ArrayBuffer;
}

interface FakeVoiceDetectionOutput {
  isFake: boolean;
  confidence: number;
  details?: Record<string, any>;
}
```

#### Example Usage
```typescript
import { DetectionFactory } from '../core/factories/DetectionFactory';

const factory = new DetectionFactory();

// Detect AI-generated text
const textResult = await factory.run({
  type: 'ai',
  text: "Sample text to analyze for AI generation"
});

console.log(`AI confidence: ${(textResult.confidence * 100).toFixed(1)}%`);

// Detect fake voice
const voiceResult = await factory.run({
  type: 'fakeVoice',
  audioBuffer: audioData
});

if (voiceResult.isFake) {
  console.log('Synthetic voice detected');
}
```

### ModerationFactory

Handles content moderation and safety checking.

#### Input/Output Shapes
```typescript
interface ModerationInput {
  text: string;
}

interface ModerationResult {
  safe: boolean;
  categories: string[];
  confidence: number;
  flagged: boolean;
}
```

#### Example Usage
```typescript
import { ModerationFactory } from '../core/factories/ModerationFactory';

const factory = new ModerationFactory();

const result = await factory.run({
  text: "This content needs to be checked for safety"
});

if (!result.safe) {
  console.log('Content flagged:', result.categories);
}
```

### AgentFactory

Provides intelligent text processing agents for summarization, sentiment analysis, and categorization.

#### Input/Output Shapes
```typescript
// Summarization
interface SummarizationInput {
  text: string;
  length?: "short" | "medium" | "long";
}

interface SummarizationOutput {
  summary: string;
  length: string;
}

// Sentiment Analysis
interface SentimentInput {
  text: string;
}

interface SentimentOutput {
  label: "positive" | "neutral" | "negative";
  score: number;
}

// Categorization
interface CategorizationInput {
  text: string;
  tags?: string[];
}

interface CategorizationOutput {
  tags: string[];
  category?: string;
}
```

#### Example Usage
```typescript
import { AgentFactory } from '../core/factories/AgentFactory';

const factory = new AgentFactory();

// Summarize text
const summary = await factory.run({
  type: 'summarization',
  text: longDocument,
  length: 'medium'
});

// Analyze sentiment
const sentiment = await factory.run({
  type: 'sentiment',
  text: "I love this product!"
});

// Categorize content
const categories = await factory.run({
  type: 'categorization',
  text: techArticle,
  tags: ['technology']
});
```

### MediaFactory

Handles media processing tasks including speech-to-text, text-to-speech, and OCR.

#### Input/Output Shapes
```typescript
// Speech-to-Text
interface STTInput {
  audioBuffer: ArrayBuffer;
  language?: string;
}

interface STTOutput {
  text: string;
  language?: string;
}

// Text-to-Speech
interface TTSInput {
  text: string;
  voice?: string;
}

interface TTSOutput {
  audioBuffer: ArrayBuffer;
}

// OCR
interface OCRInput {
  imageBuffer: ArrayBuffer;
}

interface OCROutput {
  text: string;
  blocks?: Array<{ bbox: number[]; text: string }>;
}
```

#### Example Usage
```typescript
import { MediaFactory } from '../core/factories/MediaFactory';

const factory = new MediaFactory();

// Speech-to-text
const transcription = await factory.run({
  type: 'stt',
  audioBuffer: audioData,
  language: 'en'
});

console.log('Transcription:', transcription.text);

// Text-to-speech
const audio = await factory.run({
  type: 'tts',
  text: "Hello world",
  voice: "Rachel"
});

// OCR
const extractedText = await factory.run({
  type: 'ocr',
  imageBuffer: imageData
});

console.log('Extracted text:', extractedText.text);
```

### GuardrailFactory

Provides safety checks and input validation.

#### Input/Output Shapes
```typescript
interface GuardrailInput {
  text: string;
  context?: string;
  userId?: string;
  sessionId?: string;
}

interface GuardrailResult {
  safe: boolean;
  reasons?: string[];
}
```

#### Example Usage
```typescript
import { GuardrailFactory } from '../core/factories/GuardrailFactory';

const factory = new GuardrailFactory();

const result = await factory.run({
  text: userInput,
  context: "User query",
  userId: "user123"
});

if (!result.safe) {
  console.log('Blocked reasons:', result.reasons);
}
```

### TrainingFactory

Manages training data collection, formatting, and export.

#### Input/Output Shapes
```typescript
interface TrainingExample {
  input: string;
  output?: string;
  task: string;
  metadata?: Record<string, any>;
}

interface DatasetBundle {
  manifest: Record<string, any>;
  files: string[];
}
```

#### Example Usage
```typescript
import { TrainingFactory } from '../core/factories/TrainingFactory';

const factory = new TrainingFactory();

const examples: TrainingExample[] = [
  {
    input: "Translate 'Hello' to Spanish",
    output: "Hola",
    task: "translation",
    metadata: { difficulty: "easy" }
  }
];

const dataset = await factory.run(examples, {
  metadata: {
    format: "jsonl",
    shardSize: 1000
  }
});

console.log('Generated files:', dataset.files);
```

### WorkflowFactory

Orchestrates complex multi-step AI processing pipelines.

#### Input/Output Shapes
```typescript
interface WorkflowInput {
  pipeline: PipelineDefinition;
  initialData: any;
}

interface PipelineResult<T = any> {
  success: boolean;
  data: T;
  logs: string[];
}

interface PipelineDefinition {
  name: string;
  steps: PipelineStep[];
}

interface PipelineStep {
  type: string;
  options?: Record<string, any>;
}
```

#### Example Usage
```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

const factory = new WorkflowFactory();

const pipeline: PipelineDefinition = {
  name: "Content Processing Pipeline",
  steps: [
    {
      type: "guardrail",
      options: { checkType: "input_validation" }
    },
    {
      type: "moderation",
      options: {}
    },
    {
      type: "translate",
      options: { targetLang: "es" }
    },
    {
      type: "agent",
      options: { task: "summarize", length: "short" }
    }
  ]
};

const result = await factory.run({
  pipeline,
  initialData: "Text to process"
});

if (result.success) {
  console.log('Final result:', result.data);
  console.log('Processing logs:', result.logs);
}
```

## Provider Routing

### Automatic Routing

Factories automatically route requests to appropriate providers based on:

- Task type and requirements
- Provider capabilities and performance
- Configuration preferences
- Cost and availability considerations

```typescript
// Automatic routing examples
await translationFactory.run(input); // Routes to OpenAI by default
await detectionFactory.run(input);   // Routes to specialized detection provider
await agentFactory.run(input);       // Routes to Claude for reasoning tasks
```

### Manual Provider Selection

Override automatic routing for specific requirements:

```typescript
const result = await factory.run(input, {
  provider: "anthropic" // Force specific provider
});
```

### Provider Fallback

Factories include automatic fallback mechanisms:

```typescript
// If primary provider fails, automatically try alternatives
const result = await factory.run(input, {
  metadata: {
    fallbackProviders: ["anthropic", "gemini"]
  }
});
```

## Factory Configuration

Configure factory behavior through MCF configuration:

```json
{
  "defaults": {
    "translation": {
      "targetLang": "en",
      "preserveFormat": true
    },
    "detection": {
      "aiThreshold": 0.8,
      "fakeVoiceThreshold": 0.7
    },
    "agents": {
      "summaryLength": "medium"
    }
  }
}
```

## Error Handling

Factories provide consistent error handling:

```typescript
try {
  const result = await factory.run(input);
} catch (error) {
  switch (error.code) {
    case 'PROVIDER_ERROR':
      console.log('Provider error:', error.message);
      break;
    case 'VALIDATION_ERROR':
      console.log('Input validation failed');
      break;
    case 'TIMEOUT_ERROR':
      console.log('Operation timed out');
      break;
    default:
      console.error('Unknown error:', error);
  }
}
```

## Performance Optimization

### Caching
```typescript
// Cache factory results for repeated inputs
const cache = new Map();

async function cachedFactory(input) {
  const key = hash(input);
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await factory.run(input);
  cache.set(key, result);
  return result;
}
```

### Batch Processing
```typescript
// Process multiple requests efficiently
const batchResults = await Promise.all(
  inputs.map(input => factory.run(input))
);
```

### Streaming
```typescript
// Handle streaming responses
const stream = factory.createStream(input);
stream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});
stream.on('end', () => {
  console.log('Stream complete');
});
```

## Extending Factories

### Custom Factory Implementation

```typescript
import { Factory, FactoryOptions } from '../../types';

class CustomFactory implements Factory<CustomInput, CustomOutput> {
  async run(input: CustomInput, options?: FactoryOptions): Promise<CustomOutput> {
    // Custom logic here
    const provider = getProvider(options?.provider);

    // Transform input
    const processedInput = this.transformInput(input);

    // Call provider
    const response = await provider.callModel({
      model: 'custom-model',
      input: processedInput,
      options: options?.metadata
    });

    // Transform output
    return this.transformOutput(response);
  }

  private transformInput(input: CustomInput): any {
    // Input transformation logic
  }

  private transformOutput(response: any): CustomOutput {
    // Output transformation logic
  }
}
```

### Factory Registration

```typescript
// Register custom factory
import { FactoryRegistry } from '../core/factories/FactoryRegistry';

FactoryRegistry.register('custom', new CustomFactory());
```

## Best Practices

1. **Consistent Interfaces**: All factories follow the same input/output patterns
2. **Error Resilience**: Implement proper error handling and fallbacks
3. **Performance Monitoring**: Track factory performance and latency
4. **Configuration Management**: Use configuration for customizable behavior
5. **Testing**: Thoroughly test factory implementations
6. **Documentation**: Document input/output shapes and usage examples

## Integration with Services

Factories are used by higher-level services:

```typescript
// Service uses factory internally
class TranslationService {
  private factory = new TranslationFactory();

  async translateText(text: string, targetLang: string): Promise<string> {
    const result = await this.factory.run({
      text,
      targetLang
    });

    return result.translated;
  }
}
```

## Factory Registry

MCF maintains a registry of all available factories:

```typescript
import { FactoryRegistry } from '../core/factories/FactoryRegistry';

// Get factory by type
const translationFactory = FactoryRegistry.get('translation');
const detectionFactory = FactoryRegistry.get('detection');

// List all available factories
const availableFactories = FactoryRegistry.list();
console.log('Available factories:', availableFactories);
```
