# Plan Spec 1: Core Domain

## Objective

Translate the core domain spec into a safe first implementation path for a new DDD-based app.

## What You Should Do First

### Step 1. Freeze The Ubiquitous Language

Confirm the exact meanings of these terms before writing feature code:

- Card
- Billing Date
- Due Date
- Extended Payment Date
- Reminder
- Completion
- Snooze
- Acknowledgment

Why this comes first:

- in DDD, naming is not documentation polish; it drives entities, folders, use cases, and UI labels
- if the words are unstable, the architecture will be unstable too

### Step 2. Choose The First Bounded Context

Start with the Payment Tracking Context plus the minimum Card data it needs.

Why:

- it holds the main product value
- it contains the risky logic that needs rules and acknowledgment
- it will force clean boundaries early

### Step 3. Define One Thin Vertical Slice

First slice recommendation:

1. Create a card with name and last 4 digits.
2. Add billing date and due date.
3. Enable or skip extended tracking.
4. Save a reminder rule for due date.

This is better than building all features at once because it validates the domain model before adding search, tags, snooze, and notifications.

## Suggested Delivery Sequence

### Phase 1: Domain Foundation

- finalize ubiquitous language
- define aggregates and invariants
- decide what completion means
- decide how extended tracking is modeled

### Phase 2: Application Use Cases

- create card
- update payment schedule
- enable extended tracking with acknowledgment
- create reminder

### Phase 3: Infrastructure

- local persistence
- notification scheduling adapter

### Phase 4: Presentation

- Android-first flows for creating and managing a card
- forms for payment schedule and acknowledgment
- list and detail views for reminders

## Initial File Planning

When implementation starts, prefer introducing code in this order:

1. domain types and entities
2. application use cases
3. repository interfaces
4. infrastructure implementations
5. presentation screens

## Definition Of Ready For Coding

You are ready to code the first slice when:

1. the terms in Step 1 are agreed
2. extended tracking disclaimer text is accepted
3. the first slice acceptance criteria are written
4. the storage strategy for v1 is chosen, likely local-only

## Questions To Answer Before Spec 2

1. How should extended payment date be calculated or entered?
2. What exact acknowledgment text should users accept?
3. Do you want separate screens for cards and reminders, or a card-centric flow?
4. Is notification scheduling part of the first coded slice or the second?

## Recommended Next Specs

- spec2.payment-tracking.md
- spec3.reminders.md
- spec4.notifications.md
- spec5.search-and-tags.md

## Exit Criteria

This plan is complete when the next spec can describe one fully scoped vertical slice with domain rules, UX flow, and acceptance criteria.
