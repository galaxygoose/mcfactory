# Providers

MCFACTORY Providers are the abstraction layer that handles communication with various AI service providers. The provider system enables seamless switching between different AI services while maintaining consistent interfaces.

## Provider Architecture

### Provider Interface

All providers implement the `Provider` interface:

```typescript
interface Provider {
  name: string;
  callModel(req: ProviderRequest): Promise<ProviderResponse>;
}

interface ProviderRequest {
  model: string;
  input: unknown;
  options?: Record<string, any>;
}

interface ProviderResponse {
  output: unknown;
  tokens?: number;
  model?: string;
  provider?: string;
}
```

### Provider Registry

The `ProviderRegistry` manages all registered providers:

```typescript
import { ProviderRegistry } from '../core/providers/providerRegistry';

// Register a provider
ProviderRegistry.registerProvider(provider);

// Get a provider by name
const provider = ProviderRegistry.get('openai');

// List all providers
const providers = ProviderRegistry.list();
```

## Supported Providers

### OpenAI Provider

Provides access to OpenAI's GPT models for comprehensive AI tasks.

#### Features
- GPT-4, GPT-3.5-turbo, and GPT-4-turbo models
- Text generation, completion, and chat
- Function calling and tool use
- Token usage tracking
- Streaming support

#### Configuration
```json
{
  "openai": {
    "apiKey": "${OPENAI_API_KEY}",
    "model": "gpt-4",
    "options": {
      "temperature": 0.7,
      "max_tokens": 1000,
      "presence_penalty": 0.1,
      "frequency_penalty": 0.1
    }
  }
}
```

#### Example Usage
```typescript
import { ProviderRegistry } from '../core/providers/providerRegistry';

const provider = ProviderRegistry.get('openai');

const response = await provider.callModel({
  model: 'gpt-4',
  input: {
    messages: [
      { role: 'user', content: 'Hello, how are you?' }
    ]
  },
  options: {
    temperature: 0.7,
    max_tokens: 150
  }
});

console.log(response.output.choices[0].message.content);
console.log('Tokens used:', response.tokens);
```

### Anthropic Provider

Provides access to Anthropic's Claude models, optimized for safety and reasoning.

#### Features
- Claude 3 Opus, Sonnet, and Haiku models
- Enhanced safety and alignment
- Long context windows
- Advanced reasoning capabilities
- Structured output support

#### Configuration
```json
{
  "anthropic": {
    "apiKey": "${ANTHROPIC_API_KEY}",
    "model": "claude-3-sonnet-20240229",
    "options": {
      "max_tokens_to_sample": 1000,
      "temperature": 0.7,
      "top_p": 0.9,
      "top_k": 250
    }
  }
}
```

#### Example Usage
```typescript
const provider = ProviderRegistry.get('anthropic');

const response = await provider.callModel({
  model: 'claude-3-sonnet-20240229',
  input: {
    messages: [
      {
        role: 'user',
        content: 'Explain quantum computing in simple terms'
      }
    ]
  },
  options: {
    max_tokens_to_sample: 500,
    temperature: 0.3
  }
});
```

### Google Gemini Provider

Provides access to Google's Gemini multimodal models.

#### Features
- Multimodal input (text, images, audio)
- Fast inference times
- Strong reasoning capabilities
- Native multimodal understanding
- Function calling support

#### Configuration
```json
{
  "gemini": {
    "apiKey": "${GEMINI_API_KEY}",
    "model": "gemini-pro",
    "options": {
      "temperature": 0.7,
      "topP": 0.9,
      "topK": 40,
      "maxOutputTokens": 1000
    }
  }
}
```

#### Example Usage
```typescript
const provider = ProviderRegistry.get('gemini');

const response = await provider.callModel({
  model: 'gemini-pro',
  input: {
    contents: [
      {
        parts: [
          { text: 'Describe this image in detail' },
          { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
        ]
      }
    ]
  }
});
```

### Cohere Provider

Provides access to Cohere's language models, specialized in language understanding.

#### Features
- Command and Base model families
- Strong language understanding
- Embeddings generation
- Reranking capabilities
- Multilingual support

#### Configuration
```json
{
  "cohere": {
    "apiKey": "${COHERE_API_KEY}",
    "model": "command",
    "options": {
      "temperature": 0.7,
      "max_tokens": 1000,
      "k": 0,
      "p": 0.9
    }
  }
}
```

