import {
	Button,
	Center,
	Flex,
	FormControl,
	HStack,
	Heading,
	Stack,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import React, { useState } from "react";

const OTPVerification = () => {
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	// This should be replaced with the actual email from your application state or props
	const userEmail = "username@mail.com";

	const handleOtpChange = (value) => {
		setOtp(value);
	};

	const handleVerify = async () => {
		if (otp.length !== 6) {
			toast({
				title: "Invalid OTP",
				description: "Please enter a 6-digit OTP",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
			return;
		}

		setIsLoading(true);
		try {
			// Here you would typically send the OTP to your backend for verification
			// For this example, we'll simulate an API call with a timeout
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: "Verification Successful",
				description: "Your email has been verified",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
			// Here you would typically redirect the user or update your app's state
		} catch (_error) {
			toast({
				title: "Verification Failed",
				description: "Please try again or request a new OTP",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOtp = () => {
		// Logic to resend OTP would go here
		toast({
			title: "OTP Resent",
			description: "A new OTP has been sent to your email",
			status: "info",
			duration: 3000,
			isClosable: true,
		});
	};

	return (
		<Flex
			minH={"50vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.900")}
		>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"sm"}
				bg={useColorModeValue("white", "gray.700")}
				rounded={"xl"}
				boxShadow={"lg"}
				p={6}
				my={10}
			>
				<Center>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
						Verify your Email
					</Heading>
				</Center>
				<Center
					fontSize={{ base: "sm", sm: "md" }}
					color={useColorModeValue("gray.800", "gray.400")}
				>
					We have sent a code to your email
				</Center>
				<Center
					fontSize={{ base: "sm", sm: "md" }}
					fontWeight="bold"
					color={useColorModeValue("gray.800", "gray.400")}
				>
					{userEmail}
				</Center>
				<FormControl>
					<Center>
						<HStack>
							<PinInput otp value={otp} onChange={handleOtpChange}>
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
								<PinInputField />
							</PinInput>
						</HStack>
					</Center>
				</FormControl>
				<Stack spacing={6}>
					<Button
						bg={"blue.400"}
						color={"white"}
						_hover={{
							bg: "blue.500",
						}}
						onClick={handleVerify}
						isLoading={isLoading}
						loadingText="Verifying"
					>
						Verify
					</Button>
				</Stack>
				<Text textAlign="center" fontSize="sm">
					Didn't receive the code?{" "}
					<Button variant="link" color="blue.500" onClick={handleResendOtp}>
						Resend OTP
					</Button>
				</Text>
			</Stack>
		</Flex>
	);
};

export default OTPVerification;
