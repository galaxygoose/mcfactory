# Training Datasets

MCF provides comprehensive training data management capabilities for collecting, formatting, validating, and exporting datasets for AI model training. The training system supports multiple data formats and integrates with popular machine learning frameworks.

## Data Collection

Collect training data from various sources and interactions to build comprehensive datasets for model training.

### Collection Sources

#### API-Based Collection
Automatically collect data from MCF API interactions:

```typescript
import { TrainingDataCollector } from '../services/training/dataCollector';

const collector = new TrainingDataCollector({
  sources: ['translation', 'moderation', 'detection'],
  sampling: {
    rate: 0.1,  // Collect 10% of interactions
    maxPerDay: 1000,
    filters: {
      minQuality: 0.8,
      excludeErrors: true
    }
  }
});

// Start collection
await collector.start();

// Collect specific interaction
await collector.collectInteraction({
  type: 'translation',
  input: 'Hello world',
  output: 'Hola mundo',
  metadata: {
    sourceLang: 'en',
    targetLang: 'es',
    provider: 'openai',
    quality: 0.95
  }
});
```

#### File-Based Collection
Import data from files and external sources:

```typescript
const fileCollector = new TrainingDataCollector({
  sources: ['files'],
  fileSources: [
    {
      path: './data/translations.csv',
      format: 'csv',
      columns: ['input', 'output', 'source_lang', 'target_lang']
    },
    {
      path: './data/conversations.jsonl',
      format: 'jsonl'
    }
  ]
});
```

#### Real-Time Collection
Collect data from live application usage:

```typescript
// Middleware for collecting training data
app.use('/api/*', async (req, res, next) => {
  const startTime = Date.now();

  // Store original send method
  const originalSend = res.send;
  res.send = function(data) {
    // Collect successful API responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      collector.collectInteraction({
        type: req.path.split('/')[2], // Extract API type
        input: req.body,
        output: data,
        metadata: {
          userId: req.user?.id,
          duration: Date.now() - startTime,
          userAgent: req.get('User-Agent')
        }
      }).catch(err => console.warn('Failed to collect training data:', err));
    }

    originalSend.call(this, data);
  };

  next();
});
```

### Data Sampling Strategies

#### Random Sampling
```typescript
const randomSampler = {
  shouldCollect(): boolean {
    return Math.random() < this.collectionRate;
  }
};
```

#### Stratified Sampling
```typescript
const stratifiedSampler = {
  shouldCollect(interaction: any): boolean {
    const category = this.categorizeInteraction(interaction);
    const currentCount = this.getCategoryCount(category);

    return currentCount < this.targetPerCategory;
  }
};
```

#### Quality-Based Sampling
```typescript
const qualitySampler = {
  shouldCollect(interaction: any): boolean {
    const quality = this.assessQuality(interaction);

    // Collect high-quality interactions more frequently
    if (quality > 0.9) return Math.random() < 0.5;
    if (quality > 0.7) return Math.random() < 0.2;
    if (quality > 0.5) return Math.random() < 0.05;

    return false; // Skip low-quality interactions
  }
};
```

## Data Formatting

Format collected data for different model training requirements and frameworks.

### Supported Formats

#### JSONL Format
Line-delimited JSON, ideal for large datasets:

```json
{"input": "Translate 'Hello' to Spanish", "output": "Hola", "task": "translation"}
{"input": "What is the capital of France?", "output": "Paris", "task": "qa"}
{"input": "Summarize: AI is transforming technology...", "output": "AI revolutionizes tech", "task": "summarization"}
```

#### CSV Format
Comma-separated values for spreadsheet compatibility:

```csv
input,output,task,metadata
"Translate 'Hello' to Spanish","Hola","translation","{""quality"": 0.95}"
"What is the capital of France?","Paris","qa","{""source"": ""general""}"
```

#### Parquet Format
Columnar format for efficient big data processing:

```typescript
// Parquet schema
const schema = {
  input: 'string',
  output: 'string',
  task: 'string',
  metadata: 'string', // JSON string
  timestamp: 'timestamp',
  quality: 'float'
};
```

#### Hugging Face Format
Native format for Hugging Face datasets:

```json
{
  "type": "dataset",
  "format": "json",
  "data": [
    {
      "instruction": "Translate 'Hello' to Spanish",
      "output": "Hola",
      "task": "translation",
      "input_quality": 0.95
    }
  ],
  "metadata": {
    "total_examples": 1000,
    "tasks": ["translation", "qa", "summarization"],
    "created": "2024-01-15T10:00:00Z"
  }
}
```

