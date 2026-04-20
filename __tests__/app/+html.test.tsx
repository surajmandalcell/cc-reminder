import React from "react";

import Root from "@/app/+html";

describe("Root HTML wrapper", () => {
	it("renders the expected html shell", () => {
		const element = Root({ children: React.createElement("div", null, "child") });
		const [head, body] = element.props.children;

		expect(element.props.lang).toBe("en");
		expect(head.type).toBe("head");
		expect(body.type).toBe("body");
	});
});