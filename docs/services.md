# Services

MCF Services provide high-level, easy-to-use APIs for common AI operations. Services combine factories with additional logic, convenience methods, and service-specific features to offer streamlined access to MCF capabilities.

## Service Overview

Services are organized by functional area and provide simplified interfaces for complex operations. Each service handles provider routing, error management, and response formatting automatically.

## Translation Services

### Text Translation Service

Translate text between languages with automatic provider selection and format preservation.

#### Functions
- `translateText(text, targetLang, sourceLang?, preserveFormat?)`
- `batchTranslate(texts, targetLang, options?)`
- `detectLanguage(text)`

#### Example
```typescript
import { translateText, detectLanguage } from '../services/translation/translateText';

// Simple translation
const translated = await translateText("Hello world", "es");
console.log(translated); // "Hola mundo"

// Language detection
const detected = await detectLanguage("Bonjour le monde");
console.log(detected.language); // "fr"
console.log(detected.confidence); // 0.99

// Batch translation
const translations = await batchTranslate([
  "Hello", "Goodbye", "Thank you"
], "es");
console.log(translations);
// ["Hola", "Adiós", "Gracias"]
```

### Voice Translation Services

#### Speech-to-Text Service
```typescript
import { speechToText } from '../services/translation/voice/speechToText';

const transcription = await speechToText({
  audioBuffer: audioData,
  language: 'en'
});

console.log(transcription.text);
console.log(transcription.confidence);
console.log(transcription.language);
```

#### Text-to-Speech Service
```typescript
import { textToSpeech } from '../services/translation/voice/textToSpeech';

const audio = await textToSpeech({
  text: "Hello, how are you?",
  voice: 'Rachel',
  language: 'en'
});

// audio is ArrayBuffer containing synthesized speech
```

#### Voice-to-Voice Translation Service
```typescript
import { translateVoice } from '../services/translation/voice/voiceToVoiceTranslate';

const translatedAudio = await translateVoice({
  audioBuffer: inputAudio,
  sourceLang: 'en',
  targetLang: 'es',
  voice: 'Carlos'
});
```

## Detection Services

### AI Detection Service

Detect AI-generated content in text and voice.

#### Functions
- `detectAIText(text)`
- `detectFakeVoice(audioBuffer)`

#### Example
```typescript
import { detectAIText } from '../services/detection/detectAIText';
import { detectFakeVoice } from '../services/detection/detectFakeVoice';

// Text AI detection
const textResult = await detectAIText("This is a sample text to analyze.");
console.log(textResult.isAI); // false
console.log(textResult.confidence); // 0.12

// Voice AI detection
const voiceResult = await detectFakeVoice(audioBuffer);
console.log(voiceResult.isFake); // false
console.log(voiceResult.confidence); // 0.08
```

## Moderation Services

### Content Moderation Service

Check content for inappropriate material and safety violations.

#### Functions
- `moderateText(text)`
- `moderateImage(imageBuffer)`

#### Example
```typescript
import { moderateText } from '../services/moderation/moderateText';
import { moderateImage } from '../services/moderation/moderateImage';

const textResult = await moderateText("This content needs to be checked.");
console.log(textResult.safe); // true
console.log(textResult.categories); // []

const imageResult = await moderateImage(imageBuffer);
console.log(imageResult.safe); // true
console.log(imageResult.flagged); // false
```

## Agent Services

### Text Analysis Agents

Intelligent text processing and analysis agents.

#### Summarization Service
```typescript
import { summarizeText } from '../services/agents/summarizeText';

const summary = await summarizeText(
  "Long article text...",
  "medium" // "short" | "medium" | "long"
);
console.log(summary);
```

#### Sentiment Analysis Service
```typescript
import { analyzeSentiment } from '../services/agents/analyzeSentiment';

const sentiment = await analyzeSentiment("I love this product!");
console.log(sentiment.label); // "positive"
console.log(sentiment.score); // 0.92
```

#### Categorization Service
```typescript
import { categorizeText } from '../services/agents/categorizeText';

const categories = await categorizeText(
  "The new JavaScript framework release includes significant improvements...",
  ["technology", "programming"] // optional hints
);
console.log(categories.tags); // ["javascript", "framework", "web-development"]
```

## Media Services

### Audio Processing Services

#### Speech-to-Text
```typescript
import { speechToText } from '../services/media/speechToText';

const result = await speechToText({
  audioBuffer: audioData,
  language: 'en',
  options: {
    timestamps: true,
    speakerDiarization: false
  }
});

console.log(result.text);
console.log(result.segments); // With timestamps if requested
```

