import { csrfFetch } from "./csrf";
import {createSelector} from 'reselect';

const LOAD_REVIEWS = 'reviews/loadReviews';

const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    }
};

export const loadReviewsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if(res.ok){
        const data = await res.json();
        dispatch(loadReviews(data));
        return data;
    }

    return res;
}

const reviewsArray = state => state.reviewReducer;
export const selectReviewsArray = createSelector(reviewsArray, (reviews) => {
    return Object.values(reviews).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_REVIEWS: {
            const newObj = {};
      action.payload.Reviews.forEach(el => newObj[el.id] = el);
            return {...newObj}
        }

        default: return state;
    }
};

export default reviewReducer;