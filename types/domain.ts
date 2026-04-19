export type ReminderStageKind =
	| "billing"
	| "due-soon-7"
	| "due-soon-3"
	| "due-soon-1"
	| "due-today"
	| "overdue"
	| "extended";

export type ReminderInteractionState = {
	acknowledgedAt?: string;
	snoozedUntil?: string;
};

export type PaymentCycleState = {
	settledAt?: string;
};

export type ExtendedTracking = {
	providerTemplateId?: string;
	manualDate: string;
	acknowledgedAt: string;
	warningVersion: string;
	paidAmountNote?: string;
};

export type Card = {
	id: string;
	name: string;
	provider: string;
	last4: string;
	billingDay?: number;
	dueDay: number;
	tags: string[];
	notificationsEnabled: boolean;
	extendedTracking?: ExtendedTracking;
	reminderState: Record<string, ReminderInteractionState>;
	paymentState: Record<string, PaymentCycleState>;
	createdAt: string;
	updatedAt: string;
};

export type CardDraft = {
	name: string;
	provider: string;
	last4: string;
	billingDay: string;
	dueDay: string;
	tags: string;
	notificationsEnabled: boolean;
	extendedTrackingEnabled: boolean;
	providerTemplateId?: string;
	extendedDate: string;
	acknowledgmentAccepted: boolean;
	paidAmountNote: string;
};

export type ProviderTemplate = {
	id: string;
	provider: string;
	title: string;
	hint: string;
	typicalExtraDays?: number;
	disclaimer: string;
};

export type DerivedReminder = {
	id: string;
	cycleId: string;
	cardId: string;
	cardName: string;
	provider: string;
	stage: ReminderStageKind;
	title: string;
	subtitle: string;
	scheduledFor: string;
	dueDate: string;
	tone: "accent" | "warning" | "danger" | "neutral" | "success";
	isAcknowledged: boolean;
	isSettled: boolean;
	snoozedUntil?: string;
};
