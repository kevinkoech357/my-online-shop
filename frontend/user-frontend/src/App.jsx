import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";
import React from "react";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import ProductLayout from "./layouts/ProductLayout";
import RootLayout from "./layouts/RootLayout";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import LoginPage from "./pages/authentication/LoginPage";
import OTPVerifyPage from "./pages/authentication/OTPVerifyPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import ErrorPage from "./pages/general/ErrorPage";
import Home from "./pages/general/Home";
import ProductDetailsPage from "./pages/products/ProductDetailsPage";
import ProductsPage from "./pages/products/ProductsPage";
import theme from "./theme";

const GlobalStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap");
`;

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Home />} />
			<Route path="products" element={<ProductLayout />}>
				<Route index element={<ProductsPage />} />
				<Route path=":slug" element={<ProductDetailsPage />} />
			</Route>
			<Route path="auth" element={<AuthLayout />}>
				<Route path="register" element={<RegisterPage />} />
				<Route path="login" element={<LoginPage />} />
				<Route path="verify-email" element={<OTPVerifyPage />} />
				<Route path="forgot-password" element={<ForgotPasswordPage />} />
				<Route path="reset-password" element={<ResetPasswordPage />} />
			</Route>
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
