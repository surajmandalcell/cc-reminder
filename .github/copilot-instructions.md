# CC Reminder Workspace Instructions

## Core Workflow

- Treat this repository as a DDD-first product. Clarify and preserve domain language in code, specs, and naming.
- The main agent should act as an orchestrator when the task is large: delegate read-only exploration to subagents, then integrate the result in the main flow.
- Do not drift into generic reminder-app abstractions when the actual domain is credit card billing, due dates, extended payment tracking, and local trust.

## Commits

- Make proper commits along the way at meaningful checkpoints, not only at the very end.
- Commit when a logical slice is complete, such as a spec milestone, a working UI slice, a fixed build, or a validated feature.
- Do not leave meaningful completed work uncommitted when handing off.
- Use clear, non-generic commit messages that describe the slice of work completed.
- Do not push automatically unless explicitly asked.

## Spec Rules

- Product and domain specs live under `spec/`, `spec/design/`, and `spec/plan/`.
- Follow the naming pattern `spec<number>.<subdomain>.md`, for example `spec1.core.md`.
- If a product behavior, bounded context, workflow, or domain rule changes materially, update the relevant specs as part of the same work.
- Keep specs DDD-oriented: domain language, bounded contexts, invariants, use cases, and implementation plan should stay aligned.

## Domain Rules

- The app is local-first.
- The app must not store full card number, CVV, expiry date, or any payment credential.
- Provider-specific rules and templates are advisory only and must never be presented as guaranteed truth.
- Extended payment tracking must remain explicit, user-managed, and acknowledgment-gated.
- Tags belong to cards, not individual reminders.
- Reminder flows are stage-based, not arbitrary custom reminder builders, unless specs are deliberately updated.

## Frontend Rules

- Prioritize aesthetics and interaction quality, not just functional completion.
- UI should feel premium: medium-rounded corners, soft layered shadows, strong visual hierarchy, and polished motion.
- Use meaningful microinteractions throughout the app: press states, entrance transitions, focus states, and subtle motion feedback.
- Avoid default Expo starter aesthetics, bland layouts, and generic AI-looking gradients.
- Preserve a local, trustworthy, premium product feel across onboarding, reminders, cards, and notes.

## Quality Bar

- Fix obvious issues you encounter while working, especially compile errors, broken routing, malformed files, and design inconsistencies that block the feature.
- Validate React changes with TypeScript checks and React Doctor when applicable.
- For frontend changes, verify the app actually runs after implementation.
