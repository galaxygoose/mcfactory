# Content Moderation

MCFACTORY provides comprehensive content moderation capabilities to ensure safe and compliant AI interactions. The moderation system analyzes text and images for harmful, inappropriate, or unsafe content using multiple detection techniques and configurable safety policies.

## Text Moderation

Analyze text content for safety and compliance using advanced machine learning models.

### Features
- **Multi-Category Detection**: Identifies hate speech, violence, harassment, adult content, and more
- **Confidence Scoring**: Provides probability scores for moderation decisions
- **Context Awareness**: Considers context and intent in moderation decisions
- **Multi-Language Support**: Works across different languages and cultural contexts
- **Real-Time Processing**: Fast moderation suitable for real-time applications

### Basic Text Moderation

```typescript
import { ModerationFactory } from '../core/factories/ModerationFactory';

const factory = new ModerationFactory();

// Moderate text content
const result = await factory.run({
  text: "This is a sample text to check for inappropriate content."
});

console.log(result.safe); // true or false
console.log(result.categories); // ["hate", "violence"] if unsafe
console.log(result.confidence); // 0.95 (95% confidence)
```

### Service-Level API

For simpler usage, use the moderation service:

```typescript
import { moderateText } from '../services/moderation/moderateText';

// Direct function call
const result = await moderateText("Content to moderate");

if (!result.safe) {
  console.log('Content flagged:', result.categories);
  // Handle unsafe content (reject, warn, etc.)
} else {
  console.log('Content is safe');
}
```

### Moderation Categories

MCFACTORY supports comprehensive content categories:

| Category | Description | Examples |
|----------|-------------|----------|
| `hate` | Hate speech, discrimination | Racial slurs, discriminatory content |
| `violence` | Violent content, threats | Threats of harm, violent descriptions |
| `harassment` | Bullying, harassment | Personal attacks, cyberbullying |
| `adult` | Sexual content, nudity | Explicit descriptions, adult themes |
| `spam` | Spam, promotional content | Unsolicited promotions, scams |
| `self-harm` | Self-harm, suicide content | Suicide encouragement, self-harm promotion |
| `child-exploitation` | Child exploitation | Any content involving minors inappropriately |
| `terrorism` | Terrorist content | Terrorism promotion, extremist content |
| `fraud` | Fraudulent content | Scams, phishing attempts |
| `illegal` | Illegal activities | Instructions for illegal acts |

## Image Moderation

Analyze images for inappropriate or unsafe content using computer vision models.

### Features
- **Visual Content Analysis**: Detects explicit content, violence, and inappropriate imagery
- **OCR Integration**: Combines visual analysis with text recognition
- **Multiple Format Support**: Works with JPEG, PNG, WebP, and other common formats
- **Batch Processing**: Process multiple images efficiently
- **Customizable Thresholds**: Adjust sensitivity for different use cases

### Image Moderation Example

```typescript
import { moderateImage } from '../services/moderation/moderateImage';

// Load image as ArrayBuffer
const imageBuffer = await loadImageFile('suspicious_image.jpg');

const result = await moderateImage({
  imageBuffer: imageBuffer
});

console.log(result.safe); // true or false
console.log(result.categories); // ["adult", "violence"] if unsafe
console.log(result.confidence); // 0.87 (87% confidence)

// Detailed results
if (!result.safe) {
  console.log('Moderation details:', result.details);
  // {
  //   adultContent: 0.95,
  //   violence: 0.78,
  //   detectedObjects: ["weapon", "blood"]
  // }
}
```

### Image Moderation Categories

| Category | Description |
|----------|-------------|
| `explicit` | Nudity, sexual content |
| `violence` | Violent or graphic imagery |
| `drugs` | Drug use or paraphernalia |
| `weapons` | Weapons, firearms |
| `hate-symbols` | Hate symbols, extremist imagery |
| `self-harm` | Self-harm imagery |
| `child-exploitation` | Child exploitation imagery |

## Moderation Factory Usage

The ModerationFactory provides low-level control and advanced features:

```typescript
import { ModerationFactory } from '../core/factories/ModerationFactory';

const factory = new ModerationFactory();

// Custom categories and thresholds
const result = await factory.run({
  text: "Content to moderate",
  options: {
    categories: ["hate", "violence", "adult"],
    threshold: 0.8, // Minimum confidence for flagging
    includeDetails: true
  }
}, {
  provider: "openai", // Force specific provider
  debug: true
});
```

## Provider Support

Moderation works with specialized AI providers optimized for content safety:

