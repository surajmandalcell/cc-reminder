import { ActivityIndicator } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import NotesScreen from "@/app/(tabs)/notes";

const mockAddNote = jest.fn(async () => true);
const mockDeleteNote = jest.fn(async () => undefined);
const mockUseQuickNotes = jest.fn();

jest.mock("@/hooks/useQuickNotes", () => ({
	useQuickNotes: () => mockUseQuickNotes(),
}));

describe("NotesScreen", () => {
	it("saves and deletes notes", async () => {
		mockUseQuickNotes.mockReturnValue({
			notes: [
				{ id: "1", body: "Call support", createdAt: "2026-04-20T09:00:00.000Z" },
			],
			isReady: true,
			addNote: mockAddNote,
			deleteNote: mockDeleteNote,
		});

		render(<NotesScreen />);

		fireEvent.changeText(screen.getByPlaceholderText("Write a reminder to your future self"), "Track statement");
		fireEvent.press(screen.getByText("Save note"));

		await waitFor(() => expect(mockAddNote).toHaveBeenCalledWith("Track statement"));

		fireEvent.press(screen.getByText("Delete"));
		await waitFor(() => expect(mockDeleteNote).toHaveBeenCalledWith("1"));
	});

	it("shows loading and empty states", () => {
		mockUseQuickNotes.mockReturnValue({
			notes: [],
			isReady: false,
			addNote: mockAddNote,
			deleteNote: mockDeleteNote,
		});

		const { rerender, UNSAFE_getByType } = render(<NotesScreen />);
		expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();

		mockUseQuickNotes.mockReturnValue({
			notes: [],
			isReady: true,
			addNote: mockAddNote,
			deleteNote: mockDeleteNote,
		});

		rerender(<NotesScreen />);
		expect(screen.getByText("No notes yet")).toBeOnTheScreen();
	});
});