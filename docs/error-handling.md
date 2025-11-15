# Error Handling

MCF provides comprehensive error handling mechanisms designed for reliability, observability, and graceful degradation. The error handling system follows consistent patterns across all layers and provides actionable error information for debugging and recovery.

## Error Architecture

### Error Types

MCF defines specific error types for different categories of failures:

#### Provider Errors
```typescript
interface ProviderError extends Error {
  code: 'PROVIDER_RATE_LIMIT' | 'PROVIDER_QUOTA_EXCEEDED' | 'PROVIDER_INVALID_REQUEST' | 'PROVIDER_NETWORK_ERROR' | 'PROVIDER_MODEL_ERROR';
  provider: string;
  retryable: boolean;
  retryAfter?: number;
  details?: any;
}
```

#### Factory Errors
```typescript
interface FactoryError extends Error {
  code: 'FACTORY_INPUT_INVALID' | 'FACTORY_PROCESSING_FAILED' | 'FACTORY_TIMEOUT' | 'FACTORY_PROVIDER_UNAVAILABLE';
  factory: string;
  input?: any;
  metadata?: Record<string, any>;
}
```

#### Service Errors
```typescript
interface ServiceError extends Error {
  code: 'SERVICE_INPUT_INVALID' | 'SERVICE_OPERATION_FAILED' | 'SERVICE_TIMEOUT' | 'SERVICE_DEPENDENCY_ERROR';
  service: string;
  operation?: string;
  params?: any;
}
```

#### Workflow Errors
```typescript
interface WorkflowError extends Error {
  code: 'WORKFLOW_STEP_FAILED' | 'WORKFLOW_TIMEOUT' | 'WORKFLOW_DEPENDENCY_ERROR';
  workflow: string;
  stepIndex?: number;
  stepType?: string;
  partialResults?: any;
}
```

## Error Propagation

Errors flow through MCF layers with appropriate context addition:

```
User Code → Service → Factory → Provider → AI API
    ↑           ↑         ↑         ↑         ↑
  Error       Context   Context   Context   Original
 Response    Added      Added     Added     Error
```

### Error Enrichment

Each layer adds context to errors:

```typescript
// Provider level
try {
  const response = await provider.callModel(request);
} catch (error) {
  throw new ProviderError({
    code: 'PROVIDER_NETWORK_ERROR',
    provider: this.name,
    message: `Provider ${this.name} network error: ${error.message}`,
    retryable: true,
    originalError: error
  });
}

// Factory level
try {
  const result = await provider.callModel(req);
  return this.processResponse(result);
} catch (error) {
  if (error instanceof ProviderError) {
    throw new FactoryError({
      code: 'FACTORY_PROVIDER_UNAVAILABLE',
      factory: this.constructor.name,
      message: `Factory operation failed: ${error.message}`,
      provider: error.provider,
      originalError: error
    });
  }
}
```

## Error Handling Strategies

### Retry Logic

MCF implements sophisticated retry mechanisms:

#### Exponential Backoff
```typescript
class RetryHandler {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    options: {
      maxAttempts: number;
      baseDelay: number;
      maxDelay: number;
      backoffFactor: number;
    }
  ): Promise<T> {
    let attempt = 1;

    while (attempt <= options.maxAttempts) {
      try {
        return await operation();
      } catch (error) {
        if (!this.isRetryable(error) || attempt === options.maxAttempts) {
          throw error;
        }

        const delay = Math.min(
          options.baseDelay * Math.pow(options.backoffFactor, attempt - 1),
          options.maxDelay
        );

        await this.delay(delay);
        attempt++;
      }
    }
  }

  private isRetryable(error: any): boolean {
    return error.retryable ||
           error.code === 'PROVIDER_RATE_LIMIT' ||
           error.code === 'PROVIDER_NETWORK_ERROR';
  }
}
```

#### Circuit Breaker Pattern
```typescript
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failures = 0;
  private lastFailureTime = 0;

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return Date.now() - this.lastFailureTime > this.timeout;
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }
}
```

