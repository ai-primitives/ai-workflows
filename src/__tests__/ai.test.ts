import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ai } from '../core/ai'
import { promises as fs } from 'fs'
import path from 'path'

describe('AI Proxy', () => {
  const functionsDir = path.join(process.cwd(), 'functions')
  const testFunction = 'testFunction'
  const testMdxPath = path.join(functionsDir, `${testFunction}.mdx`)

  beforeEach(async () => {
    await fs.mkdir(functionsDir, { recursive: true })
  })

  afterEach(async () => {
    try {
      await fs.rm(testMdxPath)
      await fs.rmdir(functionsDir)
    } catch {}
  })

  it('creates MDX file for undefined function', async () => {
    await (ai as any)[testFunction]({ test: true })

    const exists = await fs.access(testMdxPath)
      .then(() => true)
      .catch(() => false)
    expect(exists).toBe(true)

    const content = await fs.readFile(testMdxPath, 'utf8')
    expect(content).toContain(`name: ${testFunction}`)
    expect(content).toContain('interface Input')
    expect(content).toContain('interface Output')
  })

  it('supports template literal pattern', async () => {
    const result = await ai`What is 2+2?`
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('supports options pattern', async () => {
    const result = await ai`What is 2+2?`({ model: 'gpt-4' })
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('supports async iterator pattern', async () => {
    const chunks: string[] = []
    for await (const chunk of ai`What is 2+2?`) {
      chunks.push(chunk)
    }
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.every(chunk => typeof chunk === 'string')).toBe(true)
  })
})
