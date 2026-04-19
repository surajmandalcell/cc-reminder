import { useClientOnlyValue } from "@/components/useClientOnlyValue";

describe("useClientOnlyValue native helper", () => {
	it("returns the client value on native", () => {
		expect(useClientOnlyValue("server", "client")).toBe("client");
	});
});