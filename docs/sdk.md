# SDK

The MCF SDK provides a simple, unified interface for accessing all MCF capabilities. It combines factories, services, and workflows into a single, easy-to-use client that handles provider routing, error management, and response formatting automatically.

## Installation

Install MCF using npm or yarn:

```bash
npm install mcf
# or
yarn add mcf
```

## Quick Start

Basic usage with automatic provider selection:

```typescript
import { MCF } from 'mcf';

// Initialize the client
const client = new MCF();

// Translate text
const translation = await client.translate('Hello world', 'es');
console.log(translation); // "Hola mundo"

// Detect AI content
const isAI = await client.detectAI('Sample text to analyze');
console.log(isAI); // false

// Moderate content
const moderation = await client.moderate('Content to check');
console.log(moderation.safe); // true
```

## Client Configuration

Configure the SDK client with custom settings:

```typescript
import { MCF } from 'mcf';

// Basic configuration
const client = new MCF({
  provider: 'openai', // Default provider
  debug: true,        // Enable debug logging
  timeout: 30000      // Request timeout in ms
});

// Advanced configuration
const advancedClient = new MCF({
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4',
      options: { temperature: 0.3 }
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-sonnet-20240229'
    }
  },
  defaults: {
    translation: {
      preserveFormat: true,
      targetLang: 'en'
    },
    moderation: {
      categories: ['hate', 'violence']
    }
  },
  guardrails: {
    enabled: true,
    bannedTopics: ['politics', 'violence']
  }
});
```

## Core Methods

### Translation

#### translate(text, targetLang, options?)
Translate text between languages.

**Parameters:**
- `text`: string - Text to translate
- `targetLang`: string - Target language code (e.g., 'es', 'fr', 'de')
- `options?`: object - Additional options

**Options:**
- `sourceLang?`: string - Source language code (auto-detected if not provided)
- `preserveFormat?`: boolean - Preserve original formatting (default: true)
- `provider?`: string - Specific provider to use

**Returns:** Promise<string> - Translated text

**Example:**
```typescript
// Basic translation
const spanish = await client.translate('Hello world', 'es');
console.log(spanish); // "Hola mundo"

// Advanced translation
const result = await client.translate(
  'Important: Review the Q3 report by Friday.',
  'fr',
  {
    preserveFormat: true,
    provider: 'anthropic'
  }
);
console.log(result); // "Important: Examiner le rapport T3 d'ici vendredi."
```

#### translateBatch(texts, targetLang, options?)
Translate multiple texts efficiently.

**Parameters:**
- `texts`: string[] - Array of texts to translate
- `targetLang`: string - Target language code
- `options?`: object - Additional options

**Returns:** Promise<string[]> - Array of translated texts

**Example:**
```typescript
const texts = [
  'Hello',
  'How are you?',
  'Thank you very much'
];

const translations = await client.translateBatch(texts, 'es');
console.log(translations);
// ["Hola", "¿Cómo estás?", "Muchas gracias"]
```

### Detection

#### detectAI(text, options?)
Detect AI-generated text content.

**Parameters:**
- `text`: string - Text to analyze
- `options?`: object - Additional options

**Options:**
- `threshold?`: number - Confidence threshold (default: 0.8)
- `provider?`: string - Specific provider to use

**Returns:** Promise<boolean> - True if text appears AI-generated

**Example:**
```typescript
const isAI = await client.detectAI(
  'This is a sample text that may or may not be AI-generated.'
);
console.log(isAI); // false

// With detailed results
const result = await client.detectAI(text, { detailed: true });
console.log(result.isAI);        // false
console.log(result.confidence);  // 0.15
console.log(result.features);    // { perplexity: 42.3, entropy: 3.7 }
```

#### detectFakeVoice(audioBuffer, options?)
Detect synthetic voice audio.

**Parameters:**
- `audioBuffer`: ArrayBuffer - Audio data to analyze
- `options?`: object - Additional options

**Options:**
- `threshold?`: number - Confidence threshold (default: 0.7)
- `provider?`: string - Specific provider to use

**Returns:** Promise<boolean> - True if voice appears synthetic

**Example:**
```typescript
// Load audio file
const audioBuffer = await loadAudioFile('voice_sample.wav');

const isFake = await client.detectFakeVoice(audioBuffer);
console.log(isFake); // false

// With detailed analysis
const result = await client.detectFakeVoice(audioBuffer, { detailed: true });
console.log(result.isFake);     // false
console.log(result.confidence); // 0.12
console.log(result.details);    // { spectralAnalysis: {...}, ... }
```

