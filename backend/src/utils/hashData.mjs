import { randomBytes } from "crypto";
import { promisify } from "util";
import argon2 from "argon2";

const randomBytesAsync = promisify(randomBytes);

// The function below hashes a password using argon2 with salt
const hashData = async (password) => {
	try {
		// Generate a random salt
		const salt = await randomBytesAsync(32);

		// Hash password using argon2 with salt
		const hashedPassword = await argon2.hash(password, { salt });

		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw new Error("Password hashing failed");
	}
};

// The function below is used to verify if user password matches the stored password
const verifyData = async (hashedPassword, password) => {
	try {
		return await argon2.verify(hashedPassword, password);
	} catch (error) {
		console.error("Error verifying password:", error);
		throw new Error("Password verification failed");
	}
};

export { hashData, verifyData, randomBytesAsync };
