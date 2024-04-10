import { csrfFetch } from './csrf';

// Spot
// const CREATE_SPOT = "session/createSpot";
// const GET_SPOT = "session/getSpot";
// const UPDATE_SPOT = "session/updateSpot";
// const DELETE_SPOT = "session/deleteSpot"
const LOAD_SPOTS = "session/loadSpots";

// Actions
const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
};

//Thunk actions
export const loadSpotsThunk = () => async dispatch => {
    const res = await csrfFetch('/api/spots');
    const data = await res.json();
    dispatch(loadSpots(data));
    return res;
}

// Selectors
// const getSpots = state => state.spots.spots;


// Reducer
const initialState = {};

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            // const newObj = {};
            // action.payload.Spots.forEach(el => newObj[el.id] = el);

            return {...state, spots: action.payload.Spots}
        }

        default: return state;
    }
}

export default spotReducer;