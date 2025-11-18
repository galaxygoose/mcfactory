// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

// Initialize providers
import { PROVIDER_INIT } from './providers';

export { MCFACTORY } from './sdk/client';
export * from './types';

// Ensure providers are initialized
if (!PROVIDER_INIT) {
  throw new Error('Providers not initialized');
}