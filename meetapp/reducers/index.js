import {combineReducers} from "redux"
import auth from "./auth";
import filters from "./filters";
import profile from "./createProfile";

export const rootReducer = combineReducers({auth, filters, profile});