import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const aiDir = path.resolve(process.cwd(), 'ai')
const outputFile = path.resolve(process.cwd(), 'src/ai-types.d.ts')

/**
 * Converts an MDX output type definition to a TypeScript type
 * Handles enum types (separated by |) and string types
 */
function convertOutputTypeToTS(type: string): string {
  if (type.includes('|')) {
    // Handle enum types (e.g., "Article | BlogPosting | Thing")
    return type.split('|').map(t => `'${t.trim()}'`).join(' | ')
  }
  return 'string'
}

/**
 * Generates TypeScript type definitions from MDX files
 */
function generateTypes() {
  const mdxFiles = readdirSync(aiDir).filter(file => file.endsWith('.mdx'))
  
  let typeDefinitions = `// Generated TypeScript definitions for AI methods
// DO NOT EDIT DIRECTLY - Generated from MDX files in ai/

declare const ai: {
`

  for (const file of mdxFiles) {
    const methodName = path.basename(file, '.mdx')
    const content = readFileSync(path.join(aiDir, file), 'utf-8')
    const { data: frontmatter } = matter(content)
    
    if (!frontmatter.output?.type) {
      console.warn(`Warning: ${file} is missing output type definition`)
      continue
    }

    const tsType = convertOutputTypeToTS(frontmatter.output.type)
    const description = frontmatter.output.description || 'No description provided'
    
    typeDefinitions += `  /**
   * ${description}
   * @param input The input data for the AI operation
   * @returns A promise that resolves to the generated output
   */
  ${methodName}(input: unknown): Promise<${tsType}>;

`
  }

  typeDefinitions += `}

export { ai }
`

  writeFileSync(outputFile, typeDefinitions)
  console.log(`Generated type definitions at ${outputFile}`)
}

// Run the generator
generateTypes()
