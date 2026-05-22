const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    telephone: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      enum: ["Algeria", "Morocco", "Egypt"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
  },
  { timestamps: true },
);

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
