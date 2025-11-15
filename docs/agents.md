# Agents

MCF Agents provide intelligent text processing capabilities through specialized AI models. Agents use the factory pattern to route requests to appropriate providers while maintaining consistent interfaces.

## Available Agents

### Summarization Agent

Generate concise summaries of text content, conversations, and documents.

#### Features
- Multiple summary lengths (short, medium, long)
- Preserves key information and context
- Handles various content types (articles, emails, transcripts)
- Configurable detail level

#### Example

```typescript
import { AgentFactory } from '../core/factories/AgentFactory';

const factory = new AgentFactory();

// Short summary
const shortSummary = await factory.summarize({
  text: "The quarterly earnings report shows a 15% increase in revenue compared to last year. The company attributed this growth to strong performance in the technology sector and increased demand for cloud services. Operating expenses rose by 8% due to investments in R&D and infrastructure. Net profit margins improved from 12% to 14%.",
  length: "short"
});

console.log(shortSummary.summary);
// Output: "Company reported 15% revenue growth driven by technology sector performance and cloud services demand. Net profit margins improved to 14% despite 8% increase in operating expenses."

// Medium summary with more context
const mediumSummary = await factory.summarize({
  text: "The quarterly earnings report shows a 15% increase in revenue compared to last year...",
  length: "medium"
});
```

#### Input Parameters
- `text`: string - The text to summarize
- `length`: "short" | "medium" | "long" - Desired summary length

#### Output
- `summary`: string - The generated summary
- `length`: string - The summary length used

### Sentiment Analysis Agent

Analyze the emotional tone and sentiment of text content.

#### Features
- Positive, negative, and neutral classification
- Confidence scoring
- Emotion detection (when available)
- Context-aware analysis
- Multi-language support

#### Example

```typescript
import { AgentFactory } from '../core/factories/AgentFactory';

const factory = new AgentFactory();

const sentiment = await factory.analyzeSentiment({
  text: "I'm thrilled with the new product features! The user interface is intuitive and the performance is outstanding."
});

console.log(sentiment.label); // "positive"
console.log(sentiment.score); // 0.92
```

#### Use Cases
- Customer feedback analysis
- Social media monitoring
- Product review assessment
- Brand sentiment tracking

#### Input Parameters
- `text`: string - The text to analyze

#### Output
- `label`: "positive" | "neutral" | "negative" - Sentiment classification
- `score`: number - Confidence score (0-1)

### Categorization Agent

Automatically categorize and tag content based on topics, themes, and content type.

#### Features
- Topic classification
- Content type detection
- Multi-label categorization
- Custom tag suggestions
- Hierarchical categorization

#### Example

```typescript
import { AgentFactory } from '../core/factories/AgentFactory';

const factory = new AgentFactory();

const categorization = await factory.categorize({
  text: "The new JavaScript framework release includes significant improvements to the virtual DOM implementation, better TypeScript support, and enhanced developer tooling. The update focuses on performance optimization and developer experience.",
  tags: ["technology", "programming"] // Optional hint tags
});

console.log(categorization.tags); // ["javascript", "framework", "web-development", "typescript"]
console.log(categorization.category); // "Technology/Web Development"
```

#### Use Cases
- Content management systems
- Document organization
- News article classification
- Support ticket routing
- Email filtering

#### Input Parameters
- `text`: string - The text to categorize
- `tags`: string[] (optional) - Hint tags to guide categorization

#### Output
- `tags`: string[] - Generated tags for the content
- `category`: string (optional) - Primary category classification

## Agent Factory Usage

All agents are accessed through the AgentFactory, which handles provider routing and response processing:

```typescript
import { AgentFactory } from '../core/factories/AgentFactory';

const factory = new AgentFactory();

// Summarization
const summary = await factory.run({
  type: 'summarization',
  text: "Long text content...",
  length: "medium"
}, {
  provider: 'openai', // Optional provider override
  debug: true // Enable debug logging
});

// Sentiment analysis
const sentiment = await factory.run({
  type: 'sentiment',
  text: "Text to analyze..."
});

// Categorization
const categories = await factory.run({
  type: 'categorization',
  text: "Content to categorize...",
  tags: ["hints"]
});
```

## Provider Support

Agents work with multiple AI providers:
- **OpenAI**: GPT models for comprehensive analysis
- **Anthropic**: Claude models for nuanced understanding
- **Gemini**: Google's multimodal capabilities
- **Cohere**: Specialized in language understanding

## Error Handling

Agents include built-in error handling and fallbacks:

```typescript
try {
  const result = await factory.summarize({
    text: "Text to summarize...",
    length: "medium"
  });
} catch (error) {
  console.error('Agent error:', error.message);
  // Handle fallback or retry logic
}
```

## Configuration

Configure agent behavior through the MCF config:

```json
{
  "defaults": {
    "agents": {
      "summaryLength": "medium",
      "sentimentModel": "gpt-4",
      "categorizationThreshold": 0.7
    }
  }
}
```

## Best Practices

1. **Text Length**: Keep input text under token limits (typically 8K-32K tokens)
2. **Context**: Provide sufficient context for accurate analysis
3. **Language**: Specify language for multilingual content
4. **Caching**: Cache results for frequently analyzed content
5. **Batch Processing**: Use workflows for batch agent operations

## Integration with Workflows

Agents integrate seamlessly with MCF workflows for complex processing pipelines:

```typescript
import { WorkflowFactory } from '../core/factories/WorkflowFactory';

// Create a content analysis workflow
const workflow = WorkflowFactory.createContentProcessingWorkflow();
// Includes categorization, sentiment analysis, and moderation
```
