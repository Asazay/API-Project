import { csrfFetch } from "./csrf";
import {createSelector} from 'reselect';

// Spot
const CREATE_SPOT = "session/createSpot";
const GET_SPOT = "session/getSpot";
const GET_USER_SPOTS = "session/getUserSpots"
const UPDATE_SPOT = "session/updateSpot";
// const DELETE_SPOT = "session/deleteSpot"
const LOAD_SPOTS = "session/loadSpots";

// Actions
const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    payload: spots,
  };
};

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    payload: spot,
  };
};

const getUserSpots = (spots) => {
  return {
    type: GET_USER_SPOTS,
    payload: spots
  }
};

const createSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    payload: spot,
  };
};

const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    payload: spot
  }
}

//Thunk actions
export const loadSpotsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  const data = await res.json();
  dispatch(loadSpots(data));
  return res;
};

export const getSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(getSpot(data));
  }

  return res;
};

export const createSpotThunk =
  (spot, valErrors, images) => async (dispatch) => {
    let res;

    if (Object.keys(valErrors).length > 0) {
      res = await csrfFetch("/api/spots", {
        method: "POST",
        headers: {
          errors: JSON.stringify(valErrors),
        },
        body: JSON.stringify(spot),
      });
    } else {
      res = await csrfFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify(spot),
      });
    }

    if (res.ok) {
      const data = await res.json();
      dispatch(createSpot(data));

      Object.values(images).forEach(async (img) => {
        if (img) {
          await csrfFetch(`/api/spots/${data.id}/images`, {
            method: "POST",
            body: JSON.stringify({
              url: img,
            }),
          });
        }
      });

      return data;
    }

    return res;
  };

  export const getUserSpotsThunk = () => async dispatch => {
    const res = await csrfFetch(`/api/spots/current`);

    if(res.ok){
      const data = await res.json();
      dispatch(getUserSpots(data));
      return;
    }
  }

  export const updateSpotThunk = (spotId, spotInfo, valErrors, images) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      body: JSON.stringify(spotInfo)
    });

    if(res.ok){
      const data = await res.json();
      dispatch(updateSpot(data));

      Object.values(images).forEach(async (img) => {
        if (img) {
          await csrfFetch(`/api/spots/${data.id}/images`, {
            method: "POST",
            body: JSON.stringify({
              url: img,
            }),
          });
        }
      });

      return data;
    }
    else return res;
  }

// Selectors
const getSpots = state => state.spotReducer;
export const selectAllSpots = createSelector(getSpots, spots => Object.values(spots).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));


// Reducer
const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newObj = {};
      action.payload.Spots.forEach(el => newObj[el.id] = el);

      return {...newObj };
    }

    case GET_SPOT: {
      return { ...state, spot: action.payload };
    }

    case GET_USER_SPOTS: {
      const newObj = {};
      action.payload.Spots.forEach(el => newObj[el.id] = el)
      return {...newObj}
    }

    case CREATE_SPOT: {
      return { ...state, spot: action.payload };
    }

    case UPDATE_SPOT: {
      return {spot: action.payload}
    }

    default:
      return state;
  }
};

export default spotReducer;
