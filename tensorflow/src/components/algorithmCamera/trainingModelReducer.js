import { createSlice } from "@reduxjs/toolkit";

export const trainingModelSlice = createSlice({
    name:'trainingModel',
    initialState:{
        obj:{}
    },
    reducers:{
        storageTrainingModel:(state,action)=>{
            state.obj = action.payload
        }
    }

})
export const {storageTrainingModel} = trainingModelSlice.actions
export const selectTrainingModel = state => state.trainingModel.obj
export default trainingModelSlice.reducer