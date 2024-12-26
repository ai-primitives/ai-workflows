# AI Workflows TODO

## MDX-based AI Workflow Platform Implementation

### Core Functionality
- [ ] Implement Proxy wrapper for `ai` object
  - [ ] Create system to look up MDX files in `ai/` folder matching method names
  - [ ] Set up dynamic method handling (e.g., `ai.summarize(ticket)` → `ai/summarize.mdx`)
  - [ ] Implement error handling for missing MDX files

### MDX File Structure
- [ ] Define MDX front matter schema
  - [ ] Required parameters:
    - [ ] `model`: Language model to use with generateObject
    - [ ] `system`: System prompt for model behavior
    - [ ] `output`: Schema definition object
      ```yaml
      output:
        type: Article | BlogPosting | Thing
        description: The thinking and rationale behind the reason
      ```

### Schema Processing
- [ ] Implement Zod schema generation
  - [ ] Convert pipe-separated values (|) into Zod enums
  - [ ] Use `describe()` for string properties
  - [ ] Generate TypeScript .d.ts files based on MDX schemas
  - [ ] Implement schema validation using Vercel AI SDK's generateObject

### Integration
- [ ] Set up Vercel AI SDK integration
  - [ ] Configure generateObject function with MDX front matter parameters
  - [ ] Implement type safety and validation
  - [ ] Add error handling for schema validation failures

### TypeScript Support
- [ ] Generate TypeScript type definitions
  - [ ] Create .d.ts file generation system
  - [ ] Ensure type definitions match MDX schema definitions
  - [ ] Implement automatic type updates when MDX files change

### Example Implementation
```typescript
// Example MDX file (ai/summarize.mdx):
---
model: gpt-4-turbo
system: You are a helpful assistant that summarizes content accurately and concisely.
output:
  type: Article | BlogPosting | Thing
  description: A concise summary of the provided content
---

// Generated usage:
const summary = await ai.summarize(ticket)
// Returns object matching the schema defined in MDX
```

### Testing & Documentation
- [ ] Create test suite
  - [ ] Test Proxy wrapper functionality
  - [ ] Test MDX file loading
  - [ ] Test schema validation
  - [ ] Test TypeScript type generation
- [ ] Add documentation
  - [ ] Document MDX file structure
  - [ ] Document schema definition format
  - [ ] Add usage examples
