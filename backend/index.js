import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { DBconnection } from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoutes.js";
import shopRouter from "./routes/shopRoute.js";
import wishlistrouter from "./routes/wishlistRoute.js";
import ratingRoute from "./routes/ratingRoute.js";

dotenv.config();

const app = express();

// =====================================================
// COOKIE PARSER
// =====================================================

app.use(cookieParser());

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =====================================================
// STATIC FILES
// =====================================================

app.use(
  "/public/temp",
  express.static("public/temp")
);

// =====================================================
// DATABASE
// =====================================================

DBconnection();

// =====================================================
// ROUTES
// =====================================================

app.use("/api/auth", authRoute);

app.use("/api/products", productRoute);

app.use("/api/cart", cartRoutes);

app.use("/api/wishlist", wishlistrouter);

app.use("/api/rating", ratingRoute);

app.use("/api/shop", shopRouter);

// =====================================================
// FRONTEND
// =====================================================

const _dirname = path.resolve();

const frontendPath = path.join(
  _dirname,
  "../frontend/dist"
);

app.use(
  express.static(frontendPath)
);

// =====================================================
// REACT ROUTES
// =====================================================

app.get(/(.*)/, (req, res) => {
  res.sendFile(
    path.join(
      frontendPath,
      "index.html"
    )
  );
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});