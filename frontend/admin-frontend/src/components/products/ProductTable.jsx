import {
	Badge,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/uiComponents";
import { MoreHorizontal } from "lucide-react";

export default function ProductTable() {
	const products = [
		{
			id: 1,
			name: "Laser Lemonade Machine",
			status: "Draft",
			price: "$499.99",
			sales: 25,
			created: "2023-07-12 10:42 AM",
		},
		{
			id: 2,
			name: "Hypernova Headphones",
			status: "Active",
			price: "$129.99",
			sales: 100,
			created: "2023-10-18 03:21 PM",
		},
		{
			id: 3,
			name: "AeroGlow Desk Lamp",
			status: "Active",
			price: "$39.99",
			sales: 50,
			created: "2023-11-29 08:15 AM",
		},
		{
			id: 4,
			name: "TechTonic Energy Drink",
			status: "Draft",
			price: "$2.99",
			sales: 0,
			created: "2023-12-25 11:59 PM",
		},
		{
			id: 5,
			name: "Gamer Gear Pro Controller",
			status: "Active",
			price: "$59.99",
			sales: 75,
			created: "2024-01-01 12:00 AM",
		},
		{
			id: 6,
			name: "Luminous VR Headset",
			status: "Active",
			price: "$199.99",
			sales: 30,
			created: "2024-02-14 02:14 PM",
		},
	];

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="hidden w-[100px] sm:table-cell">
						<span className="sr-only">Image</span>
					</TableHead>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Price</TableHead>
					<TableHead className="hidden md:table-cell">Total Sales</TableHead>
					<TableHead className="hidden md:table-cell">Created at</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{products.map((product) => (
					<TableRow key={product.id}>
						<TableCell className="hidden sm:table-cell">
							<img
								alt="images"
								className="aspect-square rounded-md object-cover"
								height="64"
								src="/placeholder.webp"
								width="64"
							/>
						</TableCell>
						<TableCell className="font-medium">{product.name}</TableCell>
						<TableCell>
							<Badge variant="outline">{product.status}</Badge>
						</TableCell>
						<TableCell>{product.price}</TableCell>
						<TableCell className="hidden md:table-cell">
							{product.sales}
						</TableCell>
						<TableCell className="hidden md:table-cell">
							{product.created}
						</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button aria-haspopup="true" size="icon" variant="ghost">
										<MoreHorizontal className="h-4 w-4" />
										<span className="sr-only">Toggle menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem>Delete</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
