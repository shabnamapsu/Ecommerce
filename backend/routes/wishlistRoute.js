import express from "express";

import {
  getWishlist,
  removeWishlist,
  addToWishlist,
} from "../controller/wishlistController.js";

const wishlistrouter = express.Router();

wishlistrouter.get("/:userId", getWishlist);
wishlistrouter.post("/add", addToWishlist);
wishlistrouter.delete("/:id", removeWishlist);

export default wishlistrouter;