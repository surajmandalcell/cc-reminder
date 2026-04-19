const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function startOfDay(value: Date) {
	return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function addDays(value: Date, days: number) {
	return new Date(startOfDay(value).getTime() + days * DAY_IN_MS);
}

export function formatDateKey(value: Date) {
	return value.toISOString().slice(0, 10);
}

export function formatShortDate(value: string | Date) {
	const date = typeof value === "string" ? new Date(value) : value;
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
	}).format(date);
}

export function formatFullDate(value: string | Date) {
	const date = typeof value === "string" ? new Date(value) : value;
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(date);
}

export function relativeDayLabel(value: string | Date, now = new Date()) {
	const date = typeof value === "string" ? new Date(value) : value;
	const difference = Math.round(
		(startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_IN_MS,
	);

	if (difference === 0) return "Today";
	if (difference === 1) return "Tomorrow";
	if (difference === -1) return "Yesterday";
	if (difference > 1) return `In ${difference} days`;
	return `${Math.abs(difference)} days ago`;
}

function getDaysInMonth(year: number, monthIndex: number) {
	return new Date(year, monthIndex + 1, 0).getDate();
}

function createMonthDate(
	year: number,
	monthIndex: number,
	preferredDay: number,
) {
	const validDay = Math.min(preferredDay, getDaysInMonth(year, monthIndex));
	return new Date(year, monthIndex, validDay);
}

export function getNextOccurrence(day: number, now = new Date()) {
	const today = startOfDay(now);
	const currentMonthCandidate = createMonthDate(
		today.getFullYear(),
		today.getMonth(),
		day,
	);

	if (currentMonthCandidate >= today) {
		return currentMonthCandidate;
	}

	return createMonthDate(today.getFullYear(), today.getMonth() + 1, day);
}

export function getPreviousOccurrence(day: number, now = new Date()) {
	const today = startOfDay(now);
	const currentMonthCandidate = createMonthDate(
		today.getFullYear(),
		today.getMonth(),
		day,
	);

	if (currentMonthCandidate <= today) {
		return currentMonthCandidate;
	}

	return createMonthDate(today.getFullYear(), today.getMonth() - 1, day);
}

export function getPreviousOccurrenceFromReference(
	day: number,
	reference: Date,
) {
	const candidate = createMonthDate(
		reference.getFullYear(),
		reference.getMonth(),
		day,
	);
	if (candidate <= reference) {
		return candidate;
	}

	return createMonthDate(
		reference.getFullYear(),
		reference.getMonth() - 1,
		day,
	);
}
