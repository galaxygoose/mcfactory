# Integration Guide

This guide provides comprehensive instructions for integrating MCFACTORY (Model Context Factory) into your applications. Whether you're building a web application, mobile app, CLI tool, or enterprise system, MCFACTORY offers flexible integration options to meet your needs.

## Quick Start Integration

### Basic Setup

1. **Install MCFACTORY**
```bash
npm install mcf
# or
yarn add mcf
```

2. **Configure Environment**
```bash
# Set up your API keys
export OPENAI_API_KEY="your-openai-key"
export ANTHROPIC_API_KEY="your-anthropic-key"
# ... other provider keys as needed
```

3. **Basic Usage**
```typescript
import { MCFACTORY } from 'mcf';

const client = new MCFACTORY();

// Translate text
const translation = await client.translate('Hello world', 'es');
console.log(translation); // "Hola mundo"

// Detect AI content
const isAI = await client.detectAI('Sample text');
console.log(isAI); // false
```

## Application Integration Patterns

### Web Application Integration

#### Express.js Integration

```typescript
import express from 'express';
import { translateText, moderateText } from '../services/translation/translateText';
import { moderateText as moderate } from '../services/moderation/moderateText';

const app = express();
app.use(express.json());

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang, sourceLang } = req.body;

    const result = await translateText(text, targetLang, sourceLang);

    res.json({
      success: true,
      translation: result,
      metadata: {
        sourceLang: result.sourceLang,
        targetLang: result.targetLang,
        provider: result.provider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Content moderation middleware
app.use('/api/content', async (req, res, next) => {
  try {
    const content = req.body.text || req.body.content;

    if (content) {
      const moderation = await moderate(content);

      if (!moderation.safe) {
        return res.status(400).json({
          error: 'Content violates safety guidelines',
          categories: moderation.categories
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Moderation check failed'
    });
  }
});

app.listen(3000, () => {
  console.log('MCFACTORY-integrated API server running on port 3000');
});
```

#### React Application Integration

```typescript
import React, { useState, useEffect } from 'react';
import { translateText } from '../services/translation/translateText';

function TranslationComponent() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await translateText(inputText, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="translation-component">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
      />

      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
      </select>

      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>

      {error && <div className="error">{error}</div>}

      {translatedText && (
        <div className="result">
          <h3>Translation:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TranslationComponent;
```

### CLI Tool Integration

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import { translateText } from '../services/translation/translateText';
import { summarizeText } from '../services/agents/summarizeText';

const program = new Command();

program
  .name('content-processor')
  .description('Process content using MCF')
  .version('1.0.0');

