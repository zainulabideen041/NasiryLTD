const express = require("express");
const router = express.Router();

const {
  AddInvoice,
  UpdateInvoice,
  DeleteInvoice,
} = require("../controllers/invoice-controller");

router.post("/add", AddInvoice);
router.put("/update", UpdateInvoice);
router.delete("/delete/:invoiceNo", DeleteInvoice);

module.exports = router;
