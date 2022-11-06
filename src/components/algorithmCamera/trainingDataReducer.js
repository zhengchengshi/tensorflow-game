import { createSlice } from "@reduxjs/toolkit";

export const trainingDataSlice = createSlice({
    name:'trainingData',
    initialState:{
        obj:{}
    },
    reducers:{
        storageTrainingData:(state,action)=>{
            state.obj = action.payload
        }
    }

})
export const {storageTrainingData} = trainingDataSlice.actions
export const selectTraingData = state => state.trainingData.obj
export default trainingDataSlice.reducer