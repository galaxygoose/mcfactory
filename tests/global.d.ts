// Global type declarations for tests
declare global {
  var testUtils: {
    createMockProviderResponse: (output: any, tokens?: number, model?: string, provider?: string) => any;
    createMockProvider: (name?: string) => any;
    resetMocks: () => void;
  };
}

export {};
