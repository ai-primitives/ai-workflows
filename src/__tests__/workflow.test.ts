import { describe, it, expect } from 'vitest'
import { Workflow } from '../core/workflow'

describe('Workflow', () => {
  it('registers and triggers event handlers', async () => {
    const workflow = new Workflow()
    const result = { processed: false }

    workflow.on('test.event', (data) => {
      result.processed = data.value
      return true
    })

    await workflow.send('test.event', { value: true })
    expect(result.processed).toBe(true)
  })

  it('supports multiple handlers for same event', async () => {
    const workflow = new Workflow()
    const results: number[] = []

    workflow.on('multi.event', (data) => {
      results.push(data * 2)
    })

    workflow.on('multi.event', (data) => {
      results.push(data * 3)
    })

    await workflow.send('multi.event', 2)
    expect(results).toEqual([4, 6])
  })

  it('handles events with no registered handlers', async () => {
    const workflow = new Workflow()
    const result = await workflow.send('nonexistent.event', {})
    expect(result).toEqual([])
  })
})
