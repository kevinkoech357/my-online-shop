import { useToast } from "@chakra-ui/react";

export const useCustomToast = () => {
	const toast = useToast();

	const showToast = (
		title,
		description,
		status,
		duration = 5000,
		position = "top-right",
	) => {
		toast({
			title,
			description,
			status,
			duration,
			isClosable: true,
			position,
		});
	};

	return showToast;
};
