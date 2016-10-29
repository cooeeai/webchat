import firebase from 'firebase';
import React from 'react';
import { render } from 'react-dom';
import configureStore from 'store/configureStore';
import Root from 'containers/root';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_URL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID
} from 'config';

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_URL,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
};
firebase.initializeApp(config);

const store = configureStore({
  firebase
});

render(
  <Root store={ store }/>,
  document.getElementById('app')
);
