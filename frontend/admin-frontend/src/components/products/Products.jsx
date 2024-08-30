import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "../common/Header";
import { Sidebar } from "../common/Sidebar";
import ProductActions from "./ProductActions";
import ProductList from "./ProductList";

export function Products() {
	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<Sidebar />
			<div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
				<Header />
				<section className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
							<ProductActions />
						</div>
						<TabsContent value="all">
							<ProductList />
						</TabsContent>
					</Tabs>
				</section>
			</div>
		</div>
	);
}
