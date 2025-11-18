# MCP Tools

MCFACTORY integrates with the Model Context Protocol (MCP) to provide standardized AI tool interfaces that can be used across different MCP-compatible clients and applications. MCP tools enable seamless AI interactions while maintaining consistency and security.

## Overview

The Model Context Protocol (MCP) is a standardized interface for connecting AI models to external tools and data sources. MCFACTORY implements MCP server functionality, exposing AI capabilities as MCP tools that can be discovered and invoked by MCP clients.

### Key Benefits
- **Standardization**: Consistent tool interface across different AI applications
- **Interoperability**: Tools work with any MCP-compatible client
- **Security**: Built-in safety measures and access controls
- **Extensibility**: Easy addition of new tools and capabilities
- **Discovery**: Automatic tool discovery and documentation

## Architecture

### MCP Server Implementation

MCFACTORY runs as an MCP server that exposes AI capabilities through standardized tool interfaces:

```
MCP Client ←→ MCP Protocol ←→ MCFACTORY MCP Server ←→ MCFACTORY Services
```

### Tool Registration

Tools are automatically registered with the MCP server based on MCFACTORY service configurations:

```typescript
import { MCPServer } from '../core/mcp/MCPServer';
import { MCFToolRegistry } from '../core/mcp/MCFToolRegistry';

// Initialize MCP server
const mcpServer = new MCPServer({
  port: 3001,
  allowedOrigins: ['http://localhost:3000']
});

// Register MCFACTORY tools
MCFToolRegistry.registerAllTools(mcpServer);

// Start server
await mcpServer.start();
```

## Available Tools

MCFACTORY provides comprehensive MCP tools covering all major AI capabilities:

### Translation Tools

#### translate-text
Translate text between languages with automatic language detection.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text to translate"
    },
    "targetLang": {
      "type": "string",
      "description": "Target language code (e.g., 'es', 'fr')"
    },
    "sourceLang": {
      "type": "string",
      "description": "Source language code (optional, auto-detected if not provided)"
    },
    "preserveFormat": {
      "type": "boolean",
      "description": "Preserve original formatting and structure",
      "default": true
    }
  },
  "required": ["text", "targetLang"]
}
```

**Example Usage:**
```typescript
// MCP tool call
const result = await callTool('translate-text', {
  text: "Hello, how are you today?",
  targetLang: "es",
  preserveFormat: true
});

// Result: { translated: "Hola, ¿cómo estás hoy?" }
```

#### translate-voice
Translate spoken language through speech-to-text and text-to-speech.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "audioData": {
      "type": "string",
      "description": "Base64 encoded audio data"
    },
    "sourceLang": {
      "type": "string",
      "description": "Source language code",
      "default": "en"
    },
    "targetLang": {
      "type": "string",
      "description": "Target language code"
    },
    "voice": {
      "type": "string",
      "description": "Voice to use for output (optional)"
    }
  },
  "required": ["audioData", "targetLang"]
}
```

#### voice-to-voice-translate
Direct voice translation without intermediate text conversion.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "audioData": {
      "type": "string",
      "description": "Base64 encoded audio data"
    },
    "sourceLang": {
      "type": "string",
      "description": "Source language code"
    },
    "targetLang": {
      "type": "string",
      "description": "Target language code"
    },
    "preserveTone": {
      "type": "boolean",
      "description": "Preserve emotional tone and emphasis",
      "default": true
    }
  },
  "required": ["audioData", "sourceLang", "targetLang"]
}
```

### Detection Tools

#### detect-ai-text
Detect AI-generated text content.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text to analyze for AI generation"
    }
  },
  "required": ["text"]
}
```

**Output:**
```json
{
  "isAI": false,
  "confidence": 0.12,
  "features": {
    "perplexity": 45.2,
    "entropy": 3.8
  }
}
```

