// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

import * as fs from 'fs';
import * as path from 'path';
import { MCFactoryConfig } from '../../../types';

const CONFIG_PATH = 'mcf.config.json';

const DEFAULT_CONFIG: MCFactoryConfig = {
  providers: {},
  defaults: {},
  guardrails: {
    enabled: true
  }
};

export function initCommand(): void {
  try {
    // Check if config already exists
    if (fs.existsSync(CONFIG_PATH)) {
      console.log(`✓ MCFactory configuration already exists at ${CONFIG_PATH}`);
      console.log('Use "mcfactory validate-config" to check your configuration.');
      return;
    }

    // Create default config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
    console.log(`✓ Created default MCFactory configuration at ${CONFIG_PATH}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Edit mcf.config.json to add your API keys');
    console.log('2. Run "mcfactory validate-config" to verify your setup');
    console.log('3. Run "mcfactory diagnose" to check system health');
  } catch (error) {
    console.error('✗ Failed to initialize MCFactory configuration:', error);
    process.exit(1);
  }
}
