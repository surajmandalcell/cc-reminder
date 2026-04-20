export const spacing = {
	xs: 8,
	sm: 12,
	md: 16,
	lg: 20,
	xl: 24,
	xxl: 32,
} as const;

export const radius = {
	sm: 0,
	md: 0,
	lg: 0,
	xl: 0,
} as const;

export const motion = {
	fast: 140,
	normal: 220,
	slow: 320,
} as const;

export const shadow = {
	soft: {
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 0,
	},
	medium: {
		shadowOffset: { width: 0, height: 14 },
		shadowOpacity: 0,
		shadowRadius: 0,
		elevation: 0,
	},
} as const;
