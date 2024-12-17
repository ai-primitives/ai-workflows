import { promises as fs } from 'fs'
import { parse as parseMDXLD } from 'mdxld'
import { z } from 'zod'

interface MDXFrontmatter {
  input?: Record<string, any>
  output?: Record<string, any>
  [key: string]: any
}

function createSchemaFromTemplate(template: Record<string, any>): z.ZodType {
  if (template.type === 'object') {
    const shape: Record<string, z.ZodType> = {}
    for (const [key, prop] of Object.entries(template.properties || {})) {
      shape[key] = createSchemaFromTemplate(prop)
    }
    return z.object(shape)
  }

  if (template.type === 'array') {
    return z.array(createSchemaFromTemplate(template.items))
  }

  switch (template.type) {
    case 'string':
      return z.string()
    case 'number':
      return z.number()
    case 'boolean':
      return z.boolean()
    default:
      return z.any()
  }
}

export async function loadMDXFunction(filePath: string) {
  const content = await fs.readFile(filePath, 'utf8')
  const { frontmatter } = parseMDX(content)

  const inputSchema = createSchemaFromTemplate(frontmatter.input || {})
  const outputSchema = createSchemaFromTemplate(frontmatter.output || {})

  return {
    input: inputSchema,
    output: outputSchema,
    name: frontmatter.name || 'unnamed'
  }
}

export function parseMDX(content: string) {
  const result = parseMDXLD(content)
  const frontmatter = result.data as MDXFrontmatter

  return {
    frontmatter,
    content: result.content
  }
}
