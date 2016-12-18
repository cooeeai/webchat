import isObject from 'lodash/isObject';
import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  POST_MESSAGE,
  POST_MESSAGE_SUCCESS,
  POST_MESSAGE_FAILURE,
  RECEIVE_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE_FAILURE,
  REMOVE_TEMP_MESSAGE
} from 'constants/actionTypes/messages';

const ws = new WebSocket("ws://localhost:8080/ws-chat/1?name=markmo")

export function postMessage(channel, text, userId) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();
    dispatch({
      type: POST_MESSAGE
    });
    ws.send(text);
    firebase.database().ref(`messages/${channel}`)
      .push({
        text,
        userId: userId || auth.id,
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

export function postback(channel, text, payload, userId) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();
    dispatch({
      type: POST_MESSAGE
    });
    // ws.send({
    //   type: 'postback',
    //   text,
    //   payload
    // })
    ws.send(`postback:${payload}`);
    firebase.database().ref(`messages/${channel}`)
      .push({
        text: `${text} ${payload}`,
        userId: userId || auth.id,
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

export function removeTempMessage(channel) {
  return (dispatch, getState) => {
    dispatch({
      type: REMOVE_TEMP_MESSAGE,
      channel
    });
  };
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
    const { auth, firebase, messages } = getState();
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
    ws.onmessage = (ev) => {
      if (ev.data.length) {
        const value = ev.data.match(/^[\[\{].+/) ? JSON.parse(ev.data) : ev.data;
        const botUserId = 'tombot';
        let data;
        if (isObject(value)) {
          if (value.message && value.message.layout.name === 'show-locations') {
            setTimeout(() => {
              firebase.database().ref(`messages/${channel}`)
                .push({
                  ...value.message,
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
            }, 2000);
          } else if (value.address) {
            console.log(value);
            data = {
              type: 'address',
              text: value.text,
              latitude: value.address.location.latitude,
              longitude: value.address.location.longitude,
              timestamp: Date.now(),
              userId: botUserId
            };
            setTimeout(() => {
              firebase.database().ref(`messages/${channel}`)
                .push({
                  ...data,
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
            }, 2000);
          } else if (value.message.attachment) {
            const cards = value.message.attachment.payload.elements.map((el) => {
              return {
                imageURL: el.image_url,
                title: el.title,
                subtitle: el.subtitle,
                buttons: el.buttons
              };
            });
            data = {
              type: 'carousel',
              cards: cards,
              timestamp: Date.now(),
              userId: botUserId
            };
            setTimeout(() => {
              firebase.database().ref(`messages/${channel}`)
                .push({
                  ...data,
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
            }, 2000);
          } else if (value.message.quick_replies) {
            const buttons = value.message.quick_replies.map((el) => {
              return {
                title: el.title,
                payload: el.payload
              }
            });
            data = {
              type: 'quickReply',
              text: value.message.text,
              buttons: buttons,
              timestamp: Date.now(),
              userId: botUserId
            };
            setTimeout(() => {
              return dispatch({
                type: RECEIVE_MESSAGE_SUCCESS,
                channel,
                payload: {
                  ['FIXME']: data
                },
                meta: {
                  timestamp: Date.now()
                }
              });
            }, 2500);
          }
        } else {
          data = {
            type: 'text',
            text: value,
            timestamp: Date.now(),
            userId: botUserId
          };
          setTimeout(() => {
            firebase.database().ref(`messages/${channel}`)
              .push({
                ...data,
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
          }, 2000);
        }
      } else {
        // setTimeout(() => {
        //   return dispatch({
        //     type: RECEIVE_MESSAGE_SUCCESS,
        //     channel,
        //     payload: {},
        //     meta: {
        //       timestamp: Date.now()
        //     }
        //   });
        // }, 2000);
      }
    };
  }
}
