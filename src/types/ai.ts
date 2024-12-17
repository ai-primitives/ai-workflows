import { z } from 'zod'

export interface AIFunction {
  (input: any): Promise<any>
  schema: {
    input: z.ZodType<any, z.ZodTypeDef, any>
    output: z.ZodType<any, z.ZodTypeDef, any>
  }
  name: string
}
