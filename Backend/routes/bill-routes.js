const express = require("express");
const router = express.Router();

const {
  CreateBill,
  UpdateBill,
  DisplayBill,
  DisplayBills,
  DeleteBill,
  CloseBill,
} = require("../controllers/bill-controller");

router.post("/create/:userid", CreateBill);
router.put("/update/:billNo", UpdateBill);
router.get("/display/:billNo", DisplayBill);
router.get("/display-all/:userid", DisplayBills);
router.post("/close/:billNo", CloseBill);
router.delete("/delete/:billNo", DeleteBill);

module.exports = router;
