[![npm version](https://badge.fury.io/js/ai-workflows.svg)](https://badge.fury.io/js/ai-workflows)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# ai-workflows

Composable AI Workflows & Durable Execution Framework

## Overview

ai-workflows is a powerful framework for building event-driven, AI-powered workflows with durable execution guarantees. It provides both a JavaScript API and MDX-based workflow definitions for maximum flexibility.

## Features

- 🎯 **Event-Driven Architecture** - Build reactive workflows that respond to system events
- 🤖 **AI Integration** - Built-in AI capabilities for text summarization, sentiment analysis, and KPI review
- ⏰ **Smart Scheduling** - Schedule tasks with natural language time expressions
- 📝 **MDX Workflow Definitions** - Author workflows using MDX with structured data imports/exports
- 🎨 **Visual Workflow UI** - Built-in components for workflow visualization and management
- 💪 **Durable Execution** - Reliable workflow execution with state persistence

## Installation

```bash
npm install ai-workflows
```

## Usage

### JavaScript API

```javascript
import { ai, Workflow } from 'ai-workflows'

const workflow = Workflow()

workflow.on('ticket.created', (ticket) => {
  const summary = ai.summarize(ticket)
  workflow.send('ticket.summarized', summary)
})

workflow.on('ticket.summarized', (summary) => ai.sentiment(summary).then('update.ticket'))

workflow.every('30 minutes during business hours', (context) => ai.reviewKPIs(context).then('slack.post'))

export default workflow
```

### MDX Workflow Definition

```mdx
import { Workflow, ai } from 'ai-workflows'
import { ticketData } from './data'
export const metadata = {
  name: 'Ticket Processing Workflow',
  version: '1.0.0'
}

# Ticket Processing Workflow

This workflow handles automated ticket processing with AI assistance.

<Workflow
  events={['ticket.created', 'ticket.summarized']}
  schedule="30 minutes during business hours"
>
  {/* Event handlers are defined as MDX components */}
  <WorkflowEvent on="ticket.created">
    {(ticket) => {
      const summary = ai.summarize(ticket)
      return workflow.send('ticket.summarized', summary)
    }}
  </WorkflowEvent>

  <WorkflowEvent on="ticket.summarized">
    {(summary) => ai.sentiment(summary).then('update.ticket')}
  </WorkflowEvent>

  <WorkflowSchedule every="30 minutes during business hours">
    {(context) => ai.reviewKPIs(context).then('slack.post')}
  </WorkflowSchedule>
</Workflow>

export default function WorkflowUI({ mode = 'status' }) {
  return (
    <WorkflowViewer
      metadata={metadata}
      mode={mode} // Supports: 'design', 'schedule', 'status', 'execution', 'instance'
    />
  )
}
```

## Workflow UI Components

The framework provides built-in UI components for different workflow states:

- **Design Time View** - Visual workflow builder and editor
- **Schedule View** - Timeline view of scheduled tasks
- **Status View** - Real-time workflow execution status
- **Execution View** - Detailed execution logs and debugging
- **Instance View** - Individual workflow instance inspection

## API Reference

### Workflow Class

- `Workflow()` - Creates a new workflow instance
- `workflow.on(event, handler)` - Registers an event handler
- `workflow.send(event, data)` - Emits an event with data
- `workflow.every(schedule, handler)` - Schedules recurring tasks

### AI Methods

- `ai.summarize(text)` - Generates text summaries
- `ai.sentiment(text)` - Performs sentiment analysis
- `ai.reviewKPIs(context)` - Analyzes key performance indicators

### MDX Components

- `<Workflow>` - Root workflow component
- `<WorkflowEvent>` - Event handler component
- `<WorkflowSchedule>` - Schedule definition component
- `<WorkflowViewer>` - UI component for workflow visualization

## Dependencies

- mdxld - MDX loader and processor
- react - UI component library
- date-fns - Date/time utilities for scheduling
