const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  billNo: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
  },
  customerPhone: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  finalDate: {
    type: Date,
  },
  status: {
    type: String,
    default: "Active",
    enum: ["Active", "Closed"],
  },
  invoices: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Bill", billSchema);
