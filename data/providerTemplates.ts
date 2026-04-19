import type { ProviderTemplate } from "@/types/domain";

export const providerTemplates: ProviderTemplate[] = [
	{
		id: "amex-flex",
		provider: "American Express",
		title: "Amex flexible follow-up",
		hint: "Some Amex customers track a short extra window after minimum payment or issuer-specific relief, but rules can differ by card and account state.",
		typicalExtraDays: 7,
		disclaimer:
			"Advisory only. Verify the actual outcome and timing with your issuer before relying on any extended window.",
	},
	{
		id: "chase-caution",
		provider: "Chase",
		title: "Chase caution template",
		hint: "Useful when you want a manual extended memory date, but not as a claim about grace, reporting, or fee treatment.",
		typicalExtraDays: 5,
		disclaimer:
			"Reference only. This app does not verify Chase policy and cannot guarantee fee or bureau outcomes.",
	},
	{
		id: "discover-manual",
		provider: "Discover",
		title: "Manual extension placeholder",
		hint: "Use this when you want a disciplined manual follow-up date after talking to support or reading your card terms.",
		typicalExtraDays: 10,
		disclaimer:
			"Reference only. Always confirm the date and consequence directly with the issuer.",
	},
];
