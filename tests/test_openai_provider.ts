#!/usr/bin/env ts-node

/**
 * Simple test to verify OpenAI API integration works with real API key
 */

import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize providers
import './src/index';

import { ProviderRegistry } from './src/core/providers/providerRegistry';

async function testOpenAIProvider() {
  console.log('🧪 Testing OpenAI Provider with Real API Key\n');

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('❌ OPENAI_API_KEY not found in .env file');
      return;
    }

    console.log('🔑 OpenAI API key found');

    // Get the OpenAI provider
    const provider = ProviderRegistry.get('openai');
    if (!provider) {
      console.log('❌ OpenAI provider not found in registry');
      return;
    }

    console.log('✅ OpenAI provider found in registry');

    // Test a simple chat completion
    const request = {
      model: 'gpt-3.5-turbo',
      input: [
        { role: 'user', content: 'Hello! Please respond with just "Hello from OpenAI!"' }
      ],
      options: {
        temperature: 0.1,
        max_tokens: 50
      }
    };

    console.log('📤 Making API call to OpenAI...');
    const response = await provider.callModel(request);

    console.log('📥 Response received:');
    console.log(`   - Model: ${response.model}`);
    console.log(`   - Tokens: ${response.tokens}`);
    console.log(`   - Provider: ${response.provider}`);
    console.log(`   - Content: ${response.output}`);

    if (response.output && typeof response.output === 'string' && response.output.includes('Hello from OpenAI')) {
      console.log('🎉 SUCCESS: OpenAI API integration works with your real API key!');
    } else {
      console.log('⚠️  API call succeeded but response format unexpected');
      console.log('   (This might be expected if the AI responded differently)');
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.log('❌ OpenAI API test failed:', errorMessage);
  }
}

testOpenAIProvider().catch(console.error);
