import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
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
import React from "react";

const LoginCard = () => {
	const [showPassword, setShowPassword] = React.useState(false);
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle login logic here
		console.log("Login attempt with:", { email, password });
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
						<FormControl id="email" isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormControl>
						<FormControl id="password" isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<InputRightElement h={"full"}>
									<IconButton
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}
										icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}
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
								<Checkbox>Remember me</Checkbox>
								<Link color={"blue.400"}>Forgot password?</Link>
							</Stack>
							<Button
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								type="submit"
							>
								Sign in
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default LoginCard;
