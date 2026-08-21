import Cart from "../models/cart.js";

// =====================================================
// GET CART
// =====================================================

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({ userId })
      .populate("items.productId");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          userId,
          items: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
      items: cart.items,
    });

  } catch (error) {
    console.log("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get cart",
      error: error.message,
    });
  }
};


// =====================================================
// ADD TO CART
// =====================================================

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      productId,
      quantity = 1,
    } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    let cart = await Cart.findOne({
      userId,
    });

    // ==========================================
    // CREATE NEW CART
    // ==========================================

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            productId,
            quantity: Number(quantity),
          },
        ],
      });
    }

    // ==========================================
    // EXISTING CART
    // ==========================================

    else {
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() ===
          productId.toString()
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          productId,
          quantity: Number(quantity),
        });
      }

      await cart.save();
    }

    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });

  } catch (error) {
    console.log("ADD CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE CART QUANTITY
// =====================================================

export const updateCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
    } = req.body;

    if (
      !userId ||
      !productId ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "userId, productId and quantity are required",
      });
    }

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() ===
        productId.toString()
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // ==========================================
    // REMOVE IF QUANTITY <= 0
    // ==========================================

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          item.productId.toString() !==
          productId.toString()
      );
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
      items: cart.items,
    });

  } catch (error) {
    console.log("UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
};


// =====================================================
// REMOVE SINGLE ITEM
// =====================================================

export const removeItem = async (req, res) => {
  try {
    const {
      userId,
      productId,
    } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message:
          "userId and productId are required",
      });
    }

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !==
        productId.toString()
    );

    await cart.save();

    await cart.populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
      items: cart.items,
    });

  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove product",
      error: error.message,
    });
  }
};


// =====================================================
// CLEAR CART
// =====================================================

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });

  } catch (error) {
    console.log("CLEAR CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};