#### Text-to-Speech
```typescript
import { textToSpeech } from '../services/media/textToSpeech';

const result = await textToSpeech({
  text: "Hello world",
  voice: 'Matthew',
  language: 'en',
  options: {
    speed: 1.0,
    pitch: 0.0,
    style: 'neutral'
  }
});

console.log(result.audioBuffer); // ArrayBuffer
console.log(result.duration); // Estimated duration in seconds
```

### Image Processing Services

#### OCR Service
```typescript
import { extractTextFromImage } from '../services/media/ocr';

const result = await extractTextFromImage({
  imageBuffer: imageData,
  options: {
    language: 'en',
    detectOrientation: true,
    preserveFormatting: true
  }
});

console.log(result.text);
console.log(result.blocks); // Text blocks with coordinates
```

#### Image Captioning Service
```typescript
import { captionImage } from '../services/media/captionImage';

const result = await captionImage({
  imageBuffer: imageData,
  options: {
    maxLength: 50,
    language: 'en'
  }
});

console.log(result.caption); // "A cat sitting on a windowsill looking outside"
console.log(result.confidence); // 0.89
```

## Transformation Services

### Data Transformation Service

Clean, normalize, and transform data for processing.

#### Functions
- `cleanText(text, options)`
- `normalizeUnicode(text)`
- `filterProfanity(text)`
- `extractKeywords(text)`

#### Example
```typescript
import { cleanText, extractKeywords } from '../services/transformation/dataTransformation';

const cleaned = await cleanText("  Hello   WORLD!   ", {
  normalizeCase: true,
  removeExtraSpaces: true,
  removePunctuation: false
});
console.log(cleaned); // "hello world!"

const keywords = await extractKeywords(
  "Machine learning and artificial intelligence are transforming technology.",
  { maxKeywords: 5 }
);
console.log(keywords); // ["machine learning", "artificial intelligence", "technology"]
```

## Training Services

### Dataset Management Service

Manage training data collection and export.

#### Functions
- `collectTrainingData(sources)`
- `validateDataset(data)`
- `exportDataset(data, format)`

#### Example
```typescript
import { collectTrainingData, exportDataset } from '../services/training/datasetManager';

const trainingData = await collectTrainingData([
  { type: 'api', endpoint: '/conversations' },
  { type: 'files', pattern: '*.txt' }
]);

const exported = await exportDataset(trainingData, {
  format: 'jsonl',
  shardSize: 1000,
  outputDir: './datasets'
});

console.log(exported.files); // ["dataset_001.jsonl", "dataset_002.jsonl"]
```

## Service Architecture

### Service Layers

Services are built on top of factories and provide additional functionality:

```
┌─────────────────────────────────┐
│         Service Layer           │ ← High-level APIs, validation, convenience methods
├─────────────────────────────────┤
│        Factory Layer            │ ← Core processing, provider routing
├─────────────────────────────────┤
│       Provider Layer            │ ← AI API communication
└─────────────────────────────────┘
```

### Service Responsibilities

1. **Input Validation**: Validate and sanitize service inputs
2. **Parameter Mapping**: Convert service parameters to factory inputs
3. **Response Formatting**: Format factory outputs for service consumers
4. **Error Handling**: Service-specific error handling and recovery
5. **Convenience Methods**: High-level operations combining multiple factories

### Service Discovery

Services can be discovered and used dynamically:

```typescript
import { ServiceRegistry } from '../core/services/ServiceRegistry';

// Get service by name
const translationService = ServiceRegistry.get('translation');
const moderationService = ServiceRegistry.get('moderation');

// List available services
const services = ServiceRegistry.list();
console.log(services); // ["translation", "detection", "moderation", ...]
```

## Configuration

Configure services through MCF configuration:

```json
{
  "defaults": {
    "services": {
      "translation": {
        "defaultProvider": "openai",
        "preserveFormat": true,
        "cacheEnabled": true
      },
      "detection": {
        "aiThreshold": 0.8,
        "voiceThreshold": 0.7
      },
      "moderation": {
        "defaultCategories": ["hate", "violence"],
        "strictMode": false
      }
    }
  }
}
```

## Error Handling

Services provide consistent error handling:

```typescript
import { ServiceError } from '../types';

try {
  const result = await translateText(text, targetLang);
} catch (error) {
  if (error instanceof ServiceError) {
    switch (error.code) {
      case 'SERVICE_INPUT_INVALID':
        console.log('Invalid input:', error.details);
        break;
      case 'SERVICE_PROVIDER_ERROR':
        console.log('Provider error, trying fallback');
        break;
      case 'SERVICE_TIMEOUT':
        console.log('Service timeout');
        break;
    }
  }
}
```

## Performance Optimization

### Caching
```typescript
// Services include built-in caching
const result1 = await translateText("Hello", "es"); // Cache miss
const result2 = await translateText("Hello", "es"); // Cache hit
```

### Batching
```typescript
// Batch operations for efficiency
const results = await Promise.all([
  translateText("Hello", "es"),
  translateText("Goodbye", "fr"),
  moderateText("Content")
]);
```

