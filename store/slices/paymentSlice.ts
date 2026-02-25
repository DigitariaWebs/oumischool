import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  currentOrderId: string | null;
  currentOrderStatus: OrderStatus | null;
}

const initialState: PaymentState = {
  isLoading: false,
  error: null,
  currentOrderId: null,
  currentOrderStatus: null,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    paymentStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    paymentSuccess: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>,
    ) => {
      state.isLoading = false;
      state.currentOrderId = action.payload.orderId;
      state.currentOrderStatus = action.payload.status;
    },
    paymentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setOrderStatus: (state, action: PayloadAction<OrderStatus>) => {
      state.currentOrderStatus = action.payload;
    },
    resetPayment: (state) => {
      state.isLoading = false;
      state.error = null;
      state.currentOrderId = null;
      state.currentOrderStatus = null;
    },
  },
});

export const {
  paymentStart,
  paymentSuccess,
  paymentFailure,
  setOrderStatus,
  resetPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