program
  .command('translate')
  .description('Translate text')
  .argument('<text>', 'text to translate')
  .option('-t, --target <lang>', 'target language', 'es')
  .option('-s, --source <lang>', 'source language')
  .action(async (text, options) => {
    try {
      const result = await translateText(text, options.target, options.source);
      console.log(result);
    } catch (error) {
      console.error('Translation failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('summarize')
  .description('Summarize text')
  .argument('<text>', 'text to summarize')
  .option('-l, --length <type>', 'summary length', 'medium')
  .action(async (text, options) => {
    try {
      const result = await summarizeText(text, options.length);
      console.log(result);
    } catch (error) {
      console.error('Summarization failed:', error.message);
      process.exit(1);
    }
  });

program.parse();
```

### Mobile Application Integration (React Native)

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { translateText } from '../services/translation/translateText';

export default function TranslationScreen() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }

    setLoading(true);
    try {
      // For React Native, you might want to use a proxy API
      // or set up MCFACTORY on a backend server
      const result = await translateText(inputText, 'es');
      setTranslatedText(result);
    } catch (error) {
      Alert.alert('Translation Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
          minHeight: 100
        }}
        multiline
        placeholder="Enter text to translate"
        value={inputText}
        onChangeText={setInputText}
      />

      <Button
        title={loading ? "Translating..." : "Translate to Spanish"}
        onPress={handleTranslate}
        disabled={loading}
      />

      {translatedText ? (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Translation:</Text>
          <Text style={{ marginTop: 10 }}>{translatedText}</Text>
        </View>
      ) : null}
    </View>
  );
}
```

## Advanced Integration Patterns

### Custom Service Implementation

Create application-specific services that extend MCFACTORY:

```typescript
import { TranslationFactory } from '../core/factories/TranslationFactory';
import { ModerationFactory } from '../core/factories/ModerationFactory';

class ContentProcessingService {
  private translationFactory = new TranslationFactory();
  private moderationFactory = new ModerationFactory();

  async processUserContent(content: string, targetLang: string, userId: string) {
    // Step 1: Moderate content
    const moderation = await this.moderationFactory.run({
      text: content
    });

    if (!moderation.safe) {
      throw new Error(`Content blocked: ${moderation.categories.join(', ')}`);
    }

    // Step 2: Translate if needed
    let processedContent = content;
    if (targetLang !== 'en') {
      const translation = await this.translationFactory.run({
        text: content,
        targetLang
      });
      processedContent = translation.translated;
    }

    // Step 3: Log processing
    await this.logProcessing({
      userId,
      originalContent: content,
      processedContent,
      targetLang,
      moderationResult: moderation
    });

    return {
      content: processedContent,
      moderated: true,
      translated: targetLang !== 'en',
      originalLang: 'en',
      targetLang
    };
  }

  private async logProcessing(data: any) {
    // Log to your analytics system
    console.log('Content processed:', {
      userId: data.userId,
      contentLength: data.originalContent.length,
      moderated: data.moderationResult.safe,
      translated: data.translated
    });
  }
}

// Usage
const processor = new ContentProcessingService();
const result = await processor.processUserContent(
  "Hello, I need help with my order.",
  "es",
  "user123"
);
```

### Middleware Integration

Create middleware for cross-cutting concerns:

```typescript
// Logging middleware
class LoggingMiddleware {
  async execute(operation: () => Promise<any>, context: any) {
    const startTime = Date.now();

    try {
      const result = await operation();

      console.log('Operation completed:', {
        operation: context.operation,
        duration: Date.now() - startTime,
        success: true,
        userId: context.userId
      });

      return result;
    } catch (error) {
      console.error('Operation failed:', {
        operation: context.operation,
        duration: Date.now() - startTime,
        success: false,
        error: error.message,
        userId: context.userId
      });

      throw error;
    }
  }
}

// Caching middleware
class CachingMiddleware {
  private cache = new Map();

  async execute(operation: () => Promise<any>, context: any) {
    const key = this.generateKey(context);

    if (this.cache.has(key)) {
      console.log('Cache hit for:', key);
      return this.cache.get(key);
    }

    const result = await operation();
    this.cache.set(key, result);

    // Cache expiration (simple implementation)
    setTimeout(() => this.cache.delete(key), 300000); // 5 minutes

    return result;
  }

  private generateKey(context: any): string {
    return `${context.operation}_${JSON.stringify(context.params)}`;
  }
}

// Usage with middleware
const logging = new LoggingMiddleware();
const caching = new CachingMiddleware();

async function safeTranslate(text: string, lang: string, userId: string) {
  return await logging.execute(
    () => caching.execute(
      () => translateText(text, lang),
      { operation: 'translate', params: { text, lang }, userId }
    ),
    { operation: 'translate', userId }
  );
}
```

### Workflow Integration

Integrate complex workflows into your application:

```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

class ApplicationWorkflows {
  private workflowFactory = new WorkflowFactory();

  // Content ingestion workflow
  async createContentIngestionWorkflow() {
    return this.workflowFactory.createPipeline({
      name: 'content-ingestion',
      steps: [
        {
          type: 'guardrail',
          options: { checkType: 'input_validation' }
        },
        {
          type: 'data',
          options: { operations: ['clean', 'normalize_unicode'] }
        },
        {
          type: 'moderate',
          options: {}
        },
        {
          type: 'agent',
          options: { task: 'categorize' }
        },
        {
          type: 'translate',
          options: { targetLang: 'en' }
        }
      ]
    });
  }

  // User query processing workflow
  async createQueryProcessingWorkflow() {
    return this.workflowFactory.createPipeline({
      name: 'query-processing',
      steps: [
        {
          type: 'translate',
          options: { targetLang: 'en' }
        },
        {
          type: 'agent',
          options: { task: 'sentiment' }
        },
        {
          type: 'moderate',
          options: {}
        },
        {
          type: 'agent',
          options: { task: 'summarize', length: 'short' }
        }
      ]
    });
  }

  // Batch processing workflow
  async createBatchProcessingWorkflow(batchSize: number) {
    return this.workflowFactory.createPipeline({
      name: 'batch-processing',
      steps: [
        {
          type: 'batch',
          options: {
            batchSize,
            steps: [
              { type: 'translate', options: { targetLang: 'es' } },
              { type: 'moderate', options: {} }
            ]
          }
        }
      ]
    });
  }
}

// Usage in application
const workflows = new ApplicationWorkflows();

// Process incoming content
app.post('/api/content', async (req, res) => {
  const workflow = await workflows.createContentIngestionWorkflow();

  try {
    const result = await workflow.run({
      initialData: req.body.content,
      metadata: {
        userId: req.user.id,
        source: 'api'
      }
    });

    res.json({
      success: true,
      processedContent: result.data,
      metadata: result.metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

## Provider Extension

### Adding Custom Providers

Extend MCFACTORY with custom AI providers:

```typescript
import { Provider, ProviderRequest, ProviderResponse } from '../types';
import { ProviderRegistry } from '../core/providers/providerRegistry';

class CustomProvider implements Provider {
  name = 'custom-provider';

  async callModel(req: ProviderRequest): Promise<ProviderResponse> {
    // Implement your custom provider logic
    const response = await this.callCustomAPI(req);

    return {
      output: response.result,
      tokens: response.usage?.tokens,
      model: req.model,
      provider: this.name
    };
  }

  private async callCustomAPI(req: ProviderRequest): Promise<any> {
    // Your custom API integration
    const apiResponse = await fetch('https://your-custom-api.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CUSTOM_API_KEY}`
      },
      body: JSON.stringify({
        model: req.model,
        prompt: req.input,
        ...req.options
      })
    });

    return apiResponse.json();
  }
}

// Register the provider
ProviderRegistry.registerProvider(new CustomProvider());
```

### Provider Configuration

Configure custom providers:

```json
{
  "providers": {
    "custom": {
      "apiKey": "${CUSTOM_API_KEY}",
      "endpoint": "https://your-custom-api.com",
      "models": ["model-v1", "model-v2"],
      "options": {
        "timeout": 30000,
        "retries": 3
      }
    }
  }
}
```

## Error Handling Integration

### Global Error Handling

Set up application-wide error handling:

```typescript
import { ErrorHandler } from '../core/error/ErrorHandler';

const errorHandler = new ErrorHandler({
  onError: (error, context) => {
    // Log to your error monitoring system
    console.error('MCFACTORY Error:', {
      error: error.message,
      code: error.code,
      context,
      timestamp: new Date().toISOString()
    });

    // Send to monitoring service
    monitoring.captureException(error, { extra: context });
  },

  onRetryableError: (error, context) => {
    // Handle retryable errors
    console.warn('Retryable error, will retry:', error.message);
  }
});

// Set as global error handler
global.mcfErrorHandler = errorHandler;
```

### Service-Specific Error Handling

Handle errors in specific services:

```typescript
class SafeTranslationService {
  async translateWithFallback(text: string, targetLang: string) {
    try {
      return await translateText(text, targetLang);
    } catch (error) {
      if (error.code === 'PROVIDER_RATE_LIMIT') {
        // Wait and retry
        await delay(error.retryAfter || 60000);
        return await translateText(text, targetLang);
      }

      if (error.code === 'PROVIDER_QUOTA_EXCEEDED') {
        // Switch to different provider
        return await translateText(text, targetLang, 'anthropic');
      }

      if (error.code === 'TRANSLATION_UNSUPPORTED_LANGUAGE') {
        // Return original text
        console.warn(`Unsupported language: ${targetLang}`);
        return text;
      }

      // Re-throw unhandled errors
      throw error;
    }
  }
}
```

## Configuration Management

### Environment-Based Configuration

Manage configuration across environments:

```typescript
// config/development.js
export default {
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-3.5-turbo',
      options: { temperature: 0.7 }
    }
  },
  defaults: {
    translation: {
      preserveFormat: true
    }
  },
  errorHandling: {
    retry: { maxAttempts: 5 }
  }
};

