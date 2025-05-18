const express = require("express");
const router = express.Router();

const {
  CreateBill,
  UpdateBill,
  DisplayBill,
  DisplayBills,
} = require("../controllers/bill-controller");

router.post("/create", CreateBill);
router.put("/update/:billNo", UpdateBill);
router.get("/display/:billNo", DisplayBill);
router.get("/display-all", DisplayBills);

module.exports = router;
