import { z } from 'zod'

/**
 * Represents a handler function that can be registered for workflow events
 */
type WorkflowHandler = (data: any) => Promise<any> | any

/**
 * Workflow class for managing event-driven AI workflows with durable execution
 */
export class Workflow {
  private handlers: Map<string, WorkflowHandler[]> = new Map()

  /**
   * Register a handler function for a specific event
   * @param event The event name to listen for
   * @param handler The function to execute when the event occurs
   */
  on(event: string, handler: WorkflowHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, [])
    }
    this.handlers.get(event)!.push(handler)
  }

  /**
   * Send an event with data to all registered handlers
   * @param event The event name to trigger
   * @param data The data to pass to the handlers
   * @returns Promise that resolves when all handlers complete
   */
  async send(event: string, data: any): Promise<any[]> {
    const handlers = this.handlers.get(event) || []
    return Promise.all(handlers.map(h => h(data)))
  }

  /**
   * Schedule a handler to run on a recurring basis
   * @param schedule Natural language time expression (e.g., "30 minutes during business hours")
   * @param handler The function to execute on schedule
   */
  every(schedule: string, handler: WorkflowHandler): void {
    // TODO: Implement scheduling logic
    // This will be implemented in a future PR
  }
}
