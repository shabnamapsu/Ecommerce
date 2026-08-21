import Shop from "../models/shop.js";

// ================= CREATE SHOP =================
export const createShop = async (req, res) => {
  try {
    const { name, city, state, country, address } = req.body;

    let image = "";

    if (req.file) {
      image = req.file.filename;
    }

    const shop = await Shop.create({
      name,
      city,
      state,
      country,
      address,
      image,
      owner: req.userId,
    });

    await shop.populate("owner", "name email");

    return res.status(201).json({
      success: true,
      message: "Shop Created Successfully",
      shop,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY SHOP =================
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({
      owner: req.userId,
    }).populate("owner", "name email");

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      shop,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE SHOP =================
export const updateShop = async (req, res) => {
  try {
    const { name, city, state, country, address } = req.body;

    const shop = await Shop.findOne({
      owner: req.userId,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    if (req.file) {
      shop.image = req.file.filename;
    }

    shop.name = name || shop.name;
    shop.city = city || shop.city;
    shop.state = state || shop.state;
    shop.country = country || shop.country;
    shop.address = address || shop.address;

    await shop.save();

    await shop.populate("owner", "name email");

    return res.status(200).json({
      success: true,
      message: "Shop Updated Successfully",
      shop,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE SHOP =================
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndDelete({
      owner: req.userId,
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shop Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET ALL SHOPS =================
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find()
      .populate("owner", "name email")
      .populate("items");

    return res.status(200).json({
      success: true,
      total: shops.length,
      shops,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET SHOP BY ID =================
export const getShopById = async (req, res) => {
  try {
    console.log("Params:", req.params);

    const { id } = req.params;

    const shop = await Shop.findById(id)
      .populate("owner", "name email");

    console.log("Shop:", shop);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "Shop not found",
      });
    }

    res.status(200).json({
      success: true,
      shop,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};