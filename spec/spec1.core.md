# Spec 1: Full Product Domain

## Purpose

Define the complete v1 domain for a local-first credit card reminder app that helps individual users track billing dates, due dates, extended payment windows, notes, and stage-based reminders without storing sensitive payment credentials.

## Problem Statement

Credit card timelines are easy to miss because billing dates, due dates, minimum payment behavior, and issuer-specific grace or extension policies are fragmented. Users need a private reminder system that is simple enough to trust, local enough to feel safe, and structured enough to prevent missed stages in the payment timeline.

## Product Goal

Enable a user to manage credit card reminder records that include:

- card identity using a friendly name and last 4 digits only
- billing date and due date tracking
- stage-based reminders derived from the card lifecycle rather than ad hoc custom reminders
- optional extended payment tracking using manual entry or curated provider templates
- local notifications from the start
- card-level tags for filtering
- an app-level quick notes space for future-self reminders
- onboarding that clearly states the app is open source, fully local, and log-free

## Non-Goals

- storing full card number, CVV, expiry date, or any payment credential
- making payments
- syncing data to a server in v1
- scraping issuer websites live
- presenting issuer template data as guaranteed truth
- giving legal or financial advice

## Users

- primary user: individual consumer managing personal credit cards on Android first

## Domain Language

- Card Profile: non-sensitive representation of a credit card
- Billing Date: statement or billing checkpoint that the user may acknowledge
- Due Date: last normal payment date tracked by the app
- Extended Payment Tracking: optional user-managed tracking of an extra payment window
- Provider Template: curated issuer-specific guidance shown as a reference only
- Reminder Stage: a derived lifecycle checkpoint such as billing, upcoming due, due-today, overdue, extended-window
- Reminder Acknowledgment: user confirms the reminder was seen or handled
- Payment Settlement: user marks a payment stage as completed
- Notification Preference: whether stage notifications are enabled for a card
- Tag: card-level label used for filtering
- Quick Note: local free-text note for the user's future self at the app level
- Acknowledgment Record: explicit acceptance that extended tracking is manual and not guaranteed

## Core User Jobs

1. Register a card by name and last 4 digits.
2. Save billing date and due date for that card.
3. Receive local notifications for billing and payment-related stages.
4. Acknowledge a billing reminder when the statement period begins.
5. Track due-date reminders at multiple predefined stages.
6. Mark a payment stage as settled separately from reminder acknowledgment.
7. Enable extended payment tracking only after accepting a warning.
8. Use a manual extended date or start from a provider template and override it if needed.
9. Tag cards for filtering and faster scanning.
10. Search cards by name, last 4 digits, provider, or tag.
11. Keep quick notes for future self in a separate notes area.
12. Understand during onboarding that the app is open source, fully local, and keeps no logs.

## Constraints

- Android is the first delivery platform.
- The app must not request or store sensitive card credentials.
- Notifications are part of v1, not a later phase.
- Reminders are derived from card lifecycle stages; there are no fully custom reminder schedules in v1.
- Tags apply to cards only.
- Extended payment tracking must be explicitly optional and acknowledged.
- Provider templates must remain conservative, static, and user-overridable.
- All data remains local in v1.

## Bounded Contexts

### 1. Card Management Context

Owns:

- card profile creation and editing
- card labels and last 4 digits
- provider identity metadata
- card-level tags
- notification preference per card

### 2. Payment Tracking Context

Owns:

- billing date
- due date
- extended payment tracking
- provider template references
- settlement state per payment stage
- acknowledgment record for risky manual tracking

### 3. Reminder Lifecycle Context

Owns:

- derived reminder stages
- stage transitions
- reminder acknowledgment state
- snooze state
- notification payload metadata

### 4. Notes Context

Owns:

- app-level quick notes for the user's future self
- local note creation, deletion, and ordering

### 5. Onboarding and Trust Context

Owns:

- first-launch messaging
- local-only trust claims
- open-source trust messaging
- no-logs promise in product copy
- first acceptance of core warnings

## Primary Domain Objects

### Entities

- Card
- PaymentSchedule
- ReminderStageEntry
- AcknowledgmentRecord
- QuickNote

### Value Objects

- CardLastFour
- CardLabel
- ProviderName
- BillingDate
- DueDate
- ExtendedPaymentDate
- ReminderStage
- ReminderAcknowledgmentState
- PaymentSettlementState
- NotificationTiming
- Tag
- NoteBody

## Reminder Stage Model

