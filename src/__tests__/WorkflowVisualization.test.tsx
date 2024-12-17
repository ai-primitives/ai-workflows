import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { WorkflowVisualization } from '../components/WorkflowVisualization'
import type { Workflow } from '../types'

describe('WorkflowVisualization', () => {
  const mockWorkflow: Workflow = {
    on: jest.fn(),
    send: jest.fn(),
    every: jest.fn()
  }

  it('renders design view', () => {
    const { getByText } = render(
      <WorkflowVisualization workflow={mockWorkflow} mode="design" />
    )
    expect(getByText('Design View')).toBeInTheDocument()
  })

  it('renders schedule view', () => {
    const { getByText } = render(
      <WorkflowVisualization workflow={mockWorkflow} mode="schedule" />
    )
    expect(getByText('Schedule View')).toBeInTheDocument()
  })

  it('renders status view', () => {
    const { getByText } = render(
      <WorkflowVisualization workflow={mockWorkflow} mode="status" />
    )
    expect(getByText('Status View')).toBeInTheDocument()
  })

  it('renders execution view', () => {
    const { getByText } = render(
      <WorkflowVisualization workflow={mockWorkflow} mode="execution" />
    )
    expect(getByText('Execution View')).toBeInTheDocument()
  })

  it('renders instance view', () => {
    const { getByText } = render(
      <WorkflowVisualization workflow={mockWorkflow} mode="instance" />
    )
    expect(getByText('Instance View')).toBeInTheDocument()
  })
})
