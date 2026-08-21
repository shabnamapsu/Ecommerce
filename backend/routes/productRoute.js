import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

import { upload } from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Create Product
router.post(
  "/create",
  isAuth,
  upload.single("image"),
  createProduct
);

// Get All Products (Public)
router.get("/", getProducts);

// Get Single Product (Public)
router.get("/:id", getProductById);

// Update Product
router.put(
  "/update/:id", 
  upload.single("image"),
  updateProduct
);

// Delete Product
router.delete(
  "/delete/:id",
  deleteProduct
);

export default router;