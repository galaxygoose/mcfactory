# Command Line Interface (CLI)

MCF provides a comprehensive command-line interface for managing configurations, running pipelines, and performing AI operations directly from the terminal. The CLI offers both interactive and scripted usage patterns for development and production workflows.

## Installation

Install MCF globally to access the CLI:

```bash
npm install -g mcf
# or
yarn global add mcf
```

Verify installation:

```bash
mcf --version
# Output: 1.0.0

mcf --help
# Shows available commands
```

## Global Options

Options available for all commands:

```bash
mcf [command] [options]

Global Options:
  -c, --config <path>     Path to config file (default: "./mcf.config.json")
  -v, --verbose           Enable verbose output
  -q, --quiet             Suppress non-error output
  -h, --help              Display help for command
  --version               Show version number
```

## Configuration Commands

### Initialize Configuration

Create a new MCF configuration file:

```bash
# Initialize with default settings
mcf init

# Initialize with specific provider
mcf init --provider openai

# Initialize for specific use case
mcf init --template translation
mcf init --template moderation
mcf init --template detection

# Interactive initialization
mcf init --interactive
```

**Options:**
- `--provider <name>`: Default provider (openai, anthropic, gemini, etc.)
- `--template <type>`: Configuration template
- `--interactive`: Interactive setup mode
- `--output <path>`: Output path for config file

**Example Output:**
```bash
$ mcf init --provider openai
✅ Created mcf.config.json
📝 Next steps:
   1. Set your OPENAI_API_KEY environment variable
   2. Run 'mcf validate-config' to verify setup
   3. Try 'mcf translate "Hello" es' to test
```

### Validate Configuration

Check configuration file for errors and missing settings:

```bash
# Validate current config
mcf validate-config

# Validate specific config file
mcf validate-config --config ./config/prod.json

# Validate with connectivity tests
mcf validate-config --test-connection

# Validate for specific environment
mcf validate-config --env production
```

**Options:**
- `--config <path>`: Path to config file
- `--test-connection`: Test provider connectivity
- `--env <name>`: Environment to validate for
- `--fix`: Attempt to fix common issues

**Example Output:**
```bash
$ mcf validate-config --test-connection
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
mcf diagnose

# Quick health check
mcf diagnose --quick

# Diagnose specific component
mcf diagnose --component providers
mcf diagnose --component training
mcf diagnose --component guardrails

# Generate diagnostic report
mcf diagnose --report ./diagnostics.html
```

**Options:**
- `--quick`: Fast health check only
- `--component <name>`: Test specific component
- `--report <path>`: Generate HTML report
- `--verbose`: Detailed diagnostic output

**Example Output:**
```bash
$ mcf diagnose
🔍 Running MCF system diagnostics...

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
mcf run-pipeline content-moderation

# Run with input data
mcf run-pipeline translation-workflow --input "Hello world"

# Run pipeline from file
mcf run-pipeline --file ./pipelines/custom.json

# Run with custom parameters
mcf run-pipeline content-analysis \
  --input-file ./data/input.txt \
  --output-file ./results/output.json \
  --param targetLang=es \
  --param maxLength=100

# Run in background
mcf run-pipeline long-running-pipeline --background

# Run with debugging
mcf run-pipeline complex-workflow --debug --verbose
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
$ mcf run-pipeline content-processing --input "User generated content"
✅ Pipeline completed successfully
📊 Results:
   - Moderation: safe
   - Translation: "Contenido generado por el usuario"
   - Categories: ["general", "user-content"]
   - Processing time: 1.2s

# Batch processing
$ mcf run-pipeline batch-translation \
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
mcf pipelines

# List with details
mcf pipelines --detailed

# Filter by status
mcf pipelines --status active
mcf pipelines --status failed

# Search pipelines
mcf pipelines --search translation
```

**Example Output:**
```bash
$ mcf pipelines --detailed
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
mcf create-pipeline --template translation

# Interactive creation
mcf create-pipeline --interactive

# Create from existing pipeline
mcf create-pipeline --copy content-moderation --name my-custom-pipeline

# Create from JSON specification
mcf create-pipeline --spec ./pipeline-spec.json
```

### Manage Pipeline Execution

Monitor and manage running pipelines:

```bash
# List running pipelines
mcf pipelines running

# Stop a running pipeline
mcf stop-pipeline <pipeline-id>

# Get pipeline execution details
mcf pipeline-status <pipeline-id>

# View pipeline logs
mcf pipeline-logs <pipeline-id>
mcf pipeline-logs <pipeline-id> --tail 50  # Last 50 lines
mcf pipeline-logs <pipeline-id> --follow   # Follow logs
```

## AI Operation Commands

### Translation Commands

Perform translation operations directly:

```bash
# Text translation
mcf translate "Hello world" es
mcf translate "Bonjour" en --source fr

# File translation
mcf translate --input-file ./text.txt --output-file ./translated.txt --target es

# Batch translation
mcf translate --batch ./texts.json --target fr --output ./results.json

# Voice translation
mcf translate-voice ./audio.wav --target es --output ./translated.wav
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
mcf moderate "This is some content to check"

# Moderate file
mcf moderate --input-file ./content.txt

# Moderate image
mcf moderate-image ./image.jpg

# Batch moderation
mcf moderate --batch ./content-list.txt --output ./moderation-results.json
```

