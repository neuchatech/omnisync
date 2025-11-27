# AI Agent Onboarding

This document is intended to help AI agents understand the context and workflows of the OmniSync project.

## Key Resources
- **Contribution Guide**: Please refer to [wiki/workflow/contribution-guide.md](file:///d:/data/neuchatech/Projects/omnisync/wiki/workflow/contribution-guide.md) for detailed instructions on TDD, code standards, and workflow.
- **Task Tracking**: Check [wiki/workflow/task.md](file:///d:/data/neuchatech/Projects/omnisync/wiki/workflow/task.md) for the current status.
- **Implementation Plans**: Review `implementation_plan.md` (if active) for architectural details.

## Context
OmniSync is a unified state management library. We use a Kernel + Adapter architecture.
- **Kernel**: Handles reactivity and proxying.
- **Bindings**: Connect to external data sources (GraphQL, SQL, etc.).

## Workflow
Always follow the TDD cycle: Red -> Green -> Refactor.
