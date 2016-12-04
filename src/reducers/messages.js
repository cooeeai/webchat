import { combineReducers } from 'redux';
import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_FAILURE,
  RECEIVE_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE_FAILURE,
  REMOVE_TEMP_MESSAGE
} from 'constants/actionTypes/messages';

export const messageInitialState = {
  loading: false,
  loaded: false,
  updatedAt: null,
  entities: {}
};

const messageReducer = combineReducers({
  entities,
  loading,
  loaded,
  updatedAt
});

export default function messagesReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
    case LOAD_MESSAGES_SUCCESS:
    case LOAD_MESSAGES_FAILURE:
    case RECEIVE_MESSAGE_SUCCESS:
    case RECEIVE_MESSAGE_FAILURE:
    case REMOVE_TEMP_MESSAGE: {
      const key = action.channel;
      return {
        ...state,
        [key]: messageReducer(state[key], action)
      };
    }
    default:
      return state;
  }
}

function loading(state = messageInitialState.loading, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
      return true;
    case LOAD_MESSAGES_SUCCESS:
    case LOAD_MESSAGES_FAILURE:
      return false;
    default:
      return state;
  }
}

function loaded(state = messageInitialState.loaded, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
    case LOAD_MESSAGES_FAILURE:
      return false;
    case LOAD_MESSAGES_SUCCESS:
      return true;
    default:
      return state;
  }
}

function updatedAt(state = messageInitialState.updatedAt, action) {
  switch (action.type) {
    case LOAD_MESSAGES_SUCCESS:
    case RECEIVE_MESSAGE_SUCCESS:
      return action.meta.timestamp;
    default:
      return state;
  }
}

function entities(state = messageInitialState.entities, action) {
  switch (action.type) {
    case LOAD_MESSAGES_SUCCESS:
      return { ...action.payload };
    case RECEIVE_MESSAGE_SUCCESS:
      return { ...state, ...action.payload };
    case REMOVE_TEMP_MESSAGE:
      const { FIXME, ...y } = state;
      return y;
    default:
      return state;
  }
}
