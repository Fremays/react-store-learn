import {LocalAction, LocalActionTypes} from "../../types/localStorage";
import {Dispatch} from "redux";
import {ProductActionTypes} from "../../types/product";

export const fetchLocal = () => {
    return (dispatch: Dispatch<LocalAction>) => {

            dispatch({type: LocalActionTypes.FETCH_LOCAL})
            const response = localStorage.getItem("products") || "0"
            dispatch({type: LocalActionTypes.FETCH_LOCAL_SUCCESS, payload: response})
    }
}
