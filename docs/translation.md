# Translation

MCF provides comprehensive translation capabilities across text and voice modalities. The translation system uses multiple AI providers and includes advanced features like format preservation, automatic language detection, and voice-to-voice translation.

## Text Translation

Translate text between languages with high accuracy and format preservation.

### Features
- **Multi-Provider Support**: Automatic routing to optimal providers (OpenAI, Anthropic, Gemini, Cohere)
- **Language Detection**: Automatic source language detection
- **Format Preservation**: Maintains original formatting, structure, and special characters
- **Batch Translation**: Process multiple texts efficiently
- **Glossary Support**: Custom terminology and brand name handling
- **Real-time Translation**: Low-latency processing for interactive applications

### Basic Text Translation

```typescript
import { TranslationFactory } from '../core/factories/TranslationFactory';

const factory = new TranslationFactory();

// Simple translation
const result = await factory.run({
  text: "Hello, how are you today?",
  targetLang: "es"
});

console.log(result.translated); // "Hola, ¿cómo estás hoy?"
console.log(result.sourceLang); // "en" (auto-detected)
console.log(result.targetLang); // "es"
console.log(result.provider);   // "openai"
```

### Advanced Translation Options

```typescript
// Translation with format preservation
const formattedResult = await factory.run({
  text: "Important: Please review the **Q3 financial report** by Friday.",
  targetLang: "fr",
  preserveFormat: true
});

console.log(formattedResult.translated);
// "Important: Veuillez examiner le **rapport financier du T3** d'ici vendredi."

// Translation with explicit source language
const explicitResult = await factory.run({
  text: "Bonjour, comment allez-vous?",
  sourceLang: "fr",
  targetLang: "de"
});

console.log(explicitResult.translated); // "Hallo, wie geht es Ihnen?"
```

### Service-Level API

For simpler usage, use the translation service:

```typescript
import { translateText } from '../services/translation/translateText';

// Direct function call
const translated = await translateText(
  "The meeting is scheduled for tomorrow at 3 PM.",
  "es",
  "en", // optional source language
  true  // preserve format
);

console.log(translated); // "La reunión está programada para mañana a las 3 PM."
```

## Voice Translation

Translate spoken language through speech-to-text followed by text-to-speech.

### Features
- **End-to-End Processing**: Seamless audio input to audio output
- **Multiple Voice Options**: Choose from various voice profiles and styles
- **Language Preservation**: Maintains speaker's emotional tone and emphasis
- **Real-Time Processing**: Streaming translation for live conversations
- **Multi-Language Support**: Support for 100+ languages

### Voice-to-Voice Translation

```typescript
import { translateVoice } from '../services/translation/voice/voiceToVoiceTranslate';

// Load audio file
const audioBuffer = await loadAudioFile('input_speech.wav');

// Translate voice
const translatedAudio = await translateVoice({
  audioBuffer: audioBuffer,
  sourceLang: 'en',
  targetLang: 'es',
  voice: 'Maria' // Optional voice selection
});

// Save translated audio
await saveAudioFile('output_speech.wav', translatedAudio);
```

### Step-by-Step Voice Translation

For more control, use individual components:

```typescript
import { speechToText } from '../services/translation/voice/speechToText';
import { textToSpeech } from '../services/translation/voice/textToSpeech';
import { translateText } from '../services/translation/text/translateText';

// Step 1: Speech-to-Text
const transcription = await speechToText({
  audioBuffer: inputAudio,
  language: 'en'
});

console.log(transcription.text); // "Hello, I'd like to order a pizza."

// Step 2: Text Translation
const translatedText = await translateText(
  transcription.text,
  'es',
  'en'
);

// Step 3: Text-to-Speech
const outputAudio = await textToSpeech({
  text: translatedText,
  voice: 'Carlos',
  language: 'es'
});

// Result: Spanish audio saying "Hola, me gustaría ordenar una pizza."
```

## Voice-to-Voice Translation

Direct voice translation without intermediate text conversion for maximum fidelity.

### Features
- **Direct Audio Processing**: Bypasses text intermediate representation
- **Preserved Prosody**: Maintains intonation, rhythm, and emotional delivery
- **Low Latency**: Optimized for real-time communication
- **High Fidelity**: Superior quality compared to cascaded STT→Translation→TTS

### Direct Voice Translation

```typescript
import { voiceToVoiceTranslate } from '../services/translation/voice/v2v/voiceToVoiceTranslate';

// Direct voice-to-voice translation
const translatedAudio = await voiceToVoiceTranslate({
  audioBuffer: inputAudio,
  sourceLang: 'en',
  targetLang: 'ja',
  preserveTone: true,  // Maintain emotional tone
  voiceStyle: 'natural' // Natural or formal style
});

// Process streaming audio for real-time translation
const streamProcessor = voiceToVoiceTranslate.createStreamProcessor({
  sourceLang: 'en',
  targetLang: 'fr'
});

// Process audio chunks in real-time
for (const audioChunk of audioStream) {
  const translatedChunk = await streamProcessor.process(audioChunk);
  // Output translated audio chunk immediately
}
```

