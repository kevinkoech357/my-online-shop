import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

const ResetPasswordCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const toast = useToast();

	const validateForm = () => {
		const newErrors = {};
		if (!email) newErrors.email = "Email is required";
		if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
		if (!password) newErrors.password = "Password is required";
		if (password.length < 8)
			newErrors.password = "Password must be at least 8 characters";
		if (password !== confirmPassword)
			newErrors.confirmPassword = "Passwords do not match";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleResetPassword = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			// Here you would typically send the reset password request to your backend
			// For this example, we'll simulate an API call with a timeout
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: "Password Reset Successful",
				description:
					"Your password has been reset. You can now log in with your new password.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
			// Here you would typically redirect the user to the login page
		} catch (_error) {
			toast({
				title: "Password Reset Failed",
				description:
					"There was an error resetting your password. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
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
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6} width={"full"}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Reset your password</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						Enter your email and new password below
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4} as="form" onSubmit={handleResetPassword}>
						<FormControl id="email" isRequired isInvalid={errors.email}>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<FormErrorMessage>{errors.email}</FormErrorMessage>
						</FormControl>
						<FormControl id="password" isRequired isInvalid={errors.password}>
							<FormLabel>New Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((show) => !show)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
							<FormErrorMessage>{errors.password}</FormErrorMessage>
						</FormControl>
						<FormControl
							id="confirmPassword"
							isRequired
							isInvalid={errors.confirmPassword}
						>
							<FormLabel>Confirm New Password</FormLabel>
							<Input
								type={showPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
						</FormControl>
						<Stack spacing={10}>
							<Button
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								type="submit"
								isLoading={isLoading}
								loadingText="Resetting"
							>
								Reset Password
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default ResetPasswordCard;
