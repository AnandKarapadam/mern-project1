const User = require("../models/userModel");

exports.updateProfileImage = async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const updateData = {};

    
    if (req.body.name) {
      updateData.name = req.body.name;
    }

 
    if (req.body.email) {
      updateData.email = req.body.email;
    }


    if (req.file) {

      const imageUrl =
        req.file.secure_url ||
        req.file.path;

      if (!imageUrl) {
        return res.status(500).json({ message: "File upload failed" });
      }

      updateData.profileImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {

    console.error("Error updating profile:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });

  }
};
