# Spec 1: Core Domain

## Purpose

Define the first bounded context for the app: helping individual users track credit card billing-related dates without storing sensitive card data.

## Problem Statement

Users often miss credit card milestones because the important dates are split across statements, payment rules, and issuer-specific grace or extension behavior. The app should reduce missed payments by tracking reminder-worthy events tied to a card while keeping the stored data minimal.

## Product Goal

Enable a user to create lightweight credit card reminder records that track:

- card identity using a friendly name and last 4 digits only
- billing date
- payment due date
- optional extended payment date when the user explicitly opts in to track it
- reminder schedules for one-time and recurring events

## Non-Goals

- storing full card number, CVV, expiry, or any payment credentials
- making payments
- connecting to banks or issuers automatically in v1
- giving legal or financial advice
- guaranteeing issuer-specific grace logic is correct

## Users

- primary user: individual consumer managing personal credit cards

## Domain Language

- Card Profile: non-sensitive representation of a credit card
- Billing Cycle: statement period metadata relevant to reminders
- Due Date: last date for expected payment
- Extended Payment Tracking: user-managed tracking of an issuer-specific extra window
- Reminder: scheduled prompt for an upcoming event
- Acknowledgment: explicit confirmation that the user understands extended tracking is manual and not guaranteed

## Core User Jobs

1. Register a card by name and last 4 digits.
2. Save billing and due dates for that card.
3. Receive reminders before important dates.
4. Track recurring reminder behavior month to month.
5. Mark a reminder or payment milestone as complete.
6. Snooze a reminder when needed.
7. Categorize or tag cards and reminders for filtering.
8. Search cards or reminders quickly.
9. Optionally track an extended payment date after acknowledging the risks.

## Constraints

- Android is the first delivery platform.
- The app must not request or store sensitive card credentials.
- Extended payment tracking must be explicitly optional.
- The user must acknowledge that extended payment calculations and outcomes remain their responsibility.

## Initial Bounded Contexts

### 1. Card Management Context

Owns:

- card profile creation and editing
- card labels, tags, and status
- issuer display metadata if needed later

### 2. Reminder Scheduling Context

Owns:

- reminder definitions
- one-time and recurring schedules
- snooze state
- completion state
- notification intent metadata

### 3. Payment Tracking Context

Owns:

- billing date
- due date
- optional extended payment tracking
- user-entered paid amount when required by an issuer-specific rule
- acknowledgment records for risky manual tracking

## Primary Domain Objects

### Entities

- Card
- Reminder
- Payment Schedule
- Acknowledgment Record

### Value Objects

- CardLastFour
- CardLabel
- BillingDate
- DueDate
- ReminderRule
- MoneyAmount
- Tag

## Business Rules

1. A card must have a user-visible name.
2. A card may store only the last 4 digits, never the full number.
3. A payment schedule must have at least one important date to track.
4. Extended payment tracking cannot be enabled unless the user has acknowledged the warning.
5. Extended payment tracking may require the user to provide a paid amount.
6. The app must present extended payment tracking as user-managed, not guaranteed.
7. A reminder may be recurring or one-time.
8. Completed reminders should remain auditable in app history unless deleted by the user.

## Open Questions

1. Should the app support multiple reminders per event, such as 7 days before and 1 day before?
2. Should tags belong to cards, reminders, or both?
3. Should completion mean reminder completed, payment completed, or both as separate concepts?
4. Is extended payment tracking manual-only in v1, or do you want issuer templates later?
5. Should the app store payment amount history, or only the latest relevant amount?

## Acceptance Criteria For Spec 1

1. The domain language is clear enough to name folders, components, and future application services.
2. The app scope excludes sensitive card data.
3. The risky extended-payment behavior is isolated behind explicit acknowledgment.
4. The first implementation slice can be planned without needing bank integrations.
