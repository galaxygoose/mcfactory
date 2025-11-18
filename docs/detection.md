# AI Detection

MCFACTORY provides comprehensive AI detection capabilities for identifying AI-generated content across text and voice modalities. The detection system uses multiple techniques and ensemble methods to achieve high accuracy while minimizing false positives.

## Text Detection

Detect AI-generated text using advanced machine learning models and statistical analysis.

### Features
- **Multi-Technique Analysis**: Combines statistical, linguistic, and neural network approaches
- **Confidence Scoring**: Provides probability scores for AI-generated content
- **Feature Analysis**: Returns detailed feature analysis including perplexity, entropy, and stylometry
- **Real-time Processing**: Fast detection suitable for real-time applications
- **Multi-language Support**: Works across different languages and domains

### Example

```typescript
import { DetectionFactory } from '../core/factories/DetectionFactory';

const factory = new DetectionFactory();

// Detect AI-generated text
const result = await factory.detectAI({
  text: "The quantum mechanical model suggests that electrons exist in probabilistic cloud formations around the nucleus, rather than in fixed orbital paths as previously thought."
});

console.log(result.isAI); // true or false
console.log(result.confidence); // 0.89 (89% confidence)
console.log(result.features);
// {
//   perplexity: 45.2,
//   entropy: 3.8,
//   stylometry: { sentenceLength: 0.7, vocabulary: 0.8 }
// }
```

### Detection Techniques

1. **Statistical Analysis**
   - Perplexity measurement
   - Burstiness analysis
   - N-gram distribution patterns

2. **Linguistic Features**
   - Sentence structure analysis
   - Vocabulary diversity metrics
   - Stylometric fingerprints

3. **Neural Network Classification**
   - Transformer-based detection models
   - Fine-tuned for different content types
   - Ensemble model combinations

### Use Cases
- **Content Moderation**: Identify AI-generated spam or fake news
- **Academic Integrity**: Detect AI-assisted writing in educational contexts
- **Brand Protection**: Monitor for AI-generated fake reviews or content
- **Research**: Analyze AI model capabilities and detection evasion techniques

### Input Parameters
- `text`: string - The text to analyze (required)

### Output
- `isAI`: boolean - Whether the text is likely AI-generated
- `confidence`: number - Confidence score (0-1)
- `features`: object - Detailed analysis features
  - `perplexity`: number - Text perplexity score
  - `entropy`: number - Entropy measurement
  - `stylometry`: object - Stylometric analysis results

## Voice Detection

Detect synthetic or manipulated voice audio using advanced audio analysis techniques.

### Features
- **Deepfake Detection**: Identify AI-generated voice synthesis
- **Audio Manipulation Detection**: Detect audio editing and tampering
- **Real-time Analysis**: Process streaming audio for live detection
- **Multi-format Support**: Works with various audio formats (WAV, MP3, etc.)
- **Confidence Scoring**: Provides probability scores for synthetic audio

### Example

```typescript
import { DetectionFactory } from '../core/factories/DetectionFactory';

// Load audio file as ArrayBuffer
const audioBuffer = await loadAudioFile('suspicious_audio.wav');

const result = await factory.detectFakeVoice({
  audioBuffer: audioBuffer
});

console.log(result.isFake); // true or false
console.log(result.confidence); // 0.76 (76% confidence)
console.log(result.details);
// {
//   spectralAnalysis: { harmonics: 0.3, noise: 0.8 },
//   temporalFeatures: { consistency: 0.2 },
//   artifacts: ['phase_discontinuity', 'unnatural_pause']
// }
```

### Detection Methods

1. **Spectral Analysis**
   - Harmonic structure examination
   - Frequency domain analysis
   - Noise pattern detection

2. **Temporal Features**
   - Timing consistency analysis
   - Pause pattern detection
   - Speech rhythm analysis

3. **Artifact Detection**
   - Phase discontinuity identification
   - Synthesis artifact recognition
   - Compression anomaly detection

### Use Cases
- **Voice Authentication**: Verify speaker identity in security systems
- **Content Verification**: Detect deepfake audio in media
- **Fraud Prevention**: Identify synthetic voice in phone scams
- **Broadcast Integrity**: Monitor live audio streams for manipulation

### Input Parameters
- `audioBuffer`: ArrayBuffer - The audio data to analyze (required)

### Output
- `isFake`: boolean - Whether the audio is likely synthetic
- `confidence`: number - Confidence score (0-1)
- `details`: object - Detailed analysis results
  - `spectralAnalysis`: object - Frequency domain analysis
  - `temporalFeatures`: object - Time domain analysis
  - `artifacts`: string[] - Detected manipulation artifacts

## Ensemble Methods

Combine multiple detection techniques for improved accuracy and robustness.

### How Ensemble Detection Works

