# Workflows

MCFACTORY Workflows provide powerful pipeline orchestration capabilities for complex multi-step AI processing operations. Workflows enable you to combine multiple AI tasks into cohesive processing pipelines with sequential execution, parallel processing, error handling, and result aggregation.

## Core Concepts

### Pipeline Definition

A pipeline defines a series of processing steps that transform input data through multiple AI operations.

```typescript
interface PipelineDefinition {
  name: string;
  steps: PipelineStep[];
}

interface PipelineStep {
  type: string;           // "translate", "detectAI", "moderate", etc.
  options?: Record<string, any>;  // Step-specific configuration
}
```

### Pipeline Execution

Pipelines are executed by the WorkflowFactory, which manages step coordination, data flow, and error handling.

```typescript
interface PipelineResult<T = any> {
  success: boolean;
  data: T;
  logs: string[];
}
```

## Pipeline Types

### Sequential Pipelines

Steps execute one after another, with each step receiving the output of the previous step.

```typescript
const sequentialPipeline: PipelineDefinition = {
  name: "Content Analysis Pipeline",
  steps: [
    {
      type: "guardrail",
      options: { checkType: "input_validation" }
    },
    {
      type: "translate",
      options: { targetLang: "en" }
    },
    {
      type: "moderate",
      options: {}
    },
    {
      type: "agent",
      options: { task: "summarize", length: "medium" }
    },
    {
      type: "guardrail",
      options: { checkType: "output_validation" }
    }
  ]
};
```

### Parallel Pipelines

Multiple steps execute simultaneously, with results combined at the end.

```typescript
const parallelPipeline: PipelineDefinition = {
  name: "Multi-Modal Analysis",
  steps: [
    {
      type: "parallel",
      options: {
        branches: [
          [
            { type: "translate", options: { targetLang: "es" } },
            { type: "moderate", options: {} }
          ],
          [
            { type: "translate", options: { targetLang: "fr" } },
            { type: "agent", options: { task: "sentiment" } }
          ],
          [
            { type: "detection", options: { type: "ai" } }
          ]
        ]
      }
    },
    {
      type: "aggregate",
      options: { strategy: "merge" }
    }
  ]
};
```

### Conditional Pipelines

Steps execute based on conditions or previous step results.

```typescript
const conditionalPipeline: PipelineDefinition = {
  name: "Smart Content Processor",
  steps: [
    {
      type: "moderate",
      options: {}
    },
    {
      type: "conditional",
      options: {
        condition: "result.safe === true",
        trueSteps: [
          { type: "translate", options: { targetLang: "en" } },
          { type: "agent", options: { task: "summarize" } }
        ],
        falseSteps: [
          { type: "guardrail", options: { action: "block" } }
        ]
      }
    }
  ]
};
```

## Workflow Factory

The WorkflowFactory provides methods for creating and executing pipelines.

### Predefined Workflows

MCFACTORY includes several predefined workflow templates:

```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

// Translation workflow with guardrails
const translationWorkflow = WorkflowFactory.createTranslationWorkflow('es');

// Content processing workflow
const contentWorkflow = WorkflowFactory.createContentProcessingWorkflow();

// Media processing workflow
const mediaWorkflow = WorkflowFactory.createMediaProcessingWorkflow();

// AI analysis workflow
const aiAnalysisWorkflow = WorkflowFactory.createAIAnalysisWorkflow();
```

### Custom Workflow Execution

Execute custom pipelines with full control:

```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

const factory = new WorkflowFactory();

const customPipeline: PipelineDefinition = {
  name: "Custom Analysis Pipeline",
  steps: [
    { type: "data", options: { operations: ["clean", "normalize"] } },
    { type: "translate", options: { targetLang: "en" } },
    { type: "agent", options: { task: "categorize" } },
    { type: "moderate", options: {} }
  ]
};

const result = await factory.run({
  pipeline: customPipeline,
  initialData: userInput
}, {
  debug: true,
  provider: "openai"
});

if (result.success) {
  console.log('Pipeline completed:', result.data);
  console.log('Execution logs:', result.logs);
} else {
  console.error('Pipeline failed:', result.logs);
}
```

## Step Types

### Core Step Types

#### Guardrail Steps
```typescript
{
  type: "guardrail",
  options: {
    checkType: "input_validation", // or "output_validation"
    bannedTopics: ["violence", "hate-speech"],
    hallucinationThreshold: 0.7
  }
}
```

#### Translation Steps
```typescript
{
  type: "translate",
  options: {
    targetLang: "es",
    sourceLang: "en", // optional
    preserveFormat: true
  }
}
```

#### Moderation Steps
```typescript
{
  type: "moderate",
  options: {
    categories: ["hate", "violence", "adult"],
    threshold: 0.8
  }
}
```

#### Agent Steps
```typescript
{
  type: "agent",
  options: {
    task: "summarize", // or "sentiment", "categorize"
    length: "medium",  // for summarization
    tags: ["tech"]     // for categorization
  }
}
```

