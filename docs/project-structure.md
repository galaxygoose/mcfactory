# MCF Project Structure

This document provides a complete overview of the MCF (Model Context Factory) project file structure.

## Root Directory

```
MCF/
├── dist/                          # Compiled JavaScript and TypeScript declaration files
├── docs/                          # Documentation files
├── node_modules/                  # Node.js dependencies
├── src/                           # Source TypeScript code
├── tests/                         # Test files
├── jest.config.js                 # Jest testing configuration
├── LICENSE                        # Project license
├── mcf.config.json               # MCF configuration file
├── mcp-manifest.json             # MCP (Model Context Protocol) manifest
├── package-lock.json             # NPM lock file
├── package.json                  # NPM package configuration
├── README.md                     # Project README
└── tsconfig.json                 # TypeScript configuration
```

## Source Code Structure (`src/`)

```
src/
├── core/                         # Core MCF functionality
│   ├── cli/                      # Command-line interface
│   │   ├── commands/            # CLI command implementations
│   │   │   ├── diagnose.ts       # System diagnostics command
│   │   │   ├── generateManifest.ts # MCP manifest generation
│   │   │   ├── init.ts          # Configuration initialization
│   │   │   ├── runPipeline.ts   # Pipeline execution command
│   │   │   └── validateConfig.ts # Configuration validation
│   │   └── mcf-cli.ts           # Main CLI entry point
│   ├── config/                  # Configuration management
│   │   ├── configLoader.ts      # Configuration file loading
│   │   ├── configSchema.ts      # Configuration validation schema
│   │   ├── defaults.json        # Default configuration values
│   │   ├── env.ts              # Environment variable handling
│   │   ├── providerConfig.ts   # Provider-specific configuration
│   │   └── routingRules.ts     # Request routing rules
│   ├── data/                   # Data processing utilities
│   │   ├── cleanHTML.ts        # HTML cleaning utilities
│   │   ├── cleanText.ts        # Text cleaning utilities
│   │   ├── deduper.ts          # Duplicate removal utilities
│   │   ├── emojiNormalizer.ts  # Emoji normalization
│   │   ├── entityExtractor.ts  # Named entity extraction
│   │   ├── profanityFilter.ts  # Profanity filtering
│   │   ├── sentenceSplitter.ts # Sentence segmentation
│   │   ├── textChunker.ts      # Text chunking utilities
│   │   └── unicodeNormalizer.ts # Unicode normalization
│   ├── error/                  # Error handling and recovery
│   │   ├── errorHandler.ts     # Global error handler
│   │   ├── pipelineErrors.ts   # Pipeline-specific errors
│   │   ├── providerFailover.ts # Provider failover logic
│   │   ├── rateLimitHandler.ts # Rate limiting
│   │   ├── retryStrategy.ts    # Retry mechanisms
│   │   └── validationErrors.ts # Validation error handling
│   ├── factories/              # Factory pattern implementations
│   │   ├── AgentFactory.ts     # Agent orchestration factory
│   │   ├── DataFactory.ts      # Data processing factory
│   │   ├── DetectionFactory.ts # AI detection factory
│   │   ├── GuardrailFactory.ts # Safety guardrails factory
│   │   ├── MediaFactory.ts     # Media processing factory
│   │   ├── ModerationFactory.ts # Content moderation factory
│   │   ├── TrainingFactory.ts  # Training data factory
│   │   └── TranslationFactory.ts # Translation factory
│   ├── guardrails/             # Safety and validation systems
│   │   ├── adversarialInputDetector.ts # Adversarial input detection
│   │   ├── bannedTopicFilter.ts # Topic filtering
│   │   ├── guardrailConfig.ts  # Guardrail configuration
│   │   ├── guardrailRunner.ts  # Guardrail execution
│   │   ├── hallucinationRiskScorer.ts # Hallucination detection
│   │   ├── jailbreakDetector.ts # Jailbreak attempt detection
│   │   └── promptInjectionScanner.ts # Prompt injection prevention
│   ├── logging/                # Logging and monitoring
│   │   ├── debugEvents.ts      # Debug event logging
│   │   ├── logger.ts           # Main logging system
│   │   ├── metricsCollector.ts # Performance metrics
│   │   ├── performanceMonitor.ts # Performance monitoring
│   │   ├── pipelineTelemetry.ts # Pipeline telemetry
│   │   └── providerHealthMonitor.ts # Provider health monitoring
│   ├── mcp/                    # Model Context Protocol integration
│   │   ├── errorFormatter.ts   # MCP error formatting
│   │   ├── eventRouter.ts      # MCP event routing
│   │   ├── manifest.json       # MCP manifest template
│   │   ├── mcpLoader.ts        # MCP loader
│   │   ├── mcpToolRegistry.ts  # MCP tool registry
│   │   └── toolExecutor.ts     # MCP tool execution
│   ├── orchestration/          # Workflow orchestration
│   │   ├── ensembleController.ts # Ensemble processing
│   │   ├── fallbackController.ts # Fallback handling
│   │   ├── parallelController.ts # Parallel processing
│   │   ├── pipelineBuilder.ts  # Pipeline construction
│   │   ├── pipelineRunner.ts   # Pipeline execution
│   │   ├── providerRouter.ts   # Provider routing
│   │   ├── retryController.ts  # Retry logic
│   │   ├── stepTypes.ts        # Pipeline step types
│   │   ├── stepValidator.ts    # Step validation
│   │   └── workflowValidator.ts # Workflow validation
│   ├── providers/              # AI provider implementations
│   │   ├── anthropicProvider.ts # Anthropic Claude provider
│   │   ├── cohereProvider.ts   # Cohere provider
│   │   ├── elevenLabsProvider.ts # ElevenLabs TTS provider
│   │   ├── embeddingProvider.ts # Embedding provider router
│   │   ├── geminiProvider.ts   # Google Gemini provider
│   │   ├── imageModerationProvider.ts # Image moderation provider
│   │   ├── localLLMProvider.ts # Local LLM provider
│   │   ├── openaiProvider.ts   # OpenAI provider
│   │   ├── providerRegistry.ts # Provider registry
│   │   ├── providerTypes.ts    # Provider type definitions
│   │   └── whisperProvider.ts  # OpenAI Whisper provider
│   ├── training/               # Training data management
│   │   ├── collectFromFactories.ts # Data collection from factories
│   │   ├── csvFormatter.ts     # CSV export formatting
│   │   ├── datasetValidator.ts # Dataset validation
│   │   ├── embeddingGenerator.ts # Embedding generation
│   │   ├── exportScheduler.ts  # Export scheduling
│   │   ├── jsonlFormatter.ts   # JSONL export formatting
│   │   ├── labelGenerator.ts   # Label generation
│   │   ├── manifestGenerator.ts # Training manifest generation
│   │   ├── parquetFormatter.ts # Parquet export formatting
│   │   ├── shardManager.ts     # Dataset sharding
│   │   └── trainingManifestGenerator.ts # Training manifest generation
│   ├── utils/                  # Utility functions
│   │   ├── audioUtils.ts       # Audio processing utilities
│   │   ├── deepMerge.ts        # Deep object merging
│   │   ├── fileUtils.ts        # File system utilities
│   │   ├── hashUtils.ts        # Hashing utilities
│   │   ├── jsonValidator.ts    # JSON validation
│   │   ├── markdownParser.ts   # Markdown parsing
│   │   ├── normalizeText.ts    # Text normalization
│   │   ├── sanitizeHTML.ts     # HTML sanitization
│   │   ├── streamUtils.ts      # Stream processing utilities
│   │   ├── tokenCounter.ts     # Token counting
│   │   └── urlUtils.ts         # URL utilities
│   └── workflows/              # Workflow management
│       ├── workflow.ts         # Main workflow implementation
│       ├── workflowRunner.ts   # Workflow execution
│       ├── workflowSchema.ts   # Workflow schema validation
│       ├── workflowTypes.ts    # Workflow type definitions
│       └── workflowValidator.ts # Workflow validation
├── index.ts                    # Main MCF entry point
├── providers.ts                # Provider initialization
└── types.ts                    # TypeScript type definitions
```

