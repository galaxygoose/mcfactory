# Configuration

MCFACTORY supports flexible configuration through environment variables, JSON configuration files, and programmatic setup. The configuration system follows the Master Interface Contract (MIC) and allows fine-grained control over provider routing, defaults, and behavior.

## Environment Variables

MCFACTORY reads configuration from environment variables for sensitive information and global settings.

### API Keys
```bash
# AI Provider API Keys
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GEMINI_API_KEY=your-gemini-api-key-here
COHERE_API_KEY=your-cohere-api-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here

# Local Model Configuration
LOCAL_MODEL_PATH=/path/to/your/local/model
LOCAL_TOKENIZER_PATH=/path/to/tokenizer
```

### Global Settings
```bash
# Default Provider
DEFAULT_PROVIDER=openai

# Logging Configuration
LOG_LEVEL=info  # debug, info, warn, error

# HTTP Client Settings
HTTP_TIMEOUT=30000
HTTP_MAX_RETRIES=3

# Guardrails Configuration
GUARDRAILS_ENABLED=true
HALLUCINATION_THRESHOLD=0.7
BANNED_TOPICS=politics,violence
```

## Configuration File

MCFACTORY supports JSON configuration files (`mcf.config.json` by default) for complex setups and non-sensitive configuration.

### Basic Configuration
```json
{
  "providers": {
    "openai": {
      "apiKey": "${OPENAI_API_KEY}",
      "model": "gpt-4",
      "options": {
        "temperature": 0.7,
        "max_tokens": 1000
      }
    },
    "anthropic": {
      "apiKey": "${ANTHROPIC_API_KEY}",
      "model": "claude-3-sonnet-20240229"
    },
    "gemini": {
      "apiKey": "${GEMINI_API_KEY}",
      "model": "gemini-pro"
    },
    "cohere": {
      "apiKey": "${COHERE_API_KEY}",
      "model": "command"
    },
    "elevenlabs": {
      "apiKey": "${ELEVENLABS_API_KEY}",
      "voice": "Rachel"
    },
    "local": {
      "modelPath": "/models/llama-2-7b",
      "tokenizerPath": "/models/llama-tokenizer"
    }
  },
  "defaults": {
    "translation": {
      "targetLang": "en",
      "preserveFormat": true
    },
    "detection": {
      "aiThreshold": 0.8,
      "fakeVoiceThreshold": 0.7
    },
    "moderation": {
      "allowedCategories": ["safe", "educational"]
    },
    "agents": {
      "summaryLength": "medium"
    },
    "media": {
      "maxDurationMs": 300000
    },
    "training": {
      "format": "jsonl",
      "shardSize": 1000,
      "schedule": "manual"
    }
  }
}
```

### Advanced Configuration with Pipelines
```json
{
  "providers": {
    "openai": {
      "apiKey": "${OPENAI_API_KEY}",
      "model": "gpt-4-turbo-preview",
      "options": {
        "temperature": 0.3,
        "presence_penalty": 0.1,
        "frequency_penalty": 0.1
      }
    }
  },
  "defaults": {
    "translation": {
      "targetLang": "es",
      "preserveFormat": true
    }
  },
  "pipelines": {
    "content-moderation": {
      "name": "Content Moderation Pipeline",
      "steps": [
        {
          "type": "guardrail",
          "options": {
            "checkType": "input_validation",
            "bannedTopics": ["politics", "violence"]
          }
        },
        {
          "type": "moderation",
          "options": {}
        },
        {
          "type": "detection",
          "options": {
            "detectionType": "ai"
          }
        }
      ]
    },
    "multilingual-processing": {
      "name": "Multilingual Content Processing",
      "steps": [
        {
          "type": "translate",
          "options": {
            "targetLang": "en"
          }
        },
        {
          "type": "agent",
          "options": {
            "task": "summarize",
            "length": "medium"
          }
        },
        {
          "type": "categorize",
          "options": {}
        }
      ]
    }
  },
  "guardrails": {
    "enabled": true,
    "bannedTopics": ["politics", "hate-speech", "illegal-activities"],
    "hallucinationThreshold": 0.8,
    "maxInputLength": 10000
  },
  "training": {
    "format": "jsonl",
    "shardSize": 5000,
    "schedule": "weekly",
    "outputDir": "./training-data",
    "autoExport": true
  }
}
```

## Provider Routing

MCFACTORY's provider routing system allows intelligent selection of AI providers based on task type, performance requirements, and cost considerations.

### Automatic Routing
By default, MCFACTORY routes requests based on predefined rules:

```typescript
// Routes to OpenAI for general tasks
await translateText("Hello", "es");

// Routes to Anthropic for complex reasoning
await summarizeText(longDocument, "long");

// Routes to ElevenLabs for voice synthesis
await textToSpeech("Hello world");
```

### Manual Provider Selection
Override automatic routing for specific requirements:

