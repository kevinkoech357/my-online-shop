import fs from "node:fs/promises";

// Create the directories asynchronously if they don't exist
const createDirectory = async (dir) => {
	try {
		await fs.mkdir(dir, { recursive: true });
	} catch (error) {
		console.error(`Error creating directory ${dir}: ${error}`);
	}
};

export default createDirectory;
