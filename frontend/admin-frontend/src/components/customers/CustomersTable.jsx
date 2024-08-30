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

export default function CustomerTable() {
	const customers = [
		{
			id: 1,
			name: "John Doe",
			status: "Active",
			email: "john.doe@example.com",
			purchases: 10,
			registered: "2023-05-12",
		},
		{
			id: 2,
			name: "Jane Smith",
			status: "Inactive",
			email: "jane.smith@example.com",
			purchases: 5,
			registered: "2023-06-22",
		},
		// Add more customers as needed
	];

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Email</TableHead>
					<TableHead className="hidden md:table-cell">Purchases</TableHead>
					<TableHead className="hidden md:table-cell">Registered</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{customers.map((customer) => (
					<TableRow key={customer.id}>
						<TableCell className="font-medium">{customer.name}</TableCell>
						<TableCell>
							<Badge variant="outline">{customer.status}</Badge>
						</TableCell>
						<TableCell>{customer.email}</TableCell>
						<TableCell className="hidden md:table-cell">
							{customer.purchases}
						</TableCell>
						<TableCell className="hidden md:table-cell">
							{customer.registered}
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
