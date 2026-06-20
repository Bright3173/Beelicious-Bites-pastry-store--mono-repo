const Product = require('../models/product.model.js');
const uploadToCloudinary = require('../utils/uploadToCloudinary.js');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    let image = '';
    let imageTwo = '';
    if (req.files?.image?.[0]) {
      image = await uploadToCloudinary(req.files.image[0]);
    }
    if (req.files?.imageTwo?.[0]) {
      imageTwo = await uploadToCloudinary(req.files.imageTwo[0]);
    }

    const product = await Product.create({ ...req.body, image, imageTwo });
    console.log(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    let image = existingProduct.image;
    let imageTwo = existingProduct.imageTwo;

    if (req.files?.image?.[0]) {
      image = await uploadToCloudinary(req.files.image[0]);
    }

    if (req.files?.imageTwo?.[0]) {
      imageTwo = await uploadToCloudinary(req.files.imageTwo[0]);
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image,
        imageTwo,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await Product.findByIdAndDelete(id);

    if (!deleteProduct) {
      return res.status(404).json({ message: 'Product does not exist' });
    }

    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
