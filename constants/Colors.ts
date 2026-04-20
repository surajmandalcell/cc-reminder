const Colors = {
	light: {
		text: "#111111",
		background: "#ffffff",
		tint: "#111111",
		tabIconDefault: "#6f6a61",
		tabIconSelected: "#111111",
		card: "#fbfaf6",
		cardAlt: "#eeebe3",
		border: "#111111",
		muted: "#4f4a42",
		accent: "#111111",
		danger: "#8b1e1e",
		warning: "#6f5600",
		success: "#1f5b31",
		hero: "#f7f5ef",
		glow: "rgba(0, 0, 0, 0)",
		overlay: "rgba(17, 17, 17, 0.03)",
	},
	dark: {
		text: "#f5f1e8",
		background: "#121212",
		tint: "#f5f1e8",
		tabIconDefault: "#938d82",
		tabIconSelected: "#f5f1e8",
		card: "#1a1a1a",
		cardAlt: "#222222",
		border: "#f5f1e8",
		muted: "#b9b1a3",
		accent: "#f5f1e8",
		danger: "#ff8e8e",
		warning: "#d4be68",
		success: "#87d69a",
		hero: "#181818",
		glow: "rgba(255, 255, 255, 0)",
		overlay: "rgba(255, 255, 255, 0.04)",
	},
} as const;

export type AppPalette = (typeof Colors)[keyof typeof Colors];

export default Colors;
