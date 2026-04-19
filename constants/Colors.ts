const tintColorLight = '#2563eb';
const tintColorDark = '#93c5fd';

const Colors = {
	light: {
		text: '#102033',
		background: '#f4f7fb',
		tint: tintColorLight,
		tabIconDefault: '#94a3b8',
		tabIconSelected: tintColorLight,
		card: '#ffffff',
		cardAlt: '#eef4fb',
		border: '#d8e2f0',
		muted: '#64748b',
		accent: '#0f766e',
		danger: '#dc2626',
		warning: '#d97706',
		success: '#15803d',
		hero: '#dbeafe',
		glow: 'rgba(37, 99, 235, 0.12)',
		overlay: 'rgba(15, 23, 42, 0.06)',
	},
	dark: {
		text: '#e5eef8',
		background: '#020817',
		tint: tintColorDark,
		tabIconDefault: '#64748b',
		tabIconSelected: tintColorDark,
		card: '#0c1728',
		cardAlt: '#132238',
		border: '#1d304a',
		muted: '#94a3b8',
		accent: '#2dd4bf',
		danger: '#f87171',
		warning: '#fbbf24',
		success: '#4ade80',
		hero: '#0f2040',
		glow: 'rgba(147, 197, 253, 0.18)',
		overlay: 'rgba(15, 23, 42, 0.38)',
	},
} as const;

export type AppPalette = (typeof Colors)['light'];

export default Colors;
