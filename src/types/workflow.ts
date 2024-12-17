import type { z } from 'zod'

export interface Workflow {
  on: (event: string, handler: (data: any) => void | Promise<void>) => void
  send: (event: string, data: any) => void | Promise<void>
  every: (schedule: string, handler: (context: any) => void | Promise<void>) => void
}

export type WorkflowMode = 'design' | 'schedule' | 'status' | 'execution' | 'instance'