### Detection Commands

Detect AI-generated content:

```bash
# Detect AI text
mcf detect-ai "This might be AI-generated text"

# Detect fake voice
mcf detect-voice ./audio.wav

# Batch detection
mcf detect-ai --batch ./texts.txt --output ./detection-results.json
```

### Agent Commands

Use AI agents directly:

```bash
# Summarize text
mcf summarize "Long text to summarize..." --length medium

# Analyze sentiment
mcf sentiment "I love this product!"

# Categorize content
mcf categorize "JavaScript framework announcement" --tags technology,programming
```

## Training Commands

### Dataset Management

Manage training datasets:

```bash
# Collect training data
mcf collect-data --source api --days 7

# Validate dataset
mcf validate-dataset ./data/training.jsonl

# Export dataset
mcf export-dataset ./data/training.jsonl --format huggingface --output ./exported/

# Generate dataset statistics
mcf dataset-stats ./data/training.jsonl
```

### Model Training

Train and fine-tune models:

```bash
# Start training pipeline
mcf train-model --dataset ./data/training.jsonl --model gpt-2

# Fine-tune existing model
mcf fine-tune --base-model ./models/base --dataset ./data/fine-tune.jsonl

# Monitor training progress
mcf training-status <training-id>

# Stop training
mcf stop-training <training-id>
```

## System Management

### Service Management

Control MCF services:

```bash
# Start MCP server
mcf start-mcp --port 3001

# Stop MCP server
mcf stop-mcp

# Restart services
mcf restart

# Check service status
mcf status
```

### Cache Management

Manage caching systems:

```bash
# Clear all caches
mcf clear-cache

# Clear specific cache
mcf clear-cache --type translation
mcf clear-cache --type moderation

# Show cache statistics
mcf cache-stats
```

### Log Management

Work with system logs:

```bash
# View recent logs
mcf logs

# View specific log file
mcf logs --file error.log

# Search logs
mcf logs --search "ERROR" --last 24h

# Export logs
mcf logs --export ./logs/export.json --since "2024-01-01"
```

## Advanced Usage

### Scripting with MCF CLI

Use MCF CLI in shell scripts:

```bash
#!/bin/bash

# Process multiple files
for file in ./content/*.txt; do
  echo "Processing $file..."
  mcf run-pipeline content-moderation --input-file "$file" \
    --output-file "./processed/$(basename "$file")"
done

# Conditional processing
result=$(mcf moderate "Check this content")
if [[ $result == *"safe"* ]]; then
  mcf translate "$content" es --output ./translated.txt
else
  echo "Content flagged, skipping translation"
fi
```

### CI/CD Integration

Integrate MCF CLI into CI/CD pipelines:

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
          
      - name: Install MCF
        run: npm install -g mcf
        
      - name: Validate Configuration
        run: mcf validate-config --test-connection
        
      - name: Process Content
        run: mcf run-pipeline content-processing \
          --input-file ./content/input.txt \
          --output-file ./results/output.json
          
      - name: Run Tests
        run: npm test
```

### Interactive Mode

Use interactive commands for exploration:

```bash
# Interactive pipeline builder
mcf interactive pipeline

# Interactive configuration editor
mcf interactive config

# Interactive dataset explorer
mcf interactive dataset ./data/training.jsonl
```

## Configuration Examples

### Development Configuration
```bash
export MCF_CONFIG=./config/dev.json
export LOG_LEVEL=debug
export MCF_CACHE_ENABLED=true
```

### Production Configuration
```bash
export MCF_CONFIG=./config/prod.json
export LOG_LEVEL=warn
export MCF_MAX_CONCURRENCY=10
export MCF_RATE_LIMIT_REQUESTS_PER_MINUTE=1000
```

### Environment-Specific Setup
```bash
# Staging
mcf init --env staging --provider anthropic

# Production
mcf init --env production --provider openai --backup anthropic
```

## Troubleshooting

### Common Issues

**Command not found:**
```bash
# Install globally
npm install -g mcf

# Or use npx
npx mcf --version
```

**Configuration errors:**
```bash
# Validate configuration
mcf validate-config --verbose

# Check environment variables
echo $OPENAI_API_KEY
```

**Memory issues:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" mcf run-pipeline large-dataset
```

**Rate limiting:**
```bash
# Add delays between requests
mcf run-pipeline batch-processing --delay 1000
```

**Permission errors:**
```bash
# Check file permissions
ls -la ./mcf.config.json

# Fix permissions
chmod 644 ./mcf.config.json
```

## Best Practices

### Command Usage
1. **Use appropriate verbosity**: Use `--verbose` for debugging, `--quiet` for scripts
2. **Validate before running**: Always run `mcf validate-config` after configuration changes
3. **Monitor resource usage**: Use `mcf diagnose` to check system health
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
4. **Access controls**: Limit who can execute MCF commands
5. **Audit logging**: Enable audit logging for production systems

### Performance
1. **Use caching**: Enable caching for frequently used operations
2. **Batch operations**: Process multiple items together
3. **Parallel execution**: Use parallel pipelines when possible
4. **Resource limits**: Set appropriate memory and CPU limits
5. **Monitoring**: Monitor CLI performance and resource usage

This comprehensive CLI provides powerful tools for managing MCF installations, running AI operations, and integrating MCF into development and production workflows.
