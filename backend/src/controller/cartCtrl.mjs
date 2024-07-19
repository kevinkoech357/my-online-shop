import User from '../models/userModel.mjs';
import Product from '../models/productModel.mjs';
import Cart from '../models/cartModel.mjs';

import mongoose from 'mongoose';
import isInteger from '../utils/isInteger.mjs';

// Define userCart function that will enable an authenticated user
// to add or update items in his/her cart

const userCart = async (req, res, next) => {
  // Get user ID from request user
  const { _id } = req.user;
  // Get cart details from request body
  const { cart } = req.body;

  try {
    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      // Return 404
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    // Retrieve the existing cart
    const existingCart = await Cart.findOne({ user: _id });

    // Initialize an empty items array or use existing cart items
    const items = existingCart ? existingCart.items : [];

    // Create a map of existing items for quick lookup
    const existingItemsMap = items.reduce((map, item) => {
      map[`${item.product.toString()}_${item.color}`] = item;
      return map;
    }, {});

    // Loop through the new cart items from the request body
    for (const newItem of cart.items) {
      // Validate id
      const isValid = mongoose.Types.ObjectId.isValid(newItem.product);
      // Invalid id
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid Product ID parameter.' });
      };

      const product = await Product.findById(newItem.product).select('price');
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product Not Found' });
      }

      const existingItemKey = `${newItem.product}_${newItem.color}`;
      const existingItem = existingItemsMap[existingItemKey];

      if (existingItem) {
        const product = await Product.findById(newItem.product);
        // Check if quantity is an integer equal to or greater than 1
        if (newItem.quantity <= 0 || !isInteger(newItem.quantity)) {
          return res.status(400).json({ success: false, message: 'Quantity must be an Integer greater than or equal to 1.' });
        }

        // Check if quantity exceeds the quantity of product in the store
        if (newItem.quantity > product.quantity) {
          return res.status(400).json({ success: false, message: 'Quantity exceeds the defined Limit.' });
        }
        // Replace the quantity if the item already exists in the cart
        existingItem.quantity = newItem.quantity;
      } else {
        const product = await Product.findById(newItem.product);
        // Check if quantity is an integer equal to or greater than 1
        if (newItem.quantity <= 0 || !isInteger(newItem.quantity)) {
          return res.status(400).json({ success: false, message: 'Quantity must be an Integer greater than or equal to 1.' });
        }

        // Check if quantity exceeds the quantity of product in the store
        if (newItem.quantity > product.quantity) {
          return res.status(400).json({ success: false, message: 'Quantity exceeds the defined Limit.' });
        }
        // Add new item to the cart
        items.push({
          product: newItem.product,
          quantity: newItem.quantity,
          color: newItem.color,
          price: product.price
        });
      }
    }

    // Calculate the total price
    const cartTotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    if (existingCart) {
      // Update the existing cart with the merged items and new total price
      existingCart.items = items;
      existingCart.cartTotal = cartTotal;
      await existingCart.save();

      // Respond with the updated existing cart
      return res.status(201).json({ success: true, message: 'Cart Updated', cart: existingCart });
    } else {
      // Create a new cart if no existing cart is found
      const newCart = new Cart({
        user: _id,
        items,
        cartTotal
      });
      await newCart.save();

      // Respond with the newly created cart
      return res.status(201).json({ success: true, message: 'New Cart Created', cart: newCart });
    }
  } catch (error) {
    next(error);
  }
};

// Define getUserCart function that allows authenticated users to
// retrieve all details of their existing cart if any

const getUserCart = async (req, res, next) => {
  // Get id from session
  const { _id } = req.user;

  try {
    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      // Return 404
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }
    // Retrieve the existing cart
    const existingCart = await Cart.findOne({ user: _id }).populate({
      path: 'items.product',
      select: '_id name price color'
    });

    if (!existingCart) {
      // Return 404
      return res.status(404).json({ success: false, message: 'Cart Not Found' });
    }

    if (existingCart.items.length === 0) {
      // Return a response indicating an empty cart
      return res.status(200).json({ success: true, message: 'Cart is empty' });
    }

    // Return success
    return res.status(200).json({ success: true, message: 'Cart retrieved successfully', cart: existingCart });
  } catch (error) {
    next(error);
  }
};

// Define clearCart function that allows authenticated users to remove
// all items from their cart

const clearCart = async (req, res, next) => {
  // Get id from user session
  const { _id } = req.user;

  try {
    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      // Return 404
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    // Retrieve the existing cart and delete user's ID
    const existingCart = await Cart.findOneAndDelete({ user: user._id });

    if (!existingCart) {
      // Return 404
      return res.status(404).json({ success: false, message: 'Cart Not Found' });
    }

    return res.status(200).json({ success: true, message: 'Cart successfully cleared'});
  } catch (error) {
    next(error);
  }
};

// Define removeProductFromCart that allows authenticated users to remove
// a single product based on its id from cart

const removeProductFromCart = async (req, res, next) => {
  // Get user id from session
  const { _id } = req.user;
  // Get id of product to remove
  const { productID } = req.body;

  try {
    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      // Return 404
      return res.status(404).json({ success: false, message: 'User Not Found' });
    }

    // Retrieve the existing cart
    const existingCart = await Cart.findOne({ user: _id });

    if (!existingCart) {
      // Return 404
      return res.status(404).json({ success: false, message: 'Cart Not Found' });
    }

    // Find the index of the product in the cart items array
    const productIndex = existingCart.items.findIndex(item => item.product.toString() === productID);

    if (productIndex === -1) {
      // Return 404 if the product is not found in the cart
      return res.status(404).json({ success: false, message: 'Product Not Found' });
    }

    // Remove the product from the cart items array
    existingCart.items.splice(productIndex, 1);

    // Recalculate the cart total
    existingCart.cartTotal = existingCart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    // Save the updated cart
    await existingCart.save();

    return res.status(200).json({
      success: true,
      message: 'Product successfully removed from cart',
      cart: existingCart
    });
  } catch (error) {
    next(error);
  }
};

export { userCart, getUserCart, clearCart, removeProductFromCart };