## Translation Factory Usage

The TranslationFactory provides low-level control and advanced features:

```typescript
import { TranslationFactory } from '../core/factories/TranslationFactory';

const factory = new TranslationFactory();

// Batch translation
const batchResults = await Promise.all([
  factory.run({ text: "Hello world", targetLang: "es" }),
  factory.run({ text: "How are you?", targetLang: "fr" }),
  factory.run({ text: "Thank you", targetLang: "de" })
]);

// Translation with custom provider
const result = await factory.run({
  text: "Complex legal document text...",
  targetLang: "es"
}, {
  provider: "anthropic", // Force specific provider
  debug: true
});

// Translation with metadata
const resultWithMeta = await factory.run({
  text: "Medical terminology: dyspnea, tachycardia, hypertension",
  targetLang: "es"
}, {
  metadata: {
    domain: "medical",
    preserveTerminology: true
  }
});
```

## Provider Support

Translation works with multiple AI providers, each optimized for different use cases:

### OpenAI
- **Best for**: General purpose translation, creative content
- **Models**: GPT-4, GPT-3.5-turbo
- **Strengths**: High accuracy, good context understanding

### Anthropic
- **Best for**: Safe, consistent translation, legal/financial content
- **Models**: Claude 3 Opus, Sonnet
- **Strengths**: Reliable, conservative translations

### Google Gemini
- **Best for**: Fast translation, multilingual content
- **Models**: Gemini Pro, Ultra
- **Strengths**: Speed, broad language support

### Cohere
- **Best for**: Technical translation, domain-specific content
- **Models**: Command
- **Strengths**: Good for specialized terminology

## Language Support

MCF supports translation between 100+ languages:

### Popular Language Pairs
- English ↔ Spanish, French, German, Italian, Portuguese
- English ↔ Chinese (Simplified/Traditional), Japanese, Korean
- English ↔ Arabic, Hindi, Russian
- Spanish ↔ Portuguese, French, Italian
- And many more...

### Language Codes
Use standard ISO 639-1 language codes:

```typescript
// Common language codes
const languages = {
  english: 'en',
  spanish: 'es',
  french: 'fr',
  german: 'de',
  italian: 'it',
  portuguese: 'pt',
  chinese: 'zh',
  japanese: 'ja',
  korean: 'ko',
  arabic: 'ar',
  hindi: 'hi',
  russian: 'ru'
};
```

## Advanced Features

### Format Preservation

Maintain original formatting in translations:

```typescript
const formattedText = `
# Important Notice

**Date:** January 15, 2024

Dear valued customers,

We are pleased to announce that our new **AI-powered features** will be available starting next week.

## Key Benefits:
- Improved performance
- Better user experience
- Enhanced security

Best regards,
The MCF Team
`;

const result = await translateText(formattedText, 'es', 'en', true);
// Preserves markdown formatting, structure, and emphasis
```

### Glossary and Terminology

Use custom glossaries for consistent terminology:

```typescript
const glossary = {
  'machine learning': 'aprendizaje automático',
  'neural network': 'red neuronal',
  'artificial intelligence': 'inteligencia artificial'
};

const result = await factory.run({
  text: "Machine learning and neural networks power artificial intelligence.",
  targetLang: "es"
}, {
  metadata: {
    glossary: glossary,
    preserveTerminology: true
  }
});
// Uses consistent Spanish terms for technical vocabulary
```

### Context-Aware Translation

Provide context for better translations:

```typescript
const result = await factory.run({
  text: "bank", // Could mean river bank or financial bank
  targetLang: "es",
  context: "financial institution that manages money"
});
// Translates to "banco" (financial bank) instead of "orilla" (river bank)
```

## Performance Optimization

### Caching

Cache translations to improve performance:

```typescript
import { TranslationCache } from '../services/translation/translationCache';

const cache = new TranslationCache();

// Cached translation
const result = await cache.translate({
  text: "Frequently translated text",
  targetLang: "es"
});

// Cache statistics
console.log(cache.getStats());
// { hits: 150, misses: 25, hitRate: 0.857 }
```

### Batch Processing

Process multiple translations efficiently:

```typescript
const batchTranslator = factory.createBatchTranslator();

// Add translations to batch
batchTranslator.add({ text: "Hello", targetLang: "es" });
batchTranslator.add({ text: "Goodbye", targetLang: "fr" });
batchTranslator.add({ text: "Thank you", targetLang: "de" });

// Execute batch
const results = await batchTranslator.execute();
console.log(results); // Array of translation results
```

### Streaming Translation

For large documents or real-time translation:

```typescript
const streamTranslator = factory.createStreamTranslator({
  targetLang: "es",
  chunkSize: 1000 // Characters per chunk
});

// Process text stream
for (const chunk of textStream) {
  const translatedChunk = await streamTranslator.process(chunk);
  // Output translated chunk immediately
  yield translatedChunk;
}
```

## Quality Assurance

### Translation Evaluation

Automatically evaluate translation quality:

