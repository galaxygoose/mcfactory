// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

import * as fs from 'fs';
import * as path from 'path';
import { MCFactoryConfig } from '../../types';

const CONFIG_PATH = 'mcf.config.json';

export class ConfigLoader {
  static load(): MCFactoryConfig {
    try {
      const configPath = path.resolve(CONFIG_PATH);
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);

      return config as MCFactoryConfig;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error}`);
    }
  }
}
