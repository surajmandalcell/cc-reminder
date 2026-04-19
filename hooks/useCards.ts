import type { PropsWithChildren } from 'react';
import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';

import { providerTemplates } from '@/data/providerTemplates';
import type { Card, CardDraft } from '@/types/domain';
import { syncReminderNotifications } from '@/utils/notifications';
import { loadJson, saveJson, storageKeys } from '@/utils/storage';

const WARNING_VERSION = 'v1';

function normalizeDay(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return undefined;
  }

  return Math.max(1, Math.min(28, Math.trunc(number)));
}

export function validateCardDraft(draft: CardDraft) {
  if (!draft.name.trim()) return 'Card name is required.';
  if (!draft.provider.trim()) return 'Provider is required.';
  if (!/^\d{4}$/.test(draft.last4.trim())) return 'Last 4 digits must be exactly four numbers.';

  const dueDay = normalizeDay(draft.dueDay);
  if (!dueDay) return 'Due day is required.';

  if (draft.extendedTrackingEnabled) {
    if (!draft.extendedDate.trim()) return 'Extended tracking needs a manual date.';
    if (!draft.acknowledgmentAccepted) return 'You must accept the extended tracking acknowledgment.';
  }

  return null;
}

function toCard(draft: CardDraft, existing?: Card): Card {
  const now = new Date().toISOString();
  const billingDay = normalizeDay(draft.billingDay);
  const dueDay = normalizeDay(draft.dueDay) ?? 1;
  const tags = draft.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);

  const selectedTemplate = providerTemplates.find((template) => template.id === draft.providerTemplateId);

  return {
    id: existing?.id ?? `${Date.now()}`,
    name: draft.name.trim(),
    provider: draft.provider.trim(),
    last4: draft.last4.trim(),
    billingDay,
    dueDay,
    tags,
    notificationsEnabled: draft.notificationsEnabled,
    extendedTracking: draft.extendedTrackingEnabled
      ? {
          providerTemplateId: draft.providerTemplateId,
          manualDate: draft.extendedDate.trim(),
          acknowledgedAt: existing?.extendedTracking?.acknowledgedAt ?? now,
          warningVersion: WARNING_VERSION,
          paidAmountNote: draft.paidAmountNote.trim() || selectedTemplate?.hint,
        }
      : undefined,
    reminderState: existing?.reminderState ?? {},
    paymentState: existing?.paymentState ?? {},
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function createDefaultDraft(): CardDraft {
  return {
    name: '',
    provider: '',
    last4: '',
    billingDay: '',
    dueDay: '',
    tags: '',
    notificationsEnabled: true,
    extendedTrackingEnabled: false,
    providerTemplateId: undefined,
    extendedDate: '',
    acknowledgmentAccepted: false,
    paidAmountNote: '',
  };
}

export function mapCardToDraft(card: Card): CardDraft {
  return {
    name: card.name,
    provider: card.provider,
    last4: card.last4,
    billingDay: card.billingDay ? String(card.billingDay) : '',
    dueDay: String(card.dueDay),
    tags: card.tags.join(', '),
    notificationsEnabled: card.notificationsEnabled,
    extendedTrackingEnabled: Boolean(card.extendedTracking),
    providerTemplateId: card.extendedTracking?.providerTemplateId,
    extendedDate: card.extendedTracking?.manualDate ?? '',
    acknowledgmentAccepted: Boolean(card.extendedTracking),
    paidAmountNote: card.extendedTracking?.paidAmountNote ?? '',
  };
}

function useCardsState() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      const storedCards = await loadJson<Card[]>(storageKeys.cards, []);
      if (!isMounted) return;
      setCards(storedCards);
      setIsReady(true);
      await syncReminderNotifications(storedCards);
    }

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  async function persist(nextCards: Card[]) {
    setCards(nextCards);
    await saveJson(storageKeys.cards, nextCards);
    await syncReminderNotifications(nextCards.filter((card) => card.notificationsEnabled));
  }

  async function createCard(draft: CardDraft) {
    const error = validateCardDraft(draft);
    if (error) return error;
    await persist([toCard(draft), ...cards]);
    return null;
  }

  async function updateCard(id: string, draft: CardDraft) {
    const error = validateCardDraft(draft);
    if (error) return error;

    const nextCards = cards.map((card) => (card.id === id ? toCard(draft, card) : card));
    await persist(nextCards);
    return null;
  }

  async function deleteCard(id: string) {
    await persist(cards.filter((card) => card.id !== id));
  }

  async function acknowledgeReminder(cardId: string, reminderId: string) {
    const nextCards = cards.map((card) => {
      if (card.id !== cardId) return card;
      return {
        ...card,
        reminderState: {
          ...card.reminderState,
          [reminderId]: {
            ...card.reminderState[reminderId],
            acknowledgedAt: new Date().toISOString(),
            snoozedUntil: undefined,
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });

    await persist(nextCards);
  }

  async function snoozeReminder(cardId: string, reminderId: string, hours = 24) {
    const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const nextCards = cards.map((card) => {
      if (card.id !== cardId) return card;
      return {
        ...card,
        reminderState: {
          ...card.reminderState,
          [reminderId]: {
            ...card.reminderState[reminderId],
            snoozedUntil,
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });

    await persist(nextCards);
  }

  async function settleCycle(cardId: string, cycleId: string) {
    const nextCards = cards.map((card) => {
      if (card.id !== cardId) return card;
      return {
        ...card,
        paymentState: {
          ...card.paymentState,
          [cycleId]: {
            settledAt: new Date().toISOString(),
          },
        },
        updatedAt: new Date().toISOString(),
      };
    });

    await persist(nextCards);
  }

  const tagPool = useMemo(
    () => Array.from(new Set(cards.flatMap((card) => card.tags))).sort((left, right) => left.localeCompare(right)),
    [cards],
  );

  return {
    cards,
    isReady,
    tagPool,
    defaultDraft: createDefaultDraft,
    createCard,
    updateCard,
    deleteCard,
    acknowledgeReminder,
    snoozeReminder,
    settleCycle,
  };
}

type CardsContextValue = ReturnType<typeof useCardsState>;

const CardsContext = createContext<CardsContextValue | null>(null);

export function CardsProvider({ children }: PropsWithChildren) {
  const value = useCardsState();
  return createElement(CardsContext.Provider, { value }, children);
}

export function useCards() {
  const value = useContext(CardsContext);

  if (!value) {
    throw new Error('useCards must be used inside CardsProvider');
  }

  return value;
}