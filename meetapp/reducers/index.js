import {combineReducers} from "redux"
import auth from "./auth";
import filters from "./filters";
import profile from "./createProfile";
import chat from "./chat"

export const rootReducer = combineReducers({auth, filters, profile, chat});