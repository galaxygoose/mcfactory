<img src="https://github.com/user-attachments/assets/9db1c349-a252-40ae-b88e-6d725c94d93c" width="120" />

# **MCFactory**

**An SDK for the Model Context Protocol (MCP)** – A unified framework for building AI applications with multi-provider routing, workflows, guardrails, and training pipelines.

<img width="934" height="227" alt="image" src="https://github.com/user-attachments/assets/d005cd6b-3328-415d-93e0-d33a425cbb14" />

## **What does MCFactory manufacture?**

MCFactory creates and orchestrates **Model Context instances** – programmable AI environments that connect multiple providers, apply safety guardrails, and execute complex workflows.

```typescript
import { createMC } from 'mcfactory';

// One-liner to spin up a Model Context
const ctx = createMC({
  providers: ['openai', 'anthropic'],
  guardrails: ['content-filter', 'jailbreak-detection'],
  workflow: 'translation-pipeline'
});
```

---

## **Alpha Release Notice**

This is an early Alpha release. The API may change during Alpha.
MCFactory is free for projects earning **less than 10,000 USD per month**.
Repackaging or resale of MCFactory is not permitted.

---

## **Installation**

```bash
npm install mcfactory
```

---

## **Usage**

MCFactory includes both a **CLI tool** for development workflows and an **SDK** for programmatic integration.

---

### **SDK – Programmatic Usage**

```typescript
import { createMC, providers } from 'mcfactory';

// Create a Model Context with multiple AI providers
const context = createMC({
  providers: [
    providers.openai({ apiKey: 'your-key' }),
    providers.anthropic({ apiKey: 'your-key' })
  ],
  guardrails: ['content-moderation', 'jailbreak-prevention']
});

// Execute AI tasks through the unified interface
const result = await context.translate({
  text: "Hello world",
  targetLanguage: "es",
  provider: "anthropic" // or let MCFactory auto-route
});
```

---

### **CLI – Development Tool**

```bash
# Install globally for CLI usage
npm install -g mcfactory

# Get help
mcfactory --help

# Run a training pipeline
mcfactory run-pipeline --config my-config.json
```

---

## **Features**

* Translation services
* AI detection
* Content moderation
* Agent orchestration
* Media processing
* Training data management
* Guardrails and safety
* Workflow automation
* MCP (Model Context Protocol) integration

---

## **Documentation**

* [Introduction](./docs/introduction.md) – Overview and getting started
* [Installation](./docs/installation.md) – Setup and configuration
* [Architecture](./docs/architecture.md) – System design and principles
* [SDK](./docs/sdk.md) – Client library usage
* [CLI](./docs/cli.md) – Command-line interface
* [Services](./docs/services.md) – Available AI services
* [Agents](./docs/agents.md) – Intelligent text processing agents
* [Providers](./docs/providers.md) – AI model providers
* [Factories](./docs/factories.md) – Service factory pattern
* [Guardrails](./docs/guardrails.md) – Safety and validation
* [Workflows](./docs/workflows.md) – Pipeline automation
* [Configuration](./docs/configuration.md) – System configuration
* [Training Datasets](./docs/training-datasets.md) – Data preparation
* [Translation](./docs/translation.md) – Language services
* [Detection](./docs/detection.md) – AI content detection
* [Moderation](./docs/moderation.md) – Content safety
* [Error Handling](./docs/error-handling.md) – Error management
* [MCP Tools](./docs/mcp-tools.md) – Model Context Protocol
* [Integration](./docs/integration.md) – Third-party integration
* [Project Structure](./docs/project-structure.md) – Code organization

---

## **License**

This project uses the **MCFactory ALPHA License**. See `LICENSE` for details.
l me and I’ll generate the upgraded README.


