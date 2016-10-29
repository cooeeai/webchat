import {
  LOAD_CHANNELS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_CHANNELS_FAILURE,
  ADD_CHANNEL,
  ADD_CHANNEL_SUCCESS,
  ADD_CHANNEL_FAILURE,
  DEL_CHANNEL,
  DEL_CHANNEL_SUCCESS,
  DEL_CHANNEL_FAILURE
} from 'constants/actionTypes/channels';

export function addChannel(channelName) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.database().ref(`channels/${channelName}`);
    dispatch({
      type: ADD_CHANNEL
    });
    ref.once('value', (snapshot) => {
      if (snapshot.exists()) {
        return dispatch({
          type: ADD_CHANNEL_FAILURE,
          payload: new Error(`channel #${channelName} already exists`)
        });
      }
      ref.set({
        id: channelName,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      }, (err) => {
        if (!err) {
          dispatch({
            type: ADD_CHANNEL_SUCCESS
          });
        } else {
          dispatch({
            type: ADD_CHANNEL_FAILURE,
            payload: err
          });
        }
      });
    });
  };
}

export function deleteChannel(channelName) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.database().ref(`channels/${channelName}`);
    dispatch({
      type: DEL_CHANNEL
    });
    ref.remove().then(() => {
      dispatch({
        type: DEL_CHANNEL_SUCCESS
      });
    }).catch((err) => {
      dispatch({
        type: DEL_CHANNEL_FAILURE,
        payload: err
      });
    })
  };
}

export function registerChannelListeners() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.database().ref('channels');
    dispatch({
      type: LOAD_CHANNELS
    });
    ref.on('value', (snapshot) => {
      return dispatch({
        type: LOAD_CHANNELS_SUCCESS,
        payload: snapshot.val(),
        meta: {
          timestamp: Date.now()
        }
      })
    }, (err) => {
      return dispatch({
        type: LOAD_CHANNELS_FAILURE,
        payload: err
      });
    });
  };
}
