const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Get user from database to check if user still exists and get current role
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { 
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }; // Attach user data to request object
    
    next(); // Continue to the next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

// Middleware to restrict access based on roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `You do not have permission to perform this action. Only ${roles.join(', ')} can access this route.` 
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
