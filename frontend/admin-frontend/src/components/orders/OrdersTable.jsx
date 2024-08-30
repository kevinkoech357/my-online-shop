import Orders from "@/components/orders/Orders";
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/uiComponents";
import { File, ListFilter } from "lucide-react";

export const OrdersTable = () => (
	<Tabs defaultValue="week">
		<div className="flex items-center">
			<TabsList>
				<TabsTrigger value="week">Week</TabsTrigger>
				<TabsTrigger value="month">Month</TabsTrigger>
				<TabsTrigger value="year">Year</TabsTrigger>
			</TabsList>
			<div className="ml-auto flex items-center gap-2">
				<FilterDropdown />
				<ExportButton />
			</div>
		</div>
		<TabsContent value="week">
			<Orders />
		</TabsContent>
	</Tabs>
);

const FilterDropdown = () => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
				<ListFilter className="h-3.5 w-3.5" />
				<span className="sr-only sm:not-sr-only">Filter</span>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>Filter by</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
			<DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
			<DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

const ExportButton = () => (
	<Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
		<File className="h-3.5 w-3.5" />
		<span className="sr-only sm:not-sr-only">Export</span>
	</Button>
);
