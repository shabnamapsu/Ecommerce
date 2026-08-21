import Wishlist from "../models/wishlist.js";

// ================= GET WISHLIST =================
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const wishlist = await Wishlist.findOne({ userId })
      .populate("products");

    // No wishlist yet
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: {
          userId,
          products: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      wishlist,
    });

  } catch (error) {
    console.log("GET WISHLIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get wishlist",
      error: error.message,
    });
  }
};


// ================= ADD / REMOVE WISHLIST =================
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    // ================= CREATE WISHLIST =================

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [productId],
      });

      await wishlist.populate("products");

      return res.status(201).json({
        success: true,
        added: true,
        message: "Added to wishlist",
        wishlist,
      });
    }


    // ================= CHECK PRODUCT =================

    const exists = wishlist.products.some(
      (id) => id.toString() === productId.toString()
    );


    // ================= REMOVE =================

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId.toString()
      );

      await wishlist.save();

      await wishlist.populate("products");

      return res.status(200).json({
        success: true,
        added: false,
        message: "Removed from wishlist",
        wishlist,
      });
    }


    // ================= ADD =================

    wishlist.products.push(productId);

    await wishlist.save();

    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      added: true,
      message: "Added to wishlist",
      wishlist,
    });

  } catch (error) {
    console.log("ADD WISHLIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Wishlist error",
      error: error.message,
    });
  }
};


// ================= REMOVE FROM WISHLIST =================
export const removeWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "userId and product id are required",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== id.toString()
    );

    await wishlist.save();

    await wishlist.populate("products");

    return res.status(200).json({
      success: true,
      message: "Removed successfully",
      wishlist,
    });

  } catch (error) {
    console.log("REMOVE WISHLIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};