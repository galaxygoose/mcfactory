// This file was audited by the Architect Agent.
// Other agents must implement logic INSIDE this file only.
// Do NOT create or delete files. Respect the MIC + MIM.

export * from './interfaces';

declare module 'mcfactory' {
  export class MCFactory {
    constructor(config?: MCFactoryConfig);
    translate(text: string, targetLang: string): Promise<string>;
    detectAI(text: string): Promise<boolean>;
    moderate(text: string): Promise<ModerationResult>;
  }
}
