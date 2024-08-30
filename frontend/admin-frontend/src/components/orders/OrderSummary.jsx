import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
} from "@/components/uiComponents";

export const OrdersSummary = () => (
	<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
		<Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
			<CardHeader className="pb-3">
				<CardTitle>Your Orders</CardTitle>
				<CardDescription className="text-balance max-w-lg leading-relaxed">
					Introducing Our Dynamic Orders Dashboard for Seamless Management and
					Insightful Analysis.
				</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button>Create New Order</Button>
			</CardFooter>
		</Card>
		<SummaryCard
			title="This Week"
			amount="$1,329"
			change="+25%"
			changeValue={25}
			period="week"
		/>
		<SummaryCard
			title="This Month"
			amount="$5,329"
			change="+10%"
			changeValue={12}
			period="month"
		/>
	</div>
);

const SummaryCard = ({ title, amount, change, changeValue, period }) => (
	<Card>
		<CardHeader className="pb-2">
			<CardDescription>{title}</CardDescription>
			<CardTitle className="text-4xl">{amount}</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="text-xs text-muted-foreground">
				{change} from last {period}
			</div>
		</CardContent>
		<CardFooter>
			<Progress value={changeValue} aria-label={`${changeValue}% increase`} />
		</CardFooter>
	</Card>
);
