import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useQuickNotes } from "@/hooks/useQuickNotes";
import { storageKeys } from "@/utils/storage";

describe("useQuickNotes", () => {
	it("hydrates, adds trimmed notes, and deletes notes", async () => {
		await AsyncStorage.setItem(
			storageKeys.quickNotes,
			JSON.stringify([{ id: "seed", body: "Existing", createdAt: "2026-04-20T09:00:00.000Z" }]),
		);

		const { result } = renderHook(() => useQuickNotes());

		await waitFor(() => expect(result.current.isReady).toBe(true));
		expect(result.current.notes).toHaveLength(1);

		await act(async () => {
			expect(await result.current.addNote("   ")).toBe(false);
			expect(await result.current.addNote("  New note  ")).toBe(true);
		});

		expect(result.current.notes[0].body).toBe("New note");

		await act(async () => {
			await result.current.deleteNote("seed");
		});

		expect(result.current.notes.some((item) => item.id === "seed")).toBe(false);
	});
});