## SDK Structure (`src/sdk/`)

```
src/sdk/
├── client.ts                   # Main MCF SDK client
├── index.ts                    # SDK exports
├── interfaces.ts               # SDK interface definitions
├── mcf.d.ts                    # MCF type definitions
└── providerBindings.ts         # Provider binding utilities
```

## Services Structure (`src/services/`)

```
src/services/
├── agents/                     # AI agent services
│   ├── categorizeText.ts      # Text categorization agent
│   ├── sentimentAnalysis.ts    # Sentiment analysis agent
│   ├── summarization.ts        # Text summarization agent
│   ├── systemPrompts/         # System prompt templates
│   │   ├── categorization.txt
│   │   ├── sentiment.txt
│   │   └── summarization.txt
│   └── textAnalysis.ts        # General text analysis
├── detection/                  # AI detection services
│   ├── text/                  # Text-based detection
│   │   ├── detectAI.ts        # AI-generated text detection
│   │   ├── detectFakeVoice.ts # Fake voice detection
│   │   ├── perplexityAnalyzer.ts # Text perplexity analysis
│   │   ├── stylometryAnalyzer.ts # Writing style analysis
│   │   ├── watermarkDetector.ts # Digital watermark detection
│   │   └── zeroWatermarkDetector.ts # Zero-watermark detection
│   └── voice/                 # Voice detection
│       ├── audioFingerprinting.ts # Audio fingerprinting
│       ├── deepfakeDetector.ts # Deepfake voice detection
│       └── voiceCloningDetector.ts # Voice cloning detection
├── media/                     # Media processing services
│   ├── ocr.ts                 # Optical character recognition
│   ├── speechToText.ts        # Speech-to-text conversion
│   └── textToSpeech.ts        # Text-to-speech conversion
├── moderation/                # Content moderation services
│   ├── image/                 # Image moderation
│   │   ├── contentModeration.ts # General content moderation
│   │   └── imageSafety.ts     # Image safety checking
│   ├── text/                  # Text moderation
│   │   ├── hateSpeechDetector.ts # Hate speech detection
│   │   ├── isTextSafe.ts      # Text safety checking
│   │   ├── moderateText.ts    # Text moderation
│   │   └── toxicityAnalyzer.ts # Toxicity analysis
│   └── systemPrompts/         # Moderation prompts
│       └── moderation.txt
├── transformation/            # Content transformation services
│   ├── documentParser.ts      # Document parsing
│   ├── formatConverter.ts     # Format conversion
│   ├── languageDetector.ts    # Language detection
│   └── textNormalizer.ts      # Text normalization
└── translation/               # Translation services
    ├── batchTranslator.ts     # Batch translation
    ├── languageSupport.ts     # Language support utilities
    ├── textTranslator.ts      # Text translation
    ├── translationMemory.ts   # Translation memory
    ├── translationValidator.ts # Translation validation
    ├── translator.ts          # Main translation service
    └── voiceTranslator.ts     # Voice translation
```

