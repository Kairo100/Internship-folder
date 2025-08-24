// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit'

// import { getListOfOrders } from 'src/apis/orders'
import axios from 'axios'

interface DataParams {
  q: string
  role: string
  status: string
  currentPlan: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** List Orders
export const listOrders = createAsyncThunk('orders/list', async () => {
  // const response = await axios.get('/apps/users/list', {
  //   params
  // })

  // const resData = await getListOfOrders();
  const resData: any = []

  return resData.data
})

export const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<any>) => {
    builder.addCase(listOrders.fulfilled, (state, action) => {
      state.data = action.payload

      // state.total = action.payload.total
      // state.params = action.payload.params
      // state.allData = action.payload.allData
    })
  }
})

export default orderSlice.reducer