#### Detection Steps
```typescript
{
  type: "detection",
  options: {
    type: "ai", // or "fakeVoice"
    threshold: 0.8
  }
}
```

#### Media Steps
```typescript
// Speech-to-Text
{
  type: "media",
  options: {
    operation: "stt",
    language: "en"
  }
}

// Text-to-Speech
{
  type: "media",
  options: {
    operation: "tts",
    voice: "Rachel"
  }
}

// OCR
{
  type: "media",
  options: {
    operation: "ocr"
  }
}
```

#### Data Processing Steps
```typescript
{
  type: "data",
  options: {
    operations: ["clean", "normalize_unicode", "filter_profanity"],
    filters: {
      maxLength: 1000,
      removeUrls: true
    }
  }
}
```

### Control Flow Steps

#### Parallel Execution
```typescript
{
  type: "parallel",
  options: {
    branches: [
      [
        { type: "translate", options: { targetLang: "es" } },
        { type: "moderate", options: {} }
      ],
      [
        { type: "translate", options: { targetLang: "fr" } },
        { type: "agent", options: { task: "sentiment" } }
      ]
    ]
  }
}
```

#### Conditional Execution
```typescript
{
  type: "conditional",
  options: {
    condition: "previousResult.safe === true",
    trueSteps: [
      { type: "translate", options: { targetLang: "en" } }
    ],
    falseSteps: [
      { type: "guardrail", options: { action: "block" } }
    ]
  }
}
```

#### Loop Execution
```typescript
{
  type: "loop",
  options: {
    condition: "iteration < 3",
    steps: [
      { type: "agent", options: { task: "summarize" } },
      { type: "data", options: { operations: ["truncate"] } }
    ]
  }
}
```

## Data Flow and Transformation

### Data Context

Pipelines maintain a data context that flows between steps:

```typescript
interface PipelineContext {
  data: any;              // Current data being processed
  metadata: Record<string, any>;  // Additional context
  stepResults: any[];     // Results from previous steps
  logs: string[];         // Execution logs
}
```

### Data Transformation

Steps can transform data in various ways:

```typescript
// Input: "Hello world"
// After translation step: { translated: "Hola mundo", original: "Hello world" }
// After moderation step: { translated: "Hola mundo", original: "Hello world", safe: true }
// After agent step: { summary: "Greeting translation", ... }
```

### Custom Data Transformers

Create custom transformation logic:

```typescript
const customPipeline = {
  name: "Data Transformation Pipeline",
  steps: [
    {
      type: "transform",
      options: {
        transformer: (data) => ({
          ...data,
          processedAt: new Date().toISOString(),
          wordCount: data.text.split(' ').length
        })
      }
    }
  ]
};
```

## Error Handling and Recovery

### Step-Level Error Handling

Configure error handling for individual steps:

```typescript
{
  type: "translate",
  options: {
    targetLang: "es",
    errorHandling: {
      retryCount: 3,
      fallbackAction: "skip", // "skip", "fail", "use_default"
      defaultValue: "Translation failed"
    }
  }
}
```

### Pipeline-Level Error Handling

Configure error handling for entire pipelines:

```typescript
const result = await factory.run({
  pipeline: pipeline,
  initialData: input
}, {
  metadata: {
    continueOnError: true,  // Continue execution even if steps fail
    maxRetries: 2,
    errorThreshold: 0.5     // Fail if more than 50% steps error
  }
});
```

### Error Recovery Strategies

1. **Retry**: Automatically retry failed steps
2. **Skip**: Skip failed steps and continue
3. **Fallback**: Use alternative steps or default values
4. **Rollback**: Revert to previous successful state

## Performance Optimization

### Parallel Execution

Execute independent steps in parallel:

```typescript
const parallelWorkflow = {
  name: "Parallel Processing",
  steps: [
    {
      type: "parallel",
      options: {
        maxConcurrency: 3,  // Limit concurrent execution
        branches: [
          [{ type: "translate", options: { targetLang: "es" } }],
          [{ type: "translate", options: { targetLang: "fr" } }],
          [{ type: "detection", options: { type: "ai" } }]
        ]
      }
    }
  ]
};
```

### Caching

Cache intermediate results to avoid redundant processing:

```typescript
const cachedWorkflow = {
  name: "Cached Processing",
  steps: [
    {
      type: "cache",
      options: {
        key: "translation_${input.language}_${input.text}",
        ttl: 3600000  // 1 hour
      }
    },
    { type: "translate", options: { targetLang: "en" } }
  ]
};
```

### Batch Processing

Process multiple items efficiently:

```typescript
const batchWorkflow = {
  name: "Batch Processing",
  steps: [
    {
      type: "batch",
      options: {
        batchSize: 10,
        steps: [
          { type: "translate", options: { targetLang: "en" } },
          { type: "moderate", options: {} }
        ]
      }
    }
  ]
};
```

## Monitoring and Debugging

### Debug Mode

Enable detailed logging and debugging:

```typescript
const result = await factory.run({
  pipeline: pipeline,
  initialData: input
}, {
  debug: true  // Enable debug logging
});

console.log('Debug logs:', result.logs);
```