#### Example Usage
```typescript
const provider = ProviderRegistry.get('cohere');

const response = await provider.callModel({
  model: 'command',
  input: {
    prompt: 'Write a creative story about AI',
    max_tokens: 500,
    temperature: 0.8
  }
});
```

### ElevenLabs Provider

Provides access to ElevenLabs' voice synthesis models.

#### Features
- High-quality voice synthesis
- Multiple voice options
- Emotional expression control
- Voice cloning capabilities
- Real-time streaming

#### Configuration
```json
{
  "elevenlabs": {
    "apiKey": "${ELEVENLABS_API_KEY}",
    "voice": "Rachel",
    "model": "eleven_monolingual_v1",
    "options": {
      "stability": 0.5,
      "similarity_boost": 0.8,
      "style": 0.5,
      "use_speaker_boost": true
    }
  }
}
```

#### Example Usage
```typescript
const provider = ProviderRegistry.get('elevenlabs');

const response = await provider.callModel({
  model: 'eleven_monolingual_v1',
  input: {
    text: 'Hello, this is a test of voice synthesis.',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8
    }
  }
});

// Response contains audio buffer
const audioBuffer = response.output;
```

### Local LLM Provider

Provides access to locally-hosted language models.

#### Features
- Privacy-preserving (no data sent to external services)
- Support for various model formats (GGUF, etc.)
- GPU acceleration support
- Custom model integration
- Offline operation

#### Configuration
```json
{
  "local": {
    "modelPath": "/path/to/model.gguf",
    "tokenizerPath": "/path/to/tokenizer",
    "options": {
      "context_length": 4096,
      "threads": 4,
      "gpu_layers": 35,
      "temperature": 0.7
    }
  }
}
```

#### Example Usage
```typescript
const provider = ProviderRegistry.get('local');

const response = await provider.callModel({
  model: 'llama-2-7b',
  input: {
    prompt: 'Explain machine learning',
    max_tokens: 500,
    temperature: 0.7
  }
});
```

## Provider Selection and Routing

### Automatic Provider Selection

MCFACTORY automatically selects providers based on:

- Task requirements and capabilities
- Performance characteristics
- Cost considerations
- Availability and reliability
- User preferences and configuration

```typescript
// Automatic routing examples
const translationFactory = new TranslationFactory();
// Routes to OpenAI for general translation

const detectionFactory = new DetectionFactory();
// Routes to specialized detection provider

const reasoningFactory = new AgentFactory();
// Routes to Anthropic for complex reasoning
```

### Manual Provider Override

Override automatic selection when needed:

```typescript
const result = await factory.run(input, {
  provider: 'anthropic' // Force specific provider
});
```

### Provider Fallback

Configure fallback providers for reliability:

```typescript
const result = await factory.run(input, {
  metadata: {
    fallbackProviders: ['anthropic', 'gemini', 'openai']
  }
});
```

## Error Handling

### Provider-Specific Errors

Each provider handles errors consistently:

```typescript
try {
  const response = await provider.callModel(request);
} catch (error) {
  switch (error.code) {
    case 'PROVIDER_RATE_LIMIT':
      // Handle rate limiting
      await delay(error.retryAfter);
      break;
    case 'PROVIDER_QUOTA_EXCEEDED':
      // Handle quota issues
      switchToFallbackProvider();
      break;
    case 'PROVIDER_INVALID_REQUEST':
      // Handle validation errors
      fixRequestParameters();
      break;
    case 'PROVIDER_NETWORK_ERROR':
      // Handle network issues
      retryWithBackoff();
      break;
    default:
      console.error('Provider error:', error);
  }
}
```

### Circuit Breaker Pattern

Providers implement circuit breaker patterns for resilience:

```typescript
class ResilientProvider implements Provider {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await this.actualProvider.callModel(req);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
}
```

## Performance Optimization

### Connection Pooling

Providers maintain connection pools for efficiency:

```typescript
class PooledProvider implements Provider {
  private pool: Connection[] = [];

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    const connection = await this.getConnection();
    try {
      return await connection.call(req);
    } finally {
      this.returnConnection(connection);
    }
  }
}
```

### Request Batching

Batch multiple requests for efficiency:

```typescript
class BatchingProvider implements Provider {
  private batch: ProviderRequest[] = [];
  private batchSize = 10;

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    this.batch.push(req);

    if (this.batch.length >= this.batchSize) {
      return await this.flushBatch();
    }

    // Return promise that resolves when batch is processed
    return new Promise((resolve) => {
      this.pendingResolves.push(resolve);
    });
  }

  private async flushBatch(): Promise<ProviderResponse[]> {
    const results = await this.actualProvider.callBatch(this.batch);
    this.batch = [];
    return results;
  }
}
```

