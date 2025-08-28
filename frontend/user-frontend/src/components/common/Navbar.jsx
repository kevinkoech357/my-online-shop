import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
	Avatar,
	Badge,
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
import { useEffect, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/AuthContext";
import cartService from "../../services/cartService";
import ColorModeSwitch from "./ModeToggler";

const Navbar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [totalItems, setTotalItems] = useState(0); // Local state for total cart items
	const { isLoggedIn, logout, user } = useAuth();
	const { isOpen, onToggle } = useDisclosure();
	const navigate = useNavigate();

	// Fetch the current cart and update totalItems on mount or when the cart changes
	useEffect(() => {
		const fetchCart = async () => {
			try {
				const cart = await cartService.getCurrentCart();
				setTotalItems(cart.items.reduce((sum, item) => sum + item.quantity, 0)); // Calculate total items
			} catch (error) {
				console.error("Error fetching cart:", error.message);
			}
		};

		fetchCart();

		// Listen for cart updates
		// const handleCartUpdate = () => {
		//   fetchCart();
		// };

		// // Add event listener for cart updates
		// window.addEventListener("cartUpdate", handleCartUpdate);

		// // Clean up event listener on component unmount
		// return () => {
		//   window.removeEventListener("cartUpdate", handleCartUpdate);
		// };
	}, []);

	// Styles
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const brandColor = useColorModeValue("blue.500", "blue.300");
	const hoverColor = useColorModeValue("blue.600", "blue.400");
	const buttonBg = useColorModeValue("blue.500", "blue.600");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.700");

	// Handlers
	const handleSearch = () => {
		if (searchTerm.trim()) {
			navigate(`/search?query=${searchTerm}`);
		}
	};

	return (
		<Box as="nav" bg={bgColor} color={textColor} py={4} boxShadow="sm">
			<Container maxW="container.xl">
				<Flex align="center" justify="space-between">
					{/* Brand */}
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

					{/* Search and menu for larger screens */}
					<Flex align="center" display={{ base: "none", md: "flex" }}>
						<InputGroup maxW="md" ml={4}>
							<Input
								type="text"
								placeholder="Search products..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
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
									onClick={handleSearch}
									aria-label="Search"
								>
									<FaSearch />
								</Button>
							</InputRightElement>
						</InputGroup>
					</Flex>

					{/* Menu items */}
					<HStack spacing={7} display={{ base: "none", md: "flex" }}>
						{/* Cart Icon with Badge */}
						<Box position="relative">
							<ChakraLink
								as={ReactRouterLink}
								to="/cart"
								color={textColor}
								_hover={{ color: hoverColor }}
							>
								<FaShoppingCart size={20} />
								{/* Show badge only when totalItems > 0 */}
								{totalItems > 0 && (
									<Badge
										colorScheme="green"
										borderRadius="full"
										position="absolute"
										top="-10px"
										right="-10px"
										fontSize="0.8em"
									>
										{totalItems}
									</Badge>
								)}
							</ChakraLink>
						</Box>

						{/* User Menu */}
						{isLoggedIn ? (
							<Menu>
								<MenuButton as={Button} variant="ghost" p={0}>
									<Avatar
										size="sm"
										src={user?.profilePicture}
										name={user?.name}
									/>
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

						{/* Color Mode Switch */}
						<ColorModeSwitch />
					</HStack>

					{/* Hamburger menu for mobile */}
					<IconButton
						aria-label="Toggle Navigation"
						icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
						display={{ md: "none" }}
						onClick={onToggle}
					/>
				</Flex>

				{/* Mobile menu */}
				<Collapse in={isOpen} animateOpacity>
					<Stack
						spacing={4}
						py={4}
						display={{ base: "flex", md: "none" }}
						bg={bgColor}
						borderBottom="1px"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						{/* Search Bar */}
						<InputGroup>
							<Input
								type="text"
								placeholder="Search products..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
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
									onClick={handleSearch}
									aria-label="Search"
								>
									<FaSearch />
								</Button>
							</InputRightElement>
						</InputGroup>

						{/* Cart Icon with Badge */}
						<HStack spacing={4} justify="center">
							<Box position="relative">
								<ChakraLink
									as={ReactRouterLink}
									to="/cart"
									color={textColor}
									_hover={{ color: hoverColor }}
								>
									<FaShoppingCart size={20} />
									{totalItems > 0 && (
										<Badge
											colorScheme="green"
											borderRadius="full"
											position="absolute"
											top="-5px"
											right="-10px"
											fontSize="0.8em"
										>
											{totalItems}
										</Badge>
									)}
								</ChakraLink>
							</Box>

							{/* User Menu */}
							{isLoggedIn ? (
								<Menu>
									<MenuButton as={Button} variant="ghost" p={0}>
										<Avatar
											size="sm"
											src={user?.profilePicture}
											name={user?.name}
										/>
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

						{/* Color Mode Switch */}
						<ColorModeSwitch />
					</Stack>
				</Collapse>
			</Container>
		</Box>
	);
};

export default Navbar;
