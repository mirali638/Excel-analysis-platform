const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Create Profile model based on the schema
const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