### Moderation

#### moderate(text, options?)
Check text content for safety and compliance.

**Parameters:**
- `text`: string - Text to moderate
- `options?`: object - Additional options

**Options:**
- `categories?`: string[] - Categories to check
- `threshold?`: number - Confidence threshold
- `provider?`: string - Specific provider to use

**Returns:** Promise<ModerationResult>

**ModerationResult:**
```typescript
interface ModerationResult {
  safe: boolean;
  categories: string[];
  confidence: number;
  flagged: boolean;
  details?: any;
}
```

**Example:**
```typescript
const result = await client.moderate('This is safe content.');
console.log(result.safe);      // true
console.log(result.categories); // []

// Check specific categories
const customResult = await client.moderate(text, {
  categories: ['hate', 'violence', 'adult'],
  threshold: 0.9
});

if (!customResult.safe) {
  console.log('Flagged categories:', customResult.categories);
  // Handle unsafe content
}
```

#### moderateImage(imageBuffer, options?)
Analyze images for inappropriate content.

**Parameters:**
- `imageBuffer`: ArrayBuffer - Image data to analyze
- `options?`: object - Additional options

**Options:**
- `categories?`: string[] - Categories to check
- `threshold?`: number - Confidence threshold

**Returns:** Promise<ModerationResult>

**Example:**
```typescript
const imageBuffer = await loadImageFile('image.jpg');

const result = await client.moderateImage(imageBuffer);
console.log(result.safe);      // true
console.log(result.categories); // []

if (!result.safe) {
  console.log('Image flagged for:', result.categories);
}
```

### Agents

#### summarize(text, length?, options?)
Generate text summaries.

**Parameters:**
- `text`: string - Text to summarize
- `length?`: 'short' | 'medium' | 'long' - Summary length (default: 'medium')
- `options?`: object - Additional options

**Returns:** Promise<string> - Generated summary

**Example:**
```typescript
const summary = await client.summarize(
  `Long article text about artificial intelligence...`,
  'medium'
);
console.log(summary);

// With options
const shortSummary = await client.summarize(longText, 'short', {
  provider: 'anthropic'
});
```

#### analyzeSentiment(text, options?)
Analyze text sentiment.

**Parameters:**
- `text`: string - Text to analyze
- `options?`: object - Additional options

**Returns:** Promise<SentimentResult>

**SentimentResult:**
```typescript
interface SentimentResult {
  label: 'positive' | 'neutral' | 'negative';
  score: number; // 0-1 confidence score
}
```

**Example:**
```typescript
const sentiment = await client.analyzeSentiment(
  'I love this new product! It works perfectly.'
);

console.log(sentiment.label); // "positive"
console.log(sentiment.score);  // 0.92
```

#### categorize(text, options?)
Categorize and tag content.

**Parameters:**
- `text`: string - Text to categorize
- `options?`: object - Additional options

**Options:**
- `tags?`: string[] - Hint tags to guide categorization

**Returns:** Promise<CategorizationResult>

**CategorizationResult:**
```typescript
interface CategorizationResult {
  tags: string[];
  category?: string;
  confidence?: number;
}
```

**Example:**
```typescript
const categories = await client.categorize(
  'React is a popular JavaScript library for building user interfaces.',
  { tags: ['technology', 'programming'] }
);

console.log(categories.tags);    // ["javascript", "react", "frontend", "web-development"]
console.log(categories.category); // "Technology/Web Development"
```

### Media Processing

#### speechToText(audioBuffer, options?)
Convert speech to text.

**Parameters:**
- `audioBuffer`: ArrayBuffer - Audio data
- `options?`: object - Additional options

**Options:**
- `language?`: string - Language code (default: 'en')
- `timestamps?`: boolean - Include timestamps

**Returns:** Promise<SpeechToTextResult>

**SpeechToTextResult:**
```typescript
interface SpeechToTextResult {
  text: string;
  language?: string;
  confidence?: number;
  segments?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}
```

**Example:**
```typescript
const audioBuffer = await loadAudioFile('speech.wav');

const result = await client.speechToText(audioBuffer, {
  language: 'en',
  timestamps: true
});

console.log(result.text);
console.log(result.segments); // With timing information
```

#### textToSpeech(text, options?)
Convert text to speech.

**Parameters:**
- `text`: string - Text to convert
- `options?`: object - Additional options

**Options:**
- `voice?`: string - Voice to use (default: 'Matthew')
- `language?`: string - Language code (default: 'en')
- `speed?`: number - Speech speed (default: 1.0)

**Returns:** Promise<ArrayBuffer> - Audio data

