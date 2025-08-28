import { randomBytesAsync } from "./hashData.mjs";

// Define set session function that creates and saves a user's session during login
const setSessionOnLogin = async (user, req, res) => {
    try {
        // Generate a unique session ID
        const buffer = await randomBytesAsync(16);
        const sessionId = buffer.toString("hex");

        // Set session variables
        req.session.user = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            active: user.active,
            verified: user.verified,
            primaryAddress: user.primaryAddress,
            secondaryAddresses: user.secondaryAddresses,
            wishlistCount: user.wishlist?.length || 0,
            cartItemCount: user.cart?.length || 0,
        };

        // Set the session cookie
        const cookieName = "userSession";
        const cookieValue = sessionId;

        const maxAge = 1000 * 60 * 60 * 24 * 14; // 14 days
        return res.cookie(cookieName, cookieValue, {
            maxAge,
            signed: true,
            secure: false,
            httpOnly: true,
            sameSite: "lax",
        });
    } catch (error) {
        console.error("Error setting session during login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error setting session.",
        });
    }
};

export default setSessionOnLogin;
