import { combineReducers } from 'redux';

import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS
} from 'constants/actionTypes/auth';
import {
  UNAUTH,
  AUTH_ALLOW,
  AUTH_DENY,
  AUTH_LOGOUT
} from 'constants/authStatus';

export const initialState = {
  authenticating: false,
  authenticated: UNAUTH,
  id: null,
  user: {}
};

function authenticating(state = initialState.authenticating, action) {
  switch (action.type) {
    case AUTHENTICATE:
    case LOGIN:
      return true;
    case AUTHENTICATE_SUCCESS:
    case AUTHENTICATE_FAILURE:
    case LOGIN_SUCCESS:
    case LOGIN_FAILURE:
      return false;
    default:
      return state;
  }
}

function authenticated(state = initialState.authenticated, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS: {
      //return (action.payload.expires * 1000 > action.meta.timestamp) ? AUTH_ALLOW : AUTH_DENY;
      // i don't think login sessions expire anymore in Firebase 3
      return AUTH_ALLOW;
    }
    case LOGIN_SUCCESS:
      return AUTH_ALLOW;
    case AUTHENTICATE_FAILURE:
    case LOGIN_FAILURE:
      return AUTH_DENY;
    case LOGOUT_SUCCESS:
      return AUTH_LOGOUT;
    default:
      return state;
  }
}

function id(state = initialState.id, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
    case LOGIN_SUCCESS:
      return action.payload.uid;
    default:
      return state;
  }
}

function user(state = initialState.user, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
    case LOGIN_SUCCESS: {
      const provider = action.payload.providerData[0].providerId;
      switch (provider) {
        case 'github.com':
        case 'twitter.com': {
          const data = action.payload.providerData[0];
          return {
            id: action.payload.uid,
            name: data.displayName,
            avatar: data.photoURL
          }
        }
        default:
          return;
      }
    }
    default:
      return state;
  }
}

export default combineReducers({
  authenticating,
  authenticated,
  id,
  user
});