// config/production.js
export default {
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
      enableCache: true
    }
  },
  errorHandling: {
    retry: { maxAttempts: 3 },
    circuitBreaker: { enabled: true }
  }
};
```

### Dynamic Configuration

Update configuration at runtime:

```typescript
import { ConfigManager } from '../core/config/ConfigManager';

const configManager = new ConfigManager();

// Load initial configuration
await configManager.load('./config/production.json');

// Update provider settings
configManager.updateProvider('openai', {
  model: 'gpt-4-turbo-preview',
  options: { temperature: 0.2 }
});

// Add new provider
configManager.addProvider('custom', {
  apiKey: process.env.CUSTOM_API_KEY,
  endpoint: 'https://custom-api.com'
});

// Reload configuration
await configManager.reload();
```

## Performance Optimization

### Caching Strategies

Implement multi-level caching:

```typescript
import { CacheManager } from '../core/cache/CacheManager';

const cacheManager = new CacheManager({
  levels: [
    { type: 'memory', maxSize: 1000, ttl: 300000 }, // 5 minutes
    { type: 'redis', ttl: 3600000 }, // 1 hour
    { type: 'filesystem', ttl: 86400000 } // 24 hours
  ]
});

// Cached translation
const result = await cacheManager.wrap(
  'translate',
  { text, targetLang },
  () => translateText(text, targetLang)
);
```

### Connection Pooling

Optimize provider connections:

```typescript
import { ConnectionPool } from '../core/providers/ConnectionPool';

