# Introduction

## What is MCF?

MCF (Model Context Factory) is a comprehensive TypeScript framework for AI model interactions, content processing, and workflow orchestration. It provides a unified interface for multiple AI providers and services through a factory pattern architecture, enabling developers to build complex AI-powered applications with consistent APIs and robust safety measures.

## Architecture Overview

MCF follows a layered architecture:

- **Providers**: Abstract interfaces to AI services (OpenAI, Anthropic, Gemini, etc.)
- **Factories**: Standardized processing units for specific AI tasks
- **Services**: High-level APIs that combine factories for common use cases
- **Workflows**: Orchestration system for complex multi-step AI pipelines
- **Guardrails**: Safety and validation systems integrated throughout the stack
- **CLI & SDK**: Developer interfaces for programmatic and command-line usage

## Key Features

### Core AI Services
- **Translation**: Text and voice translation between languages
- **Detection**: AI-generated content detection and fake voice analysis
- **Moderation**: Content safety checking and inappropriate material filtering
- **Agents**: Text summarization, sentiment analysis, and content categorization

### Media Processing
- **Speech-to-Text**: Audio transcription with multiple language support
- **Text-to-Speech**: Voice synthesis with customizable voices
- **OCR**: Text extraction from images
- **Voice-to-Voice**: Direct voice translation without intermediate text conversion

### Advanced Capabilities
- **Workflow Orchestration**: Sequential and parallel pipeline execution
- **Training Data Management**: Dataset collection, formatting, and export
- **Guardrails**: Input validation, prompt injection prevention, and hallucination detection
- **Multi-Provider Support**: Seamless switching between AI providers
- **MCP Integration**: Model Context Protocol support for enhanced AI interactions

## Master Interface Contract (MIC)

MCF enforces consistency through the Master Interface Contract - a comprehensive type system that defines:

- Standardized input/output shapes for all services
- Factory interfaces for extensible AI processing
- Provider contracts for consistent API interactions
- Error handling and response formats
- Configuration structures and defaults

## Quick Start

```typescript
import { MCF } from 'mcf';

// Initialize the client
const client = new MCF();

// Translate text
const translation = await client.translate('Hello world', 'es');
console.log(translation); // "Hola mundo"

// Detect AI-generated content
const isAI = await client.detectAI('This is a sample text');
console.log(isAI); // false

// Moderate content
const moderation = await client.moderate('Sample content to check');
console.log(moderation.safe); // true
```

## Installation

See the [Installation Guide](./installation.md) for detailed setup instructions.

## Documentation Structure

- [SDK Reference](./sdk.md) - Programmatic API usage
- [Configuration](./configuration.md) - Environment setup and provider configuration
- [Factories](./factories.md) - Core factory pattern and provider routing
- [Services](./services.md) - High-level service APIs
- [Workflows](./workflows.md) - Pipeline orchestration
- [CLI](./cli.md) - Command-line interface
- [Guardrails](./guardrails.md) - Safety and validation systems
- [Training](./training-datasets.md) - Dataset management
- [MCP Tools](./mcp-tools.md) - Model Context Protocol integration
- [Architecture](./architecture.md) - System design and patterns
- [Error Handling](./error-handling.md) - Error management strategies
- [Integration Guide](./integration.md) - Best practices and extension patterns
