const express = require("express");
const router = express.Router();

const {
  CreateBill,
  UpdateBill,
  DisplayBill,
  DisplayBills,
  DeleteBill,
} = require("../controllers/bill-controller");

router.post("/create", CreateBill);
router.put("/update/:billNo", UpdateBill);
router.get("/display/:billNo", DisplayBill);
router.get("/display-all", DisplayBills);
router.delete("/delete", DeleteBill);

module.exports = router;
