import OpenAI from 'openai'
import { promises as fs } from 'fs'
import path from 'path'

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
  gpt: OpenAI
  list: string[]
} {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const aiProxy = new Proxy(openai, {
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

        // Use chat completion API
        const completion = await target.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: args[0] }]
        })

        return completion.choices[0].message.content
      }
    },

    apply(target: any, thisArg: any, args: any[]) {
      return target.apply(thisArg, args)
    }
  })

  return {
    ai: aiProxy,
    gpt: openai,
    list: ['summarize', 'sentiment', 'reviewKPIs']
  }
}

export const { ai, gpt, list } = createAIProxy()
