import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import billReducer from "./bill-slice";
import invoiceReducer from "./invoice-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bill: billReducer,
    invcoice: invoiceReducer,
  },
});
