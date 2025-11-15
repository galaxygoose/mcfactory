// MIC goes here. Maintainer will paste the contract.
/**
 * MCFactory — Model Context Factory
 * MASTER INTERFACE CONTRACT (MIC)
 *
 * This file defines every shared type, interface, enum, and contract
 * that ALL modules, factories, providers, pipelines, CLI commands,
 * SDK functions, and MCP tools must follow.
 *
 * THIS IS THE SINGLE SOURCE OF TRUTH.
 * No other file may redefine or override these interfaces.
 */

// =========================================
// ENV + CONFIG
// =========================================

export interface MCFactoryEnvironment {
    OPENAI_API_KEY?: string;
    ANTHROPIC_API_KEY?: string;
    GEMINI_API_KEY?: string;
    COHERE_API_KEY?: string;
    ELEVENLABS_API_KEY?: string;
    LOCAL_MODEL_PATH?: string;
    [key: string]: string | undefined;
  }
  
  export interface MCFactoryConfig {
    providers: ProviderConfigMap;
    defaults: DefaultModuleConfig;
    pipelines?: Record<string, PipelineDefinition>;
    training?: TrainingExportConfig;
    guardrails?: GuardrailConfig;
  }
  
  export interface ProviderConfigMap {
    openai?: ProviderCredentials;
    anthropic?: ProviderCredentials;
    gemini?: ProviderCredentials;
    cohere?: ProviderCredentials;
    elevenlabs?: ProviderCredentials;
    local?: LocalLLMConfig;
  }
  
  export interface ProviderCredentials {
    apiKey: string;
    model?: string;
    options?: Record<string, any>;
  }
  
  export interface LocalLLMConfig {
    modelPath: string;
    tokenizerPath?: string;
  }
  
  // Default configs for factories
  export interface DefaultModuleConfig {
    translation?: TranslationDefaults;
    detection?: DetectionDefaults;
    moderation?: ModerationDefaults;
    agents?: AgentDefaults;
    media?: MediaDefaults;
    training?: TrainingDefaults;
  }
  
  export interface TranslationDefaults {
    targetLang?: string;
    preserveFormat?: boolean;
  }
  
  export interface DetectionDefaults {
    aiThreshold?: number;
    fakeVoiceThreshold?: number;
  }
  
  export interface ModerationDefaults {
    allowedCategories?: string[];
  }
  
  export interface AgentDefaults {
    summaryLength?: "short" | "medium" | "long";
  }
  
  export interface MediaDefaults {
    maxDurationMs?: number;
  }
  
  export interface TrainingDefaults {
    format?: "jsonl" | "csv" | "parquet" | "hf";
    shardSize?: number;
    schedule?: "manual" | "daily" | "weekly" | "monthly";
  }
  
  
  // =========================================
  // PROVIDER CONTRACT
  // =========================================
  
  export interface ProviderRequest {
    model: string;
    input: unknown;
    options?: Record<string, any>;
  }
  
  export interface ProviderResponse {
    output: unknown;
    tokens?: number;
    model?: string;
    provider?: string;
  }
  
  export interface Provider {
    name: string;
    callModel(req: ProviderRequest): Promise<ProviderResponse>;
  }
  
  // Embeddings provider
  export interface EmbeddingRequest {
    text: string;
    model?: string;
  }
  
  export interface EmbeddingResponse {
    embedding: number[];
    dimensions: number;
  }
  
  // =========================================
  // FACTORY CONTRACTS (GLOBAL)
  // =========================================
  
  export interface Factory<TInput, TOutput> {
    run(input: TInput, options?: FactoryOptions): Promise<TOutput>;
  }
  
  export interface FactoryOptions {
    provider?: string; // "openai", "anthropic", etc.
    debug?: boolean;
    metadata?: Record<string, any>;
  }
  
  
  // =========================================
  // TRANSLATION
  // =========================================
  
  export interface TranslationInput {
    text: string;
    sourceLang?: string;
    targetLang: string;
    preserveFormat?: boolean;
  }
  
  export interface TranslationOutput {
    translated: string;
    sourceLang?: string;
    targetLang: string;
    provider: string;
    tokens?: number;
  }
  
  
  // =========================================
  // DETECTION
  // =========================================
  
  export interface AIDetectionInput {
    text: string;
  }
  
  export interface AIDetectionOutput {
    isAI: boolean;
    confidence: number;
    features?: {
      entropy?: number;
      perplexity?: number;
      stylometry?: Record<string, number>;
    };
  }
  
  export interface FakeVoiceDetectionInput {
    audioBuffer: ArrayBuffer;
  }
  
  export interface FakeVoiceDetectionOutput {
    isFake: boolean;
    confidence: number;
    details?: Record<string, any>;
  }
  
  
  // =========================================
  // MODERATION
  // =========================================
  
  export interface ModerationInput {
    text: string;
  }
  
  export interface ModerationResult {
    safe: boolean;
    categories: string[];
    confidence: number;
    flagged: boolean;
  }
  
  
  // =========================================
  // AGENTS
  // =========================================
  
  export interface SummarizationInput {
    text: string;
    length?: "short" | "medium" | "long";
  }
  
  export interface SummarizationOutput {
    summary: string;
    length: string;
  }
  
  export interface SentimentInput {
    text: string;
    type?: 'sentiment';
  }

  export interface SentimentOutput {
    label: "positive" | "neutral" | "negative";
    score: number;
  }

  export interface CategorizationInput {
    text: string;
    tags?: string[]; // Optional hint tags for categorization
    type?: 'categorization';
  }
  
  export interface CategorizationOutput {
    tags: string[];
    category?: string;
  }
  
  
  // =========================================
  // MEDIA (STT, TTS, OCR)
  // =========================================
  
  export interface STTInput {
    audioBuffer: ArrayBuffer;
    language?: string;
  }
  
  export interface STTOutput {
    text: string;
    language?: string;
  }
  
  export interface TTSInput {
    text: string;
    voice?: string;
  }
  
  export interface TTSOutput {
    audioBuffer: ArrayBuffer;
  }
  
  export interface OCRInput {
    imageBuffer: ArrayBuffer;
    type?: 'ocr';
  }

  export interface OCROutput {
    text: string;
    blocks?: Array<{ bbox: number[]; text: string }>;
  }

  export interface ImageCaptionInput {
    imageBuffer: ArrayBuffer;
    type?: 'caption';
  }

  export interface ImageCaptionOutput {
    caption: string;
    confidence?: number;
  }
  
  
  // =========================================
  // WORKFLOWS & PIPELINES
  // =========================================
  
  export interface PipelineStep {
    type: string;            // "translate", "detectAI", etc.
    options?: Record<string, any>;
  }
  
  export interface PipelineDefinition {
    name: string;
    steps: PipelineStep[];
  }
  
  export interface PipelineResult<T = any> {
    success: boolean;
    data: T;
    logs: string[];
  }
  
  
  // =========================================
  // TRAINING DATASETS
  // =========================================
  
  export interface TrainingExportConfig {
    format: "jsonl" | "csv" | "parquet" | "hf";
    shardSize?: number;
    schedule?: "manual" | "daily" | "weekly" | "monthly";
    outputDir?: string;
  }
  
  export interface TrainingExample {
    input: string;
    output?: string;
    task: string;
    metadata?: Record<string, any>;
  }
  
  export interface DatasetBundle {
    manifest: Record<string, any>;
    files: string[];
  }
  
  
  // =========================================
  // GUARDRAILS
  // =========================================
  
  export interface GuardrailConfig {
    enabled: boolean;
    bannedTopics?: string[];
    hallucinationThreshold?: number;
  }
  
  export interface GuardrailResult {
    safe: boolean;
    reasons?: string[];
  }
  
  
  // =========================================
  // GLOBAL ENUMS
  // =========================================
  
  export enum ProviderName {
    OPENAI = "openai",
    ANTHROPIC = "anthropic",
    GEMINI = "gemini",
    COHERE = "cohere",
    LOCAL = "local",
    ELEVENLABS = "elevenlabs"
  }
  
  export enum TrainingFormat {
    JSONL = "jsonl",
    CSV = "csv",
    PARQUET = "parquet",
    HF = "hf"
  }
  
  export enum SummaryLength {
    SHORT = "short",
    MEDIUM = "medium",
    LONG = "long"
  }