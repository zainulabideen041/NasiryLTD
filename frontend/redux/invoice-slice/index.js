import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "http://localhost:7000/invoice";
// const baseURL = "https://nasiry-backend.vercel.app/invoice";

// Add Invoice
export const addInvoice = createAsyncThunk(
  "invoice/addInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/add`, invoiceData);
      return response.data.invoice;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseURL}/update`, invoiceData);
      return response.data.invoice;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Invoice
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (invoiceNo, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseURL}/delete/${invoiceNo}`);
      return invoiceNo; // return invoiceNo to remove it from local state
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: {
    invoices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Invoice
      .addCase(addInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        const index = state.invoices.findIndex(
          (inv) => inv.invoiceNo === updated.invoiceNo
        );

        if (index !== -1) {
          state.invoices[index] = updated;
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (inv) => inv.invoiceNo !== action.payload
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer;
