import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import OrderActions from "@/components/orders/OrderActions";
import Orders from "@/components/orders/Orders";
import SingleOrder from "@/components/orders/SingleOrder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrdersPage = () => {
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<Sidebar />
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<Header />
				<section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
					<div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
						<Tabs defaultValue="all">
							<div className="flex items-center">
								<TabsList>
									<TabsTrigger value="all">All</TabsTrigger>
									<TabsTrigger value="active">Active</TabsTrigger>
									<TabsTrigger value="draft">Draft</TabsTrigger>
									<TabsTrigger value="archived" className="hidden sm:flex">
										Archived
									</TabsTrigger>
								</TabsList>
								<OrderActions />
							</div>
							<TabsContent value="all">
								<Orders />
							</TabsContent>
						</Tabs>
					</div>
					<div>
						<SingleOrder />
					</div>
				</section>
			</div>
		</div>
	);
};

export default OrdersPage;
