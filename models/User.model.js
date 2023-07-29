const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: [true, "Password is required"],
  },
  repeatPassword: {
    type: String,
    required: [true, "Password does not match"],
  },

  isJobseeker: {
    type: Boolean,
    default: true,
  },

  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  aboutMe: {
    type: String,
  },

  dateOfBrith: {
    type: Date,
  },
  professionalExperience: {
    type: String,
  },

  companyLocation: {
    type: String,
    required: [true, "Location is required"],
  },
});

const User = model("User", userSchema);

module.exports = User;
