import {
	initializeEmptyCart,
	updateCartItemQuantity,
	validateCart,
} from "../utils/cartStorage";
import apiClient from "./api-client";

// Define constants for API endpoints
const CART_ENDPOINTS = {
	GET_CART: "/cart",
	CREATE_CART: "/cart/create",
	REMOVE_PRODUCT: (productId) => `/cart/remove/${productId}`,
	CLEAR_CART: "/cart/clear",
};

class CartService {
	constructor() {
		this.cart = initializeEmptyCart(); // Initialize with an empty cart
	}

	// Helper function to dispatch cart update event
	// dispatchCartUpdateEvent() {
	// 	window.dispatchEvent(new Event('cartUpdate'));
	//   }

	// Fetch the current cart from the server
	async getCurrentCart(signal) {
		try {
			const response = await apiClient.get(CART_ENDPOINTS.GET_CART, { signal });
			if (response.cart) {
				this.cart = response.cart; // Update the local cart state
				//   this.dispatchCartUpdateEvent();
				return this.cart;
			}
			throw new Error("Failed to fetch cart");
		} catch (error) {
			console.error("Error fetching cart:", error.message);
			return this.cart; // Return the current cart in case of failure
		}
	}

	// Add or update a product in the cart
	async addOrUpdateProduct(productId, newQuantity, color, signal) {
		try {
			// Create the exact body structure the backend expects
			const cartData = {
				cart: {
					items: [
						{
							product: productId,
							quantity: newQuantity,
							color: color,
						},
					],
				},
			};

			const response = await apiClient.post(
				CART_ENDPOINTS.CREATE_CART,
				cartData,
				{ signal },
			);

			if (response.cart) {
				this.cart = response.cart;
				//   this.dispatchCartUpdateEvent();
				return this.cart;
			}

			throw new Error("Failed to update cart");
		} catch (error) {
			console.error("Error adding or updating product:", error.message);
			console.log(error);
			throw error;
		}
	}

	// Remove a product from the cart
	async removeProduct(productId, signal) {
		try {
			console.log(`Attempting to remove product with ID ${productId}`);
			const response = await apiClient.patch(
				CART_ENDPOINTS.REMOVE_PRODUCT(productId),
				{},
				{ signal },
			);
			if (response.cart) {
				this.cart = response.cart; // Update cart after removal
				// this.dispatchCartUpdateEvent();
				console.log(`Product with ID ${productId} removed successfully`);
				return this.cart;
			}
			throw new Error(
				`Failed to remove product with ID ${productId} from cart`,
			);
		} catch (error) {
			console.error("Error removing product:", error.message);
			if (error.response) {
				console.error("Response from server:", error.response.data);
			} else if (error.request) {
				console.error("No response from server:", error.request);
			} else {
				console.error("Error message:", error.message);
			}
			throw error;
		}
	}

	// Clear the cart on the server
	async clearCart(signal) {
		try {
			const response = await apiClient.delete(CART_ENDPOINTS.CLEAR_CART, {
				signal,
			});
			if (response.success) {
				this.cart = initializeEmptyCart(); // Reset cart to empty
				//   this.dispatchCartUpdateEvent();
			} else {
				throw new Error(
					"Failed to clear cart: Server returned an unsuccessful response",
				);
			}
			return this.cart;
		} catch (error) {
			console.error("Error clearing cart:", error.message);
			throw error;
		}
	}

	// Get the total number of items in the cart
	getItemCount() {
		return this.cart.items.reduce((total, item) => total + item.quantity, 0);
	}

	// Check if the cart is empty
	isEmpty() {
		return this.cart.items.length === 0;
	}

	// Validate if the cart is in a valid state
	isValid() {
		return validateCart(this.cart);
	}
}

const cartService = new CartService();
export default cartService;
