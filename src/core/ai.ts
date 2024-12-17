import { OpenAIProvider, createOpenAI } from '@ai-sdk/openai'
import { LanguageModelV1, LanguageModelV1CallOptions } from '@ai-sdk/provider'
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
  ai: LanguageModelV1
  openai: OpenAIProvider
  list: string[]
} {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const aiProxy = new Proxy({} as any, {
    get(target: any, prop: string | symbol) {
      if (typeof prop !== 'string') return undefined

      return async (...args: any[]) => {
        try {
          const model = openai.chat('gpt-4')
          const result = await model.doGenerate({
            inputFormat: 'messages',
            mode: {
              type: 'regular'
            },
            prompt: [{
              role: 'user',
              content: [{
                type: 'text',
                text: `Execute function ${String(prop)} with arguments: ${JSON.stringify(args)}`
              }]
            }]
          })

          return result.text
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            await createMDXFile(String(prop))
          }
          throw error
        }
      }
    },

    apply(target: any, thisArg: any, args: any[]) {
      return undefined
    }
  })

  return {
    ai: aiProxy,
    openai,
    list: ['summarize', 'sentiment', 'reviewKPIs']
  }
}
