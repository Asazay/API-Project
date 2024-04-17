import { csrfFetch } from "./csrf";
import {createSelector} from 'reselect';

const LOAD_REVIEWS = 'reviews/loadReviews';
const CREATE_REVIEW = 'reviews/createReview';
const DELETE_REVIEW = 'reviews/deleteReview';

//Actions
const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    }
};

const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        payload: review
    }
};

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        payload: reviewId
    }
}


// Thunk actions
export const loadReviewsThunk = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if(res.ok){
        const data = await res.json();
        dispatch(loadReviews(data));
        return data;
    }

    return res;
}

export const createReviewThunk = (spotId, review) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    });

    if(res.ok){
        const data = await res.json();
        dispatch(createReview(data));
        return data;
    }

    return res;
};

export const deleteReviewThunk = (reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

    if(res.ok){
        const data = await res.json();
        dispatch(deleteReview(reviewId));
        return data;
    }
    else return res;
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

        case CREATE_REVIEW: {
            return {...state, ...action.payload}
        }

        case DELETE_REVIEW: {
            const newObj = {};
            Object.values(state).forEach(review => newObj[review.id] = review);
            delete newObj[action.payload]
            return {...newObj}
        }

        default: return state;
    }
};

export default reviewReducer;