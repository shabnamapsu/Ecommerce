import { Rating } from "../models/ratingSchema.js";


// Add Rating
export const addRating = async (req, res) => {
  try {
    const { userId, productId, rating, review } = req.body;

    // Check if user already rated
    const alreadyRated = await Rating.findOne({
      user: userId,
      product: productId,
    });

    if (alreadyRated) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this product.",
      });
    }

    const newRating = await Rating.create({
      user: userId,
      product: productId,
      rating,
      review,
    });

    res.status(201).json({
      success: true,
      message: "Rating added successfully.",
      rating: newRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Ratings by Product
export const getProductRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({
      product: req.params.productId,
    }).populate("user", "name");

    const totalRatings = ratings.length;

    const averageRating =
      totalRatings > 0
        ? (
            ratings.reduce((sum, item) => sum + item.rating, 0) /
            totalRatings
          ).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      totalRatings,
      averageRating,
      ratings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Rating
export const updateRating = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const updatedRating = await Rating.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        review,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Rating updated successfully.",
      rating: updatedRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Rating
export const deleteRating = async (req, res) => {
  try {
    await Rating.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Rating deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};