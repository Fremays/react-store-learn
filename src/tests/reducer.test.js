import {localReducer} from "../store/reducers/localStorageReducer";
import {LocalAction, LocalActionTypes} from "../types/localStorage";

// eleventh and twelfth test
describe("local reducer", () =>{
    test('FetchLocalSuccessAction to be success', () =>{
        expect(localReducer({local: "0"}, {
            type: LocalActionTypes.FETCH_LOCAL_SUCCESS,
            payload: "25"
        })).toEqual({"local": "25"})
    })
    test('initial to be zero', () =>{
        expect(localReducer(null, {type: LocalActionTypes.FETCH_LOCAL})).toEqual({"local": "0"})
    })
})