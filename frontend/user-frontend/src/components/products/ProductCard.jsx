import {
	Badge,
	Box,
	Circle,
	Flex,
	Image,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import Rating from "./ProductRating";

const ProductCard = ({ product }) => {
	return (
		<Link to={`/products/${product.slug}`}>
			<Box
				bg={useColorModeValue("white", "gray.800")}
				maxW="sm"
				borderWidth="1px"
				rounded="lg"
				shadow="lg"
				position="relative"
				transition="all 0.3s"
				_hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
			>
				{product.isNew && (
					<Circle
						size="10px"
						position="absolute"
						top={2}
						right={2}
						bg="red.200"
					/>
				)}

				<Image
					src={product.image}
					alt={product.name}
					roundedTop="lg"
					w="100%"
					h={200}
					objectFit="cover"
				/>

				<Box p="6">
					<Box display="flex" alignItems="baseline">
						{product.isNew && (
							<Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
								New
							</Badge>
						)}
						<Badge
							rounded="full"
							px="2"
							fontSize="0.5em"
							colorScheme="green"
							ml={2}
						>
							{product.category}
						</Badge>
					</Box>
					<Flex mt="1" justifyContent="space-between" alignItems="center">
						<Box
							fontSize="2xl"
							fontWeight="semibold"
							as="h4"
							lineHeight="tight"
							isTruncated
						>
							{product.name}
						</Box>
					</Flex>

					<Flex justifyContent="space-between" alignItems="center" mt="4">
						<Rating rating={product.rating} />
						<Box fontSize="2xl" color={useColorModeValue("gray.800", "white")}>
							<Box as="span" color="gray.600" fontSize="lg">
								KES
							</Box>
							{product.price.toFixed(2)}
						</Box>
					</Flex>
				</Box>
			</Box>
		</Link>
	);
};

export default ProductCard;