### Fallback Mechanisms

Multiple fallback strategies for resilience:

#### Provider Fallback
```typescript
const result = await factory.run(input, {
  metadata: {
    fallbackProviders: ['anthropic', 'gemini', 'openai']
  }
});
```

#### Default Value Fallback
```typescript
async function safeTranslate(text: string, targetLang: string): Promise<string> {
  try {
    return await translateText(text, targetLang);
  } catch (error) {
    if (error.code === 'TRANSLATION_UNSUPPORTED_LANGUAGE') {
      // Return original text for unsupported languages
      return text;
    }
    if (error.retryable) {
      // Try once more with different provider
      return await translateText(text, targetLang, 'anthropic');
    }
    // Return a generic error message
    return `[Translation failed: ${error.message}]`;
  }
}
```

#### Graceful Degradation
```typescript
async function processContent(content: string) {
  try {
    // Try full processing pipeline
    return await fullContentProcessing(content);
  } catch (error) {
    console.warn('Full processing failed, falling back to basic processing');

    try {
      // Fallback to basic processing
      return await basicContentProcessing(content);
    } catch (fallbackError) {
      console.error('Basic processing also failed');

      // Final fallback: return original content with warning
      return {
        processed: content,
        warning: 'Content processing failed, showing original',
        error: error.message
      };
    }
  }
}
```

## Error Classification

### Transient vs Permanent Errors

MCF classifies errors to determine appropriate handling:

```typescript
function classifyError(error: any): 'transient' | 'permanent' | 'unknown' {
  // Transient errors (retryable)
  if (error.code === 'PROVIDER_RATE_LIMIT' ||
      error.code === 'PROVIDER_NETWORK_ERROR' ||
      error.code === 'TIMEOUT') {
    return 'transient';
  }

  // Permanent errors (non-retryable)
  if (error.code === 'PROVIDER_INVALID_REQUEST' ||
      error.code === 'UNSUPPORTED_LANGUAGE' ||
      error.code === 'QUOTA_EXCEEDED') {
    return 'permanent';
  }

  return 'unknown';
}
```

### Error Severity Levels

```typescript
enum ErrorSeverity {
  LOW = 'low',       // Minor issues, operation can continue
  MEDIUM = 'medium', // Significant issues, may affect functionality
  HIGH = 'high',     // Critical issues, operation fails
  CRITICAL = 'critical' // System-level failures
}

function getErrorSeverity(error: any): ErrorSeverity {
  if (error.code?.includes('RATE_LIMIT')) return ErrorSeverity.LOW;
  if (error.code?.includes('NETWORK')) return ErrorSeverity.MEDIUM;
  if (error.code?.includes('QUOTA')) return ErrorSeverity.HIGH;
  if (error.code?.includes('AUTH')) return ErrorSeverity.CRITICAL;

  return ErrorSeverity.MEDIUM;
}
```

## Error Monitoring and Logging

### Structured Logging

MCF provides structured error logging:

```typescript
interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  error: {
    code: string;
    message: string;
    stack?: string;
  };
  context: {
    operation: string;
    userId?: string;
    sessionId?: string;
    provider?: string;
    factory?: string;
  };
  metadata?: Record<string, any>;
}

class ErrorLogger {
  log(error: any, context: any) {
    const logEntry: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: this.getLogLevel(error),
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        stack: error.stack
      },
      context: {
        operation: context.operation,
        userId: context.userId,
        sessionId: context.sessionId,
        provider: context.provider,
        factory: context.factory
      },
      metadata: context.metadata
    };

    // Log to monitoring system
    this.sendToMonitoring(logEntry);
  }
}
```

### Error Metrics

Track error patterns and trends:

```typescript
class ErrorMetrics {
  private metrics = new Map();

  recordError(error: any, context: any) {
    const key = `${error.code}_${context.operation}`;

    const current = this.metrics.get(key) || {
      count: 0,
      firstSeen: Date.now(),
      lastSeen: Date.now()
    };

    current.count++;
    current.lastSeen = Date.now();

    this.metrics.set(key, current);
  }

  getErrorStats(): any {
    return Array.from(this.metrics.entries()).map(([key, stats]) => ({
      errorKey: key,
      ...stats
    }));
  }

  getTopErrors(limit = 10): any[] {
    return this.getErrorStats()
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}
```

## User-Facing Error Messages

### Error Message Translation

Provide user-friendly error messages:

```typescript
const errorMessages = {
  'PROVIDER_RATE_LIMIT': 'The service is currently busy. Please try again in a moment.',
  'PROVIDER_QUOTA_EXCEEDED': 'Your usage limit has been reached. Please upgrade your plan or try again later.',
  'TRANSLATION_UNSUPPORTED_LANGUAGE': 'This language pair is not currently supported.',
  'DETECTION_INVALID_INPUT': 'The provided content could not be analyzed. Please check the format and try again.',
  'MODERATION_CONTENT_BLOCKED': 'Your content was flagged by our safety filters and cannot be processed.'
};

function getUserFriendlyMessage(errorCode: string, originalMessage?: string): string {
  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again or contact support.';
}
```

### Contextual Error Messages

Include context-specific guidance:

```typescript
function createContextualErrorMessage(error: any, context: any): string {
  let message = getUserFriendlyMessage(error.code);

  // Add context-specific guidance
  switch (error.code) {
    case 'TRANSLATION_UNSUPPORTED_LANGUAGE':
      message += ` Supported languages include: ${context.supportedLanguages?.join(', ')}`;
      break;
    case 'PROVIDER_QUOTA_EXCEEDED':
      message += ` You can check your usage at ${context.usageUrl}`;
      break;
    case 'MODERATION_CONTENT_BLOCKED':
      message += ` Please review our content guidelines: ${context.guidelinesUrl}`;
      break;
  }

  return message;
}
```

## Error Recovery Patterns

### Automatic Recovery

Implement automatic recovery for transient errors:

```typescript
async function withAutoRecovery<T>(
  operation: () => Promise<T>,
  recoveryStrategies: Array<(error: any) => Promise<T> | T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    for (const strategy of recoveryStrategies) {
      try {
        return await strategy(error);
      } catch (recoveryError) {
        // Recovery strategy failed, try next one
        continue;
      }
    }
    // All recovery strategies failed
    throw error;
  }
}

// Usage
const result = await withAutoRecovery(
  () => translateText(text, lang),
  [
    // Strategy 1: Retry with different provider
    (error) => translateText(text, lang, 'anthropic'),
    // Strategy 2: Use cached result
    (error) => getCachedTranslation(text, lang),
    // Strategy 3: Return original text
    (error) => text
  ]
);
```

### Manual Recovery

Provide recovery options for user intervention:

```typescript
interface RecoveryOptions {
  retry: boolean;
  useFallback: boolean;
  skipOperation: boolean;
  customHandler?: (error: any) => Promise<any>;
}

async function handleErrorWithRecovery(
  error: any,
  options: RecoveryOptions
): Promise<any> {
  if (options.retry && error.retryable) {
    return await retryOperation();
  }

  if (options.useFallback) {
    return await fallbackOperation();
  }

  if (options.skipOperation) {
    return null; // Skip this operation
  }

  if (options.customHandler) {
    return await options.customHandler(error);
  }

  throw error; // No recovery possible
}
```

## Error Testing

### Error Simulation

Test error handling with simulated failures:

