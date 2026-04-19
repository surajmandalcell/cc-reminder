import type { ProviderTemplate } from "@/types/domain";

export const providerTemplates: ProviderTemplate[] = [
	{
		id: "amex-flex",
		provider: "American Express",
		title: "Amex reference template",
		hint: "Use this only as a memory aid after you confirm the real dates and consequences with Amex for your specific account.",
		typicalExtraDays: 7,
		disclaimer:
			"Advisory only. CC Reminder does not verify issuer policy, late fees, grace treatment, or credit reporting outcomes.",
	},
];
