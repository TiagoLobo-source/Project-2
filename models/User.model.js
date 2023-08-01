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
    
  },

  isJobseeker: {
    type: Boolean,
    default: true,
  },

  firstName: {
    type: String,
   
  },
  lastName: {
    type: String,
    
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
   
  },
});

const User = model("User", userSchema);

module.exports = User;
