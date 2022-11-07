import {combineReducers} from "redux"
import {configureStore} from '@reduxjs/toolkit'
import fileReducer from "./fileReducer"
import usersReducer from "./usersReducer"
import userReducer from "./userReducer"
import uploadReducer from "./uploadReducer"
import appReducer from "./appReducer"

const rootReducer = combineReducers({
    user: userReducer,    
    files: fileReducer,
    users: usersReducer,
    upload: uploadReducer,
    app: appReducer
})

export const store = configureStore({reducer: rootReducer})


