import { expect, jest } from "@jest/globals";
import matchers from "@testing-library/jest-dom/matchers";
import type { ChatCompletion } from 'openai/resources/chat/completions';

expect.extend(matchers as any);

// Mock OpenAI for tests
const mockChatCompletion: ChatCompletion = {
  id: 'test-id',
  object: 'chat.completion',
  created: Date.now(),
  model: 'gpt-3.5-turbo',
  choices: [{
    index: 0,
    message: {
      role: 'assistant',
      content: JSON.stringify({
        type: 'Article',
        description: 'Test description'
      }),
      function_call: undefined,
      tool_calls: undefined,
      refusal: null
    },
    finish_reason: 'stop',
    logprobs: null
  }],
  usage: {
    prompt_tokens: 0,
    completion_tokens: 0,
    total_tokens: 0
  },
  system_fingerprint: undefined
};

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn(() => ({
      chat: {
        completions: {
          create: jest.fn(() => Promise.resolve(mockChatCompletion))
        }
      }
    }))
  };
});

// Set required environment variables for tests
process.env.OPENAI_API_KEY = 'test-key'