### Format Conversion

Convert between different dataset formats:

```typescript
import { DatasetFormatter } from '../services/training/datasetFormatter';

const formatter = new DatasetFormatter();

// Convert JSONL to Hugging Face format
const hfDataset = await formatter.convert({
  inputFormat: 'jsonl',
  outputFormat: 'huggingface',
  inputPath: './data/training.jsonl',
  outputPath: './data/training_hf.json',
  options: {
    splitRatio: { train: 0.8, validation: 0.2 },
    shuffle: true
  }
});

// Convert CSV to Parquet
const parquetDataset = await formatter.convert({
  inputFormat: 'csv',
  outputFormat: 'parquet',
  inputPath: './data/training.csv',
  outputPath: './data/training.parquet',
  options: {
    compression: 'snappy',
    rowGroupSize: 50000
  }
});
```

### Data Preprocessing

Apply preprocessing transformations during formatting:

```typescript
const preprocessor = {
  // Clean and normalize text
  cleanText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Filter low-quality examples
  filterQuality(example: any): boolean {
    return example.quality > 0.7 &&
           example.input.length > 10 &&
           example.output.length > 0;
  },

  // Add metadata
  enrichMetadata(example: any): any {
    return {
      ...example,
      metadata: {
        ...example.metadata,
        processed_at: new Date().toISOString(),
        input_length: example.input.length,
        output_length: example.output.length
      }
    };
  }
};

// Apply preprocessing during formatting
const processedDataset = await formatter.convert({
  inputFormat: 'jsonl',
  outputFormat: 'jsonl',
  inputPath: './data/raw.jsonl',
  outputPath: './data/processed.jsonl',
  preprocessing: [
    (examples) => examples.map(preprocessor.cleanText),
    (examples) => examples.filter(preprocessor.filterQuality),
    (examples) => examples.map(preprocessor.enrichMetadata)
  ]
});
```

## Dataset Validation

Validate training datasets for quality, consistency, and training readiness.

### Validation Checks

#### Schema Validation
```typescript
const schemaValidator = {
  validateExample(example: any): ValidationResult {
    const errors: string[] = [];

    if (!example.input || typeof example.input !== 'string') {
      errors.push('Missing or invalid input field');
    }

    if (!example.output && !example.task?.includes('generation')) {
      errors.push('Missing output field for non-generation task');
    }

    if (!example.task || typeof example.task !== 'string') {
      errors.push('Missing or invalid task field');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
};
```

#### Quality Validation
```typescript
const qualityValidator = {
  validateQuality(example: any): QualityResult {
    let score = 1.0;

    // Length checks
    if (example.input.length < 5) score -= 0.3;
    if (example.output && example.output.length < 2) score -= 0.3;

    // Diversity checks
    if (this.hasRepetitiveContent(example.input)) score -= 0.2;

    // Completeness checks
    if (!example.metadata?.quality) score -= 0.1;

    return {
      score: Math.max(0, score),
      issues: this.identifyIssues(example)
    };
  }
};
```

#### Consistency Validation
```typescript
const consistencyValidator = {
  validateConsistency(dataset: any[]): ConsistencyResult {
    const issues: string[] = [];

    // Check for duplicate inputs
    const inputs = new Set();
    const duplicates = new Set();

    dataset.forEach(example => {
      if (inputs.has(example.input)) {
        duplicates.add(example.input);
      }
      inputs.add(example.input);
    });

    if (duplicates.size > 0) {
      issues.push(`${duplicates.size} duplicate inputs found`);
    }

    // Check task distribution
    const taskCounts = {};
    dataset.forEach(example => {
      taskCounts[example.task] = (taskCounts[example.task] || 0) + 1;
    });

    const total = dataset.length;
    Object.entries(taskCounts).forEach(([task, count]) => {
      const percentage = (count / total) * 100;
      if (percentage < 5) {
        issues.push(`Task '${task}' has low representation (${percentage.toFixed(1)}%)`);
      }
    });

    return {
      consistent: issues.length === 0,
      issues
    };
  }
};
```

### Automated Validation

Run comprehensive validation on datasets:

