import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import moment from 'moment';
import GoogleMap from 'google-map-react';
import Place from './Place';
import { GOOGLE_MAPS_API_KEY } from '../config';

import 'styles/Address.scss';

export default class Address extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    })
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { text, latitude, longitude, timestamp, user } = this.props;
    return (
      <div className="message-item">
        {
          user &&
            <span className="avatar">
              <img src={ user.avatar }/>
            </span>
        }
        {
          user &&
            <span className="name">{ user.name }</span>
        }
        <span className="info">{ `${moment(timestamp).format('MM/DD HH:mm')}` }</span>
        <div className="text" dangerouslySetInnerHTML={{__html: text.replace(/\n/g, '<br>')}}/>
        <div className="map">
          <GoogleMap
            bootstrapURLKeys={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en'
            }}
            defaultCenter={ { lat: latitude, lng: longitude } }
            defaultZoom={ 15 }>
            <Place lat={ latitude } lng={ longitude } text={ 'A' }/>
          </GoogleMap>
        </div>
      </div>
    );
  }
}
