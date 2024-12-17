import { createAIFunction } from 'ai-functions'
import { promises as fs } from 'fs'
import matter from 'gray-matter'
import { z } from 'zod'

/**
 * Creates a Zod schema from a JSON Schema template
 */
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

/**
 * Loads an MDX file and creates an AI function from its frontmatter
 */
export async function loadMDXFunction(filePath: string) {
  const content = await fs.readFile(filePath, 'utf8')
  const { data: frontmatter } = matter(content)

  const inputSchema = createSchemaFromTemplate(frontmatter.input)
  const outputSchema = createSchemaFromTemplate(frontmatter.output)

  return createAIFunction(outputSchema)
}
