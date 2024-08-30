import React, { createContext, useContext, useEffect, useState } from "react";

// Define the types for theme and props
const initialState = {
	theme: "system",
	setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "vite-ui-theme",
	...props
}) {
	// State to manage the current theme
	const [theme, setTheme] = useState(
		() => localStorage.getItem(storageKey) || defaultTheme,
	);

	// Effect to update the document's class list based on the theme
	useEffect(() => {
		const root = document.documentElement;

		root.classList.remove("light", "dark");

		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";

			root.classList.add(systemTheme);
			return;
		}

		root.classList.add(theme);
	}, [theme]);

	// Value to be provided by the context
	const value = {
		theme,
		setTheme: (newTheme) => {
			localStorage.setItem(storageKey, newTheme);
			setTheme(newTheme);
		},
	};

	// Provide the context to children
	return (
		<ThemeProviderContext.Provider value={value} {...props}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

// Custom hook to use the theme context
export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return context;
};
