import express from "express";

import {
  addToCart,
  clearCart,
  getCart,
  removeItem,
  updateCart,
} from "../controller/cartController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();


// ADD
router.post(
  "/add",
  isAuth,
  addToCart
);


// GET
router.get(
  "/:userId",
  isAuth,
  getCart
);


// UPDATE
router.post(
  "/update",
  isAuth,
  updateCart
);


// REMOVE
router.post(
  "/remove",
  isAuth,
  removeItem
);


// CLEAR
router.delete(
  "/clear/:userId",
  isAuth,
  clearCart
);

export default router;