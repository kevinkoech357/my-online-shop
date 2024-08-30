import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
} from "@/components/uiComponents";

export function LoginForm() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Admin Login</CardTitle>
					<CardDescription>
						Enter your email and password below to login to your account.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<Input id="password" type="password" required />
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full">
						Sign in
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
