import Product from '../models/productModel.mjs';
import capitalizeFirstLetter from '../utils/capitalizeName.mjs';
import slugify from 'slugify';

// ===================================================START ADMIN PRODUCT RELATED ACTIONS=======================================================================================================
// Define adminCreateProduct function that allows the admin to add a product to the DB

const adminCreateProduct = async (req, res) => {
  // Destructure body
  const { name, description, quantity, brand, color, price, images, category } = req.body;
  try {
    // Capitalized necessary fields
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
      images,
      category
    });

    await newProduct.save();

    // Return a valid response with new product details
    res.status(201).json({ success: true, message: 'New Product successfully Added', details: newProduct });
  } catch (error) {
    console.log('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define adminModifyProduct function that allows the admin to modify specific product details based on ID

const adminModifyProduct = async (req, res) => {
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
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, message: 'Product details successfully modified.', details: modifiedProduct });
  } catch (error) {
    console.error('Error modifying product:', error);
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define adminDeleteProduct function that allows the admin to delete a specific product based on ID

const adminDeleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'No product Found' });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Product details successfully deleted' });
  } catch (error) {
    console.log('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// ==============================================================END ADMIN PRODUCT RELATED ACTIONS===============================================================================================

// ==========================================================START ANY-USER PRODUCT RELATED ACTIONS=================================================================================================

// Define viewOneProduct that returns all details associated with one product based on ID

const viewOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'No product Found' });
    }

    res.status(200).json({ success: true, message: 'Product details successfully retrieved.', details: product });
  } catch (error) {
    console.log('Error retrieving product:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// Define getAllProducts that returns all available products in the DB

const getAllProducts = async (req, res) => {
  try {
    // Check if req.query is null or empty
    if (!req.query || Object.keys(req.query).length === 0) {
      // If no query parameters provided, return all products
      const allProducts = await Product.find();

      if (allProducts.length === 0) {
        return res.status(200).json({ success: true, message: 'No products available' });
      }

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

    res.status(200).json({ success: true, message: 'Products successfully retrieved.', products: allProducts });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

// ==========================================================END ANY-USER PRODUCT RELATED ACTIONS=================================================================================================

export { adminCreateProduct, adminModifyProduct, adminDeleteProduct, viewOneProduct, getAllProducts };
