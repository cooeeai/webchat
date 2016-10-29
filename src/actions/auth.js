import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS
} from 'constants/actionTypes/auth';

function authenticate(provider) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    dispatch({
      type: LOGIN
    });
    const auth = firebase.auth();
    let p;
    switch (provider) {
      case 'twitter':
        p = new firebase.auth.TwitterAuthProvider();
    }
    auth.signInWithPopup(p).then((result) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: result.user,
        meta: {
          timestamp: Date.now()
        }
      });
    }).catch((err) => {
      dispatch({
        type: LOGIN_FAILURE,
        payload: err,
        meta: {
          timestamp: Date.now()
        }
      });
      console.error('signInWithPopup: ', err);
      return;
    });
  }
}

export function initAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    dispatch({
      type: AUTHENTICATE
    });
    const auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch({
          type: AUTHENTICATE_SUCCESS,
          payload: user,
          meta: {
            timestamp: Date.now()
          }
        });
      } else {
        dispatch({
          type: AUTHENTICATE_FAILURE,
          meta: {
            timestamp: Date.now()
          }
        });
      }
    });
  }
}

export function loginWithGithub() {
  return authenticate('github');
}

export function loginWithTwitter() {
  return authenticate('twitter');
}

export function logout() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const auth = firebase.auth();
    auth.signOut().then(() => {
      dispatch({
        type: LOGOUT_SUCCESS
      });
    });
  };
}
