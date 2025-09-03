import { configureStore } from "@reduxjs/toolkit";
import tabReducer from '../slices/tabs/tabSlice';

export default configureStore({
    reducer: tabReducer,
});