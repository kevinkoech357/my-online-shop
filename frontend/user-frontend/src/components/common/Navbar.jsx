import {
	Box,
	Button,
	Link as ChakraLink,
	Container,
	Flex,
	HStack,
	Input,
	InputGroup,
	InputRightElement,
	useColorModeValue,
} from "@chakra-ui/react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link as ReactRouterLink } from "react-router-dom";

import ColorModeSwitch from "./ModeToggler";

const Navbar = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const brandColor = useColorModeValue("blue.500", "blue.300");
	const hoverColor = useColorModeValue("blue.600", "blue.400");
	const buttonBg = useColorModeValue("blue.500", "blue.600");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.700");

	return (
		<Box as="nav" bg={bgColor} color={textColor} py={4} boxShadow="sm">
			<Container maxW="container.xl">
				<Flex align="center" justify="space-between">
					<ChakraLink
						as={ReactRouterLink}
						to="/"
						fontSize="2xl"
						fontWeight="bold"
						color={brandColor}
						_hover={{ color: hoverColor, textDecoration: "none" }}
					>
						My Online Shop
					</ChakraLink>

					<InputGroup maxW="md">
						<Input
							type="text"
							placeholder="Search products..."
							borderColor="gray.300"
							_hover={{ borderColor: "gray.400" }}
							_focus={{
								borderColor: brandColor,
								boxShadow: `0 0 0 1px ${brandColor}`,
							}}
						/>
						<InputRightElement width="4.5rem">
							<Button
								h="1.75rem"
								size="sm"
								bg={buttonBg}
								color="white"
								_hover={{ bg: buttonHoverBg }}
							>
								<FaSearch />
							</Button>
						</InputRightElement>
					</InputGroup>

					<HStack spacing={7}>
						<ChakraLink
							as={ReactRouterLink}
							to="/cart"
							color={textColor}
							_hover={{ color: hoverColor }}
						>
							<FaShoppingCart size={20} />
						</ChakraLink>
						<ChakraLink
							as={ReactRouterLink}
							to="/account"
							color={textColor}
							_hover={{ color: hoverColor }}
						>
							<FaUser size={20} />
						</ChakraLink>
						<ColorModeSwitch />
					</HStack>
				</Flex>
			</Container>
		</Box>
	);
};

export default Navbar;
