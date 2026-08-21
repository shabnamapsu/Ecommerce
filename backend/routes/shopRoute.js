import express from "express";
import { upload } from "../middleware/multer.js";
import isAuth from "../middleware/isAuth.js";

import {
  createShop,
  updateShop,
  getMyShop,
  deleteShop,
  getAllShops,
  getShopById,
} from "../controller/shopController.js";

const shopRouter = express.Router();

shopRouter.post("/create", isAuth, upload.single("image"), createShop);

shopRouter.put("/update", isAuth, upload.single("image"), updateShop);

shopRouter.get("/get-shop", isAuth, getMyShop);

shopRouter.get("/all", getAllShops);

shopRouter.get("/:id", getShopById);

shopRouter.delete("/delete", isAuth, deleteShop);

export default shopRouter;