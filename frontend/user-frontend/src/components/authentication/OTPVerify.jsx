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
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOTPService, verifyOTPService } from "../../services/authService";

const OTPVerification = () => {
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [timer, setTimer] = useState(0);
	const toast = useToast();
	const location = useLocation();
	const navigate = useNavigate();

	// Get the email from the location state
	const userEmail = location.state?.email || "N/A";

	useEffect(() => {
		// Initialize timer
		let interval;
		if (isResendDisabled) {
			interval = setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer <= 1) {
						clearInterval(interval);
						setIsResendDisabled(false);
						return 0;
					}
					return prevTimer - 1;
				});
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [isResendDisabled]);

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
			const userData = { email: userEmail, otp };
			const response = await verifyOTPService(userData);
			toast({
				title: "Verification Successful",
				description: response.message || "Your email has been verified",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
			navigate("/auth/login");
		} catch (error) {
			toast({
				title: "Verification Failed",
				description: error.message || "Please try again or request a new OTP",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "top-right",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOtp = async () => {
		if (isResendDisabled) return;

		try {
			setIsResendDisabled(true);
			setTimer(90); // Set timer for 90 seconds
			await resendOTPService({ email: userEmail });
			toast({
				title: "Sending New Code",
				description: "A new OTP is being sent to your email.",
				status: "info",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Failed to Resend OTP",
				description: error.response?.data?.message || "Please try again later",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		}
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
					{isResendDisabled ? (
						`Resend code in ${timer}s`
					) : (
						<>
							Didn't receive the code?{" "}
							<Button variant="link" color="blue.500" onClick={handleResendOtp}>
								Resend OTP
							</Button>
						</>
					)}
				</Text>
			</Stack>
		</Flex>
	);
};

export default OTPVerification;