```typescript
class ErrorSimulator {
  async simulateProviderError(type: string): Promise<void> {
    switch (type) {
      case 'rate_limit':
        throw new ProviderError({
          code: 'PROVIDER_RATE_LIMIT',
          message: 'Rate limit exceeded',
          retryable: true,
          retryAfter: 60
        });
      case 'network':
        throw new ProviderError({
          code: 'PROVIDER_NETWORK_ERROR',
          message: 'Network connection failed',
          retryable: true
        });
      case 'quota':
        throw new ProviderError({
          code: 'PROVIDER_QUOTA_EXCEEDED',
          message: 'API quota exceeded',
          retryable: false
        });
    }
  }
}

// Test error handling
describe('Error Handling', () => {
  test('handles rate limit with retry', async () => {
    const simulator = new ErrorSimulator();

    // Mock provider to simulate rate limit
    const mockProvider = {
      callModel: jest.fn()
        .mockRejectedValueOnce(await simulator.simulateProviderError('rate_limit'))
        .mockResolvedValueOnce({ output: 'success' })
    };

    const result = await withRetry(() => mockProvider.callModel({}));
    expect(result.output).toBe('success');
  });
});
```

### Chaos Engineering

Introduce controlled failures to test resilience:

```typescript
class ChaosEngine {
  async injectFailure(type: 'delay' | 'error' | 'timeout', probability = 0.1) {
    if (Math.random() < probability) {
      switch (type) {
        case 'delay':
          await new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
          break;
        case 'error':
          throw new Error('Chaos-induced failure');
        case 'timeout':
          // Simulate timeout by delaying beyond configured timeout
          await new Promise(resolve => setTimeout(resolve, 35000));
          break;
      }
    }
  }
}
```

## Configuration

Configure error handling behavior:

```json
{
  "errorHandling": {
    "retry": {
      "maxAttempts": 3,
      "baseDelay": 1000,
      "maxDelay": 30000,
      "backoffFactor": 2
    },
    "circuitBreaker": {
      "failureThreshold": 5,
      "timeout": 60000,
      "monitoringPeriod": 120000
    },
    "logging": {
      "level": "warn",
      "includeStackTraces": true,
      "structured": true
    },
    "fallback": {
      "enabled": true,
      "providers": ["anthropic", "gemini"]
    }
  }
}
```

## Best Practices

### Error Handling Principles

1. **Fail Fast**: Detect and report errors early
2. **Fail Safely**: Default to safe behavior when possible
3. **Fail Transparently**: Provide clear error information
4. **Fail Recoverably**: Enable automatic and manual recovery

### Implementation Guidelines

1. **Consistent Error Types**: Use standardized error codes and messages
2. **Context Preservation**: Include relevant context in error information
3. **Logging Strategy**: Log errors with appropriate detail levels
4. **User Communication**: Provide user-friendly error messages
5. **Monitoring Integration**: Send errors to monitoring and alerting systems
6. **Testing Coverage**: Test error scenarios thoroughly
7. **Documentation**: Document expected errors and recovery procedures

### Error Handling Patterns

#### Try-Catch with Specific Handling
```typescript
try {
  const result = await operation();
  return result;
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    await delay(error.retryAfter);
    return await operation(); // Retry
  } else if (error.code === 'QUOTA_EXCEEDED') {
    throw new UserError('Usage limit reached', error);
  } else {
    throw error; // Re-throw unknown errors
  }
}
```

#### Async Error Boundaries
```typescript
class ErrorBoundary {
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      await this.logError(error);
      await this.notifyMonitoring(error);

      if (this.canRecover(error)) {
        return await this.recover(error);
      }

      throw this.formatError(error);
    }
  }
}
```

#### Error Aggregation
```typescript
class BatchErrorHandler {
  private errors: any[] = [];

  async executeBatch<T>(operations: Array<() => Promise<T>>): Promise<T[]> {
    const results = await Promise.allSettled(operations);

    const successful: T[] = [];
    const failed: any[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successful.push(result.value);
      } else {
        failed.push({
          index,
          error: result.reason,
          operation: operations[index]
        });
      }
    });

    if (failed.length > 0) {
      this.errors.push(...failed);

      if (failed.length === operations.length) {
        throw new BatchError('All operations failed', failed);
      }

      // Partial success - log warnings but return results
      console.warn(`${failed.length} operations failed in batch`);
    }

    return successful;
  }
}
```

This comprehensive error handling system ensures MCF applications are robust, observable, and user-friendly when failures occur.
