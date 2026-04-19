module.exports = {
	preset: "jest-expo",
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	collectCoverageFrom: [
		"app/**/*.{ts,tsx}",
		"components/**/*.{ts,tsx}",
		"hooks/**/*.{ts,tsx}",
		"utils/**/*.{ts,tsx}",
		"data/**/*.{ts,tsx}",
		"!**/*.d.ts",
		"!components/__tests__/**",
	],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};