const pool = new ConnectionPool({
  maxConnections: 10,
  minConnections: 2,
  acquireTimeout: 30000,
  idleTimeout: 600000
});

// Use pooled connections
const connection = await pool.acquire();
try {
  const result = await connection.call(request);
  return result;
} finally {
  pool.release(connection);
}
```

### Request Batching

Batch multiple requests for efficiency:

```typescript
import { BatchProcessor } from '../core/utils/BatchProcessor';

const batchProcessor = new BatchProcessor({
  maxBatchSize: 10,
  maxWaitTime: 1000 // 1 second
});

// Queue requests for batching
const promises = texts.map(text =>
  batchProcessor.add(() => translateText(text, 'es'))
);

// Wait for all results
const results = await Promise.all(promises);
```

## Monitoring and Observability

### Metrics Collection

Track application performance:

```typescript
import { MetricsCollector } from '../core/monitoring/MetricsCollector';

const metrics = new MetricsCollector();

// Track operation metrics
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    metrics.record({
      operation: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent')
    });
  });

  next();
});

// Get metrics
app.get('/metrics', (req, res) => {
  res.json(metrics.getSummary());
});
```

### Health Checks

Implement health check endpoints:

```typescript
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  };

  try {
    // Check MCF providers
    const providers = await checkProviderHealth();
    health.checks.providers = providers;

    // Check database connectivity
    const dbStatus = await checkDatabaseHealth();
    health.checks.database = dbStatus;

    // Check external services
    const externalStatus = await checkExternalServices();
    health.checks.external = externalStatus;

    const overallStatus = Object.values(health.checks).every(check => check.healthy);
    health.status = overallStatus ? 'healthy' : 'unhealthy';

    res.status(overallStatus ? 200 : 503).json(health);
  } catch (error) {
    health.status = 'unhealthy';
    health.error = error.message;
    res.status(503).json(health);
  }
});
```

## Security Considerations

### API Key Management

Securely manage API keys:

```typescript
import { KeyManager } from '../core/security/KeyManager';

const keyManager = new KeyManager({
  encryptionKey: process.env.KEY_ENCRYPTION_KEY,
  rotationInterval: 30 * 24 * 60 * 60 * 1000 // 30 days
});

// Store encrypted keys
await keyManager.storeKey('openai', process.env.OPENAI_API_KEY);

// Retrieve decrypted keys
const apiKey = await keyManager.getKey('openai');
```

### Input Validation

Validate all inputs before processing:

```typescript
import { InputValidator } from '../core/validation/InputValidator';

