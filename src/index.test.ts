import { describe, it, expect, beforeAll } from 'vitest';
import { add, ai } from './index.js';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

describe('add', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(-1, 1)).toBe(0)
    expect(add(0, 0)).toBe(0)
  })
})

describe('ai', () => {
  beforeAll(async () => {
    // Create ai directory and test MDX file
    await mkdir(path.resolve(process.cwd(), 'ai'), { recursive: true })
    await writeFile(
      path.resolve(process.cwd(), 'ai/test.mdx'),
      `---
model: gpt-3.5-turbo
system: Test system prompt
output:
  type: Article | BlogPosting
  description: Test description
---

# Test MDX

Test content`
    )
  })

  it('should handle AI method calls correctly', async () => {
    const result = await (ai as { test: (input: { input: string }) => Promise<{ type: string; description: string }> }).test({ input: 'test' })
    expect(result).toEqual({
      type: 'Article',
      description: 'Test description'
    })
  })
})
