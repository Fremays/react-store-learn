import {combineReducers} from "redux";
import {productReducer} from "./productReducer";
import {localReducer} from "./localStorageReducer";


export const rootReducer = combineReducers({
    product: productReducer,
    local: localReducer
})


export type RootState = ReturnType<typeof rootReducer>