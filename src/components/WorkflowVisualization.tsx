import React from 'react'
import type { Workflow, WorkflowMode } from '../types'
import './WorkflowVisualization.css'

interface Props {
  workflow: Workflow
  mode: WorkflowMode
}

function DesignView({ workflow }: { workflow: Workflow }) {
  return (
    <div className="workflow-view design">
      <h2>Design View</h2>
      {/* TODO: Implement design view visualization */}
    </div>
  )
}

function ScheduleView({ workflow }: { workflow: Workflow }) {
  return (
    <div className="workflow-view schedule">
      <h2>Schedule View</h2>
      {/* TODO: Implement schedule view visualization */}
    </div>
  )
}

function StatusView({ workflow }: { workflow: Workflow }) {
  return (
    <div className="workflow-view status">
      <h2>Status View</h2>
      {/* TODO: Implement status view visualization */}
    </div>
  )
}

function ExecutionView({ workflow }: { workflow: Workflow }) {
  return (
    <div className="workflow-view execution">
      <h2>Execution View</h2>
      {/* TODO: Implement execution view visualization */}
    </div>
  )
}

function InstanceView({ workflow }: { workflow: Workflow }) {
  return (
    <div className="workflow-view instance">
      <h2>Instance View</h2>
      {/* TODO: Implement instance view visualization */}
    </div>
  )
}

export function WorkflowVisualization({ workflow, mode }: Props) {
  switch (mode) {
    case 'design':
      return <DesignView workflow={workflow} />
    case 'schedule':
      return <ScheduleView workflow={workflow} />
    case 'status':
      return <StatusView workflow={workflow} />
    case 'execution':
      return <ExecutionView workflow={workflow} />
    case 'instance':
      return <InstanceView workflow={workflow} />
    default:
      return null
  }
}
