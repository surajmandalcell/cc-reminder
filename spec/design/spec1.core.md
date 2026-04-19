# Design Spec 1: Full Product Design

## Design Goal

Apply Domain-Driven Design in a lightweight way suitable for a React Native Expo app while keeping the domain explicit enough for risky payment-timeline behavior and simple enough for a local-first solo product.

## What DDD Means Here

For this product, DDD must answer:

1. What words are stable enough to drive the model?
2. Which bounded contexts own which responsibilities?
3. Which rules are domain rules versus UI behavior?
4. How do local notifications, onboarding, and notes fit without polluting core payment logic?

## Proposed Layering

### Domain Layer

Contains pure business concepts and rules.

Examples:

- Card entity
- PaymentSchedule entity
- ReminderStageEntry entity
- QuickNote entity or simplified note model
- value objects for last 4 digits, dates, stages, tags, provider template ids
- domain services for deriving stage timelines and evaluating provider-template applicability

Rules:

- no React code
- no Expo APIs
- no AsyncStorage code
- deterministic logic where possible
- monthly billing and due scheduling must support user-entered day values from 1 to 31, with nearest-valid-date handling in shorter months

### Application Layer

Coordinates use cases.

Examples:

- create card
- update payment schedule
- derive stage reminders
- enable extended tracking with acknowledgment
- mark reminder acknowledged
- mark payment settled
- search cards
- create quick note

Rules:

- orchestrates repositories and domain objects
- may depend on domain
- should not contain UI components

### Infrastructure Layer

Implements external concerns.

Examples:

- local storage repositories
- local notifications adapter
- provider template catalog source
- persistence mapping

Rules:

- depends on domain contracts and application contracts
- contains Expo or native integration code
- never introduces financial rules on its own

### Presentation Layer

Owns screens, forms, navigation, local interaction state, and onboarding storytelling.

Examples:

- Expo Router screens
- onboarding flow
- tabs, lists, forms, and note editor
- view models and screen-specific state mappers

Rules:

- should call application use cases
- should not decide issuer-rule truth
- may shape copy for trust and warnings, but warning versions should be defined centrally

## Suggested Code Shape

This is the target shape after the starter project grows beyond template code.

```text
src/
  domain/
    card/
    payment-tracking/
    reminder-lifecycle/
    notes/
    onboarding/
    shared/
  application/
    card/
    payment-tracking/
    reminder-lifecycle/
    notes/
    onboarding/
  infrastructure/
    storage/
    notifications/
    provider-templates/
  presentation/
    screens/
    components/
    hooks/
```

## Aggregate Candidates

### Card Aggregate

Likely root:

- Card

Likely children and value objects:

- CardLastFour
- CardLabel
- ProviderName
- Tag collection
- NotificationPreference

Why:

- card identity is central and non-sensitive
- payment schedules and reminder stages attach to a card id

### Payment Tracking Aggregate

Likely root:

- PaymentSchedule

Likely children and value objects:

- BillingDate
- DueDate
- ExtendedPaymentDate
- ExtendedTrackingMode
- AcknowledgmentRecord reference
- PaymentSettlementState

Why:

- billing, due, settlement, and extended tracking rules change together
- acknowledgment is required when risky manual tracking is enabled

### Reminder Lifecycle Aggregate

Likely root:

- ReminderStageEntry

Likely children and value objects:

- ReminderStage
- NotificationTiming
- ReminderAcknowledgmentState
- SnoozeState

Why:

- reminders are derived from a payment schedule rather than freely authored
- acknowledgment and snooze behavior belong to the lifecycle state, not the card identity itself

### Notes Aggregate

Likely root:

- QuickNote

Likely children and value objects:

- NoteBody
- NoteTimestamp

Why:

- notes are local, simple, and app-level rather than part of payment rules

## Important Invariants

1. Card data must never include full account credentials.
2. Extended tracking must require prior acknowledgment.
3. Provider templates are reference-only and may never be treated as guaranteed issuer rules.
4. Domain logic must not rely on UI-only state.
5. All reminder entries must derive from a valid card payment schedule stage.
6. Tags are attached to cards only.
7. Overdue and extended-window stages cannot resolve until settlement is marked.
8. Quick notes stay local and are not modeled as card credentials or structured payment facts.

## Recommended Use Cases

1. CreateCard
2. UpdatePaymentSchedule
3. DeriveReminderStages
4. AcknowledgeReminderStage
5. SettlePaymentStage
6. EnableExtendedTracking
7. OverrideProviderTemplateSuggestion
8. CreateQuickNote
9. DeleteQuickNote
10. CompleteOnboarding

## Domain Events Worth Naming

- CardCreated
- PaymentScheduleUpdated
- ReminderStagesDerived
- ReminderStageAcknowledged
- PaymentStageSettled
- ExtendedTrackingEnabled
- ProviderTemplateSuggested
- QuickNoteCreated
- QuickNoteDeleted
- OnboardingCompleted

## Provider Template Design

Provider templates should be modeled as catalog data, not executable financial truth.

V1 scope:

- ship only an Amex advisory template until real product pressure justifies broader issuer coverage

Recommended shape:

- provider id
- display name
- template description
- optional typical extension hint
- source label
- last reviewed date
- advisory disclaimer

Design rule:

- template selection may prefill fields or copy, but the final saved extended date must remain user-entered or explicitly user-confirmed

## Notification Design

Notifications belong in infrastructure, but stage derivation belongs in domain.

Domain decides:

- which stages exist
- when a stage should occur relative to billing or due date
- when a stage is resolved
- overdue reminders remain active until settlement and should support daily follow-up scheduling from infrastructure
- extended-payment reminders occur 1 day before the user-entered extended date and again on the extended date

Infrastructure decides:

- how local notifications are scheduled on the device
- how notification permissions are requested
- how scheduled notifications are canceled or refreshed when card data changes
- how the app keeps working when notification permission is denied while still surfacing passive status in presentation

## Onboarding Design

Onboarding is a presentation feature with domain significance because it establishes trust promises and captures the first product understanding.

Required themes:

- open source
- fully local storage
- no logs

Design rule:

- onboarding completion is a persistent local state and not tied to a backend account
- onboarding may be implemented as a single plain trust screen in v1 as long as those trust promises remain explicit

## Design Risks

### Risk: Overengineering too early

Mitigation:

- keep the first model small and explicit
- do not add CQRS or event sourcing
- keep provider templates static until product pressure demands more

### Risk: Mixing domain logic and reminder UI behavior

Mitigation:

- derive stages in domain services
- keep Expo notification scheduling in infrastructure adapters
- keep screen components focused on presentation and intent dispatch

### Risk: Financial ambiguity or false confidence

Mitigation:

- keep all extended tracking behind acknowledgment
- never phrase template output as guaranteed issuer truth
- version warning copy and store acceptance timestamps

### Risk: Trust copy drifting from actual product behavior

Mitigation:

- only claim open source, fully local, and no logs as long as infrastructure truly does that
- revisit onboarding copy if analytics or sync is introduced later

## Decisions Locked By This Spec

1. Payment completion and reminder acknowledgment are separate concepts.
2. Tags live on cards only.
3. Extended tracking supports both manual entry and provider templates, but templates are advisory only.
4. Billing and due date inputs accept 1 to 31 and clamp to the nearest valid calendar date for each month.
5. Notifications are part of the baseline product, not a deferred enhancement.
6. Quick notes exist as an app-level local feature.
