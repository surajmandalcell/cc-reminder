import {
	addDays,
	getNextOccurrence,
	getPreviousOccurrence,
	getPreviousOccurrenceFromReference,
	relativeDayLabel,
	startOfDay,
} from "@/utils/date";

describe("date utils", () => {
	it("normalizes a date to the start of day", () => {
		const result = startOfDay(new Date(2026, 3, 20, 16, 30, 22));

		expect(result).toEqual(new Date(2026, 3, 20));
	});

	it("adds day offsets from the normalized day", () => {
		const result = addDays(new Date(2026, 3, 20, 16, 30, 22), 2);

		expect(result).toEqual(new Date(2026, 3, 22));
	});

	it("returns friendly relative day labels", () => {
		const now = new Date(2026, 3, 20);

		expect(relativeDayLabel(new Date(2026, 3, 20), now)).toBe("Today");
		expect(relativeDayLabel(new Date(2026, 3, 21), now)).toBe("Tomorrow");
		expect(relativeDayLabel(new Date(2026, 3, 19), now)).toBe("Yesterday");
		expect(relativeDayLabel(new Date(2026, 3, 25), now)).toBe("In 5 days");
		expect(relativeDayLabel(new Date(2026, 3, 18), now)).toBe("2 days ago");
	});

	it("clamps next occurrences to the nearest valid day in short months", () => {
		const result = getNextOccurrence(31, new Date(2026, 3, 1));

		expect(result).toEqual(new Date(2026, 3, 30));
	});

	it("returns the previous clamped occurrence when the current month has already passed", () => {
		const result = getPreviousOccurrence(31, new Date(2026, 4, 1));

		expect(result).toEqual(new Date(2026, 3, 30));
	});

	it("finds the previous month reference date when the current month candidate is ahead", () => {
		const result = getPreviousOccurrenceFromReference(31, new Date(2026, 1, 15));

		expect(result).toEqual(new Date(2026, 0, 31));
	});
});