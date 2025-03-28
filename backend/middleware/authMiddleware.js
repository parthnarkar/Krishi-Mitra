const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    req.user = decoded; // Attach user data to request object
    next(); // Continue to the next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = { protect };
