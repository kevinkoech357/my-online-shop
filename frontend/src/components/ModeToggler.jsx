import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ColorModeSwitch = () => {
	const { toggleColorMode } = useColorMode();
	const SwitchIcon = useColorModeValue(FaMoon, FaSun);

	return (
		<IconButton
			aria-label="Toggle color mode"
			icon={<SwitchIcon />}
			onClick={toggleColorMode}
			variant="ghost"
			color="current"
			size="md"
			margin={1}
			padding={1}
		/>
	);
};

export default ColorModeSwitch;
