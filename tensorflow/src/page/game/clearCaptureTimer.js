import { createSlice } from "@reduxjs/toolkit";

export const clearCaptureTimerSlice = createSlice({
    name:'clearCaptureTimer',
    initialState:{
        flag:false
    },
    reducers:{
        storageClearCaptureTimer:(state,action)=>{
            state.flag = action.payload
        }
    }

})
export const {storageClearCaptureTimer} = clearCaptureTimerSlice.actions
export const selectClearCaptureTimer = state => state.clearCaptureTimer.flag
export default clearCaptureTimerSlice.reducer