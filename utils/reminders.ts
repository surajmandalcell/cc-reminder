import type { Card, DerivedReminder, ReminderStageKind } from '@/types/domain';

import { addDays, formatDateKey, formatFullDate, formatShortDate, getNextOccurrence, getPreviousOccurrence, getPreviousOccurrenceFromReference, relativeDayLabel, startOfDay } from '@/utils/date';

function buildReminder(card: Card, options: { cycleId: string; stage: ReminderStageKind; scheduledFor: Date; dueDate: Date; title: string; subtitle: string; tone: DerivedReminder['tone']; }) {
  const reminderId = `${options.cycleId}:${options.stage}`;
  const reminderState = card.reminderState[reminderId];
  const paymentState = card.paymentState[options.cycleId];

  return {
    id: reminderId,
    cycleId: options.cycleId,
    cardId: card.id,
    cardName: card.name,
    provider: card.provider,
    stage: options.stage,
    title: options.title,
    subtitle: options.subtitle,
    scheduledFor: options.scheduledFor.toISOString(),
    dueDate: options.dueDate.toISOString(),
    tone: options.tone,
    isAcknowledged: Boolean(reminderState?.acknowledgedAt),
    isSettled: Boolean(paymentState?.settledAt),
    snoozedUntil: reminderState?.snoozedUntil,
  } satisfies DerivedReminder;
}

export function deriveReminders(cards: Card[], now = new Date()) {
  const today = startOfDay(now);
  const reminders: DerivedReminder[] = [];

  cards.forEach((card) => {
    const nextDue = getNextOccurrence(card.dueDay, today);
    const previousDue = getPreviousOccurrence(card.dueDay, today);
    const activeDueCycle = previousDue <= today ? previousDue : nextDue;
    const nextCycleId = `${card.id}:${formatDateKey(nextDue)}`;
    const activeCycleId = `${card.id}:${formatDateKey(activeDueCycle)}`;

    if (card.billingDay) {
      const billingDate = getPreviousOccurrenceFromReference(card.billingDay, nextDue);
      reminders.push(
        buildReminder(card, {
          cycleId: nextCycleId,
          stage: 'billing',
          scheduledFor: billingDate,
          dueDate: nextDue,
          title: `${card.name} billing checkpoint`,
          subtitle: `${formatShortDate(billingDate)} · ${relativeDayLabel(billingDate, today)}`,
          tone: 'neutral',
        })
      );
    }

    [7, 3, 1].forEach((offset) => {
      const stageDate = addDays(nextDue, -offset);
      if (stageDate >= addDays(today, -1)) {
        reminders.push(
          buildReminder(card, {
            cycleId: nextCycleId,
            stage: `due-soon-${offset}` as ReminderStageKind,
            scheduledFor: stageDate,
            dueDate: nextDue,
            title: `${card.name} due in ${offset} day${offset === 1 ? '' : 's'}`,
            subtitle: `${card.provider} · Due ${formatFullDate(nextDue)}`,
            tone: offset === 1 ? 'warning' : 'accent',
          })
        );
      }
    });

    reminders.push(
      buildReminder(card, {
        cycleId: nextCycleId,
        stage: 'due-today',
        scheduledFor: nextDue,
        dueDate: nextDue,
        title: `${card.name} due today`,
        subtitle: `${card.provider} · ${formatFullDate(nextDue)}`,
        tone: 'warning',
      })
    );

    if (previousDue < today) {
      reminders.push(
        buildReminder(card, {
          cycleId: activeCycleId,
          stage: 'overdue',
          scheduledFor: addDays(previousDue, 1),
          dueDate: previousDue,
          title: `${card.name} is overdue`,
          subtitle: `Due ${formatFullDate(previousDue)} · mark settled when handled`,
          tone: 'danger',
        })
      );
    }

    if (card.extendedTracking?.manualDate) {
      const extendedDate = new Date(card.extendedTracking.manualDate);
      const extendedCycleId = `${card.id}:${formatDateKey(previousDue)}`;
      reminders.push(
        buildReminder(card, {
          cycleId: extendedCycleId,
          stage: 'extended',
          scheduledFor: extendedDate,
          dueDate: extendedDate,
          title: `${card.name} extended follow-up`,
          subtitle: `${card.provider} · Manual extension ${formatFullDate(extendedDate)}`,
          tone: 'success',
        })
      );
    }
  });

  return reminders
    .filter((reminder) => {
      if (reminder.isSettled && reminder.stage !== 'billing') {
        return false;
      }
      if (reminder.snoozedUntil && new Date(reminder.snoozedUntil) > now) {
        return false;
      }
      if (reminder.stage === 'overdue') {
        return true;
      }

      return new Date(reminder.scheduledFor) >= addDays(today, -2);
    })
    .sort(
      (left, right) =>
        new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime()
    );
}

export function getReminderMetrics(cards: Card[], reminders: DerivedReminder[]) {
  return {
    cardCount: cards.length,
    activeCount: reminders.length,
    overdueCount: reminders.filter((item) => item.stage === 'overdue').length,
    extendedCount: reminders.filter((item) => item.stage === 'extended').length,
  };
}