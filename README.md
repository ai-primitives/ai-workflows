[![npm version](https://badge.fury.io/js/ai-workflows.svg)](https://badge.fury.io/js/ai-workflows)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# ai-workflows

Composable AI Workflows & Durable Execution Framework

## Overview

ai-workflows is a powerful framework for building event-driven, AI-powered workflows with durable execution guarantees. It provides both a JavaScript API and MDX-based workflow definitions for maximum flexibility.

## Features

- 🎯 **Event-Driven Architecture** - Build reactive workflows that respond to external events
- 🤖 **AI Functions** - Built-in MDX-based AI functions structured data generation and processing
- ⏰ **Smart Scheduling** - Schedule tasks with natural language time expressions
- 📝 **Workflow Definitions** - Design workflows by composing AI functions and events
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
