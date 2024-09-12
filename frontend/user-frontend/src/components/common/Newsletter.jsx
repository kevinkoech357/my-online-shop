import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Input,
	Text,
	useColorModeValue,
	useToast, // Import useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { subscribeToNewsletter } from "../../services/userService";

const NewsletterSection = () => {
	const [email, setEmail] = useState("");
	const toast = useToast();

	const bgColor = useColorModeValue("gray.50", "gray.900");
	const buttonBg = useColorModeValue("blue.500", "blue.600");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.700");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			toast({
				title: "Invalid email address",
				description: "Please enter a valid email address.",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
			return;
		}

		try {
			const response = await subscribeToNewsletter(email);
			setEmail(""); // Clear email field
			toast({
				title: "Subscription successful",
				description:
					response.message ||
					"You've successfully subscribed to our newsletter.",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Subscription failed",
				description:
					error.message ||
					"An error occurred while subscribing. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-right",
			});
		}
	};

	return (
		<Box
			bg={bgColor}
			py={6}
			borderBottom={1}
			borderStyle={"solid"}
			borderColor={useColorModeValue("gray.200", "gray.700")}
		>
			<Container maxW={"6xl"}>
				<Flex
					direction={{ base: "column", md: "row" }}
					justify="space-between"
					align="center"
				>
					<Box mb={{ base: 4, md: 0 }}>
						<Heading as="h3" size="md" mb={1}>
							Subscribe to Our Newsletter
						</Heading>
						<Text fontSize="sm">
							Stay updated with our latest offers and products
						</Text>
					</Box>
					<Flex
						direction={{ base: "column", sm: "row" }}
						gap={3}
						align="stretch"
						w={{ base: "full", md: "auto" }}
					>
						<Input
							placeholder="Your email address"
							bg={useColorModeValue("white", "gray.800")}
							borderColor={useColorModeValue("gray.300", "gray.600")}
							w={{ base: "full", sm: "auto" }}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Button
							onClick={handleSubmit}
							bg={buttonBg}
							color="white"
							_hover={{
								bg: buttonHoverBg,
							}}
							w={{ base: "full", sm: "auto" }}
						>
							Subscribe
						</Button>
					</Flex>
				</Flex>
				<Text fontSize="xs" mt={2} textAlign={{ base: "center", md: "right" }}>
					We respect your privacy. No spam, and you can unsubscribe anytime.
				</Text>
			</Container>
		</Box>
	);
};

export default NewsletterSection;
