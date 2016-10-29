import Firebase from 'firebase';
import {
  LOAD_USER,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE
} from 'constants/actionTypes/users';

export function loadUser(userId) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.database().ref(`users/${userId}`);
    dispatch({
      type: LOAD_USER
    });
    ref.on('value', (snapshot) => {
      return dispatch({
        type: LOAD_USER_SUCCESS,
        payload: snapshot.val(),
        meta: {
          timestamp: Date.now()
        }
      });
    }, (err) => {
      console.error('loadUser: ', err);
      return dispatch({
        type: LOAD_USER_FAILURE,
        payload: err
      });
    });
  };
}

export function registerUser() {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();
    const ref = firebase.database().ref(`users/${auth.id}`);
    dispatch({
      type: REGISTER_USER
    });
    ref.set({
      ...auth.user,
      id: auth.id,
      updatedAt: firebase.database.ServerValue.TIMESTAMP
    }, (err) => {
      if (err) {
        console.error('registerUser: ', err);
        return dispatch({
          type: REGISTER_USER_FAILURE,
          payload: err
        });
      }
      return dispatch({
        type: REGISTER_USER_SUCCESS
      });
    });
  };
}
