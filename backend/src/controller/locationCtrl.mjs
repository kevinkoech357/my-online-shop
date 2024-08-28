import Location from "../models/locationModel.mjs";
import capitalizeFirstLetter from "../utils/capitalizeName.mjs";

// ===================================================START ADMIN LOCATION RELATED ACTIONS=========================================

// Admin function to create a new Location
const adminCreateLocation = async (req, res, next) => {
	const { name, county, town } = req.body;

	try {
		// Check if a Location with the same name already exists
		const existingLocation = await Location.findOne({ name });
		if (existingLocation) {
			return res.status(409).json({
				success: false,
				message: "Location with the same name already exists",
			});
		}

		// Capitalize name, county, town
		const capitalizedName = await capitalizeFirstLetter(name);
		const capitalizedCounty = await capitalizeFirstLetter(county);
		const capitalizedTown = await capitalizeFirstLetter(town);

		// Create a new Location instance
		const newLocation = new Location({
			name: capitalizedName,
			county: capitalizedCounty,
			town: capitalizedTown,
		});

		// Save the new Location to the database
		await newLocation.save();

		return res.status(201).json({
			success: true,
			message: "New Location created successfully",
			details: newLocation,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to modify a specific Location

const adminModifyLocation = async (req, res, next) => {
	const { id } = req.params;
	const { name, county, town } = req.body;

	try {
		// Find and update the Location
		const locationToUpdate = await Location.findById(id);

		if (!locationToUpdate) {
			// Return a 404 with not found message
			return res.status(404).json({ success: false, message: "Location Not Found" });
		}

		if (name) {
			locationToUpdate.name = await capitalizeFirstLetter(name);
		}
		if (county) {
			locationToUpdate.county = await capitalizeFirstLetter(county);
		}
		if (town) {
			locationToUpdate.town = await capitalizeFirstLetter(town);
		}

		await locationToUpdate.save();

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Location Updated Successfully",
			details: locationToUpdate,
		});
	} catch (error) {
		next(error);
	}
};

// Admin function to delete a specific Location

const adminDeleteLocation = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find and delete the Location
		const locationToDelete = await Location.findByIdAndDelete(id);

		if (!locationToDelete) {
			// Return a 404 with not found message
			return res.status(404).json({ success: false, message: "Location Not Found" });
		}

		// Return a success response
		return res.status(200).json({ success: true, message: "Location Deleted Successfully" });
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ADMIN LOCATION RELATED ACTIONS==============================

// ==========================================================START ANY-USER LOCATION RELATED ACTIONS==========================

// Function to get all Locations (accessible by any user)

const getAllLocations = async (_req, res, next) => {
	try {
		// Find all available Locations
		const allLocations = await Location.find();

		if (!allLocations) {
			// Return a 200 code with empty array
			return res.status(200).json({ success: true, message: "No Locations Found.", details: [] });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Location Retrieved Successfully",
			details: allLocations,
		});
	} catch (error) {
		next(error);
	}
};

// Function to get a single Location (accessible by any user)

const viewOneLocation = async (req, res, next) => {
	const { id } = req.params;

	try {
		// Find specific Location based on ID
		const location = await Location.findById(id);

		if (!location) {
			// Return 404
			return res.status(404).json({ success: false, message: "Location Not Found" });
		}

		// Return a success response
		return res.status(200).json({
			success: true,
			message: "Location successfully retrieved",
			details: location,
		});
	} catch (error) {
		next(error);
	}
};

// ==========================================================END ANY-USER LOCATION RELATED ACTIONS==============================

export { adminCreateLocation, adminModifyLocation, adminDeleteLocation, getAllLocations, viewOneLocation };