1. **Multi-Model Voting**: Multiple detection models vote on the final decision
2. **Weighted Scoring**: Different techniques contribute with different weights
3. **Confidence Calibration**: Adjusts confidence scores based on agreement between models
4. **Fallback Mechanisms**: Uses backup methods when primary detection fails

### Example

```typescript
import { DetectionFactory } from '../core/factories/DetectionFactory';

const factory = new DetectionFactory();

// Configure ensemble detection
const result = await factory.run({
  type: 'ensemble',
  text: "Sample text to analyze",
  audioBuffer: audioData, // Optional: include both text and audio
  options: {
    methods: ['statistical', 'neural', 'linguistic'],
    weights: { statistical: 0.4, neural: 0.4, linguistic: 0.2 }
  }
});

// Ensemble result combines multiple techniques
console.log(result.isAI); // Combined decision
console.log(result.confidence); // Calibrated confidence score
console.log(result.methodResults); // Individual method results
```

### Ensemble Strategies

1. **Majority Voting**
   ```typescript
   // Simple majority vote across methods
   const ensembleResult = majorityVote([method1, method2, method3]);
   ```

2. **Weighted Average**
   ```typescript
   // Weighted combination of confidence scores
   const weightedScore = (0.5 * score1) + (0.3 * score2) + (0.2 * score3);
   ```

3. **Stacking**
   ```typescript
   // Use a meta-model to combine base model predictions
   const finalPrediction = metaModel.predict([score1, score2, score3]);
   ```

## Detection Factory Usage

The DetectionFactory provides a unified interface for all detection operations:

```typescript
import { DetectionFactory } from '../core/factories/DetectionFactory';

const factory = new DetectionFactory();

// AI Text Detection
const textResult = await factory.run({
  type: 'ai',
  text: "Text to analyze for AI generation"
}, {
  provider: 'openai', // Optional provider override
  debug: true
});

// Fake Voice Detection
const voiceResult = await factory.run({
  type: 'fakeVoice',
  audioBuffer: audioData
});

// Ensemble Detection
const ensembleResult = await factory.run({
  type: 'ensemble',
  text: "Text content",
  audioBuffer: audioData,
  options: {
    combineModalities: true
  }
});
```

## Provider Support

Detection works with specialized AI providers optimized for analysis tasks:

- **OpenAI**: GPT models for sophisticated text analysis
- **Anthropic**: Claude models for nuanced detection
- **Cohere**: Specialized language models for detection tasks
- **Custom Models**: Fine-tuned detection models

## Configuration

Configure detection behavior through MCFACTORY configuration:

```json
{
  "defaults": {
    "detection": {
      "aiThreshold": 0.8,
      "fakeVoiceThreshold": 0.7,
      "ensembleWeights": {
        "statistical": 0.4,
        "neural": 0.4,
        "linguistic": 0.2
      }
    }
  }
}
```

## Performance Optimization

### Caching
```typescript
// Cache detection results for repeated content
const cache = new Map();

async function cachedDetection(text: string) {
  if (cache.has(text)) {
    return cache.get(text);
  }

  const result = await factory.detectAI({ text });
  cache.set(text, result);
  return result;
}
```

### Batch Processing
```typescript
// Process multiple items efficiently
const batchResults = await Promise.all(
  texts.map(text => factory.detectAI({ text }))
);
```

### Streaming Detection
```typescript
// Real-time detection for streaming content
const streamDetector = factory.createStreamDetector();

streamDetector.on('result', (result) => {
  console.log('Detection result:', result);
});

streamDetector.process(audioStream);
```

## Error Handling

Detection operations include comprehensive error handling:

```typescript
try {
  const result = await factory.detectAI({
    text: "Text to analyze"
  });
} catch (error) {
  if (error.code === 'DETECTION_TIMEOUT') {
    console.log('Detection timed out, using fallback');
  } else if (error.code === 'INVALID_INPUT') {
    console.log('Invalid input format');
  } else {
    console.error('Detection failed:', error.message);
  }
}
```

## Best Practices

1. **Threshold Tuning**: Adjust confidence thresholds based on your use case
2. **Multi-Modal Analysis**: Use both text and voice detection when available
3. **Regular Retraining**: Update detection models as AI generation techniques evolve
4. **False Positive Management**: Implement human review for high-stakes decisions
5. **Performance Monitoring**: Track detection accuracy and latency metrics

## Integration with Workflows

Detection integrates seamlessly with MCFACTORY workflows:

```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

// Create content verification workflow
const workflow = WorkflowFactory.createAIAnalysisWorkflow();
// Includes AI detection, moderation, and guardrail checks
```

## API Compatibility

Detection services are compatible with major AI safety APIs:

- **OpenAI Moderation API**: Text safety checking
- **Google Perspective API**: Toxicity and content analysis
- **Custom Detection Models**: Integration with specialized detection systems
