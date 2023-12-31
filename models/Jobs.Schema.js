const { text } = require("express");
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const jobSchema = new Schema({
  companyName: {
    type: String,
  },
  title: {
    type: String,
    //required: [true, "Job title is required"],
  },
  description: {
    type: String,
    //required: [true, "Description: is required"],
  },
  location: {
    type: String,
    //required: [true, "Location is required"],
  },

  postedBy: {
    type: Schema.Types.ObjectId,
    reference: "User",
  },
  appliedBy: [
    {
      type: Schema.Types.ObjectId,
      reference: "User",
    },
  ],

  postedJob: {
    type: Boolean,
    default: true,
  },

  industry: {
    type: String,
    //required: [true, "Industry is required"],
  },

  contractType: {
    type: String,
    enum: ["Part-time", "Full-time", "Contract", "Freelance"],
    //required: [true, "Contract type is required"],
  },

  salary: {
    type: String,
    //required: [true, "Salary is required"],
  },

  responsibilities: {
    type: String,
    //required: [true, "Responsabilities is required"],
  },

  qualifications: {
    type: String,
    //required: [true, "Qualifications is required"]
  },
});

const Jobs = model("jobs", jobSchema);

module.exports = Jobs;
