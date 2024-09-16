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
import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { registerUserService } from "../../services/authService";
import { useCustomToast } from "../../utils/toastify";

const RegisterCard = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		password: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const showToast = useCustomToast();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.firstname.trim())
			newErrors.firstname = "First name is required";
		if (!formData.lastname.trim()) newErrors.lastname = "Last name is required";
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			setIsLoading(true);
			try {
				// Send a POST method to /auth/register using formData
				const response = await registerUserService(formData);
				showToast(
					"Registration successful",
					response.message || "Please check your email for verification.",
					"success",
				);
				navigate("/auth/verify-email", { state: { email: formData.email } });
			} catch (error) {
				showToast(
					"Registration failed",
					error.message || "An error occurred during registration.",
					"error",
				);
			} finally {
				setIsLoading(false);
			}
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
									id="firstname"
									isRequired
									isInvalid={errors.firstname}
								>
									<FormLabel>First Name</FormLabel>
									<Input
										type="text"
										name="firstname"
										value={formData.firstname}
										onChange={handleChange}
									/>
									<FormErrorMessage>{errors.firstname}</FormErrorMessage>
								</FormControl>
							</Box>
							<Box>
								<FormControl
									id="lastname"
									isRequired
									isInvalid={errors.lastname}
								>
									<FormLabel>Last Name</FormLabel>
									<Input
										type="text"
										name="lastname"
										value={formData.lastname}
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
								isLoading={isLoading}
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
