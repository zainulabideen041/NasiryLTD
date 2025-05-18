const Bill = require("../models/Bill");

const CreateBill = async (req, res) => {
  try {
    const { customerName, customerAddress, customerPhone } = req.body;

    if (!customerName || !customerAddress) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    const latestBill = await Bill.findOne().sort({ billNo: -1 }).limit(1);

    const newBillNo = latestBill ? Number(latestBill.billNo) + 1 : 1;

    const bill = new Bill({
      billNo: newBillNo.toString(),
      customerName,
      customerAddress,
      customerPhone,
    });

    await bill.save();

    res.json({
      success: true,
      message: "Bill Created Successfully",
      bill,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).error({
      success: false,
      message: "Failed to create bill.",
      error: error,
    });
  }
};

const DisplayBill = async (req, res) => {
  try {
    const { billNo } = req.params;

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.json("No Bill Found!");
    }

    res.json({
      success: true,
      bill,
    });
  } catch (error) {
    console.error("Error Displaying bill:", error);
    res.status(500).error({
      success: false,
      message: "Failed to Display bill.",
      error: error,
    });
  }
};

const DisplayBills = async (req, res) => {
  try {
    const bills = await Bill.find();

    if (!bills) {
      return res.json("No Bills Found!");
    }

    res.json({
      success: true,
      bills,
    });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).error({
      success: false,
      message: "Failed to create bill.",
      error: error,
    });
  }
};

const UpdateBill = async (req, res) => {
  try {
    const { billNo } = req.params;
    const { customerName, customerAddress, customerPhone, finalDate, status } =
      req.body;

    const bill = await Bill.findOne({ billNo });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found.",
      });
    }

    // Update fields if they are provided in request body
    if (customerName) bill.customerName = customerName;
    if (customerAddress) bill.customerAddress = customerAddress;
    if (customerPhone) bill.customerPhone = customerPhone;
    if (finalDate) bill.finalDate = finalDate;
    if (status) bill.status = status;

    await bill.save();

    res.json({
      success: true,
      message: "Bill updated successfully.",
      bill,
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update bill.",
      error: error.message,
    });
  }
};

module.exports = { CreateBill, DisplayBill, DisplayBills, UpdateBill };
