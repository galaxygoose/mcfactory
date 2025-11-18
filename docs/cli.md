# Command Line Interface (CLI)

mcfactory provides a comprehensive command-line interface for managing configurations, running pipelines, and performing AI operations directly from the terminal. The CLI offers both interactive and scripted usage patterns for development and production workflows.

## Installation

Install mcfactory globally to access the CLI:

```bash
npm install -g mcfactory
# or
yarn global add mcfactory
```

Verify installation:

```bash
mcfactory --version
# Output: 1.0.0

mcfactory --help
# Shows available commands
```

## Global Options

Options available for all commands:

```bash
mcfactory [command] [options]

Global Options:
  -c, --config <path>     Path to config file (default: "./mcfactory.config.json")
  -v, --verbose           Enable verbose output
  -q, --quiet             Suppress non-error output
  -h, --help              Display help for command
  --version               Show version number
```

## Configuration Commands

### Initialize Configuration

Create a new mcfactory configuration file:

```bash
# Initialize with default settings
mcfactory init

# Initialize with specific provider
mcfactory init --provider openai

# Initialize for specific use case
mcfactory init --template translation
mcfactory init --template moderation
mcfactory init --template detection

# Interactive initialization
mcfactory init --interactive
```

**Options:**
- `--provider <name>`: Default provider (openai, anthropic, gemini, etc.)
- `--template <type>`: Configuration template
- `--interactive`: Interactive setup mode
- `--output <path>`: Output path for config file

**Example Output:**
```bash
$ mcfactory init --provider openai
✅ Created mcfactory.config.json
📝 Next steps:
   1. Set your OPENAI_API_KEY environment variable
   2. Run 'mcfactory validate-config' to verify setup
   3. Try 'mcfactory translate "Hello" es' to test
```

### Validate Configuration

Check configuration file for errors and missing settings:

```bash
# Validate current config
mcfactory validate-config

# Validate specific config file
mcfactory validate-config --config ./config/prod.json

# Validate with connectivity tests
mcfactory validate-config --test-connection

# Validate for specific environment
mcfactory validate-config --env production
```

**Options:**
- `--config <path>`: Path to config file
- `--test-connection`: Test provider connectivity
- `--env <name>`: Environment to validate for
- `--fix`: Attempt to fix common issues

**Example Output:**
```bash
$ mcfactory validate-config --test-connection
✅ Configuration file is valid
✅ Provider 'openai' is configured
✅ API key is set (masked)
✅ OpenAI API connection successful
⚠️  Warning: Rate limit detected (80% of limit used)
📊 Configuration summary:
   - Providers: 2 configured (openai, anthropic)
   - Pipelines: 3 defined
   - Training: enabled
   - Guardrails: enabled
```

### Diagnose System

Run comprehensive system diagnostics:

```bash
# Full system diagnosis
mcfactory diagnose

# Quick health check
mcfactory diagnose --quick

# Diagnose specific component
mcfactory diagnose --component providers
mcfactory diagnose --component training
mcfactory diagnose --component guardrails

# Generate diagnostic report
mcfactory diagnose --report ./diagnostics.html
```

**Options:**
- `--quick`: Fast health check only
- `--component <name>`: Test specific component
- `--report <path>`: Generate HTML report
- `--verbose`: Detailed diagnostic output

**Example Output:**
```bash
$ mcfactory diagnose
🔍 Running mcfactory system diagnostics...

✅ Core modules loaded successfully
✅ Configuration validated
✅ Provider registry initialized
   - OpenAI: ✅ Connected
   - Anthropic: ✅ Connected
   - Local models: ⚠️ Not configured
✅ Database connectivity: ✅ OK
✅ Cache system: ✅ Redis connected
✅ Training pipeline: ✅ Ready
✅ Guardrails: ✅ Active

⚠️ Warnings:
   - High memory usage detected
   - 2 provider API keys expiring soon

📊 Performance metrics:
   - Average response time: 245ms
   - Error rate: 0.02%
   - Cache hit rate: 87%

📋 Recommendations:
   1. Consider increasing memory limits
   2. Rotate expiring API keys
   3. Enable request batching for better performance
```

## Pipeline Commands

### Execute Pipeline

Run named pipelines or custom pipeline definitions:

```bash
# Run named pipeline
mcfactory run-pipeline content-moderation

# Run with input data
mcfactory run-pipeline translation-workflow --input "Hello world"

# Run pipeline from file
mcfactory run-pipeline --file ./pipelines/custom.json

# Run with custom parameters
mcfactory run-pipeline content-analysis \
  --input-file ./data/input.txt \
  --output-file ./results/output.json \
  --param targetLang=es \
  --param maxLength=100

# Run in background
mcfactory run-pipeline long-running-pipeline --background

# Run with debugging
mcfactory run-pipeline complex-workflow --debug --verbose
```

**Options:**
- `--input <text>`: Input text for pipeline
- `--input-file <path>`: Input file path
- `--output-file <path>`: Output file path
- `--param <key=value>`: Pipeline parameters
- `--file <path>`: Custom pipeline file
- `--background`: Run in background
- `--debug`: Enable debug output
- `--dry-run`: Validate pipeline without execution

