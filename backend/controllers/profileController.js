const Profile = require("../models/Profile");

// Get or auto-create profile, and update profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user_id: req.user.id }).select(
      "-__v"
    );

    if (!profile) {
      profile = await Profile.create({
        user_id: req.user.id,
        name: req.user.name || "",
        email: req.user.email || "",
        phone: "",
        address: "",
      });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const updatedProfile = await Profile.findOneAndUpdate(
      { user_id: req.user.id },
      { name, email, phone, address },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProfile, updateProfile };
