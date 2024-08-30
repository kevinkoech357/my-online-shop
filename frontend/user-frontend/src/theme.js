import { extendTheme } from "@chakra-ui/react";

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config,
	fonts: {
		heading: "Lato, sans-serif",
		body: "Lato, sans-serif",
	},
});

export default theme;
