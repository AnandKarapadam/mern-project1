import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import adminReducer from './adminSlice';

const store = configureStore({
    reducer:{
        users:userReducer,
        admin:adminReducer
    }
})

export default store;