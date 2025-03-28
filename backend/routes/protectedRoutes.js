const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Example protected route
router.get("/", protect, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user, // Contains user data from JWT
  });
});

module.exports = router;
