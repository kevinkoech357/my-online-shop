import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/uiComponents";
import {
	Home,
	LineChart,
	Package,
	Settings,
	ShoppingCart,
	Users2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
	const location = useLocation();

	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/"
								className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${location.pathname === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								<Home className="h-5 w-5" />
								<span className="sr-only">Dashboard</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Dashboard</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/orders"
								className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${location.pathname === "/orders" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								<ShoppingCart className="h-5 w-5" />
								<span className="sr-only">Orders</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Orders</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/products"
								className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${location.pathname === "/products" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								<Package className="h-5 w-5" />
								<span className="sr-only">Products</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Products</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/customers"
								className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${location.pathname === "/customers" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								<Users2 className="h-5 w-5" />
								<span className="sr-only">Customers</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Customers</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/analytics"
								className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${location.pathname === "/analytics" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								<LineChart className="h-5 w-5" />
								<span className="sr-only">Analytics</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Analytics</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to="/settings"
								className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${location.pathname === "/settings" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
							>
								<Settings className="h-5 w-5" />
								<span className="sr-only">Settings</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side="right">Settings</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</nav>
		</aside>
	);
}
