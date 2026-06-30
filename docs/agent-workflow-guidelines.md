# Agent Workflow Guidelines for NeoViet360

This project uses `superpowers` as the primary agent workflow system. Do not vendor large external agent frameworks into this repository unless they directly become project runtime code.

## Keep These Principles

### 1. Think Before Coding
- State assumptions explicitly.
- Ask for clarification when requirements are ambiguous.
- Surface tradeoffs instead of silently choosing a risky path.
- Do not hide uncertainty.

### 2. Simplicity First
- Prefer the smallest change that solves the actual problem.
- Avoid speculative abstractions.
- Do not add configurability or framework code unless required.
- Keep frontend/backend integration fixes focused on the current app architecture.

### 3. Surgical Changes
- Touch only files required by the task.
- Do not perform unrelated cleanup while fixing a bug.
- Match existing project style.
- Remove only dead code introduced by the current change unless explicitly asked.

### 4. Goal-Driven Execution
- Convert tasks into verifiable success criteria.
- For bugs, identify root cause before fixing.
- Add or run tests/checks that prove the behavior.
- Do not claim completion without verification evidence.

## Superpowers Usage

Use the relevant `superpowers` skill before major work:

- `systematic-debugging` for bugs, failed tests, build errors, and unexpected behavior.
- `writing-plans` for multi-step implementation plans.
- `test-driven-development` for feature or bugfix implementation.
- `verification-before-completion` before claiming work is complete.
- `requesting-code-review` before merging or finalizing major changes.

## External References

- GSD legacy repo `gsd-build/get-shit-done` is archived and should not be installed into this project.
- If GSD is needed for research, use the current repository instead: https://github.com/open-gsd/gsd-core
- Karpathy-inspired agent guidance is useful conceptually, but the full repository should not be vendored into this codebase.