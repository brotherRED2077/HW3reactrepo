import actionTypes from '../constants/actionTypes';
import runtimeEnv from '@mars/heroku-js-runtime-env';


function reviewPosted(review){
    return {
        type: actionTypes.POST_REVIEW,
        review: review
    }
}

export function submitReview(review){
    const env = runtimeEnv();

    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/review`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(review),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                dispatch(reviewPosted(res));
            })
            .catch( (e) => console.log(e) );
    }
}