**Example Usage:**
```bash
# Content processing pipeline
$ mcfactory run-pipeline content-processing --input "User generated content"
✅ Pipeline completed successfully
📊 Results:
   - Moderation: safe
   - Translation: "Contenido generado por el usuario"
   - Categories: ["general", "user-content"]
   - Processing time: 1.2s

# Batch processing
$ mcfactory run-pipeline batch-translation \
  --input-file ./data/texts.txt \
  --output-file ./results/translations.json \
  --param targetLang=fr \
  --param preserveFormat=true
📁 Processing 150 items...
✅ Batch completed: 150/150 successful
💾 Results saved to ./results/translations.json
```

### List Pipelines

Show available pipelines and their status:

```bash
# List all pipelines
mcfactory pipelines

# List with details
mcfactory pipelines --detailed

# Filter by status
mcfactory pipelines --status active
mcfactory pipelines --status failed

# Search pipelines
mcfactory pipelines --search translation
```

**Example Output:**
```bash
$ mcfactory pipelines --detailed
📋 Available Pipelines:

1. content-moderation
   📝 Description: Moderate user-generated content
   🔧 Steps: 4 (guardrail, moderate, log, notify)
   📊 Status: active
   🕒 Last run: 2024-01-15 14:30:22
   ✅ Success rate: 98.5%

2. translation-workflow
   📝 Description: Translate content with quality checks
   🔧 Steps: 3 (translate, detect-quality, format)
   📊 Status: active
   🕒 Last run: 2024-01-15 16:45:10
   ✅ Success rate: 99.2%

3. batch-processing
   📝 Description: Process large batches of content
   🔧 Steps: 5 (load, process, validate, save, cleanup)
   📊 Status: idle
   🕒 Last run: 2024-01-14 09:15:33
   ✅ Success rate: 95.8%
```

### Create Pipeline

Create new pipelines interactively or from templates:

```bash
# Create from template
mcfactory create-pipeline --template translation

# Interactive creation
mcfactory create-pipeline --interactive

# Create from existing pipeline
mcfactory create-pipeline --copy content-moderation --name my-custom-pipeline

# Create from JSON specification
mcfactory create-pipeline --spec ./pipeline-spec.json
```

### Manage Pipeline Execution

Monitor and manage running pipelines:

```bash
# List running pipelines
mcfactory pipelines running

# Stop a running pipeline
mcfactory stop-pipeline <pipeline-id>

# Get pipeline execution details
mcfactory pipeline-status <pipeline-id>

# View pipeline logs
mcfactory pipeline-logs <pipeline-id>
mcfactory pipeline-logs <pipeline-id> --tail 50  # Last 50 lines
mcfactory pipeline-logs <pipeline-id> --follow   # Follow logs
```

## AI Operation Commands

### Translation Commands

Perform translation operations directly:

```bash
# Text translation
mcfactory translate "Hello world" es
mcfactory translate "Bonjour" en --source fr

# File translation
mcfactory translate --input-file ./text.txt --output-file ./translated.txt --target es

# Batch translation
mcfactory translate --batch ./texts.json --target fr --output ./results.json

# Voice translation
mcfactory translate-voice ./audio.wav --target es --output ./translated.wav
```

**Translation Options:**
- `--source <lang>`: Source language
- `--target <lang>`: Target language
- `--preserve-format`: Maintain formatting
- `--voice <name>`: Voice for TTS output
- `--batch`: Process multiple items

### Moderation Commands

Moderate content directly:

```bash
# Moderate text
mcfactory moderate "This is some content to check"

# Moderate file
mcfactory moderate --input-file ./content.txt

# Moderate image
mcfactory moderate-image ./image.jpg

# Batch moderation
mcfactory moderate --batch ./content-list.txt --output ./moderation-results.json
```

### Detection Commands

Detect AI-generated content:

```bash
# Detect AI text
mcfactory detect-ai "This might be AI-generated text"

# Detect fake voice
mcfactory detect-voice ./audio.wav

# Batch detection
mcfactory detect-ai --batch ./texts.txt --output ./detection-results.json
```

### Agent Commands

Use AI agents directly:

```bash
# Summarize text
mcfactory summarize "Long text to summarize..." --length medium

# Analyze sentiment
mcfactory sentiment "I love this product!"

# Categorize content
mcfactory categorize "JavaScript framework announcement" --tags technology,programming
```

## Training Commands

### Dataset Management

Manage training datasets:

```bash
# Collect training data
mcfactory collect-data --source api --days 7

# Validate dataset
mcfactory validate-dataset ./data/training.jsonl

# Export dataset
mcfactory export-dataset ./data/training.jsonl --format huggingface --output ./exported/

# Generate dataset statistics
mcfactory dataset-stats ./data/training.jsonl
```

### Model Training

Train and fine-tune models:

```bash
# Start training pipeline
mcfactory train-model --dataset ./data/training.jsonl --model gpt-2

# Fine-tune existing model
mcfactory fine-tune --base-model ./models/base --dataset ./data/fine-tune.jsonl

# Monitor training progress
mcfactory training-status <training-id>

# Stop training
mcfactory stop-training <training-id>
```

