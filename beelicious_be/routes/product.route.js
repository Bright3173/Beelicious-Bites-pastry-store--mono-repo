const express = require('express');
const {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller.js');
const protect = require('../middleware/auth.js');
const adminOnly = require('../middleware/admin.middleware.js');
const upload = require('../middleware/uploadMiddleware.js');
const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getOneProduct);

router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageTwo', maxCount: 1 },
  ]),
  addProduct,
);

router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageTwo', maxCount: 1 },
  ]),
  updateProduct,
);

router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
