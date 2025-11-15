// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { diagnoseCommand } from './commands/diagnose';
import { validateConfigCommand } from './commands/validateConfig';
import { runPipelineCommand } from './commands/runPipeline';
import { generateManifestCommand } from './commands/generateManifest';

const program = new Command();

program
  .name('mcfactory')
  .description('MCFactory CLI')
  .version('1.0.0');

// Register commands
program
  .command('init')
  .description('Initialize MCFactory configuration')
  .action(initCommand);

program
  .command('diagnose')
  .description('Run system diagnostics')
  .action(diagnoseCommand);

program
  .command('validate-config')
  .description('Validate MCFactory configuration')
  .action(validateConfigCommand);

program
  .command('run-pipeline <name>')
  .description('Run a named pipeline')
  .action(runPipelineCommand);

program
  .command('generate-manifest')
  .description('Generate MCP manifest')
  .action(generateManifestCommand);

program.parse();
