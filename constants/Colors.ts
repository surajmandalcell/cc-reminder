const Colors = {
	light: {
		text: "#111111",
		background: "#ffffff",
		tint: "#111111",
		tabIconDefault: "#666666",
		tabIconSelected: "#111111",
		card: "#ffffff",
		cardAlt: "#f5f5f5",
		border: "#d0d0d0",
		muted: "#555555",
		accent: "#111111",
		danger: "#b00020",
		warning: "#7a5c00",
		success: "#1d5f2d",
		hero: "#f5f5f5",
		glow: "rgba(0, 0, 0, 0)",
		overlay: "rgba(0, 0, 0, 0.04)",
	},
	dark: {
		text: "#f5f5f5",
		background: "#111111",
		tint: "#f5f5f5",
		tabIconDefault: "#999999",
		tabIconSelected: "#f5f5f5",
		card: "#1b1b1b",
		cardAlt: "#232323",
		border: "#3d3d3d",
		muted: "#b0b0b0",
		accent: "#f5f5f5",
		danger: "#ff7a7a",
		warning: "#d2b04c",
		success: "#7dd48d",
		hero: "#1b1b1b",
		glow: "rgba(255, 255, 255, 0)",
		overlay: "rgba(255, 255, 255, 0.04)",
	},
} as const;

export type AppPalette = (typeof Colors)[keyof typeof Colors];

export default Colors;