```typescript
import { DatasetValidator } from '../services/training/datasetValidator';

const validator = new DatasetValidator();

// Validate entire dataset
const validationResult = await validator.validate('./data/training.jsonl', {
  checks: ['schema', 'quality', 'consistency', 'balance'],
  thresholds: {
    minQuality: 0.7,
    maxDuplicates: 0.05,
    minTaskBalance: 0.1
  }
});

console.log('Validation Results:');
console.log('Valid:', validationResult.valid);
console.log('Total examples:', validationResult.totalExamples);
console.log('Quality score:', validationResult.qualityScore);
console.log('Issues found:', validationResult.issues.length);

// Generate validation report
await validator.generateReport(validationResult, './reports/validation-report.html');
```

## Dataset Export

Export validated datasets in various formats for training.

### Export Configuration

```typescript
import { DatasetExporter } from '../services/training/datasetExporter';

const exporter = new DatasetExporter({
  formats: ['jsonl', 'csv', 'parquet', 'huggingface'],
  compression: {
    enabled: true,
    algorithm: 'gzip',
    level: 6
  },
  sharding: {
    enabled: true,
    maxShardSize: 100000, // examples per shard
    prefix: 'training_data'
  }
});
```

### Batch Export

Export datasets with sharding and compression:

```typescript
// Export to multiple formats
const exportResults = await exporter.export('./data/training.jsonl', [
  {
    format: 'jsonl',
    destination: './exports/training.jsonl.gz',
    options: { compressed: true }
  },
  {
    format: 'parquet',
    destination: './exports/training.parquet',
    options: { rowGroupSize: 50000 }
  },
  {
    format: 'huggingface',
    destination: './exports/training_hf.json',
    options: {
      splitRatios: { train: 0.8, validation: 0.15, test: 0.05 },
      shuffle: true
    }
  }
]);

console.log('Export completed:');
exportResults.forEach(result => {
  console.log(`${result.format}: ${result.fileCount} files, ${result.totalSize} bytes`);
});
```

### Incremental Export

Export new data incrementally:

```typescript
const incrementalExporter = new DatasetExporter({
  incremental: true,
  checkpointFile: './exports/checkpoint.json'
});

// Export only new data since last export
const newData = await collector.getNewData(lastExportTime);
await incrementalExporter.exportIncremental(newData, './exports/training.jsonl');
```

## Training Pipeline Integration

Integrate dataset management with training pipelines:

```typescript
import { TrainingPipeline } from '../services/training/trainingPipeline';

const trainingPipeline = new TrainingPipeline({
  dataSource: './data/training.jsonl',
  modelConfig: {
    type: 'transformer',
    size: 'small',
    vocabSize: 30000
  },
  training: {
    epochs: 10,
    batchSize: 32,
    learningRate: 1e-4,
    validationSplit: 0.1
  },
  export: {
    format: 'huggingface',
    destination: './models/fine-tuned-model'
  }
});

// Run complete training pipeline
const trainingResult = await trainingPipeline.run();

console.log('Training completed:');
console.log('Final loss:', trainingResult.finalLoss);
console.log('Validation accuracy:', trainingResult.validationAccuracy);
console.log('Model saved to:', trainingResult.modelPath);
```

## Dataset Management

### Dataset Versioning

Manage multiple versions of datasets:

```typescript
import { DatasetManager } from '../services/training/datasetManager';

const datasetManager = new DatasetManager('./datasets');

// Create new dataset version
const version = await datasetManager.createVersion({
  name: 'translation-v2',
  description: 'Improved translation dataset with quality filtering',
  source: './data/training.jsonl',
  preprocessing: ['quality_filter', 'deduplication']
});

// List available versions
const versions = await datasetManager.listVersions();
console.log('Available versions:', versions.map(v => v.name));

// Switch to specific version
await datasetManager.switchVersion('translation-v1');
```

### Dataset Statistics

Generate comprehensive statistics:

```typescript
const statsGenerator = {
  async generateStats(datasetPath: string): Promise<DatasetStats> {
    const dataset = await this.loadDataset(datasetPath);

    return {
      totalExamples: dataset.length,
      averageInputLength: this.calculateAverageLength(dataset.map(d => d.input)),
      averageOutputLength: this.calculateAverageLength(dataset.map(d => d.output || '')),
      taskDistribution: this.calculateTaskDistribution(dataset),
      qualityDistribution: this.calculateQualityDistribution(dataset),
      languagePairs: this.calculateLanguagePairs(dataset),
      duplicates: this.findDuplicates(dataset),
      vocabularySize: this.calculateVocabularySize(dataset)
    };
  }
};

const stats = await statsGenerator.generateStats('./data/training.jsonl');
console.log('Dataset Statistics:');
console.log(`Total examples: ${stats.totalExamples}`);
console.log(`Average input length: ${stats.averageInputLength}`);
console.log(`Task distribution:`, stats.taskDistribution);
```