### Streaming
```typescript
// Streaming responses for large data
const stream = await speechToText.createStream();
stream.on('data', (chunk) => {
  console.log('Transcription chunk:', chunk);
});
```

## Service Integration

### Combining Services

Services can be easily combined for complex operations:

```typescript
async function processUserContent(content: string, image?: Buffer) {
  // Step 1: Moderate text
  const moderation = await moderateText(content);
  if (!moderation.safe) {
    throw new Error('Content flagged by moderation');
  }

  // Step 2: Extract keywords
  const keywords = await extractKeywords(content);

  // Step 3: Analyze sentiment
  const sentiment = await analyzeSentiment(content);

  // Step 4: Process image if provided
  let caption;
  if (image) {
    caption = await captionImage({ imageBuffer: image });
  }

  // Step 5: Categorize content
  const categories = await categorizeText(content, keywords);

  return {
    safe: moderation.safe,
    keywords,
    sentiment,
    caption,
    categories
  };
}
```

### Service Pipelines

Create service-level pipelines using workflow factories:

```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

const contentAnalysisPipeline = WorkflowFactory.createContentProcessingWorkflow();

// Pipeline includes:
// 1. Text cleaning and normalization
// 2. Content moderation
// 3. Keyword extraction
// 4. Sentiment analysis
// 5. Categorization

const result = await contentAnalysisPipeline.run({
  initialData: userContent
});
```

## Testing Services

### Unit Testing
```typescript
import { translateText } from '../services/translation/translateText';

describe('Translation Service', () => {
  test('translates English to Spanish', async () => {
    const result = await translateText('Hello', 'es');
    expect(result).toBe('Hola');
  });

  test('handles empty input', async () => {
    await expect(translateText('', 'es')).rejects.toThrow('Empty input');
  });
});
```

### Integration Testing
```typescript
describe('Service Integration', () => {
  test('end-to-end content processing', async () => {
    const content = "This is test content for processing.";

    // Test full pipeline
    const result = await processUserContent(content);

    expect(result).toHaveProperty('safe');
    expect(result).toHaveProperty('keywords');
    expect(result).toHaveProperty('sentiment');
    expect(result).toHaveProperty('categories');
  });
});
```

## Service Extensions

### Custom Service Implementation

```typescript
class CustomTranslationService {
  private factory = new TranslationFactory();

  async translateWithGlossary(text: string, targetLang: string, glossary: Record<string, string>) {
    // Pre-process with glossary
    let processedText = text;
    for (const [term, translation] of Object.entries(glossary)) {
      processedText = processedText.replace(
        new RegExp(term, 'gi'),
        translation
      );
    }

    // Translate
    return await this.factory.run({
      text: processedText,
      targetLang
    });
  }
}
```

### Service Registration

```typescript
import { ServiceRegistry } from '../core/services/ServiceRegistry';

ServiceRegistry.register('custom-translation', new CustomTranslationService());
```

## Monitoring and Analytics

Track service usage and performance:

```typescript
// Service metrics
const metrics = {
  recordServiceCall(service: string, method: string, duration: number, success: boolean) {
    // Record metrics for monitoring
  },

  getServiceStats(service: string) {
    // Return usage statistics
    return {
      totalCalls: 1250,
      successRate: 0.98,
      averageResponseTime: 250,
      errorRate: 0.02
    };
  }
};
```

## Best Practices

1. **Input Validation**: Always validate inputs before processing
2. **Error Handling**: Implement comprehensive error handling for all services
3. **Caching Strategy**: Use appropriate caching for frequently accessed data
4. **Batch Operations**: Prefer batch operations for multiple items
5. **Resource Management**: Monitor and limit resource usage
6. **Monitoring**: Track service performance and errors
7. **Documentation**: Document service inputs, outputs, and behavior
8. **Testing**: Thoroughly test services with various inputs and scenarios

## Service Compatibility

| Service | Text | Image | Audio | Video | Streaming | Batch |
|---------|------|-------|-------|-------|-----------|-------|
| Translation | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Detection | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Moderation | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Agents | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Media | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Training | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

## Migration Guide

### From Direct Factory Usage

```typescript
// Old: Direct factory usage
const factory = new TranslationFactory();
const result = await factory.run({ text, targetLang });

// New: Service usage
const result = await translateText(text, targetLang);
```

### From Custom Implementations

```typescript
// Old: Custom translation logic
async function translate(text, lang) {
  // Custom logic
}

// New: Extend service
class CustomTranslationService extends TranslationService {
  async translateWithCustomLogic(text, lang) {
    // Extended logic
  }
}
```

This service layer provides a clean, consistent API for accessing MCF capabilities while maintaining the flexibility and power of the underlying factory system.
