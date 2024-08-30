import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import CustomerTable from "./CustomersTable";

export default function CustomerList() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Customers</CardTitle>
				<CardDescription>
					Manage your customers and view their details and activity.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<CustomerTable />{" "}
				{/* Make sure to create a CustomerTable component similar to ProductTable */}
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>50</strong> customers{" "}
					{/* Adjust the numbers as needed */}
				</div>
			</CardFooter>
		</Card>
	);
}