## System Management

### Service Management

Control mcfactory services:

```bash
# Start MCP server
mcfactory start-mcp --port 3001

# Stop MCP server
mcfactory stop-mcp

# Restart services
mcfactory restart

# Check service status
mcfactory status
```

### Cache Management

Manage caching systems:

```bash
# Clear all caches
mcfactory clear-cache

# Clear specific cache
mcfactory clear-cache --type translation
mcfactory clear-cache --type moderation

# Show cache statistics
mcfactory cache-stats
```

### Log Management

Work with system logs:

```bash
# View recent logs
mcfactory logs

# View specific log file
mcfactory logs --file error.log

# Search logs
mcfactory logs --search "ERROR" --last 24h

# Export logs
mcfactory logs --export ./logs/export.json --since "2024-01-01"
```

## Advanced Usage

### Scripting with mcfactory CLI

Use mcfactory CLI in shell scripts:

```bash
#!/bin/bash

# Process multiple files
for file in ./content/*.txt; do
  echo "Processing $file..."
  mcfactory run-pipeline content-moderation --input-file "$file" \
    --output-file "./processed/$(basename "$file")"
done

# Conditional processing
result=$(mcfactory moderate "Check this content")
if [[ $result == *"safe"* ]]; then
  mcfactory translate "$content" es --output ./translated.txt
else
  echo "Content flagged, skipping translation"
fi
```

### CI/CD Integration

Integrate mcfactory CLI into CI/CD pipelines:

```yaml
# GitHub Actions example
name: Content Processing Pipeline
on: [push, pull_request]

jobs:
  process-content:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install mcfactory
        run: npm install -g mcfactory
        
      - name: Validate Configuration
        run: mcfactory validate-config --test-connection
        
      - name: Process Content
        run: mcfactory run-pipeline content-processing \
          --input-file ./content/input.txt \
          --output-file ./results/output.json
          
      - name: Run Tests
        run: npm test
```

### Interactive Mode

Use interactive commands for exploration:

```bash
# Interactive pipeline builder
mcfactory interactive pipeline

# Interactive configuration editor
mcfactory interactive config

# Interactive dataset explorer
mcfactory interactive dataset ./data/training.jsonl
```

## Configuration Examples

### Development Configuration
```bash
export MCFACTORY_CONFIG=./config/dev.json
export LOG_LEVEL=debug
export MCFACTORY_CACHE_ENABLED=true
```

### Production Configuration
```bash
export MCFACTORY_CONFIG=./config/prod.json
export LOG_LEVEL=warn
export MCFACTORY_MAX_CONCURRENCY=10
export MCFACTORY_RATE_LIMIT_REQUESTS_PER_MINUTE=1000
```

### Environment-Specific Setup
```bash
# Staging
mcfactory init --env staging --provider anthropic

# Production
mcfactory init --env production --provider openai --backup anthropic
```

## Troubleshooting

### Common Issues

**Command not found:**
```bash
# Install globally
npm install -g mcfactory

# Or use npx
npx mcfactory --version
```

**Configuration errors:**
```bash
# Validate configuration
mcfactory validate-config --verbose

# Check environment variables
echo $OPENAI_API_KEY
```

**Memory issues:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" mcfactory run-pipeline large-dataset
```

**Rate limiting:**
```bash
# Add delays between requests
mcfactory run-pipeline batch-processing --delay 1000
```

**Permission errors:**
```bash
# Check file permissions
ls -la ./mcfactory.config.json

# Fix permissions
chmod 644 ./mcfactory.config.json
```

## Best Practices

### Command Usage
1. **Use appropriate verbosity**: Use `--verbose` for debugging, `--quiet` for scripts
2. **Validate before running**: Always run `mcfactory validate-config` after configuration changes
3. **Monitor resource usage**: Use `mcfactory diagnose` to check system health
4. **Handle errors gracefully**: Check exit codes in scripts
5. **Use batch operations**: Prefer batch processing for multiple items

### Pipeline Management
1. **Version control pipelines**: Keep pipeline definitions in version control
2. **Test pipelines**: Use `--dry-run` to validate pipelines before execution
3. **Monitor performance**: Track pipeline execution times and success rates
4. **Implement logging**: Use appropriate log levels for different environments
5. **Handle failures**: Implement retry logic and fallback strategies

### Security
1. **Secure API keys**: Never commit API keys to version control
2. **Use environment variables**: Store sensitive configuration in environment variables
3. **Regular key rotation**: Rotate API keys regularly
4. **Access controls**: Limit who can execute mcfactory commands
5. **Audit logging**: Enable audit logging for production systems

### Performance
1. **Use caching**: Enable caching for frequently used operations
2. **Batch operations**: Process multiple items together
3. **Parallel execution**: Use parallel pipelines when possible
4. **Resource limits**: Set appropriate memory and CPU limits
5. **Monitoring**: Monitor CLI performance and resource usage

This comprehensive CLI provides powerful tools for managing mcfactory installations, running AI operations, and integrating mcfactory into development and production workflows.
