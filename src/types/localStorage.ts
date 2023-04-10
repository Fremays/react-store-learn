export interface LocalState {
    local: string | null;
}

export enum LocalActionTypes {
    FETCH_LOCAL = 'FETCH_LOCAL',
    FETCH_LOCAL_SUCCESS = 'FETCH_LOCAL_SUCCESS'
}
interface FetchLocalAction {
    type: LocalActionTypes.FETCH_LOCAL;
}
interface FetchLocalSuccessAction {
    type: LocalActionTypes.FETCH_LOCAL_SUCCESS;
    payload: string
}

export type LocalAction = FetchLocalAction | FetchLocalSuccessAction