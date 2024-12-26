// Generated TypeScript definitions for AI methods
// DO NOT EDIT DIRECTLY - Generated from MDX files in ai/

declare const ai: {
  /**
   * The thinking and rationale behind the reason
   * @param input The input data for the AI operation
   * @returns A promise that resolves to the generated output
   */
  summarize(input: unknown): Promise<'Article' | 'BlogPosting' | 'Thing'>;

  /**
   * Test description
   * @param input The input data for the AI operation
   * @returns A promise that resolves to the generated output
   */
  test(input: unknown): Promise<'Article' | 'BlogPosting'>;

}

export { ai }