### OpenAI
- **Best for**: General content moderation with good balance of accuracy and speed
- **Models**: Moderation API with custom fine-tuning support
- **Strengths**: Comprehensive category coverage, reliable performance

### Anthropic
- **Best for**: Nuanced content understanding and contextual moderation
- **Models**: Claude models with safety-focused training
- **Strengths**: Better understanding of context and intent

### Custom Moderation Models
- **Best for**: Domain-specific moderation requirements
- **Models**: Fine-tuned models for specific content types
- **Strengths**: Higher accuracy for specialized use cases

## Safety Policies

Configure custom safety policies to meet your application's requirements.

### Policy Configuration

```json
{
  "moderation": {
    "enabled": true,
    "defaultCategories": ["hate", "violence", "harassment", "adult"],
    "customCategories": [
      {
        "name": "political-extremism",
        "keywords": ["extremist", "radical", "supremacist"],
        "threshold": 0.7
      }
    ],
    "thresholds": {
      "block": 0.9,
      "warn": 0.7,
      "allow": 0.3
    },
    "actions": {
      "block": ["log", "notify", "reject"],
      "warn": ["log", "flag"],
      "allow": ["log"]
    }
  }
}
```

### Policy-Based Moderation

```typescript
import { ModerationPolicy } from '../core/moderation/ModerationPolicy';

const policy = new ModerationPolicy({
  categories: ['hate', 'violence', 'political-extremism'],
  threshold: 0.8,
  action: 'block'
});

const result = await policy.enforce("Content to check against policy");

if (result.violatesPolicy) {
  console.log('Policy violation:', result.reasons);
  // Take appropriate action based on policy
}
```

## Advanced Moderation Features

### Contextual Moderation

Consider context when making moderation decisions:

```typescript
const result = await moderateText("I hate this bug in my code!", {
  context: "software development discussion",
  intent: "frustration expression"
});

// May be flagged as safe due to context
console.log(result.safe); // true (context-aware decision)
```

### Multi-Modal Moderation

Combine text and image moderation for comprehensive content analysis:

```typescript
const multiModalResult = await moderateContent({
  text: "Check out this image",
  imageBuffer: imageData,
  options: {
    combineModalities: true,
    crossReference: true
  }
});

// Results consider both text and image content
console.log(multiModalResult.overallSafe);
console.log(multiModalResult.textSafe);
console.log(multiModalResult.imageSafe);
```

### Custom Moderation Rules

Implement custom moderation logic:

```typescript
class CustomModerationService {
  async moderateWithRules(content: string, rules: ModerationRule[]): Promise<ModerationResult> {
    let safe = true;
    const categories: string[] = [];
    let maxConfidence = 0;

    for (const rule of rules) {
      const matches = await this.checkRule(content, rule);

      if (matches.confidence > rule.threshold) {
        safe = false;
        categories.push(rule.category);
        maxConfidence = Math.max(maxConfidence, matches.confidence);
      }
    }

    return {
      safe,
      categories,
      confidence: maxConfidence,
      flagged: !safe
    };
  }

  private async checkRule(content: string, rule: ModerationRule) {
    // Implement custom rule checking logic
    // Could use regex, ML models, or external APIs
  }
}
```

## Performance Optimization

### Caching Moderation Results

Cache moderation decisions for repeated content:

```typescript
import { ModerationCache } from '../services/moderation/ModerationCache';

const cache = new ModerationCache();

// Cached moderation
const result = await cache.moderate("Frequently moderated content");

console.log('Cache hit rate:', cache.getHitRate());
```

### Batch Moderation

Process multiple items efficiently:

```typescript
const batchResults = await Promise.all([
  moderateText("First text"),
  moderateText("Second text"),
  moderateImage(imageBuffer1),
  moderateImage(imageBuffer2)
]);

// Process results
batchResults.forEach((result, index) => {
  if (!result.safe) {
    console.log(`Item ${index} flagged:`, result.categories);
  }
});
```

### Streaming Moderation

Moderate content streams in real-time:

```typescript
const streamModerator = factory.createStreamModerator();

streamModerator.on('result', (result) => {
  if (!result.safe) {
    console.log('Unsafe content detected:', result.categories);
    // Take immediate action (disconnect, warn, etc.)
  }
});

// Process streaming content
await streamModerator.processContentStream(contentStream);
```

## Error Handling

Moderation operations include comprehensive error handling:

