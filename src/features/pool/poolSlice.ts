import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBalancesAPI } from "./poolAPI";

export interface PoolState {
  balances: {
    tokenOneBalance: BigInt;
    tokenTwoBalance: BigInt;
    tokenThreeBalance: BigInt;
    lpTokenBalance: BigInt;
  };
  isApproved: boolean;
  exchange: {
    loadingExchangeRate: boolean;
    exchangeIn: number;
    expectedExchangeOut: BigInt;
  };
}

const initialState: PoolState = {
  balances: {
    tokenOneBalance: BigInt(0),
    tokenTwoBalance: BigInt(0),
    tokenThreeBalance: BigInt(0),
    lpTokenBalance: BigInt(0),
  },
  isApproved: false,
  exchange: {
    loadingExchangeRate: false,
    exchangeIn: 0,
    expectedExchangeOut: BigInt(0),
  },
};

export const fetchBalances = createAsyncThunk(
  "pool/fetchBalances",
  async (amount: number) => {
    await fetchBalancesAPI();
    // The value we return becomes the `fulfilled` action payload
  }
);

export const poolSlice = createSlice({
  name: "pool",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBalances.fulfilled, (state, action) => {});
  },
});

export default poolSlice.reducer;
