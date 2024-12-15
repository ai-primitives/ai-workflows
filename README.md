# ai-workflows
Composable AI Workflows &amp; Durable Execution Framework

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
