import {
	Box,
	Button,
	Heading,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({
	errorCode = 404,
	errorMessage = "Oops! Page not found",
}) => {
	const navigate = useNavigate();
	const bgColor = useColorModeValue("gray.50", "gray.900");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const accentColor = useColorModeValue("red.500", "red.300");
	const buttonBg = useColorModeValue("blue.500", "blue.600");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.700");

	return (
		<Box
			minHeight="70vh"
			display="flex"
			alignItems="center"
			justifyContent="center"
			bg={bgColor}
			color={textColor}
		>
			<VStack spacing={8} textAlign="center">
				<Box color={accentColor}>
					<svg
						width="200"
						height="200"
						viewBox="0 0 200 200"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="100"
							cy="100"
							r="96"
							stroke="currentColor"
							strokeWidth="8"
						/>
						<path
							d="M65 80C65 91.0457 56.0457 100 45 100C33.9543 100 25 91.0457 25 80C25 68.9543 33.9543 60 45 60C56.0457 60 65 68.9543 65 80Z"
							fill="currentColor"
						/>
						<path
							d="M175 80C175 91.0457 166.046 100 155 100C143.954 100 135 91.0457 135 80C135 68.9543 143.954 60 155 60C166.046 60 175 68.9543 175 80Z"
							fill="currentColor"
						/>
						<path
							d="M55 140C55 140 70 120 100 120C130 120 145 140 145 140"
							stroke="currentColor"
							strokeWidth="8"
							strokeLinecap="round"
						/>
					</svg>
				</Box>
				<Heading as="h1" size="4xl" color={accentColor}>
					{errorCode}
				</Heading>
				<Text fontSize="xl" maxW="md">
					{errorMessage}
				</Text>
				<Button
					bg={buttonBg}
					color="white"
					_hover={{ bg: buttonHoverBg }}
					size="lg"
					onClick={() => navigate("/")}
				>
					Return Home
				</Button>
			</VStack>
		</Box>
	);
};

export default ErrorPage;