The app does not support arbitrary user-created reminder schedules in v1. Instead, it derives reminders from the lifecycle of a card payment schedule.

### Default Stages

1. Billing
   Meaning: the statement cycle or billing checkpoint has begun.
   Completion meaning: acknowledged.

2. Due Soon
   Meaning: the normal payment due date is approaching.
   Completion meaning: acknowledged.

3. Due Today
   Meaning: the normal payment date is today.
   Completion meaning: acknowledged or settled.

4. Overdue
   Meaning: the normal due date has passed and the user has not marked settlement.
   Completion meaning: settled.

5. Extended Window
   Meaning: the user enabled optional extended tracking and wants reminders inside that extra window.
   Completion meaning: settled.

### Default Timing

- Billing reminder: on the billing date
- Due Soon reminders: 7 days before, 3 days before, and 1 day before due date
- Due Today reminder: on the due date
- Overdue reminder: 1 day after due date, with optional additional follow-up while unsettled
- Extended Window reminders: off unless extended tracking is explicitly enabled and saved

These timings are part of the default product behavior and can be refined later, but they are not ad hoc user-defined reminder rules in v1.

## Completion Model

Completion is stage-specific and split into two independent concerns.

### Reminder Acknowledgment

- used when the user saw or handled a reminder stage
- especially relevant for billing and upcoming reminders

### Payment Settlement

- used when the user considers the payment responsibility handled for that stage
- required to stop overdue and extended-window pressure states

Examples:

- Billing stage complete means acknowledged, not paid.
- Due Soon stage complete usually means acknowledged.
- Due Today stage may be acknowledged first and settled later.
- Overdue stage is only fully resolved when the user marks the payment settled.

## Provider Template Policy

The app may offer predefined provider templates for issuers such as Amex, but they are advisory only.

Rules:

- templates are static, curated references rather than live issuer integrations
- templates may suggest common extension logic or window lengths
- users can ignore, edit, or override template suggestions entirely
- templates never remove the need for explicit acknowledgment
- templates must not be presented as guarantees or official issuer determinations

Because issuer policies vary by product, account status, geography, and policy changes, provider templates exist to help memory, not to establish legal truth.

## Search Model

Search must work across:

- card name
- last 4 digits
- provider name
- tags

Quick notes are not part of the first structured search requirement.

## Business Rules

1. A card must have a user-visible name.
2. A card may store only the last 4 digits, never the full number.
3. A payment schedule must include at least a due date, and may also include a billing date.
4. Reminders are derived from lifecycle stages, not freeform custom schedules.
5. Tags belong to cards only, not to individual reminders.
6. Local notifications are enabled from the start and must respect card-level notification preferences.
7. Extended payment tracking cannot be enabled unless the user has acknowledged the warning.
8. Extended payment tracking may require the user to enter paid amount details when they want to reason about special provider behavior.
9. Provider templates are suggestions only and must always be user-overridable.
10. Billing stage completion means acknowledgment, not payment.
11. Overdue and extended-window stages are not resolved until the user marks settlement.
12. Quick notes are local free text and are not treated as structured card data.
13. The app must clearly state that it is open source, fully local, and keeps no logs.
14. The app must never claim to verify issuer rules or guarantee bureau-reporting outcomes.

## Extended Tracking Acknowledgment

When a user enables extended payment tracking, the product must show a warning equivalent to the following:

"Grace periods, extension windows, minimum-payment effects, late fees, and credit-reporting outcomes depend on your specific card agreement and may change without notice. CC Reminder cannot monitor your issuer's policies.

By enabling extended payment tracking, you acknowledge that any extended date shown here is only a memory aid. It is not a guarantee, not legal advice, not financial advice, and may still be wrong for your card. You are responsible for verifying the actual terms directly with your issuer."

The app should store the acceptance timestamp and warning version.

## Onboarding Promise

The onboarding flow must communicate:

1. Open source: the product and its logic are visible to the user.
2. Fully local: data is stored on-device in v1.
3. No logs: the app does not ship usage logs or card data to a backend in v1.

## Acceptance Criteria For Spec 1

1. The domain language is strong enough to name future entities, screens, and use cases.
2. The app scope excludes sensitive card data and server-side syncing.
3. The reminder model is stage-based rather than custom-reminder-based.
4. Notifications are included in the baseline scope.
5. Extended tracking is isolated behind explicit warning and manual responsibility.
6. Provider templates are clearly advisory and not positioned as guaranteed truth.
7. App-level notes and onboarding trust messaging are part of the product baseline.
