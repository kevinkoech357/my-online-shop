import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Heading,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import { useCustomToast } from "../../utils/toastify";

const LoginCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading } = useAuth() || {};
	const showToast = useCustomToast();

	// Enhanced email validation
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

	const isFormValid = () => {
		return (
			email.trim() !== "" && password.trim() !== "" && emailRegex.test(email)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isFormValid()) {
			showToast(
				"Validation Error",
				"Please check your email and password.",
				"error",
			);
			return;
		}

		const userCredentials = {
			email: email.trim(),
			password: password.trim(),
		};

		try {
			await login(userCredentials);
		} catch (error) {
			console.error("Login error:", error);
			showToast(
				"Login Error",
				error.message || "Login failed. Please try again.",
				"error",
			);
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
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to continue shopping ✌️
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4} as="form" onSubmit={handleSubmit}>
						<FormControl
							id="email"
							isRequired
							isInvalid={!emailRegex.test(email) && email !== ""}
						>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="Enter your email"
							/>
							{!emailRegex.test(email) && email !== "" && (
								<FormHelperText color="red.500">
									Please enter a valid email address.
								</FormHelperText>
							)}
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									placeholder="Enter your password"
								/>
								<InputRightElement h={"full"}>
									<IconButton
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										aria-describedby="password"
										icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
										onClick={() => setShowPassword((prev) => !prev)}
										variant={"ghost"}
									/>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10}>
							<Stack
								direction={{ base: "column", sm: "row" }}
								align={"start"}
								justify={"space-between"}
							>
								<Link
									as={ReactRouterLink}
									to="/auth/forgot-password"
									color={"blue.400"}
								>
									Forgot password?
								</Link>
								<Link
									as={ReactRouterLink}
									to="/auth/register"
									color={"blue.400"}
								>
									Create an account
								</Link>
							</Stack>
							<Button
								bg={"blue.400"}
								color={"white"}
								_hover={{ bg: "blue.500" }}
								type="submit"
								isLoading={isLoading}
								isDisabled={!isFormValid()}
							>
								Login
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default LoginCard;