```typescript
import { TranslationEvaluator } from '../services/translation/translationEvaluator';

const evaluator = new TranslationEvaluator();

const quality = await evaluator.evaluate({
  sourceText: "The cat sat on the mat.",
  translatedText: "El gato se sentó en la estera.",
  targetLang: "es"
});

console.log(quality.score); // 0.92 (92% quality score)
console.log(quality.feedback); // ["Good fluency", "Minor terminology issue"]
```

### Human-in-the-Loop

Integrate human review for critical translations:

```typescript
const result = await factory.run(input, {
  metadata: {
    requireReview: true,
    reviewer: "expert@company.com",
    deadline: "2024-01-20"
  }
});

// Check review status
const status = await factory.checkReviewStatus(result.id);
if (status.reviewed) {
  console.log('Reviewed translation:', status.finalTranslation);
}
```

## Configuration

Configure translation behavior through MCF configuration:

```json
{
  "defaults": {
    "translation": {
      "targetLang": "en",
      "preserveFormat": true,
      "enableGlossary": true,
      "qualityThreshold": 0.8
    }
  },
  "translation": {
    "glossaryPath": "./glossaries/",
    "cacheEnabled": true,
    "cacheTTL": 86400000,
    "batchSize": 10,
    "supportedLanguages": ["en", "es", "fr", "de", "it", "pt", "zh", "ja", "ko"]
  }
}
```

## Error Handling

Translation operations include comprehensive error handling:

```typescript
try {
  const result = await translateText(text, targetLang);
} catch (error) {
  switch (error.code) {
    case 'TRANSLATION_UNSUPPORTED_LANGUAGE':
      console.log('Unsupported language pair');
      break;
    case 'TRANSLATION_QUOTA_EXCEEDED':
      console.log('Provider quota exceeded, trying fallback');
      // Try alternative provider
      break;
    case 'TRANSLATION_TIMEOUT':
      console.log('Translation timed out');
      break;
    default:
      console.error('Translation failed:', error.message);
  }
}
```

## Integration Examples

### Web Application Integration

```typescript
// Express.js translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    const result = await translateText(text, targetLang, sourceLang);

    res.json({
      success: true,
      translation: result,
      sourceLang: result.sourceLang,
      targetLang: result.targetLang
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### Chatbot Translation

```typescript
class MultilingualChatbot {
  async processMessage(message: string, userLang: string) {
    // Detect if translation is needed
    const needsTranslation = userLang !== 'en';

    let processedMessage = message;
    if (needsTranslation) {
      processedMessage = await translateText(message, 'en', userLang);
    }

    // Process message in English
    const response = await this.generateResponse(processedMessage);

    // Translate response back if needed
    if (needsTranslation) {
      response.translated = await translateText(response.text, userLang, 'en');
    }

    return response;
  }
}
```

### Document Translation Service

```typescript
class DocumentTranslator {
  async translateDocument(docPath: string, targetLang: string) {
    const content = await readDocument(docPath);

    // Extract text and metadata
    const { text, metadata } = this.parseDocument(content);

    // Translate with context preservation
    const translatedText = await translateText(text, targetLang, null, true);

    // Maintain document structure
    const translatedDoc = await this.reconstructDocument(translatedText, metadata);

    return translatedDoc;
  }
}
```

## Best Practices

1. **Context Matters**: Provide context for ambiguous terms
2. **Format Preservation**: Use preserveFormat for structured content
3. **Glossary Usage**: Maintain glossaries for consistent terminology
4. **Quality Checks**: Implement quality evaluation for critical translations
5. **Caching Strategy**: Cache frequently translated content
6. **Error Handling**: Always handle translation failures gracefully
7. **Batch Processing**: Use batch translation for multiple items
8. **Language Detection**: Rely on automatic detection when source language is unknown

## Use Cases

### E-commerce Translation
- Product descriptions
- Customer reviews
- Support documentation
- Marketing content

### Legal Translation
- Contracts and agreements
- Legal documents
- Compliance materials
- Regulatory filings

### Healthcare Translation
- Medical records
- Patient information
- Clinical documentation
- Pharmaceutical content

### Education Translation
- Course materials
- Educational content
- Assessment materials
- Research papers

### Media Translation
- News articles
- Social media content
- Entertainment content
- Broadcast materials

## Cost Optimization

Monitor and optimize translation costs:

```typescript
const costOptimizer = {
  // Choose most cost-effective provider for language pair
  selectOptimalProvider(sourceLang: string, targetLang: string): string {
    const costMatrix = {
      'en-es': { openai: 0.002, anthropic: 0.0015, gemini: 0.001 },
      'en-fr': { openai: 0.002, anthropic: 0.0015, gemini: 0.001 }
    };

    const costs = costMatrix[`${sourceLang}-${targetLang}`];
    return Object.keys(costs).reduce((a, b) => costs[a] < costs[b] ? a : b);
  },

  // Estimate translation cost
  estimateCost(text: string, provider: string): number {
    const tokens = this.estimateTokens(text);
    const rate = this.getProviderRate(provider);
    return tokens * rate;
  }
};
```
