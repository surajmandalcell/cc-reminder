import AsyncStorage from "@react-native-async-storage/async-storage";

import { loadJson, saveJson } from "@/utils/storage";

describe("storage utils", () => {
	it("returns fallback for missing or invalid JSON values", async () => {
		expect(await loadJson("missing", ["fallback"])).toEqual(["fallback"]);

		await AsyncStorage.setItem("broken", "{");
		expect(await loadJson("broken", { ok: false })).toEqual({ ok: false });
	});

	it("saves JSON values into storage", async () => {
		await saveJson("cards", [{ id: 1 }]);

		expect(await AsyncStorage.getItem("cards")).toBe(JSON.stringify([{ id: 1 }]));
	});
});