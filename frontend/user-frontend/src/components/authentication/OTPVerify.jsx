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
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOTPService, verifyOTPService } from "../../services/authService";
import AuthService from "../../services/authService";
import { useCustomToast } from "../../utils/toastify";

const OTPVerification = () => {
	const [otp, setOtp] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isResendDisabled, setIsResendDisabled] = useState(false);
	const [timer, setTimer] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();
	const showToast = useCustomToast();

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
			showToast("Invalid OTP", "Please enter a 6-digit OTP", "error");
			return;
		}

		setIsLoading(true);
		try {
			const userData = { email: userEmail, otp };
			const response = await AuthService.verifyOTP(userData);
			showToast(
				"Verification Successful",
				response.message || "Your email has been verified",
				"success",
			);
			navigate("/auth/login");
		} catch (error) {
			showToast(
				"Verification Failed",
				error.message || "Please try again or request a new OTP",
				"error",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOtp = async () => {
		if (isResendDisabled) return;

		try {
			setIsResendDisabled(true);
			setTimer(90); // Set timer for 90 seconds
			await AuthService.resendOTP(userEmail);
			showToast(
				"Sending New Code",
				"A new OTP is being sent to your email.",
				"info",
			);
		} catch (error) {
			showToast(
				"Failed to Resend OTP",
				error.response?.data?.message || "Please try again later",
				"error",
			);
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
