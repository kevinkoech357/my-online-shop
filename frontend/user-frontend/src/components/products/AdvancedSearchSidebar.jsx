import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Heading,
	RangeSlider,
	RangeSliderFilledTrack,
	RangeSliderThumb,
	RangeSliderTrack,
	Stack,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";

const AdvancedSearchSidebar = ({ onFilterChange }) => {
	const [priceRange, setPriceRange] = useState([100, 1000]);

	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const buttonColorScheme = useColorModeValue("blue", "blue");

	const handleCategoryChange = (selectedCategories) => {
		onFilterChange({ type: "category", value: selectedCategories });
	};

	const handlePriceChange = (priceRange) => {
		onFilterChange({ type: "price", value: priceRange });
	};

	return (
		<Box
			p={6}
			bg={bgColor}
			color={textColor}
			borderRadius="lg"
			boxShadow="lg"
			borderWidth={1}
			borderColor={borderColor}
		>
			<Heading as="h3" size="md" mb={6}>
				Advanced Search
			</Heading>

			<VStack align="start" spacing={6}>
				{/* Category Filter */}
				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Category
					</Text>
					<CheckboxGroup onChange={handleCategoryChange}>
						<VStack align="start" spacing={2}>
							<Checkbox value="Smartphones">Smartphones</Checkbox>
							<Checkbox value="Laptops">Laptops</Checkbox>
							<Checkbox value="Clothing">Clothing</Checkbox>
							<Checkbox value="Kitchenware">Kitchenware</Checkbox>
							<Checkbox value="TVs">TVs</Checkbox>
							<Checkbox value="Furniture">Furniture</Checkbox>
							<Checkbox value="Gaming">Gaming</Checkbox>
						</VStack>
					</CheckboxGroup>
				</Stack>

				{/* Price Range Slider with Display */}
				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Price Range
					</Text>
					<Text>{`KES.${priceRange[0]} - KES.${priceRange[1]}`}</Text>
					<RangeSlider
						defaultValue={[100, 1000]}
						min={0}
						max={2000}
						step={50}
						onChange={(val) => setPriceRange(val)} // Update state when slider is moved
						onChangeEnd={handlePriceChange}
						colorScheme={buttonColorScheme}
					>
						<RangeSliderTrack>
							<RangeSliderFilledTrack />
						</RangeSliderTrack>
						<RangeSliderThumb index={0} />
						<RangeSliderThumb index={1} />
					</RangeSlider>
				</Stack>

				{/* Apply Filters Button */}
				<Button
					colorScheme={buttonColorScheme}
					w="full"
					mt={6}
					size="md"
					borderRadius="full"
					_hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
					onClick={() => onFilterChange(null)}
				>
					Apply Filters
				</Button>
			</VStack>
		</Box>
	);
};

export default AdvancedSearchSidebar;
