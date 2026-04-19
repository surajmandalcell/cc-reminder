# Design Spec 1: Core Domain

## Design Goal

Apply Domain-Driven Design in a lightweight way suitable for a new React Native app.

## What DDD Means Here

For this project, DDD should answer four questions before large feature work starts:

1. What is the domain language?
2. What are the bounded contexts?
3. What business rules must the code protect?
4. How should the codebase separate domain logic from screens and storage?

## Proposed Layering

### Domain Layer

Contains pure business concepts and rules.

Examples:

- Card entity
- Reminder entity
- PaymentSchedule entity
- value objects for dates, last 4 digits, money, tags
- domain services for extended payment rule evaluation

Rules:

- no React code
- no Expo APIs
- no persistence code
- deterministic logic where possible

### Application Layer

Coordinates use cases.

Examples:

- create card
- update billing schedule
- enable extended tracking with acknowledgment
- mark reminder complete
- snooze reminder
- search reminders

Rules:

- orchestrates repositories and domain objects
- may depend on domain
- should not contain UI components

### Infrastructure Layer

Implements external concerns.

Examples:

- local storage repository
- notifications adapter
- persistence mapping
- analytics later if needed

Rules:

- depends on application and domain contracts
- contains platform-specific code

### Presentation Layer

Owns screens, forms, navigation, and state shaping for UI.

Examples:

- Expo Router screens
- view models
- form validation presentation rules

Rules:

- should call application use cases
- should not contain core business decisions

## Suggested Code Shape

This is a target shape, not a mandatory immediate refactor.

```text
src/
  domain/
    card/
    reminder/
    payment-tracking/
    shared/
  application/
    card/
    reminder/
    payment-tracking/
  infrastructure/
    storage/
    notifications/
  presentation/
    screens/
    components/
    hooks/
```

## Aggregate Candidates

### Card Aggregate

Likely root:

- Card

Likely children/value objects:

- CardLastFour
- CardLabel
- Tag collection

Why:

- card identity is central and non-sensitive
- reminders and schedules can reference the card id

### Payment Tracking Aggregate

Likely root:

- PaymentSchedule

Likely children/value objects:

- BillingDate
- DueDate
- ExtendedPaymentOption
- AcknowledgmentRecord reference

Why:

- billing and due rules change together
- extended tracking has business constraints

### Reminder Aggregate

Likely root:

- Reminder

Likely children/value objects:

- ReminderRule
- ReminderStatus
- SnoozeState

Why:

- scheduling, snoozing, and completion are cohesive

## Important Invariants

1. Card data must never include full account credentials.
2. Extended tracking must require prior acknowledgment.
3. Reminder scheduling must reference valid tracked events.
4. Domain logic must not rely on UI-only state.

## Recommended First Use Cases

1. CreateCard
2. UpdatePaymentSchedule
3. EnableExtendedTracking
4. CreateReminder
5. MarkReminderComplete

## Event Ideas

You do not need event-driven architecture yet, but naming domain events helps.

- CardCreated
- PaymentScheduleUpdated
- ExtendedTrackingEnabled
- ReminderScheduled
- ReminderCompleted
- ReminderSnoozed

## Design Risks

### Risk: Overengineering early

Mitigation:

- keep entities and use cases small
- do not add CQRS, event sourcing, or complicated factories unless needed

### Risk: Mixing domain and UI logic

Mitigation:

- move issuer-specific rules into domain services
- keep Expo notification calls in infrastructure

### Risk: Financial ambiguity

Mitigation:

- store explicit disclaimers in the acknowledgment flow
- never present calculations as guaranteed advice

## Decisions To Make Next

1. Whether payment completion and reminder completion are separate concepts.
2. Whether tags live on cards, reminders, or both.
3. Whether extended-payment rules are manual-only or template-driven.