#### detect-fake-voice
Detect synthetic or manipulated voice audio.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "audioData": {
      "type": "string",
      "description": "Base64 encoded audio data"
    }
  },
  "required": ["audioData"]
}
```

**Output:**
```json
{
  "isFake": false,
  "confidence": 0.08,
  "details": {
    "spectralAnalysis": { "harmonics": 0.3 },
    "temporalFeatures": { "consistency": 0.9 }
  }
}
```

### Moderation Tools

#### moderate-text
Check text content for safety and compliance.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text content to moderate"
    },
    "categories": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Specific categories to check",
      "default": ["hate", "violence", "adult"]
    }
  },
  "required": ["text"]
}
```

**Output:**
```json
{
  "safe": true,
  "categories": [],
  "confidence": 0.95,
  "flagged": false
}
```

#### moderate-image
Analyze images for inappropriate content.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "imageData": {
      "type": "string",
      "description": "Base64 encoded image data"
    },
    "categories": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Categories to check",
      "default": ["explicit", "violence", "hate-symbols"]
    }
  },
  "required": ["imageData"]
}
```

### Agent Tools

#### summarize-text
Generate concise summaries of text content.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text to summarize"
    },
    "length": {
      "type": "string",
      "enum": ["short", "medium", "long"],
      "description": "Desired summary length",
      "default": "medium"
    }
  },
  "required": ["text"]
}
```

#### analyze-sentiment
Analyze the emotional tone of text.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text to analyze"
    }
  },
  "required": ["text"]
}
```

**Output:**
```json
{
  "label": "positive",
  "score": 0.92
}
```

#### categorize-text
Automatically categorize and tag content.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text to categorize"
    },
    "hintTags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Optional hint tags to guide categorization"
    }
  },
  "required": ["text"]
}
```

**Output:**
```json
{
  "tags": ["technology", "programming", "web-development"],
  "category": "Technology/Web Development"
}
```

### Media Processing Tools

#### speech-to-text
Convert audio speech to text.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "audioData": {
      "type": "string",
      "description": "Base64 encoded audio data"
    },
    "language": {
      "type": "string",
      "description": "Language code",
      "default": "en"
    },
    "timestamps": {
      "type": "boolean",
      "description": "Include timestamps",
      "default": false
    }
  },
  "required": ["audioData"]
}
```

#### text-to-speech
Convert text to speech audio.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "text": {
      "type": "string",
      "description": "Text to convert to speech"
    },
    "voice": {
      "type": "string",
      "description": "Voice to use",
      "default": "Matthew"
    },
    "language": {
      "type": "string",
      "description": "Language code",
      "default": "en"
    }
  },
  "required": ["text"]
}
```

#### extract-text-from-image
Extract text from images using OCR.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "imageData": {
      "type": "string",
      "description": "Base64 encoded image data"
    },
    "language": {
      "type": "string",
      "description": "Language for OCR",
      "default": "en"
    }
  },
  "required": ["imageData"]
}
```

#### caption-image
Generate captions for images.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "imageData": {
      "type": "string",
      "description": "Base64 encoded image data"
    },
    "maxLength": {
      "type": "number",
      "description": "Maximum caption length",
      "default": 50
    }
  },
  "required": ["imageData"]
}
```

## Configuration

Configure MCP server settings in your MCFACTORY configuration:

```json
{
  "mcp": {
    "enabled": true,
    "server": {
      "port": 3001,
      "host": "localhost",
      "allowedOrigins": ["http://localhost:3000", "http://localhost:3001"],
      "maxConnections": 100,
      "timeout": 30000
    },
    "tools": {
      "autoRegister": true,
      "customTools": [],
      "disabledTools": [],
      "rateLimits": {
        "requestsPerMinute": 60,
        "burstLimit": 10
      }
    },
    "security": {
      "requireAuthentication": true,
      "allowedClients": ["claude-desktop", "custom-client"],
      "apiKeys": ["${MCP_API_KEY}"]
    }
  }
}
```

### Tool-Specific Configuration

Configure individual tools with custom settings:

