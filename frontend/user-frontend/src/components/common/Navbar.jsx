import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Box,
	Button,
	Link as ChakraLink,
	Collapse,
	Container,
	Flex,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link as ReactRouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ColorModeSwitch from "./ModeToggler";

const Navbar = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const brandColor = useColorModeValue("blue.500", "blue.300");
	const hoverColor = useColorModeValue("blue.600", "blue.400");
	const buttonBg = useColorModeValue("blue.500", "blue.600");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.700");
	const { isLoggedIn, logout } = useAuth() || {};
	const { isOpen, onToggle } = useDisclosure();

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

					<Flex align="center" display={{ base: "none", md: "flex" }}>
						<InputGroup maxW="md" ml={4}>
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
					</Flex>

					<HStack spacing={7} display={{ base: "none", md: "flex" }}>
						<ChakraLink
							as={ReactRouterLink}
							to="/cart"
							color={textColor}
							_hover={{ color: hoverColor }}
						>
							<FaShoppingCart size={20} />
						</ChakraLink>
						{isLoggedIn ? (
							<Menu>
								<MenuButton as={Button} variant="ghost" p={0}>
									<Avatar size="sm" />
								</MenuButton>
								<MenuList>
									<MenuItem as={ReactRouterLink} to="/account">
										My Account
									</MenuItem>
									<MenuItem as={ReactRouterLink} to="/orders">
										Orders
									</MenuItem>
									<MenuItem as={ReactRouterLink} to="/user/wishlist">
										Wishlist
									</MenuItem>
									<MenuItem onClick={logout}>Logout</MenuItem>
								</MenuList>
							</Menu>
						) : (
							<Button
								as={ReactRouterLink}
								to="/auth/login"
								fontSize="sm"
								fontWeight={600}
								color="white"
								bg={buttonBg}
								_hover={{ bg: buttonHoverBg }}
							>
								Login
							</Button>
						)}
						<ColorModeSwitch />
					</HStack>

					<IconButton
						aria-label="Toggle Navigation"
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						display={{ md: "none" }}
						onClick={onToggle}
					/>
				</Flex>

				<Collapse in={isOpen} animateOpacity>
					<Stack
						spacing={4}
						py={4}
						display={{ base: "flex", md: "none" }}
						bg={bgColor}
						borderBottom="1px"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						<InputGroup>
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
						<HStack spacing={4} justify="center">
							<ChakraLink
								as={ReactRouterLink}
								to="/cart"
								color={textColor}
								_hover={{ color: hoverColor }}
							>
								<FaShoppingCart size={20} />
							</ChakraLink>
							{isLoggedIn ? (
								<Menu>
									<MenuButton as={Button} variant="ghost" p={0}>
										<Avatar size="sm" />
									</MenuButton>
									<MenuList>
										<MenuItem as={ReactRouterLink} to="/account">
											My Account
										</MenuItem>
										<MenuItem as={ReactRouterLink} to="/orders">
											Orders
										</MenuItem>
										<MenuItem as={ReactRouterLink} to="/user/wishlist">
											Wishlist
										</MenuItem>
										<MenuItem onClick={logout}>Logout</MenuItem>
									</MenuList>
								</Menu>
							) : (
								<Button
									as={ReactRouterLink}
									to="/auth/login"
									fontSize="sm"
									fontWeight={600}
									color="white"
									bg={buttonBg}
									_hover={{ bg: buttonHoverBg }}
								>
									Login
								</Button>
							)}
						</HStack>
						<ColorModeSwitch />
					</Stack>
				</Collapse>
			</Container>
		</Box>
	);
};

export default Navbar;
