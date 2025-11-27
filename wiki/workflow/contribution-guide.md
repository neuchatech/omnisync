# OmniSync Contribution Guide

## Core Philosophy
We follow a **Test-Driven Development (TDD)** approach.
1.  **Red**: Write a failing test for the feature you want to implement.
2.  **Green**: Write the minimal code to make the test pass.
3.  **Refactor**: Improve the code while keeping tests green.

## Workflow
1.  **Task Tracking**: We use `wiki/workflow/task.md` to track progress. Always update this file when starting or completing a task.
2.  **Implementation Plans**: Before starting a complex feature, create or update `implementation_plan.md` and get approval.
3.  **Artifacts**: Keep the `wiki` updated with design decisions and architectural changes.

## Code Standards
- **TypeScript**: Strict mode is enabled. No `any` unless absolutely necessary.
- **Testing**: All logic must be tested. We use Jest.
- **Commits**: Use descriptive commit messages.

## Directory Structure
- `src/kernel`: Core logic (framework agnostic).
- `src/react`: React bindings.
- `src/bindings`: Backend adapters.
