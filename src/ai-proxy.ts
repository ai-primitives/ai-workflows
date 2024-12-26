import { readFileSync, existsSync } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'
import OpenAI from 'openai'

const aiBasePath = path.resolve(process.cwd(), 'ai')
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Schema for required MDX frontmatter
const frontmatterSchema = z.object({
  model: z.string(),
  system: z.string(),
  output: z.object({
    type: z.string(),
    description: z.string()
  })
})

/**
 * Creates a Zod schema from an output definition in MDX frontmatter
 * Handles enum types (separated by |) and string types with descriptions
 * @param outputDef - The output definition from MDX frontmatter
 * @returns A Zod schema for validating the output
 */
function createZodSchemaFromOutput(outputDef: Record<string, string>) {
  const { type, description } = outputDef
  
  if (type.includes('|')) {
    // Handle enum types (e.g., "Article | BlogPosting | Thing")
    const enumValues = type.split('|').map(t => t.trim())
    return z.enum(enumValues as [string, ...string[]]).describe(description)
  }
  
  // Default to string type with description
  return z.string().describe(description)
}

/**
 * Type for the AI method handler function
 * @param input - The input data for the AI method
 * @returns A promise that resolves to the validated output
 */
type AIMethodHandler = (input: unknown) => Promise<unknown>

/**
 * The ai object is a Proxy that dynamically loads MDX files for each method call
 * Example: ai.summarize(ticket) will load ai/summarize.mdx and use its configuration
 */
export const ai = new Proxy({}, {
  get(_target: object, methodName: string): AIMethodHandler {
    return async (input: unknown) => {
      try {
        // Check if MDX file exists
        const mdxFile = path.join(aiBasePath, `${methodName}.mdx`)
        if (!existsSync(mdxFile)) {
          throw new Error(`No MDX file found for ai.${methodName}(). Create ${methodName}.mdx in the ai/ directory.`)
        }

        // Load and parse the MDX file
        const fileContent = readFileSync(mdxFile, 'utf-8')
        const { data: rawFrontmatter, content } = matter(fileContent)
        
        // Validate frontmatter against schema
        const frontmatter = frontmatterSchema.parse(rawFrontmatter)
        
        // Create Zod schema from output definition
        const outputSchema = createZodSchemaFromOutput(frontmatter.output)
        
        // Generate response using OpenAI
        const completion = await openai.chat.completions.create({
          model: frontmatter.model,
          messages: [
            { role: 'system', content: frontmatter.system },
            { role: 'user', content: `${content}\n\nInput: ${JSON.stringify(input, null, 2)}` }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7, // Add some creativity while maintaining structure
        })

        // Parse and validate the response
        let result: unknown
        try {
          result = JSON.parse(completion.choices[0].message.content || '{}')
        } catch (error) {
          // Narrow error type for proper handling
          const parseError = error as Error
          throw new Error(`Failed to parse OpenAI response as JSON: ${parseError.message}`)
        }
        
        // Validate against our schema and return
        return outputSchema.parse(result)
      } catch (error) {
        // Enhance error messages for different types of failures
        if (error instanceof z.ZodError) {
          throw new Error(`Schema validation failed in ai.${methodName}(): ${error.errors.map(e => e.message).join(', ')}`)
        } else if (error instanceof Error) {
          throw new Error(`Error in ai.${methodName}(): ${error.message}`)
        }
        throw error
      }
    }
  }
})
