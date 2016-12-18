import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import moment from 'moment';
import GoogleMap from 'google-map-react';
import Place from './Place';
import { GOOGLE_MAPS_API_KEY } from '../config';
import 'bootstrap/js/collapse';

import 'styles/StoreLocations.scss';

const pins = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default class StoreLocations extends Component {

  shouldComponentUpdate = shouldPureComponentUpdate;

  renderDayOfWeek(day, i) {
    return (
      <tr key={ 'day-' + i } >
        <td>
          { days[i] }
        </td>
        <td>
          {day.isOpen ?
            day.open + ' - ' + day.close
            :
            'closed'
          }
        </td>
      </tr>
    );
  }

  render() {
    const { data: { location_data }, text, timestamp, user } = this.props;
    const center = {
      lat: location_data[0].address.lat,
      lng: location_data[0].address.lng,
    };
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
        <div className="text" dangerouslySetInnerHTML={{__html: text[0].replace(/\n/g, '<br>')}}/>
        <div className="map">
          <GoogleMap
            bootstrapURLKeys={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en'
            }}
            defaultCenter={ { lat: center.lat, lng: center.lng } }
            defaultZoom={ 15 }>
            {location_data.map((loc, i) =>
              <Place key={ 'place-' + pins[i] } lat={ loc.address.lat } lng={ loc.address.lng } text={ pins[i] }/>
            )}
          </GoogleMap>
        </div>
        <ul className="media-list">
          {location_data.map((loc, i) =>
            <li key={ 'location-' + pins[i] } className="media">
              <div className="media-left">
                <a href="#">
                  { pins[i] }
                </a>
              </div>
              <div className="media-body">
                <h4 className="media-heading">
                  { loc.label }
                </h4>
                <div>
                  { loc.address.address }
                </div>
                <div className="hours">
                  <a href={ `#hours-${timestamp}-${i}` } role="button" data-toggle="collapse">
                    Opening hours
                  </a>
                  <table className="table collapse" id={ `hours-${timestamp}-${i}` }>
                    <tbody>
                      { loc.days.map((day, i) => this.renderDayOfWeek(day, i)) }
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
          )}
        </ul>
        <div dangerouslySetInnerHTML={{__html: text[1].replace(/\n/g, '<br>')}}/>
      </div>
    );
  }
}