### Step Metrics

Track performance metrics for each step:

```typescript
// Pipeline result includes timing information
console.log('Step timings:', result.stepTimings);
// {
//   "translate": 1250,    // 1.25 seconds
//   "moderate": 800,      // 0.8 seconds
//   "summarize": 2100     // 2.1 seconds
// }
```

### Pipeline Visualization

Generate pipeline execution diagrams:

```typescript
const visualization = await factory.visualizePipeline(pipeline);
// Returns ASCII diagram or GraphViz DOT format
```

## Configuration

Configure workflow behavior through MCFACTORY configuration:

```json
{
  "pipelines": {
    "content-moderation": {
      "name": "Content Moderation Pipeline",
      "steps": [
        {
          "type": "guardrail",
          "options": { "checkType": "input_validation" }
        },
        {
          "type": "moderation",
          "options": {}
        }
      ]
    }
  },
  "defaults": {
    "workflows": {
      "maxConcurrency": 5,
      "defaultTimeout": 30000,
      "continueOnError": false
    }
  }
}
```

## Advanced Patterns

### Fan-Out/Fan-In

Distribute work across multiple parallel branches and combine results:

```typescript
const fanOutFanInPipeline = {
  name: "Fan-Out/Fan-In Processing",
  steps: [
    {
      type: "split",
      options: {
        splitter: (data) => data.texts,  // Split array into individual items
        branches: [
          { type: "translate", options: { targetLang: "es" } },
          { type: "translate", options: { targetLang: "fr" } },
          { type: "translate", options: { targetLang: "de" } }
        ]
      }
    },
    {
      type: "aggregate",
      options: {
        strategy: "merge",
        key: "language"
      }
    }
  ]
};
```

### Saga Pattern

Implement long-running transactions with compensation:

```typescript
const sagaPipeline = {
  name: "Saga Transaction",
  steps: [
    {
      type: "saga",
      options: {
        steps: [
          {
            type: "data",
            options: { operations: ["validate"] },
            compensation: { type: "data", options: { operations: ["rollback"] } }
          },
          {
            type: "translate",
            options: { targetLang: "es" },
            compensation: { type: "translate", options: { targetLang: "en" } }
          }
        ]
      }
    }
  ]
};
```

### Event-Driven Workflows

Trigger workflows based on events or conditions:

```typescript
const eventDrivenPipeline = {
  name: "Event-Driven Processing",
  steps: [
    {
      type: "event-listener",
      options: {
        event: "content_uploaded",
        condition: "event.type === 'text'",
        steps: [
          { type: "moderate", options: {} },
          { type: "agent", options: { task: "categorize" } }
        ]
      }
    }
  ]
};
```

## Integration with CLI

Execute pipelines from the command line:

```bash
# Run a named pipeline
mcf run-pipeline content-moderation --input "Text to process"

# Run custom pipeline from file
mcf run-pipeline --file custom-pipeline.json --input-file input.txt

# Run with debug output
mcf run-pipeline translation-workflow --debug --input "Hello world"
```

## Best Practices

1. **Modular Steps**: Keep individual steps focused on single responsibilities
2. **Error Boundaries**: Implement proper error handling at appropriate levels
3. **Resource Management**: Be mindful of memory usage in long-running pipelines
4. **Monitoring**: Enable logging and monitoring for production pipelines
5. **Testing**: Thoroughly test pipelines with various inputs and edge cases
6. **Versioning**: Version pipeline definitions for reproducibility
7. **Documentation**: Document complex pipelines and their expected inputs/outputs

## Use Cases

### Content Processing Pipeline
```typescript
// Process user-generated content
const contentPipeline = {
  name: "Content Processing",
  steps: [
    { type: "guardrail", options: { checkType: "input_validation" } },
    { type: "data", options: { operations: ["clean", "normalize"] } },
    { type: "moderate", options: {} },
    { type: "translate", options: { targetLang: "en" } },
    { type: "agent", options: { task: "categorize" } },
    { type: "guardrail", options: { checkType: "output_validation" } }
  ]
};
```

### Document Analysis Pipeline
```typescript
// Analyze and summarize documents
const documentPipeline = {
  name: "Document Analysis",
  steps: [
    { type: "media", options: { operation: "ocr" } },
    { type: "data", options: { operations: ["clean"] } },
    { type: "translate", options: { targetLang: "en" } },
    { type: "agent", options: { task: "summarize", length: "long" } },
    { type: "agent", options: { task: "categorize" } }
  ]
};
```

### Customer Support Pipeline
```typescript
// Process customer support tickets
const supportPipeline = {
  name: "Customer Support",
  steps: [
    { type: "agent", options: { task: "categorize", tags: ["support"] } },
    { type: "agent", options: { task: "sentiment" } },
    { type: "moderate", options: {} },
    {
      type: "conditional",
      options: {
        condition: "sentiment.positive < 0.3",
        trueSteps: [{ type: "escalate", options: { priority: "high" } }],
        falseSteps: [{ type: "auto_respond", options: {} }]
      }
    }
  ]
};
```
