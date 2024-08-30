import {
	Box,
	Container,
	SimpleGrid,
	Stack,
	Tag,
	Text,
	VisuallyHidden,
	useColorModeValue,
} from "@chakra-ui/react";
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";

import NewsletterSection from "./Newsletter";

const ListHeader = ({ children }) => {
	return (
		<Text fontWeight={"500"} fontSize={"lg"} mb={2}>
			{children}
		</Text>
	);
};

const SocialButton = ({ children, label, href }) => {
	const hoverColor = useColorModeValue("blue.600", "blue.400");
	return (
		<Box
			as="a"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			rounded={"full"}
			w={8}
			h={8}
			display={"inline-flex"}
			alignItems={"center"}
			justifyContent={"center"}
			transition={"all 0.3s ease"}
			_hover={{
				color: hoverColor,
				transform: "scale(1.1)",
			}}
		>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</Box>
	);
};

const Footer = () => {
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.700", "gray.200");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const linkHoverColor = useColorModeValue("blue.600", "blue.400");

	const currentYear = new Date().getFullYear();

	return (
		<Box bg={bgColor} color={textColor}>
			<NewsletterSection />
			<Container as={Stack} maxW={"6xl"} py={10}>
				<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
					<Stack align={"flex-start"}>
						<ListHeader>Company</ListHeader>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							About Us
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Blog
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Careers
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Contact Us
						</Box>
					</Stack>
					<Stack align={"flex-start"}>
						<ListHeader>Support</ListHeader>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Help Center
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Safety Center
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Community Guidelines
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Cancel My Order
						</Box>
					</Stack>
					<Stack align={"flex-start"}>
						<ListHeader>Legal</ListHeader>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Cookies Policy
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Privacy Policy
						</Box>
						<Box as="a" href={"#"} _hover={{ color: linkHoverColor }}>
							Terms of Service
						</Box>
					</Stack>
					<Stack align={"flex-start"}>
						<ListHeader>Install App</ListHeader>
						<Tag
							size={"md"}
							variant="solid"
							colorScheme="blue"
							borderRadius="full"
						>
							Coming Soon
						</Tag>
					</Stack>
				</SimpleGrid>
			</Container>
			<Box borderTopWidth={1} borderStyle={"solid"} borderColor={borderColor}>
				<Container
					as={Stack}
					maxW={"6xl"}
					py={4}
					direction={{ base: "column", md: "row" }}
					spacing={4}
					justify={{ md: "space-between" }}
					align={{ md: "center" }}
				>
					<Text>© {currentYear} My Online Shop. All rights reserved</Text>
					<Stack direction={"row"} spacing={6}>
						<SocialButton label={"Twitter"} href={"#"}>
							<FaTwitter />
						</SocialButton>
						<SocialButton label={"YouTube"} href={"#"}>
							<FaYoutube />
						</SocialButton>
						<SocialButton label={"Instagram"} href={"#"}>
							<FaInstagram />
						</SocialButton>
						<SocialButton label={"TikTok"} href={"#"}>
							<FaTiktok />
						</SocialButton>
					</Stack>
				</Container>
			</Box>
		</Box>
	);
};

export default Footer;
