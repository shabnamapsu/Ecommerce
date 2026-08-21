import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded Token:", decoded);

    req.userId = decoded.id;

    next();

  } catch (error) {
    console.log("JWT Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};

export default isAuth;