import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  POST_MESSAGE,
  POST_MESSAGE_SUCCESS,
  POST_MESSAGE_FAILURE,
  RECEIVE_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE_FAILURE
} from 'constants/actionTypes/messages';

export function postMessage(channel, text) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();
    dispatch({
      type: POST_MESSAGE
    });
    firebase.database().ref(`messages/${channel}`)
      .push({
        text,
        userId: auth.id,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      }, (err) => {
        if (!err) {
          dispatch({
            type: POST_MESSAGE_SUCCESS
          });
        } else {
          console.error('postMessage: ', err);
          dispatch({
            type: POST_MESSAGE_FAILURE,
            payload: err
          });
        }
      });
  }
}

export function loadMessages(channel) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.database().ref(`messages/${channel}`);
    dispatch({
      type: LOAD_MESSAGES,
      channel
    });
    ref.limitToLast(50).once('value', (snapshot) => {
      return dispatch({
        type: LOAD_MESSAGES_SUCCESS,
        channel,
        payload: snapshot.val(),
        meta: {
          timestamp: Date.now()
        }
      });
    }, (err) => {
      return dispatch({
        type: LOAD_MESSAGES_FAILURE,
        channel,
        payload: err
      });
    });
  };
}

export function registerMessageListeners(channel) {
  return (dispatch, getState) => {
    const { firebase, messages } = getState();
    const ref = firebase.database().ref(`messages/${channel}`);
    ref.limitToLast(5).on('child_added', (snapshot) => {
      const channelMessages = messages[channel];
      const key = snapshot.key;
      // if incoming is new message
      if (!channelMessages || !channelMessages.entities[key]) {
        return dispatch({
          type: RECEIVE_MESSAGE_SUCCESS,
          channel,
          payload: {
            [key]: snapshot.val()
          },
          meta: {
            timestamp: Date.now()
          }
        });
      }
    }, (err) => {
      return dispatch({
        type: RECEIVE_MESSAGE_FAILURE,
        channel,
        payload: err
      });
    });
  };
}
