import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import theme from "./theme";

const GlobalStyles = css`
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');`;

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Home />} />
			<Route path="*" element={<ErrorPage />} />
		</Route>,
	),
);

function App() {
	return (
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<Global styles={GlobalStyles} />
			<RouterProvider router={router} />
		</ChakraProvider>
	);
}

export default App;