## Test Structure (`tests/`)

```
tests/
├── agents.test.ts             # Agent service tests
├── cli.test.ts                # CLI functionality tests
├── config.test.ts             # Configuration tests
├── detection.test.ts          # Detection service tests
├── factories.test.ts          # Factory pattern tests
├── global.d.ts                # Global type definitions for tests
├── integration.test.ts        # Integration tests
├── moderation.test.ts         # Moderation service tests
├── pipelines.test.ts          # Pipeline tests
├── providers.test.ts          # Provider tests
├── setup.ts                   # Test setup and utilities
├── training.test.ts           # Training functionality tests
└── translation.test.ts        # Translation service tests
```

## Documentation Structure (`docs/`)

```
docs/
├── agents.md                  # AI agents documentation
├── architecture.md            # System architecture overview
├── cli.md                     # Command-line interface guide
├── configuration.md           # Configuration documentation
├── detection.md               # AI detection features
├── error-handling.md          # Error handling strategies
├── factories.md               # Factory pattern documentation
├── guardrails.md              # Safety guardrails documentation
├── installation.md            # Installation instructions
├── integration.md             # Integration guides
├── introduction.md            # Project introduction
├── mcp-tools.md               # MCP tools documentation
├── moderation.md              # Content moderation features
├── providers.md               # AI provider documentation
├── project-structure.md       # This file - complete project structure
├── sdk.md                     # SDK usage documentation
├── services.md                # Service layer documentation
├── training-datasets.md       # Training data management
├── translation.md             # Translation features
└── workflows.md               # Workflow orchestration
```

## Compiled Distribution (`dist/`)

The `dist/` directory contains compiled JavaScript and TypeScript declaration files that mirror the `src/` structure. Each TypeScript file in `src/` has corresponding:
- `.js` - Compiled JavaScript
- `.d.ts` - TypeScript declarations
- `.js.map` - Source maps (for debugging)

## File Counts by Type

- **TypeScript Source Files**: ~200+ (`.ts` files in `src/`)
- **Test Files**: 14 (`.ts` files in `tests/`)
- **Documentation Files**: 19 (`.md` files in `docs/`)
- **Configuration Files**: 8 (JSON, JS, and other config files)
- **Compiled Files**: ~400+ (JS, DTS, and map files in `dist/`)

## Key Architecture Notes

1. **Master Interface Contract (MIC)**: `src/types.ts` defines all shared interfaces
2. **Provider Registry**: Centralized provider management in `src/core/providers/providerRegistry.ts`
3. **Factory Pattern**: All AI operations use factories for consistent interfaces
4. **Layered Architecture**: Clear separation between core, services, SDK, and CLI layers
5. **MCP Integration**: Model Context Protocol support for enhanced AI interactions

This structure ensures maintainability, extensibility, and clear separation of concerns throughout the MCF framework.
