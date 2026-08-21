import express from "express";
import { addRating, deleteRating, getProductRatings, updateRating } from "../controller/ratingController.js";

const router = express.Router();

// Add Rating
router.post("/add",  addRating);

// Get All Ratings of a Product
router.get("/:productId", getProductRatings);

// Update Rating
router.put("/update/:id", updateRating);

// Delete Rating
router.delete("/delete/:id", deleteRating);

export default router;