```typescript
try {
  const result = await moderateText(content);
} catch (error) {
  switch (error.code) {
    case 'MODERATION_TIMEOUT':
      console.log('Moderation timed out, using cached result');
      break;
    case 'MODERATION_SERVICE_UNAVAILABLE':
      console.log('Moderation service down, falling back to basic checks');
      break;
    case 'MODERATION_INVALID_INPUT':
      console.log('Invalid content format');
      break;
    default:
      console.error('Moderation failed:', error.message);
  }
}
```

## Integration Examples

### API Content Moderation

```typescript
// Express.js middleware for content moderation
app.use('/api/posts', async (req, res, next) => {
  const { content, images } = req.body;

  try {
    // Moderate text content
    if (content) {
      const textResult = await moderateText(content);
      if (!textResult.safe) {
        return res.status(400).json({
          error: 'Content contains inappropriate material',
          categories: textResult.categories
        });
      }
    }

    // Moderate images
    if (images && images.length > 0) {
      for (const image of images) {
        const imageResult = await moderateImage({ imageBuffer: image });
        if (!imageResult.safe) {
          return res.status(400).json({
            error: 'Image contains inappropriate content',
            categories: imageResult.categories
          });
        }
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Content moderation failed'
    });
  }
});
```

### Chat Application Moderation

```typescript
class ModeratedChat {
  async sendMessage(message: string, userId: string): Promise<MessageResult> {
    // Pre-moderate message
    const moderation = await moderateText(message);

    if (!moderation.safe) {
      return {
        accepted: false,
        reason: 'Message contains inappropriate content',
        categories: moderation.categories
      };
    }

    // Send message if safe
    const sentMessage = await this.sendToChat(message, userId);

    return {
      accepted: true,
      message: sentMessage
    };
  }
}
```

### Content Management System

```typescript
class ContentManager {
  async publishContent(content: ContentItem): Promise<PublishResult> {
    // Comprehensive moderation
    const textModeration = content.text ?
      await moderateText(content.text) : { safe: true };

    const imageModeration = content.image ?
      await moderateImage({ imageBuffer: content.image }) : { safe: true };

    const overallSafe = textModeration.safe && imageModeration.safe;

    if (!overallSafe) {
      const allCategories = [
        ...(textModeration.categories || []),
        ...(imageModeration.categories || [])
      ];

      return {
        published: false,
        reason: 'Content failed moderation',
        categories: [...new Set(allCategories)], // Remove duplicates
        requiresReview: true
      };
    }

    // Publish content
    const published = await this.publishToCMS(content);

    return {
      published: true,
      content: published,
      moderated: true
    };
  }
}
```

## Configuration

Configure moderation behavior through MCFACTORY configuration:

```json
{
  "defaults": {
    "moderation": {
      "categories": ["hate", "violence", "harassment", "adult"],
      "threshold": 0.8,
      "includeDetails": false
    }
  },
  "moderation": {
    "cacheEnabled": true,
    "cacheTTL": 3600000,
    "batchSize": 10,
    "customRules": [
      {
        "name": "brand-protection",
        "pattern": "competitor.*brand",
        "action": "flag"
      }
    ]
  }
}
```

## Best Practices

1. **Multi-Layer Defense**: Combine automated moderation with human review for critical content
2. **Context Matters**: Consider context and intent when making moderation decisions
3. **User Education**: Inform users about content policies and moderation criteria
4. **Appeal Process**: Provide mechanisms for users to appeal moderation decisions
5. **Regular Updates**: Keep moderation models and rules updated with current trends
6. **Performance Monitoring**: Track moderation accuracy, false positives, and processing times
7. **Legal Compliance**: Ensure moderation practices comply with relevant laws and regulations
8. **Transparency**: Clearly communicate moderation decisions and reasoning

## Monitoring and Analytics

Track moderation effectiveness and usage patterns:

```typescript
const moderationMetrics = {
  recordModeration(result: ModerationResult, contentType: string) {
    // Record metrics
    console.log('Moderation:', {
      contentType,
      safe: result.safe,
      categories: result.categories,
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    });
  },

  getModerationStats(timeRange: string) {
    // Return moderation statistics
    return {
      totalModerated: 1250,
      safeContent: 1100,
      unsafeContent: 150,
      topCategories: ['hate', 'adult', 'violence'],
      averageConfidence: 0.85
    };
  }
};
```

## Compliance and Standards

Moderation supports various compliance requirements:

- **Platform Safety**: Meet platform content policies and community standards
- **Legal Requirements**: Comply with laws regarding hate speech, child protection, etc.
- **Industry Standards**: Follow industry best practices for content moderation
- **Ethical AI**: Ensure responsible and unbiased moderation decisions

This comprehensive moderation system ensures MCFACTORY applications can safely handle user-generated content while maintaining compliance and user trust.