**Example:**
```typescript
const audioBuffer = await client.textToSpeech(
  'Hello, this is a test of text-to-speech conversion.',
  {
    voice: 'Rachel',
    language: 'en',
    speed: 1.2
  }
);

// Save or play the audio
await saveAudioFile('output.wav', audioBuffer);
```

#### extractTextFromImage(imageBuffer, options?)
Extract text from images using OCR.

**Parameters:**
- `imageBuffer`: ArrayBuffer - Image data
- `options?`: object - Additional options

**Options:**
- `language?`: string - Language for OCR (default: 'en')

**Returns:** Promise<OCRResult>

**OCRResult:**
```typescript
interface OCRResult {
  text: string;
  confidence?: number;
  blocks?: Array<{
    text: string;
    bbox: number[]; // [x, y, width, height]
    confidence: number;
  }>;
}
```

**Example:**
```typescript
const imageBuffer = await loadImageFile('document.png');

const result = await client.extractTextFromImage(imageBuffer, {
  language: 'en'
});

console.log(result.text);
console.log(result.blocks); // Text blocks with positions
```

#### captionImage(imageBuffer, options?)
Generate captions for images.

**Parameters:**
- `imageBuffer`: ArrayBuffer - Image data
- `options?`: object - Additional options

**Options:**
- `maxLength?`: number - Maximum caption length (default: 50)

**Returns:** Promise<ImageCaptionResult>

**ImageCaptionResult:**
```typescript
interface ImageCaptionResult {
  caption: string;
  confidence?: number;
}
```

**Example:**
```typescript
const imageBuffer = await loadImageFile('photo.jpg');

const result = await client.captionImage(imageBuffer, {
  maxLength: 30
});

console.log(result.caption); // "A cat sitting on a windowsill looking outside"
console.log(result.confidence); // 0.89
```

## Advanced Usage

### Custom Providers

Use specific providers for operations:

```typescript
// Force specific provider
const result = await client.translate('Hello', 'es', {
  provider: 'anthropic'
});

// Provider-specific options
const customResult = await client.summarize(longText, 'medium', {
  provider: 'openai',
  options: {
    temperature: 0.3,
    max_tokens: 200
  }
});
```

### Workflows

Execute complex pipelines through the SDK:

```typescript
import { WorkflowFactory } from 'mcf';

const workflowClient = new MCF({
  workflowFactory: new WorkflowFactory()
});

// Execute predefined workflow
const result = await workflowClient.executeWorkflow('content-analysis', {
  text: 'Content to analyze',
  targetLang: 'es'
});

// Create custom workflow
const customWorkflow = await workflowClient.createWorkflow({
  name: 'custom-analysis',
  steps: [
    { type: 'moderate', options: {} },
    { type: 'translate', options: { targetLang: 'fr' } },
    { type: 'summarize', options: { length: 'short' } }
  ]
});

const customResult = await workflowClient.executeWorkflow(customWorkflow, {
  text: 'Text to process through custom workflow'
});
```

### Streaming

Handle streaming responses for real-time applications:

```typescript
// Streaming translation for large documents
const stream = await client.createTranslationStream({
  targetLang: 'es',
  chunkSize: 1000
});

stream.on('data', (chunk) => {
  console.log('Translated chunk:', chunk);
  // Process chunk immediately
});

stream.on('end', () => {
  console.log('Translation complete');
});

// Feed text to stream
await stream.write(largeDocument);
await stream.end();
```

### Batch Operations

Process multiple items efficiently:

```typescript
// Batch different operations
const batch = client.createBatch();

batch.addTranslation('Hello', 'es');
batch.addTranslation('Goodbye', 'fr');
batch.addModeration('Content to check');
batch.addSentimentAnalysis('Great product!');

// Execute all operations
const results = await batch.execute();

console.log(results.translations); // ["Hola", "Au revoir"]
console.log(results.moderations);  // [ModerationResult, ...]
console.log(results.sentiments);    // [SentimentResult, ...]
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
  const result = await client.translate('Hello', 'es');
} catch (error) {
  switch (error.code) {
    case 'SDK_INVALID_INPUT':
      console.log('Invalid input parameters');
      break;
    case 'SDK_PROVIDER_ERROR':
      console.log('Provider error:', error.message);
      // Try fallback provider
      const fallback = await client.translate('Hello', 'es', {
        provider: 'anthropic'
      });
      break;
    case 'SDK_TIMEOUT':
      console.log('Operation timed out');
      break;
    case 'SDK_QUOTA_EXCEEDED':
      console.log('API quota exceeded');
      break;
    default:
      console.error('Unknown error:', error);
  }
}
```

