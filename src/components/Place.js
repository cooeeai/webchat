import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import 'styles/Place.scss';

export default class Place extends Component {
  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {};

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { text } = this.props;
    return (
      <div className="place">
        { text }
      </div>
    );
  }
}
