# Plan Spec 1: Full Product Plan

## Objective

Translate the full product spec into a safe DDD-first implementation path for a local-first React Native app.

## What You Should Do First

### Step 1. Freeze The Ubiquitous Language

Lock the exact meanings of these terms before building deeper features:

- Card
- Billing Date
- Due Date
- Extended Payment Date
- Reminder Stage
- Reminder Acknowledgment
- Payment Settlement
- Snooze
- Provider Template
- Quick Note
- Acknowledgment Record

Why this comes first:

- in DDD, naming drives entities, use cases, folders, UI labels, and test cases
- your app has risky terms such as extended payment and overdue, so fuzzy wording will create bad logic quickly

### Step 2. Lock The Trust Boundary

Before modeling provider-specific behavior, lock what the app promises and what it refuses to promise.

Must be explicit:

- the app is open source
- the app is fully local in v1
- the app keeps no logs in v1
- provider templates are advisory only
- extended tracking is a memory aid, not a guarantee

Why this comes second:

- trust copy influences onboarding, settings, warnings, and domain constraints
- it prevents accidental product claims later

### Step 3. Define The Baseline Reminder Lifecycle

Lock the default stage sequence before you write code:

1. Billing
2. Due Soon
3. Due Today
4. Overdue
5. Extended Window, only if enabled

Also lock the default timing:

- billing date: same day
- due soon: 7 days before, 3 days before, 1 day before
- due today: same day
- overdue: 1 day after due date
- extended window: user-enabled only

Why this comes third:

- you said you do not want arbitrary custom reminders
- once the lifecycle is clear, notifications, UI, and persistence become straightforward

## Full v1 Scope

The first shippable product includes all of the following:

1. card creation with name, provider, and last 4 digits
2. billing date and due date management
3. stage-derived reminder generation
4. local notifications from the start
5. reminder acknowledgment
6. payment settlement marking
7. optional extended tracking with acknowledgment
8. manual extended date entry and static provider-template suggestions
9. card tags and card search
10. app-level quick notes tab
11. onboarding flow with open-source, fully-local, no-logs messaging

## Delivery Sequence

### Phase 1. Domain Foundation

- define entities, value objects, and invariants
- model stage-derived reminders
- separate reminder acknowledgment from payment settlement
- model provider templates as advisory catalog data

### Phase 2. Application Contracts

- create card use cases
- update payment schedule use cases
- derive reminder stages use case
- acknowledge reminder stage use case
- settle payment stage use case
- enable extended tracking use case
- create and delete quick note use cases
- complete onboarding use case

### Phase 3. Infrastructure

- local storage repositories
- onboarding completion storage
- quick notes storage
- local notification adapter
- static provider-template catalog

### Phase 4. Presentation

- onboarding flow
- reminders overview screen
- cards screen
- notes tab
- acknowledgment dialog and copy
- search and tag filtering UI

## Initial File Planning

When implementation starts, prefer introducing code in this order:

1. domain types and entities
2. application use cases and interfaces
3. storage and notification adapters
4. onboarding and notes persistence
5. reminder and card screens
6. search, tags, and extended-tracking UX polish

## Definition Of Ready For Coding

You are ready to code confidently when:

1. the domain terms in Step 1 are stable
2. the trust boundary in Step 2 is accepted
3. the reminder-stage model in Step 3 is accepted
4. the extended-tracking warning text is approved
5. the provider-template policy is explicitly conservative
6. the storage strategy remains local-only for v1

## First Technical Slice

Build this first even though the full scope is already defined:

1. persist onboarding completion locally
2. show onboarding screens with the three trust promises
3. add the notes tab with local storage
4. create the shell for reminders and cards tabs
5. keep navigation and local persistence stable before deeper domain features arrive

Why this slice first:

- it proves the local-only product identity immediately
- it establishes the app structure before the payment model becomes denser
- it gives you user-visible progress without forcing financial logic too early

## Second Technical Slice

1. create card entity and form
2. store provider, last 4 digits, billing date, and due date
3. derive default stages
4. schedule local notifications
5. support acknowledgment and settlement transitions

## Third Technical Slice

1. add extended tracking opt-in
2. present warning and store acceptance
3. allow manual extended date entry
4. optionally prefill from a provider template catalog
5. keep templates editable and override-friendly

## Key Product Decisions Locked By This Plan

1. No arbitrary custom reminders in v1.
2. Tags are card-level only.
3. Notifications are required in the baseline product.
4. Provider templates are advisory, static, and manually verified by the user.
5. Quick notes are app-level and fully local.

## Exit Criteria

This plan is complete when implementation can proceed without inventing new domain meaning during coding, especially around reminder stages, settlement, and extended tracking responsibility.