```typescript
import { TranslationFactory } from './core/factories/TranslationFactory';

const factory = new TranslationFactory();

// Force OpenAI for consistency
const result1 = await factory.run({
  text: "Hello world",
  targetLang: "es"
}, {
  provider: "openai"
});

// Force Anthropic for safety
const result2 = await factory.run({
  text: "Complex legal text",
  targetLang: "fr"
}, {
  provider: "anthropic"
});
```

### Provider-Specific Options
Configure provider-specific behavior:

```json
{
  "providers": {
    "openai": {
      "model": "gpt-4-turbo-preview",
      "options": {
        "temperature": 0.3,
        "max_tokens": 2000,
        "presence_penalty": 0.1
      }
    },
    "anthropic": {
      "model": "claude-3-opus-20240229",
      "options": {
        "max_tokens_to_sample": 1000,
        "temperature": 0.7
      }
    }
  }
}
```

## Supported Providers

### OpenAI
- **Models**: GPT-4, GPT-3.5-turbo, GPT-4-turbo
- **Best for**: General purpose, coding, creative writing
- **Configuration**:
```json
{
  "openai": {
    "apiKey": "${OPENAI_API_KEY}",
    "model": "gpt-4",
    "options": {
      "temperature": 0.7,
      "max_tokens": 1000
    }
  }
}
```

### Anthropic
- **Models**: Claude 3 Opus, Sonnet, Haiku
- **Best for**: Analysis, reasoning, safety-critical applications
- **Configuration**:
```json
{
  "anthropic": {
    "apiKey": "${ANTHROPIC_API_KEY}",
    "model": "claude-3-sonnet-20240229",
    "options": {
      "max_tokens_to_sample": 1000,
      "temperature": 0.7
    }
  }
}
```

### Google Gemini
- **Models**: Gemini Pro, Gemini Ultra
- **Best for**: Multimodal tasks, fast responses
- **Configuration**:
```json
{
  "gemini": {
    "apiKey": "${GEMINI_API_KEY}",
    "model": "gemini-pro",
    "options": {
      "temperature": 0.7,
      "topP": 0.9
    }
  }
}
```

### Cohere
- **Models**: Command, Base
- **Best for**: Language understanding, embeddings
- **Configuration**:
```json
{
  "cohere": {
    "apiKey": "${COHERE_API_KEY}",
    "model": "command",
    "options": {
      "temperature": 0.7,
      "max_tokens": 1000
    }
  }
}
```

### ElevenLabs
- **Models**: Various voice models
- **Best for**: Text-to-speech, voice synthesis
- **Configuration**:
```json
{
  "elevenlabs": {
    "apiKey": "${ELEVENLABS_API_KEY}",
    "voice": "Rachel",
    "model": "eleven_monolingual_v1",
    "options": {
      "stability": 0.5,
      "similarity_boost": 0.8
    }
  }
}
```

### Local Models
- **Models**: Any compatible local LLM
- **Best for**: Privacy, offline usage, custom models
- **Configuration**:
```json
{
  "local": {
    "modelPath": "/path/to/model",
    "tokenizerPath": "/path/to/tokenizer",
    "options": {
      "context_length": 4096,
      "threads": 4
    }
  }
}
```

## Configuration Validation

MCFACTORY validates configuration on startup and provides helpful error messages:

```bash
# Validate configuration file
mcf validate-config

# Check provider connectivity
mcf diagnose
```

## Environment-Specific Configuration

Use different configurations for development, staging, and production:

```bash
# Development
NODE_ENV=development MCFACTORY_CONFIG=./config/dev.json

# Production
NODE_ENV=production MCFACTORY_CONFIG=./config/prod.json
```

## Programmatic Configuration

Configure MCFACTORY programmatically in code:

```typescript
import { MCFACTORYConfig } from './types';

const config: MCFACTORYConfig = {
  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4'
    }
  },
  defaults: {
    translation: {
      targetLang: 'en'
    }
  }
};

// Apply configuration
// (Configuration is typically loaded automatically from mcf.config.json)
```

## Best Practices

1. **Security**: Never commit API keys to version control
2. **Environment Variables**: Use environment variables for sensitive data
3. **Validation**: Always validate configuration before deployment
4. **Documentation**: Document custom configuration for team members
5. **Version Control**: Track configuration changes appropriately
6. **Testing**: Test configuration changes in staging environments

## Troubleshooting

### Common Configuration Issues

**Missing API Key**
```
Error: OPENAI_API_KEY environment variable is required
Solution: Set the environment variable or add to .env file
```

**Invalid Provider Configuration**
```
Error: Provider 'invalid' not found
Solution: Check provider name spelling and ensure it's registered
```

**Configuration File Not Found**
```
Error: Configuration file not found at ./mcf.config.json
Solution: Create the configuration file or specify correct path
```
