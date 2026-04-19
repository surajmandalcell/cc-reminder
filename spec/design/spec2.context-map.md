# Design Spec 2: Context Map

## Purpose

Show how the core bounded contexts relate to each other in the current v1 design.

```mermaid
flowchart LR
    OT[Onboarding and Trust Context]
    CM[Card Management Context]
    PT[Payment Tracking Context]
    RL[Reminder Lifecycle Context]
    NT[Notes Context]
    INF[(Local Infrastructure\nAsyncStorage + Notifications)]

    OT -->|establishes product trust rules for| CM
    OT -->|frames warning language for| PT
    CM -->|supplies card identity and notification preference to| PT
    PT -->|supplies due dates and extended tracking data to| RL
    RL -->|creates stage-derived reminder work for| CM
    NT -->|stays independent of card payment rules but shares local-first trust model with| OT

    CM --> INF
    PT --> INF
    RL --> INF
    NT --> INF
    OT --> INF
```

## Relationship Notes

- Card Management is upstream for provider identity, last 4 digits, tags, and notification preference.
- Payment Tracking owns billing, due date, extended tracking, and settlement-related meaning.
- Reminder Lifecycle depends on Payment Tracking to derive stages and on Card Management for context.
- Notes remain intentionally separate from payment rules.
- Onboarding and Trust shape language, promises, and warning boundaries across the product.
