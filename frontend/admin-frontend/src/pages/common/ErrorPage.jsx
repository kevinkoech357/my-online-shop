import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			<Sidebar />
			<div className="flex flex-col w-full sm:pl-14 mt-4">
				<Header />
				<hr className="mt-4" />
				<div className="flex flex-1 items-center justify-center p-4">
					<div className="text-center p-8 max-w-md w-full">
						<AlertCircle className="mx-auto h-16 w-16 text-red-500" />
						<h1 className="mt-6 text-3xl font-bold tracking-tight text-primary">
							Oops! Something went wrong.
						</h1>
						<p className="mt-4 text-lg text-muted-foreground">
							{error?.message || "An unexpected error occurred."}
						</p>
						<div className="mt-8">
							<Button onClick={() => navigate("/")}>Go back home</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
