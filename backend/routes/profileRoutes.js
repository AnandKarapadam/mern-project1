const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const User = require("../models/userModel");

const { updateProfileImage } = require("../controllers/profileController");

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});
router.put(
  "/profile-image",
  (req, res, next) => {
    console.log("PUT /profile-image hit");
    next();
  },
  protect,
  upload.single("image"),
  updateProfileImage,
);

module.exports = router;
