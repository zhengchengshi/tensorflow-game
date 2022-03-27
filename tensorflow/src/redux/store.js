import { configureStore } from '@reduxjs/toolkit'
import trainingDataReducer from '../components/algorithmCamera/trainingDataReducer'
import trainingModelReducer from '../components/algorithmCamera/trainingModelReducer'
import clearCaptureTimerReducer from '../page/game/clearCaptureTimer'
const store = configureStore({
    reducer:{
        trainingData:trainingDataReducer,
        trainingModel:trainingModelReducer,
        clearCaptureTimer:clearCaptureTimerReducer
    },
})
export default store