// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

import * as fs from 'fs';
import { MCFACTORYConfig, ProviderName } from '../../../types';
import { ConfigLoader } from '../../config/configLoader';
import { CONFIG_SCHEMA } from '../../config/configSchema';

const CONFIG_PATH = 'mcf.config.json';

interface ValidationError {
  path: string;
  message: string;
}

export function validateConfigCommand(): void {
  try {
    // Check if config exists
    if (!fs.existsSync(CONFIG_PATH)) {
      console.error(`✗ Configuration file not found: ${CONFIG_PATH}`);
      console.log('Run "mcfactory init" to create a default configuration.');
      process.exit(1);
    }

    // Load config
    const config = ConfigLoader.load() as MCFACTORYConfig;
    const errors: ValidationError[] = [];

    // Validate structure
    if (!config || typeof config !== 'object') {
      errors.push({ path: 'root', message: 'Configuration must be a valid object' });
    } else {
      // Validate providers
      if (config.providers === null || config.providers === undefined || typeof config.providers !== 'object') {
        errors.push({ path: 'providers', message: 'Providers section must be an object' });
      } else {
        // Validate each provider
        const validProviders = Object.values(ProviderName);
        for (const [providerName, providerConfig] of Object.entries(config.providers)) {
          if (!validProviders.includes(providerName as ProviderName)) {
            errors.push({
              path: `providers.${providerName}`,
              message: `Unknown provider: ${providerName}. Valid providers: ${validProviders.join(', ')}`
            });
          } else if (providerName !== 'local' && !providerConfig.apiKey) {
            errors.push({
              path: `providers.${providerName}.apiKey`,
              message: `API key required for provider: ${providerName}`
            });
          } else if (providerName === 'local' && !providerConfig.modelPath) {
            errors.push({
              path: `providers.${providerName}.modelPath`,
              message: 'modelPath required for local provider'
            });
          }
        }
      }

      // Validate defaults (optional, but if present should be valid)
      if (config.defaults && typeof config.defaults !== 'object') {
        errors.push({ path: 'defaults', message: 'Defaults section must be an object' });
      }

      // Validate guardrails
      if (config.guardrails) {
        if (typeof config.guardrails !== 'object') {
          errors.push({ path: 'guardrails', message: 'Guardrails section must be an object' });
        } else if (typeof config.guardrails.enabled !== 'boolean') {
          errors.push({ path: 'guardrails.enabled', message: 'Guardrails enabled must be a boolean' });
        }
      }

      // Validate pipelines (optional)
      if (config.pipelines) {
        if (typeof config.pipelines !== 'object') {
          errors.push({ path: 'pipelines', message: 'Pipelines section must be an object' });
        } else {
          for (const [pipelineName, pipeline] of Object.entries(config.pipelines)) {
            if (!pipeline.name || !pipeline.steps || !Array.isArray(pipeline.steps)) {
              errors.push({
                path: `pipelines.${pipelineName}`,
                message: 'Pipeline must have name and steps array'
              });
            }
          }
        }
      }
    }

    // Report results
    if (errors.length === 0) {
      console.log('✓ Configuration is valid');
      console.log(`Found ${Object.keys(config.providers || {}).length} provider(s) configured`);
      if (config.pipelines) {
        console.log(`Found ${Object.keys(config.pipelines).length} pipeline(s) defined`);
      }
    } else {
      console.error('✗ Configuration validation failed:');
      errors.forEach(error => {
        console.error(`  • ${error.path}: ${error.message}`);
      });
      process.exit(1);
    }

  } catch (error) {
    console.error('✗ Failed to validate configuration:', error);
    process.exit(1);
  }
}
