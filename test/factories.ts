import type { Card, CardDraft } from "@/types/domain";

export function makeCard(overrides: Partial<Card> = {}): Card {
	return {
		id: "card-1",
		name: "Everyday Gold",
		provider: "American Express",
		last4: "1234",
		billingDay: 1,
		dueDay: 25,
		tags: ["travel", "daily"],
		notificationsEnabled: true,
		extendedTracking: undefined,
		reminderState: {},
		paymentState: {},
		createdAt: "2026-04-01T00:00:00.000Z",
		updatedAt: "2026-04-01T00:00:00.000Z",
		...overrides,
	};
}

export function makeDraft(overrides: Partial<CardDraft> = {}): CardDraft {
	return {
		name: "Everyday Gold",
		provider: "American Express",
		last4: "1234",
		billingDay: "1",
		dueDay: "25",
		tags: "travel, daily",
		notificationsEnabled: true,
		extendedTrackingEnabled: false,
		providerTemplateId: undefined,
		extendedDate: "",
		acknowledgmentAccepted: false,
		paidAmountNote: "",
		...overrides,
	};
}