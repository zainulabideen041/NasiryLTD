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
  finalDate: {
    type: Date,
  },
  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
  ],
});

module.exports = mongoose.model("Bill", billSchema);
