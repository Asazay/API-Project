// frontend/src/store/session.js

import { csrfFetch } from './csrf';
import {createSelector} from 'reselect';

// User const's
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";


// User Actions
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};


// login/signup/logout Thunk Actions
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;

  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });

  const data = await response.json();
  dispatch(setUser(data.user));
  return response;

};

export const logout = () => async dispatch => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  const data = await res.json();
  dispatch(removeUser());
  return data;
}

export const signUp = (user) => async (dispatch) => {
  const res = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(user)
  })

  if(res.ok){
    const data = await res.json();
  dispatch(setUser(data));
  return data;
  }
  
  return res;
}

// Restore User thunk action
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

//selectors
const getUser = (state) => state.session.user;
export const selectGetUser = createSelector(getUser, (user) => user);


//Reducers
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;