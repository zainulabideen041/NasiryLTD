import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://nasiry-backend.vercel.app/bill";

const initialState = {
  bills: [],
  bill: null,
  isLoading: false,
  error: null,
};

// Create a new bill
export const createBill = createAsyncThunk(
  "bills/createBill",
  async (billData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseURL}/create`, billData);
      return res.data.bill;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get bill by billNo
export const getBillByNo = createAsyncThunk(
  "bills/getBillByNo",
  async (billNo, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}/display/${billNo}`);
      return res.data.bill;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all bills
export const getAllBills = createAsyncThunk(
  "bills/getAllBills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseURL}/display-all`);
      return res.data.bills;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update bill
export const updateBill = createAsyncThunk(
  "bills/updateBill",
  async ({ billNo, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${baseURL}/update/${billNo}`, updatedData);
      return res.data.bill;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Delete bill
export const deleteBill = createAsyncThunk(
  "bills/deleteBill",
  async (billNo, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${baseURL}/delete`, billNo);
      return billNo;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//Close bill
export const closeBill = createAsyncThunk(
  "bills/closeBill",
  async (billNo, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseURL}/close`, billNo);
      return res.data.bill;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const billSlice = createSlice({
  name: "bills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload;
      })
      .addCase(getAllBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get One
      .addCase(getBillByNo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBillByNo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bill = action.payload;
      })
      .addCase(getBillByNo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedBill = action.payload;
        state.bills = state.bills.map((bill) =>
          bill.billNo === updatedBill.billNo ? updatedBill : bill
        );
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //Delete
      .addCase(deleteBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedBillNo = action.payload;
        state.bills = state.bills.filter(
          (bill) => bill.billNo !== deletedBillNo
        );
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //Close
      .addCase(closeBill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(closeBill.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedBill = action.payload;
        state.bills = state.bills.map((bill) =>
          bill.billNo === updatedBill.billNo ? updatedBill : bill
        );
      })
      .addCase(closeBill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default billSlice.reducer;
