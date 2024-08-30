import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const ForgotPasswordCard = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const toast = useToast();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email) {
			setError("Email is required");
			return;
		}
		setIsLoading(true);
		setError("");

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: "Reset Email Sent",
				description: "Check your email for password reset instructions.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			// Here you would typically redirect the user or update your app's state
		} catch (_error) {
			setError("Failed to send reset email. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Flex
			minH={"50vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Forgot your password?</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						We'll send you reset instructions
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4} as="form" onSubmit={handleSubmit}>
						<FormControl id="email" isRequired isInvalid={!!error}>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<FormErrorMessage>{error}</FormErrorMessage>
						</FormControl>
						<Stack spacing={10}>
							<Button
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								isLoading={isLoading}
								loadingText="Sending"
								type="submit"
							>
								Send Reset Link
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default ForgotPasswordCard;
