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

  it('uses chat completions API', async () => {
    const result = await (ai as any).chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "What is 2+2?" }]
    })
    expect(result.choices[0].message.content).toBeDefined()
  })

  it('supports function calls', async () => {
    const result = await (ai as any).summarize("Test content")
    expect(typeof result).toBe('string')
  })

  it('generates MDX files for new functions', async () => {
    const functionName = 'newTestFunction'
    const mdxPath = path.join(functionsDir, `${functionName}.mdx`)

    await (ai as any)[functionName]("Test input")

    const exists = await fs.access(mdxPath)
      .then(() => true)
      .catch(() => false)
    expect(exists).toBe(true)

    const content = await fs.readFile(mdxPath, 'utf8')
    expect(content).toContain(`name: ${functionName}`)
  })
})
