const mongoose = require("mongoose");
const { Schema } = mongoose;

const userProfileSchema = new Schema(
  {
    age: {
      max: 150,
      required: true,
      type: Number,
    },
    companies: [
      {
        trim: true,
        type: String,
      },
    ],
    headline: {
      maxlength: 140,
      trim: true,
      type: String,
    },
    qualifications: {
      required: true,
      trim: true,
      type: String,
    },
    summary: {
      maxlength: 1000,
      trim: true,
      type: String,
    },
    title: {
      trim: true,
      type: String,
    },
    username: {
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: "userProfile",
  }
);

userProfileSchema.index({ summary: "text", headline: "text" });

const UserProfile = mongoose.model('userProfile', userProfileSchema);
module.exports = UserProfile;