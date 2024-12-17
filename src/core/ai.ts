import { createAI } from 'ai'
import { promises as fs } from 'fs'
import path from 'path'
import type { OpenAI } from 'openai'

async function createMDXFile(name: string, options: any = {}): Promise<void> {
  const mdx = `---
$type: https://mdx.org.ai/AIFunction
$context: https://schema.org
name: ${name}
description: AI function that handles ${name} operation
input: ${JSON.stringify(options.input || {
    type: 'object',
    properties: {}
  })}
output: ${JSON.stringify(options.output || {
    type: 'object',
    properties: {}
  })}
---

# ${name}

This function is auto-generated by the AI Workflow system.

## Input Schema
\`\`\`typescript
interface Input {
  // TODO: Define input properties
}
\`\`\`

## Output Schema
\`\`\`typescript
interface Output {
  // TODO: Define output properties
}
\`\`\`

## Example Usage
\`\`\`typescript
const result = await ai.${name}({ /* input */ })
\`\`\`
`
  await fs.mkdir(path.dirname(options.mdxPath || path.join(process.cwd(), 'functions', `${name}.mdx`)), { recursive: true })
  await fs.writeFile(options.mdxPath || path.join(process.cwd(), 'functions', `${name}.mdx`), mdx)
}

export function createAIProxy(): {
  ai: OpenAI
  gpt: ReturnType<typeof createAI>['gpt']
  list: ReturnType<typeof createAI>['list']
} {
  const { ai: baseAi, gpt, list } = createAI()

  const aiProxy = new Proxy(baseAi, {
    get(target: any, prop: PropertyKey) {
      if (typeof prop === 'symbol' || prop === 'then' || prop in target) {
        return target[prop]
      }

      return async function(...args: any[]) {
        const mdxPath = path.join(process.cwd(), 'functions', `${String(prop)}.mdx`)

        try {
          await fs.access(mdxPath)
        } catch {
          await createMDXFile(String(prop), { mdxPath })
        }

        return target[prop](...args)
      }
    },

    apply(target: any, thisArg: any, args: any[]) {
      return target.apply(thisArg, args)
    }
  })

  return {
    ai: aiProxy,
    gpt,
    list
  }
}

export const { ai, gpt, list } = createAIProxy()
