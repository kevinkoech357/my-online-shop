import { OrdersSummary } from "../orders/OrderSummary";
import { OrdersTable } from "../orders/OrdersTable";
import SingleOrder from "../orders/SingleOrder";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function Dashboard() {
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<Sidebar />
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<Header />
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
					<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
						<OrdersSummary />
						<OrdersTable />
					</div>
					<div>
						<SingleOrder />
					</div>
				</main>
			</div>
		</div>
	);
}
