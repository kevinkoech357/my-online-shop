import {
	Box,
	Button,
	Checkbox,
	CheckboxGroup,
	Heading,
	Input,
	RangeSlider,
	RangeSliderFilledTrack,
	RangeSliderThumb,
	RangeSliderTrack,
	Select,
	Stack,
	Text,
	VStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useCustomToast } from "../../utils/toastify";

const categories = [
	"Smartphones",
	"Laptops",
	"Clothing",
	"Kitchenware",
	"TVs",
	"Furniture",
	"Gaming",
];

const AdvancedSearchSidebar = ({ onFilterChange, initialFilters = {} }) => {
	const [name, setName] = useState(initialFilters.name || "");
	const [brand, setBrand] = useState(initialFilters.brand || "");
	const [category, setCategory] = useState(initialFilters.category || "");
	const [priceRange, setPriceRange] = useState([
		initialFilters.minPrice || 0,
		initialFilters.maxPrice || 50000,
	]);
	const [sortBy, setSortBy] = useState(initialFilters.sortBy || "createdAt");
	const [order, setOrder] = useState(initialFilters.order || "desc");

	const showToast = useCustomToast();

	const bgColor = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.800", "gray.100");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const buttonColorScheme = useColorModeValue("blue", "blue");

	const handleApplyFilters = useCallback(() => {
		const filters = {
			name,
			brand,
			category,
			minPrice: priceRange[0],
			maxPrice: priceRange[1],
			sortBy,
			order,
		};
		onFilterChange(filters);
		showToast(
			"Filters applied",
			"The product list has been updated.",
			"success",
		);
	}, [
		name,
		brand,
		category,
		priceRange,
		sortBy,
		order,
		onFilterChange,
		showToast,
	]);

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
				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Product Name
					</Text>
					<Input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Search by name"
					/>
				</Stack>

				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Brand
					</Text>
					<Input
						value={brand}
						onChange={(e) => setBrand(e.target.value)}
						placeholder="Search by brand"
					/>
				</Stack>

				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Category
					</Text>
					<Select
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						placeholder="Select category"
					>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</Select>
				</Stack>

				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Price Range
					</Text>
					<Text>{`KES ${priceRange[0]} - KES ${priceRange[1]}`}</Text>
					<RangeSlider
						value={priceRange}
						min={0}
						max={50000}
						step={100}
						onChange={setPriceRange}
						colorScheme={buttonColorScheme}
					>
						<RangeSliderTrack>
							<RangeSliderFilledTrack />
						</RangeSliderTrack>
						<RangeSliderThumb index={0} />
						<RangeSliderThumb index={1} />
					</RangeSlider>
				</Stack>

				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Sort By
					</Text>
					<Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
						<option value="createdAt">Date Created</option>
						<option value="price">Price</option>
						<option value="name">Name</option>
					</Select>
				</Stack>

				<Stack align="start" spacing={4} w="full">
					<Text fontWeight="bold" fontSize="sm">
						Order
					</Text>
					<Select value={order} onChange={(e) => setOrder(e.target.value)}>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</Select>
				</Stack>

				<Button
					colorScheme={buttonColorScheme}
					w="full"
					mt={6}
					size="md"
					borderRadius="full"
					_hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
					onClick={handleApplyFilters}
				>
					Apply Filters
				</Button>
			</VStack>
		</Box>
	);
};

export default AdvancedSearchSidebar;
