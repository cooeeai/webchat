import 'jquery';
import 'bootstrap-sass';
import React, { Component, PropTypes } from 'react';

import { AUTH_ALLOW } from 'constants/authStatus';

import 'styles/Navigation.scss';

export default class Navigation extends Component {
  static propTypes = {
    auth: PropTypes.shape({
      authenticated: PropTypes.string.isRequired,
      user: PropTypes.object.isRequired
    }),
    onClickLogoutBtn: PropTypes.func.isRequired
  }

  render() {
    const { onClickLogoutBtn } = this.props;
    const { authenticated, authenticating, user } = this.props.auth;
    return (
      <div className="navigation navbar navbar-default navbar-fixed-top" role="navigation">
        <a className="navbar-brand header-title" href="/">Cooee webchat</a>
        {
          authenticating &&
            <a className="navbar-brand pull-right">
              <b className="fa fa-lg fa-spin fa-refresh"/>
            </a>
        }
        {
          authenticated === AUTH_ALLOW &&
            <ul className="nav navbar-nav pull-right">
              <li className="nav-item">
                <a id="dropdown-user" href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <b className="fa fa-lg fa-user"/>
                  { user.name }
                </a>
                <ul className="dropdown-menu" aria-labelled="dropdown-user">
                  <li className="dropdown-item">
                    <a href="#" onClick={ onClickLogoutBtn }>
                      <b className="glyphicon glyphicon-log-out"/>
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
        }
      </div>
    );
  }
}