```json
{
  "mcp": {
    "tools": {
      "translate-text": {
        "enabled": true,
        "defaultProvider": "openai",
        "supportedLanguages": ["en", "es", "fr", "de", "ja"],
        "cacheEnabled": true,
        "rateLimit": 100
      },
      "moderate-text": {
        "enabled": true,
        "defaultCategories": ["hate", "violence", "adult"],
        "threshold": 0.8,
        "includeDetails": false
      },
      "detect-ai-text": {
        "enabled": true,
        "ensembleMethods": true,
        "confidenceThreshold": 0.7
      }
    }
  }
}
```

## Security and Access Control

### Authentication

Control access to MCP tools with authentication:

```typescript
import { MCPAuthenticator } from '../core/mcp/MCPAuthenticator';

const authenticator = new MCPAuthenticator({
  requireAuth: true,
  validApiKeys: process.env.MCP_API_KEYS?.split(',') || [],
  rateLimiting: {
    windowMs: 60000, // 1 minute
    maxRequests: 100
  }
});

// Authenticate requests
app.use('/mcp', authenticator.middleware());
```

### Tool Permissions

Configure which tools are available to different clients:

```json
{
  "mcp": {
    "security": {
      "toolPermissions": {
        "admin": ["*"],  // All tools
        "moderator": ["moderate-text", "moderate-image", "detect-ai-text"],
        "translator": ["translate-text", "translate-voice"],
        "analyst": ["summarize-text", "analyze-sentiment", "categorize-text"]
      }
    }
  }
}
```

## Client Integration

### Claude Desktop Integration

Configure Claude Desktop to use MCFACTORY MCP tools:

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// or %APPDATA%/Claude/claude_desktop_config.json (Windows)

{
  "mcpServers": {
    "mcf": {
      "command": "node",
      "args": ["/path/to/mcf/dist/core/mcp/mcp-server.js"],
      "env": {
        "OPENAI_API_KEY": "your-key-here",
        "MCP_API_KEY": "your-mcp-key"
      }
    }
  }
}
```

### Custom MCP Client

Create custom clients that interact with MCFACTORY MCP tools:

```typescript
import { MCPClient } from 'mcp-client';

class MCFACTORYMCPClient {
  private client: MCPClient;

  constructor(serverUrl: string) {
    this.client = new MCPClient({
      serverUrl,
      apiKey: process.env.MCP_API_KEY
    });
  }

  async translateText(text: string, targetLang: string) {
    return await this.client.callTool('translate-text', {
      text,
      targetLang
    });
  }

  async moderateContent(text: string) {
    return await this.client.callTool('moderate-text', {
      text
    });
  }

  async summarizeText(text: string) {
    return await this.client.callTool('summarize-text', {
      text,
      length: 'medium'
    });
  }
}

// Usage
const mcfClient = new MCFACTORYMCPClient('http://localhost:3001');
const translation = await mcfClient.translateText('Hello world', 'es');
```

## Error Handling

MCP tools provide standardized error responses:

```typescript
try {
  const result = await mcpClient.callTool('translate-text', {
    text: 'Hello',
    targetLang: 'invalid'
  });
} catch (error) {
  switch (error.code) {
    case 'MCP_TOOL_ERROR':
      console.log('Tool execution failed:', error.message);
      break;
    case 'MCP_INVALID_PARAMS':
      console.log('Invalid parameters:', error.details);
      break;
    case 'MCP_RATE_LIMITED':
      console.log('Rate limit exceeded, retry after:', error.retryAfter);
      break;
    case 'MCP_AUTH_FAILED':
      console.log('Authentication failed');
      break;
  }
}
```

## Monitoring and Analytics

Track MCP tool usage and performance:

```typescript
import { MCPMetrics } from '../core/mcp/MCPMetrics';

const metrics = new MCPMetrics();

// Track tool calls
mcpServer.on('toolCalled', (event) => {
  metrics.recordToolCall({
    toolName: event.tool,
    clientId: event.clientId,
    duration: event.duration,
    success: event.success,
    errorCode: event.error?.code
  });
});

