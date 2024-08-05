import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Input,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

const NewsletterSection = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const buttonBg = useColorModeValue("blue.500", "blue.600");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.700");

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
						/>
						<Button
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
