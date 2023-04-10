import {LocalAction, LocalActionTypes, LocalState} from "../../types/localStorage";

const initialState: LocalState = {
    local: "0",
}

export const localReducer = (state = initialState, action: LocalAction): LocalState => {
    switch (action.type) {
        case LocalActionTypes.FETCH_LOCAL:
            return {local: "0"}
        case LocalActionTypes.FETCH_LOCAL_SUCCESS:
            return {local: action.payload}
        default:
            return state
    }
}