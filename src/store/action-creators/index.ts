import * as UserActionCreators from './product'
import * as LocalActionCreators from "./local"

export default {
    ...UserActionCreators,
    ...LocalActionCreators
}