// Get metrics
const stats = metrics.getStats();
console.log('MCP Metrics:', {
  totalCalls: stats.totalCalls,
  successRate: stats.successRate,
  averageResponseTime: stats.averageResponseTime,
  topTools: stats.topTools,
  errorRates: stats.errorRates
});
```

## Best Practices

### Tool Design
1. **Clear Schemas**: Provide comprehensive input/output schemas
2. **Descriptive Names**: Use clear, descriptive tool names
3. **Consistent Parameters**: Follow consistent parameter naming conventions
4. **Error Handling**: Provide meaningful error messages and codes
5. **Documentation**: Include detailed descriptions for all tools

### Security
1. **Authentication**: Always require authentication for production use
2. **Rate Limiting**: Implement appropriate rate limits per client
3. **Input Validation**: Validate all inputs before processing
4. **Access Control**: Use role-based access control for tools
5. **Audit Logging**: Log all tool usage for security monitoring

### Performance
1. **Caching**: Cache results for frequently used tools
2. **Batching**: Support batch operations where possible
3. **Async Processing**: Use async processing for long-running operations
4. **Resource Limits**: Set appropriate timeouts and resource limits
5. **Monitoring**: Monitor tool performance and usage patterns

### Client Integration
1. **Connection Management**: Handle connection failures gracefully
2. **Retry Logic**: Implement appropriate retry strategies
3. **Error Recovery**: Provide fallback mechanisms for failures
4. **Version Compatibility**: Handle API version changes gracefully
5. **Testing**: Thoroughly test client integrations

## Troubleshooting

### Common Issues

**Connection Failed**
```
Error: Failed to connect to MCP server
Solution: Check server URL, port, and network connectivity
```

**Authentication Failed**
```
Error: MCP authentication failed
Solution: Verify API key and client permissions
```

**Tool Not Found**
```
Error: Tool 'unknown-tool' not found
Solution: Check tool name spelling and ensure tool is registered
```

**Rate Limited**
```
Error: Too many requests
Solution: Implement backoff and reduce request frequency
```

**Invalid Parameters**
```
Error: Invalid tool parameters
Solution: Check parameter types and required fields
```

## Advanced Features

### Custom Tool Development

Create custom MCP tools for specialized functionality:

```typescript
import { MCPTool } from '../core/mcp/MCPTool';

class CustomAnalysisTool extends MCPTool {
  name = 'custom-analysis';
  description = 'Perform custom content analysis';

  inputSchema = {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Text to analyze' },
      analysisType: {
        type: 'string',
        enum: ['sentiment', 'complexity', 'readability'],
        description: 'Type of analysis to perform'
      }
    },
    required: ['text', 'analysisType']
  };

  async execute(params: any): Promise<any> {
    // Custom analysis logic
    switch (params.analysisType) {
      case 'sentiment':
        return await this.analyzeSentiment(params.text);
      case 'complexity':
        return await this.analyzeComplexity(params.text);
      case 'readability':
        return await this.analyzeReadability(params.text);
    }
  }
}

// Register custom tool
MCFToolRegistry.registerTool(new CustomAnalysisTool());
```

### Tool Chaining

Chain multiple tools together for complex workflows:

```typescript
// Define a tool chain
const contentProcessingChain = {
  name: 'content-processing-chain',
  steps: [
    { tool: 'moderate-text', params: { text: '$input.text' } },
    {
      tool: 'translate-text',
      params: { text: '$input.text', targetLang: '$input.targetLang' },
      condition: '$previous.safe === true'
    },
    {
      tool: 'summarize-text',
      params: { text: '$previous.translated', length: 'short' }
    }
  ]
};

// Execute chain
const result = await mcpClient.executeChain('content-processing-chain', {
  text: "Original content to process",
  targetLang: "es"
});
```

This comprehensive MCP integration enables MCFACTORY to provide standardized, secure, and interoperable AI tools that work seamlessly across different applications and clients.
