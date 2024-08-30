import { ThemeProvider } from "@/components/common/ThemeProvider";
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from "react-router-dom";

import LoginPage from "./pages/authentication/LoginPage";
import CustomerPage from "./pages/common/CustomerPage";
import DashboardPage from "./pages/common/DashboardPage";
import ErrorPage from "./pages/common/ErrorPage";
import OrdersPage from "./pages/common/OrdersPage";
import ProductsPage from "./pages/common/ProductsPage";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route index element={<DashboardPage />} />
			<Route path="auth/login" element={<LoginPage />} />
			<Route path="orders" element={<OrdersPage />} />
			<Route path="products" element={<ProductsPage />} />
			<Route path="customers" element={<CustomerPage />} />
			<Route path="*" element={<ErrorPage />} />
		</Route>,
	),
);

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<RouterProvider router={router} />
		</ThemeProvider>
	);
}

export default App;
