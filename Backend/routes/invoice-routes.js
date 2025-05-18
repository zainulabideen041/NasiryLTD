const express = require("express");
const router = express.Router();

const {
  AddInvoice,
  DeleteInvoice,
} = require("../controllers/invoice-controller");

router.post("/add", AddInvoice);
router.delete("/delete/:invoiceNo", DeleteInvoice);

module.exports = router;
