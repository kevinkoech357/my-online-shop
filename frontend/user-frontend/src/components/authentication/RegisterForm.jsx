import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Heading,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

const RegisterCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// Clear the error for this field when the user starts typing
		if (errors[name]) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.firstName.trim())
			newErrors.firstName = "First name is required";
		if (!formData.email.trim()) newErrors.email = "Email is required";
		if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Email is invalid";
		if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
		if (!/^\d{10}$/.test(formData.phone))
			newErrors.phone = "Phone number should be 10 digits";
		if (!formData.password) newErrors.password = "Password is required";
		if (formData.password.length < 6)
			newErrors.password = "Password should be at least 6 characters";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			console.log("Form submitted:", formData);
			// Here you would typically send the data to your backend
			// For now, let's simulate a successful registration by navigating to the login page
			navigate("/auth/login");
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
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to experience modern day shopping ✌️
					</Text>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4} as="form" onSubmit={handleSubmit}>
						<HStack>
							<Box>
								<FormControl
									id="firstName"
									isRequired
									isInvalid={errors.firstName}
								>
									<FormLabel>First Name</FormLabel>
									<Input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
									/>
									<FormErrorMessage>{errors.firstName}</FormErrorMessage>
								</FormControl>
							</Box>
							<Box>
								<FormControl id="lastName">
									<FormLabel>Last Name</FormLabel>
									<Input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl id="email" isRequired isInvalid={errors.email}>
							<FormLabel>Email address</FormLabel>
							<Input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
							/>
							<FormErrorMessage>{errors.email}</FormErrorMessage>
						</FormControl>
						<FormControl id="phone" isRequired isInvalid={errors.phone}>
							<FormLabel>Phone Number</FormLabel>
							<Input
								type="tel"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
							/>
							<FormErrorMessage>{errors.phone}</FormErrorMessage>
						</FormControl>
						<FormControl id="password" isRequired isInvalid={errors.password}>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() =>
											setShowPassword((showPassword) => !showPassword)
										}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
							<FormErrorMessage>{errors.password}</FormErrorMessage>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								size="lg"
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								type="submit"
							>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link as={ReactRouterLink} to="/auth/login" color={"blue.400"}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default RegisterCard;
