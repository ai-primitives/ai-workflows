import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadMDXFunction } from '../core/mdx'
import { promises as fs } from 'fs'
import path from 'path'
import type { AIFunction } from '../types/ai'

describe('MDX Loader', () => {
  const functionsDir = path.join(process.cwd(), 'functions')
  const testFunction = 'testFunction'
  const testMdxPath = path.join(functionsDir, `${testFunction}.mdx`)

  beforeEach(async () => {
    await fs.mkdir(functionsDir, { recursive: true })
    const mdx = `---
name: ${testFunction}
description: Test function
input:
  type: object
  properties:
    text:
      type: string
    count:
      type: number
output:
  type: object
  properties:
    result:
      type: string
    score:
      type: number
---

# Test Function
`
    await fs.writeFile(testMdxPath, mdx)
  })

  afterEach(async () => {
    try {
      await fs.rm(testMdxPath)
      await fs.rmdir(functionsDir)
    } catch {}
  })

  it('loads MDX file and creates AI function', async () => {
    const fn: AIFunction = await loadMDXFunction(testMdxPath)
    expect(fn).toBeDefined()
    expect(typeof fn).toBe('function')
    expect(fn.schema).toBeDefined()
  })
})
