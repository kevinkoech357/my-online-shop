import { Box } from "@chakra-ui/react";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const Rating = ({ rating }) => {
	// Ensure rating is a number
	const numericRating = parseFloat(rating);
	const roundedRating = Math.round(numericRating * 2) / 2;

	return (
		<Box display="flex" alignItems="center">
			{Array(5)
				.fill("")
				.map((_, i) => {
					if (roundedRating - i >= 1) {
						return (
							<BsStarFill
								key={i}
								style={{ marginLeft: "1px" }}
								color="teal.500"
							/>
						);
					}
					if (roundedRating - i === 0.5) {
						return (
							<BsStarHalf
								key={i}
								style={{ marginLeft: "1px" }}
								color="teal.500"
							/>
						);
					}
					return (
						<BsStar key={i} style={{ marginLeft: "1px" }} color="gray.300" />
					);
				})}
		</Box>
	);
};

export default Rating;
