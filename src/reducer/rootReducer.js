import branchReducer from './branchReducer';

import { combineReducers } from "redux";

const rootReducers = combineReducers({
    branch: branchReducer
});

export default rootReducers;
