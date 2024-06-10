import Product from '../models/productModel.mjs';
import User from '../models/userModel.mjs';
import capitalizeFirstLetter from '../utils/capitalizeName.mjs';
import slugify from 'slugify';

// ===================================================START ADMIN PRODUCT RELATED ACTIONS=======================================

// Admin function to create a new product
const adminCreateProduct = async (req, res, next) => {
  // Destructure body
  const { name, description, quantity, brand, color, price, category } = req.body;
  try {
    // Capitalize necessary fields
    const capitalizedName = await capitalizeFirstLetter(name);
    const capitalizedDescription = await capitalizeFirstLetter(description);
    const capitalizedBrand = await capitalizeFirstLetter(brand);

    // Create slug
    const slug = slugify(name, {
      replacement: '-',
      lower: true
    });

    // Create new Product
    const newProduct = new Product({
      name: capitalizedName,
      description: capitalizedDescription,
      slug,
      quantity,
      brand: capitalizedBrand,
      color,
      price,
      category
    });

    // Save the new product to the database
    await newProduct.save();

    // Return a valid response with new product details
    return res.status(201).json({ success: true, message: 'New Product successfully added', details: newProduct });
  } catch (error) {
    next(error);
  }
};

// Admin function to modify specific product details based on ID
const adminModifyProduct = async (req, res, next) => {
  // Get product id from params
  const { id } = req.params;
  try {
    // Check if the name field is being modified
    if (req.body.name) {
      // Generate the new slug based on the modified name
      req.body.slug = slugify(req.body.name, {
        replacement: '-',
        lower: true
      });
    }
    const modifiedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!modifiedProduct) {
      // If product not found, send a 404 response
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Send success response
    return res.status(200).json({ success: true, message: 'Product details successfully modified.', details: modifiedProduct });
  } catch (error) {
    next(error);
  }
};

// Admin function to delete a specific product based on ID
const adminDeleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      // If product not found, send a 404 response
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Send success response
    return res.status(200).json({ success: true, message: 'Product successfully deleted' });
  } catch (error) {
    next(error);
  }
};

// ==========================================================END ADMIN PRODUCT RELATED ACTIONS========================

// ==========================================================START ANY-USER PRODUCT RELATED ACTIONS==================

// Function to view a specific product by ID (accessible by any user)
const viewOneProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      // If product not found, send a 404 response
      return res.status(404).json({ success: false, message: 'No product found' });
    }

    // Send success response with product details
    return res.status(200).json({ success: true, message: 'Product details successfully retrieved.', details: product });
  } catch (error) {
    next(error);
  }
};

// Function to get all products (accessible by any user)
const getAllProducts = async (req, res, next) => {
  try {
    // Check if req.query is null or empty
    if (!req.query || Object.keys(req.query).length === 0) {
      // If no query parameters provided, return all products
      const allProducts = await Product.find();

      if (allProducts.length === 0) {
        return res.status(200).json({ success: true, message: 'No products available' });
      }

      // Send success response with all products
      return res.status(200).json({ success: true, message: 'All products successfully retrieved.', products: allProducts });
    }

    // Get query parameters
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc', name, brand, category, minPrice, maxPrice } = req?.query;

    // Build query options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: {
        [sortBy]: order === 'asc' ? 1 : -1
      }
    };

    // Filter products based on query parameters
    const query = {};

    if (name) {
      query.name = new RegExp(name, 'i');
    }

    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    if (category) {
      query.category = new RegExp(category, 'i');
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Retrieve paginated and filtered products
    const allProducts = await Product.paginate(query, options);

    // Check if products are found
    if (allProducts.docs.length === 0) {
      return res.status(200).json({ success: true, message: 'No products matching the criteria available.' });
    }

    // Send success response with filtered products
    return res.status(200).json({ success: true, message: 'Products successfully retrieved.', products: allProducts });
  } catch (error) {
    next(error);
  }
};

// Define addToWishlist function that allows authenticated users to add
// different products to their wishlist

const addToWishlist = async (req, res, next) => {
  // Get _id from user session
  const { _id } = req.user;
  // Get productID from req.body
  const { productID } = req.body;

  try {
    // Check if user exists based on ID
    const user = await User.findById(_id);

    if (!user) {
      // Return 404 if user not found
      return res.status(404).json({ success: false, message: 'User Not Found.' });
    }

    // Check if product exists based on productID
    const product = await Product.findById(productID);

    if (!product) {
      // Return 404 if product not found
      return res.status(404).json({ success: false, message: 'Product Not Found.' });
    }

    // Check if product has already been added to wishlist
    const productAlreadyAdded = user.wishlist.includes(productID);

    if (productAlreadyAdded) {
      // Remove product from wishlist
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: productID } },
        { new: true }
      );
      // Return response
      return res.status(200).json({ success: true, message: 'Product successfully removed from wishlist.', details: updatedUser });
    } else {
      // Add product to wishlist
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: productID } },
        { new: true }
      );
      // Return response
      return res.status(200).json({ success: true, message: 'Product successfully added to wishlist.', details: updatedUser });
    }
  } catch (error) {
    next(error);
  }
};

// Define getWishlist function that allows authenticated users
// to view all products in their wishlist

const getWishlist = async (req, res, next) => {
  // Get _id from user session
  const { _id } = req.user;

  try {
    // Check if user exists based on ID
    const user = await User.findById(_id).populate('wishlist');

    if (!user) {
      // Return 404 if user not found
      return res.status(404).json({ success: false, message: 'User Not Found.' });
    }

    // Return response with wishlist details
    return res.status(200).json({
      success: true,
      message: user.wishlist.length > 0 ? 'Wishlist retrieved successfully.' : 'Wishlist is empty.',
      details: user.wishlist,
      count: user.wishlist.length
    });
  } catch (error) {
    next(error);
  }
};

// Define rateProduct that allows authenticated users
// to rate a specific product

const rateProduct = async (req, res, next) => {
  // Get _id from user session
  const { _id } = req.user;
  // Get star and productID from req.body
  const { star, productID, comment } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User Not Found.' });
    }

    // Check if product exists
    const product = await Product.findById(productID);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product Not Found.' });
    }

    // Check if user has already rated the product
    const userRating = product.ratings.find(ratingObj => ratingObj.postedBy.toString() === _id.toString());

    if (userRating) {
      // Update existing user rating
      if (star) userRating.star = star;
      if (comment) userRating.comment = comment;
    } else {
      // Add new rating
      product.ratings.push({ star, comment, postedBy: _id });
    }

    // Calculate total rating
    const totalRatings = product.ratings.reduce((acc, ratingObj) => acc + ratingObj.star, 0);
    product.totalRating = (totalRatings / product.ratings.length).toFixed(1);

    // Save the updated product
    await product.save();

    // Fetch updated product for response
    const updatedProduct = await Product.findById(productID);

    return res.status(200).json({
      success: true,
      message: 'Product rated successfully.',
      details: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================================END ANY-USER PRODUCT RELATED ACTIONS====================

export { adminCreateProduct, adminModifyProduct, adminDeleteProduct, viewOneProduct, getAllProducts, addToWishlist, getWishlist, rateProduct };