const validator = new InputValidator({
  maxTextLength: 10000,
  allowedLanguages: ['en', 'es', 'fr', 'de', 'ja'],
  contentTypes: ['text/plain', 'text/markdown']
});

app.use('/api/mcf/*', async (req, res, next) => {
  try {
    await validator.validateRequest(req);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Invalid input',
      details: error.details
    });
  }
});
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const mcfLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/mcf', mcfLimiter);
```

## Testing Integration

### Unit Testing

Test MCFACTORY integrations:

```typescript
import { translateText } from '../services/translation/translateText';

describe('Translation Integration', () => {
  test('translates English to Spanish', async () => {
    const result = await translateText('Hello', 'es');
    expect(result).toBe('Hola');
  });

  test('handles errors gracefully', async () => {
    await expect(translateText('', 'es')).rejects.toThrow('Empty input');
  });

  test('respects rate limits', async () => {
    // Test rate limiting behavior
    const promises = Array(150).fill().map(() =>
      translateText('Test', 'es').catch(() => 'rate_limited')
    );

    const results = await Promise.all(promises);
    const rateLimited = results.filter(r => r === 'rate_limited');
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

### Integration Testing

Test complete workflows:

```typescript
describe('Content Processing Workflow', () => {
  test('processes content end-to-end', async () => {
    const testContent = 'This is a test article about artificial intelligence.';

    // Process through complete workflow
    const result = await processContent(testContent);

    expect(result).toHaveProperty('translated');
    expect(result).toHaveProperty('moderated');
    expect(result).toHaveProperty('categorized');
    expect(result).toHaveProperty('sentiment');
  });

  test('handles failures gracefully', async () => {
    const invalidContent = '   '; // Invalid input

    await expect(processContent(invalidContent))
      .rejects.toThrow('Invalid input');
  });
});
```

## Deployment Considerations

### Container Deployment

Deploy with Docker:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables

Configure for different environments:

```bash
# Development
export MCFACTORY_CONFIG=./config/dev.json
export LOG_LEVEL=debug

# Production
export MCFACTORY_CONFIG=./config/prod.json
export LOG_LEVEL=warn
export MCFACTORY_CACHE_ENABLED=true
```

### Scaling Considerations

Scale MCFACTORY applications horizontally:

```typescript
// Load balancing configuration
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  // Worker process
  const app = createMCFACTORYApplication();
  app.listen(3000);
}
```

## Best Practices

### Application Architecture

1. **Layer Separation**: Keep MCFACTORY logic separate from business logic
2. **Dependency Injection**: Use dependency injection for MCFACTORY services
3. **Configuration Management**: Centralize MCFACTORY configuration
4. **Error Boundaries**: Implement error boundaries around MCFACTORY operations
5. **Caching Strategy**: Implement appropriate caching for performance
6. **Monitoring**: Monitor MCFACTORY operations and performance

### Code Organization

1. **Service Wrappers**: Create application-specific wrappers around MCFACTORY services
2. **Middleware Pattern**: Use middleware for cross-cutting concerns
3. **Factory Pattern**: Use factories for complex object creation
4. **Repository Pattern**: Abstract data access behind repositories

### Security

1. **Input Validation**: Always validate inputs before MCFACTORY processing
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **API Key Security**: Securely manage and rotate API keys
4. **Audit Logging**: Log all MCFACTORY operations for security review
5. **Access Control**: Implement proper authorization for MCFACTORY endpoints

### Performance

1. **Caching**: Cache frequently used results
2. **Batching**: Batch multiple requests when possible
3. **Connection Pooling**: Use connection pooling for providers
4. **Async Processing**: Use async operations for better performance
5. **Resource Limits**: Set appropriate resource limits

### Maintainability

1. **Documentation**: Document MCFACTORY integrations and configurations
2. **Testing**: Write comprehensive tests for MCFACTORY integrations
3. **Version Pinning**: Pin MCFACTORY versions to ensure stability
4. **Change Management**: Have procedures for MCFACTORY updates
5. **Monitoring**: Monitor MCFACTORY performance and errors

This integration guide provides the foundation for successfully incorporating MCFACTORY into your applications, with patterns and practices that ensure reliability, performance, and maintainability.
