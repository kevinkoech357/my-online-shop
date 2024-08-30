import {
	Box,
	Container,
	Heading,
	Icon,
	SimpleGrid,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import {
	FaBlender,
	FaCouch,
	FaGamepad,
	FaLaptop,
	FaMobileAlt,
	FaTshirt,
	FaTv,
} from "react-icons/fa";

const CategoryCard = ({ icon, label }) => {
	return (
		<VStack
			bg={useColorModeValue("white", "gray.800")}
			p={6}
			borderRadius="lg"
			boxShadow="md"
			transition="all 0.3s"
			_hover={{
				transform: "translateY(-10px)",
				boxShadow: "xl",
				bg: useColorModeValue("blue.50", "gray.700"),
			}}
			cursor="pointer"
		>
			<Icon as={icon} w={10} h={10} color="blue.600" />
			<Text
				fontSize="md"
				fontWeight="semibold"
				color={useColorModeValue("gray.700", "gray.300")}
			>
				{label}
			</Text>
		</VStack>
	);
};

const HeroSection = () => {
	const categories = [
		{ icon: FaMobileAlt, label: "Smartphones" },
		{ icon: FaLaptop, label: "Laptops" },
		{ icon: FaTshirt, label: "Clothing" },
		{ icon: FaBlender, label: "Kitchenware" },
		{ icon: FaTv, label: "TVs" },
		{ icon: FaCouch, label: "Furniture" },
		{ icon: FaGamepad, label: "Gaming" },
	];

	return (
		<Box
			bgGradient={useColorModeValue(
				"linear(to-r, blue.100, teal.100)",
				"linear(to-r, gray.900, blue.900)",
			)}
			py={20}
			px={4}
		>
			<Container maxW="container.xl">
				<VStack
					spacing={8}
					align="center"
					mb={12}
					color={useColorModeValue("gray.800", "white")}
				>
					<Heading as="h1" size="2xl" textAlign="center">
						Discover Amazing Products
					</Heading>
					<Text fontSize="xl" textAlign="center" maxW="2xl">
						Explore our wide range of products across various categories. Find
						exactly what you need for your home, work, or play.
					</Text>
				</VStack>
				<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 7 }} spacing={8}>
					{categories.map((category, index) => (
						<CategoryCard
							key={index}
							icon={category.icon}
							label={category.label}
						/>
					))}
				</SimpleGrid>
			</Container>
		</Box>
	);
};

export default HeroSection;