### Caching

Cache provider responses for repeated requests:

```typescript
class CachingProvider implements Provider {
  private cache = new Map();

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    const key = this.hashRequest(req);

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const result = await this.actualProvider.callModel(req);
    this.cache.set(key, result);
    return result;
  }
}
```

## Monitoring and Analytics

### Provider Metrics

Track provider performance and usage:

```typescript
class MonitoredProvider implements Provider {
  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    const startTime = Date.now();

    try {
      const result = await this.actualProvider.callModel(req);
      const duration = Date.now() - startTime;

      // Record metrics
      metrics.record('provider.request', {
        provider: this.name,
        model: req.model,
        duration,
        tokens: result.tokens,
        success: true
      });

      return result;
    } catch (error) {
      metrics.record('provider.request', {
        provider: this.name,
        model: req.model,
        duration: Date.now() - startTime,
        success: false,
        error: error.message
      });
      throw error;
    }
  }
}
```

### Cost Tracking

Monitor API usage costs:

```typescript
const costTracker = {
  calculateCost(provider: string, model: string, tokens: number): number {
    const rates = {
      'openai': {
        'gpt-4': { input: 0.03, output: 0.06 },
        'gpt-3.5-turbo': { input: 0.0015, output: 0.002 }
      },
      'anthropic': {
        'claude-3-opus': { input: 0.015, output: 0.075 },
        'claude-3-sonnet': { input: 0.003, output: 0.015 }
      }
    };

    const rate = rates[provider]?.[model];
    if (!rate) return 0;

    // Simplified cost calculation
    return (tokens * rate.input) / 1000;
  }
};
```

## Extending Providers

### Custom Provider Implementation

```typescript
import { Provider, ProviderRequest, ProviderResponse } from '../../types';

class CustomProvider implements Provider {
  name = 'custom';

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    // Custom provider logic
    const response = await this.makeAPIRequest(req);

    return {
      output: response.data,
      tokens: response.usage?.total_tokens,
      model: req.model,
      provider: this.name
    };
  }

  private async makeAPIRequest(req: ProviderRequest): Promise<any> {
    // Implement API call to custom service
  }
}

// Register the provider
ProviderRegistry.registerProvider(new CustomProvider());
```

### Provider Middleware

Add middleware for cross-cutting concerns:

```typescript
class ProviderMiddleware implements Provider {
  constructor(private innerProvider: Provider) {}

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    // Pre-processing
    this.validateRequest(req);
    this.logRequest(req);

    try {
      const response = await this.innerProvider.callModel(req);

      // Post-processing
      this.logResponse(response);
      this.updateMetrics(response);

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }
}
```

## Best Practices

1. **Error Resilience**: Implement proper error handling and fallback mechanisms
2. **Resource Management**: Use connection pooling and request batching
3. **Monitoring**: Track performance, costs, and reliability metrics
4. **Security**: Never log sensitive information like API keys
5. **Rate Limiting**: Respect provider rate limits and implement backoff
6. **Cost Optimization**: Monitor usage and optimize for cost efficiency
7. **Testing**: Thoroughly test provider implementations
8. **Documentation**: Document provider capabilities and limitations

## Provider Compatibility Matrix

| Feature | OpenAI | Anthropic | Gemini | Cohere | ElevenLabs | Local |
|---------|--------|-----------|--------|--------|------------|-------|
| Text Generation | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Chat/Conversation | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Function Calling | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Streaming | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Embeddings | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Multimodal | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Voice Synthesis | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Local Operation | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cost | Medium | High | Low | Medium | High | Free |

## Troubleshooting

### Common Provider Issues

**Rate Limiting**
```
Error: Rate limit exceeded
Solution: Implement exponential backoff, reduce request frequency
```

**Quota Exceeded**
```
Error: Quota exceeded
Solution: Monitor usage, upgrade plan, or switch providers
```

**Invalid API Key**
```
Error: Invalid API key
Solution: Check API key configuration and environment variables
```

**Network Timeout**
```
Error: Request timeout
Solution: Increase timeout, check network connectivity, retry with backoff
```

**Model Not Available**
```
Error: Model not found
Solution: Check model name spelling, verify model availability
```
