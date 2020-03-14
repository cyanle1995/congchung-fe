
const initialState = {
    branch: {},
}

export default function branchReducer(state = initialState, action) {

    switch (action.type) {
        case 'GET_BRANCH':
            return {
                ...state,
                branch: action.payload,
            }
        default:
            return state;
    }
}