## Configuration

Configure training data management through MCF configuration:

```json
{
  "training": {
    "dataCollection": {
      "enabled": true,
      "samplingRate": 0.1,
      "maxDailyCollection": 5000,
      "qualityThreshold": 0.8,
      "excludeErrors": true
    },
    "dataFormatting": {
      "defaultFormat": "jsonl",
      "compression": "gzip",
      "sharding": {
        "enabled": true,
        "maxShardSize": 100000
      }
    },
    "dataValidation": {
      "enabled": true,
      "strictMode": false,
      "qualityChecks": ["schema", "duplicates", "balance"],
      "minQualityScore": 0.7
    },
    "dataExport": {
      "formats": ["jsonl", "parquet", "huggingface"],
      "outputDir": "./training-data",
      "autoExport": {
        "enabled": false,
        "schedule": "weekly",
        "minNewExamples": 1000
      }
    }
  }
}
```

## Best Practices

### Data Collection
1. **Quality over Quantity**: Focus on high-quality, diverse examples
2. **Ethical Collection**: Ensure proper consent and privacy protection
3. **Bias Mitigation**: Actively work to reduce bias in collected data
4. **Data Labeling**: Use clear, consistent labeling conventions
5. **Version Control**: Track changes and versions of datasets

### Data Processing
1. **Cleaning**: Remove noise, duplicates, and low-quality data
2. **Normalization**: Standardize formats and encodings
3. **Augmentation**: Generate additional training examples when appropriate
4. **Validation**: Thoroughly validate data before training
5. **Documentation**: Document preprocessing steps and decisions

### Dataset Management
1. **Organization**: Keep datasets well-organized and documented
2. **Backup**: Regularly backup important datasets
3. **Access Control**: Implement appropriate access controls
4. **Monitoring**: Track dataset usage and quality over time
5. **Updates**: Regularly update and refresh training data

### Training Integration
1. **Format Compatibility**: Ensure datasets match model requirements
2. **Splitting**: Properly split data for training, validation, and testing
3. **Scaling**: Handle datasets of varying sizes efficiently
4. **Monitoring**: Track training progress and dataset effectiveness
5. **Iteration**: Use training results to improve data collection

## Use Cases

### Model Fine-tuning
```typescript
// Fine-tune a language model on collected translation data
const fineTuningPipeline = {
  dataset: './exports/translations.jsonl',
  baseModel: 'microsoft/DialoGPT-medium',
  training: {
    learningRate: 5e-5,
    epochs: 3,
    batchSize: 4,
    gradientAccumulationSteps: 8
  },
  output: './models/fine-tuned-translator'
};
```

### Synthetic Data Generation
```typescript
// Generate synthetic training data to augment existing datasets
const syntheticGenerator = {
  async generateSyntheticData(seedData: any[], count: number): Promise<any[]> {
    const synthetic = [];

    for (let i = 0; i < count; i++) {
      const seed = seedData[Math.floor(Math.random() * seedData.length)];

      // Generate variations using MCF
      const variation1 = await translateText(seed.input, 'es');
      const variation2 = await summarizeText(seed.input, 'short');

      synthetic.push({
        input: variation1,
        output: seed.output,
        task: seed.task,
        synthetic: true,
        source: seed.input
      });
    }

    return synthetic;
  }
};
```

### Continuous Learning
```typescript
// Implement continuous learning with ongoing data collection
const continuousLearner = {
  async updateModel() {
    // Collect new data
    const newData = await collector.getRecentData(24 * 60 * 60 * 1000); // Last 24 hours

    if (newData.length >= 100) {
      // Validate and format new data
      const validatedData = await validator.validate(newData);
      const formattedData = await formatter.convert({
        input: validatedData,
        outputFormat: 'jsonl'
      });

      // Incremental training
      await trainer.incrementalTrain(formattedData);

      // Update deployed model
      await modelDeployer.updateModel(trainer.getModel());
    }
  }
};

// Run continuous learning every hour
setInterval(() => continuousLearner.updateModel(), 60 * 60 * 1000);
```

This comprehensive training dataset management system ensures MCF can effectively collect, process, validate, and utilize training data for building and improving AI models.
