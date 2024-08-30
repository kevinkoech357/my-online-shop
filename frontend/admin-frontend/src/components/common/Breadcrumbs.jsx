import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/uiComponents";
import { Link, useLocation } from "react-router-dom";

export function Breadcrumbs() {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);

	return (
		<Breadcrumb className="hidden md:flex">
			<BreadcrumbList>
				{/* Home Link */}
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link to="/">Dashboard</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />

				{/* Generate breadcrumbs based on the route */}
				{pathnames.map((value, index) => {
					const to = `/${pathnames.slice(0, index + 1).join("/")}`;
					const isLast = index === pathnames.length - 1;

					return (
						<BreadcrumbItem key={to} iscurrentpage={isLast.toString()}>
							{isLast ? (
								<BreadcrumbLink>{value}</BreadcrumbLink>
							) : (
								<BreadcrumbLink asChild>
									<Link to={to}>{value}</Link>
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