## Configuration

Configure SDK behavior through environment variables or programmatic config:

```typescript
// Environment variables
process.env.MCF_DEFAULT_PROVIDER = 'openai';
process.env.MCF_DEBUG = 'true';
process.env.MCF_TIMEOUT = '30000';

// Programmatic configuration
const client = new MCF({
  defaultProvider: 'openai',
  debug: true,
  timeout: 30000,
  cache: {
    enabled: true,
    ttl: 3600000 // 1 hour
  },
  retry: {
    maxAttempts: 3,
    backoff: 'exponential'
  }
});
```

## Best Practices

### Initialization
1. **Single Client Instance**: Reuse client instances across your application
2. **Environment-Specific Config**: Use different configurations for dev/staging/prod
3. **Error Handling**: Always wrap SDK calls in try-catch blocks
4. **Resource Management**: Properly dispose of clients when shutting down

### Performance
1. **Caching**: Enable caching for frequently accessed data
2. **Batching**: Use batch operations for multiple similar requests
3. **Streaming**: Use streaming for large data processing
4. **Timeouts**: Set appropriate timeouts for your use case

### Security
1. **Input Validation**: Validate all inputs before passing to SDK
2. **Output Sanitization**: Sanitize SDK outputs before using in your application
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Audit Logging**: Log SDK usage for security monitoring

### Reliability
1. **Fallback Providers**: Configure fallback providers for high availability
2. **Circuit Breakers**: Use circuit breakers to prevent cascade failures
3. **Retry Logic**: Implement appropriate retry strategies
4. **Monitoring**: Monitor SDK performance and error rates

## API Reference

### Client Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `translate(text, targetLang, options?)` | string, string, object? | Promise<string> | Translate text |
| `translateBatch(texts, targetLang, options?)` | string[], string, object? | Promise<string[]> | Translate multiple texts |
| `detectAI(text, options?)` | string, object? | Promise<boolean \| DetectionResult> | Detect AI-generated text |
| `detectFakeVoice(audioBuffer, options?)` | ArrayBuffer, object? | Promise<boolean \| DetectionResult> | Detect synthetic voice |
| `moderate(text, options?)` | string, object? | Promise<ModerationResult> | Moderate text content |
| `moderateImage(imageBuffer, options?)` | ArrayBuffer, object? | Promise<ModerationResult> | Moderate image content |
| `summarize(text, length?, options?)` | string, string?, object? | Promise<string> | Generate text summary |
| `analyzeSentiment(text, options?)` | string, object? | Promise<SentimentResult> | Analyze text sentiment |
| `categorize(text, options?)` | string, object? | Promise<CategorizationResult> | Categorize content |
| `speechToText(audioBuffer, options?)` | ArrayBuffer, object? | Promise<SpeechToTextResult> | Convert speech to text |
| `textToSpeech(text, options?)` | string, object? | Promise<ArrayBuffer> | Convert text to speech |
| `extractTextFromImage(imageBuffer, options?)` | ArrayBuffer, object? | Promise<OCRResult> | Extract text from images |
| `captionImage(imageBuffer, options?)` | ArrayBuffer, object? | Promise<ImageCaptionResult> | Generate image captions |

### Client Options

```typescript
interface ClientOptions {
  provider?: string;              // Default provider
  debug?: boolean;                // Enable debug logging
  timeout?: number;               // Request timeout in ms
  cache?: {
    enabled?: boolean;            // Enable caching
    ttl?: number;                 // Cache TTL in ms
  };
  retry?: {
    maxAttempts?: number;         // Max retry attempts
    backoff?: 'fixed' | 'exponential'; // Retry backoff strategy
  };
  providers?: ProviderConfigMap;  // Provider configurations
  defaults?: DefaultModuleConfig; // Default configurations
}
```

## Troubleshooting

### Common Issues

**Configuration Error**
```
Error: Provider not configured
Solution: Set API keys in environment variables or configuration
```

**Timeout Error**
```
Error: Operation timed out
Solution: Increase timeout or check network connectivity
```

**Quota Exceeded**
```
Error: API quota exceeded
Solution: Check usage limits or switch to different provider
```

**Invalid Input**
```
Error: Invalid input format
Solution: Validate input data before calling SDK methods
```

**Provider Unavailable**
```
Error: Provider temporarily unavailable
Solution: Try different provider or implement retry logic
```

This SDK provides a comprehensive, easy-to-use interface for accessing all MCF capabilities while handling the complexity of provider management, error handling, and optimization internally.
