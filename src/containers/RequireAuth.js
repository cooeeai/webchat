import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { LOGIN_PATH, POST_LOGOUT_PATH } from 'config';
import { AUTH_ALLOW, AUTH_DENY, AUTH_LOGOUT } from 'constants/authStatus';
import * as authActions from 'actions/auth';
import * as userActions from 'actions/users';

@connect((state) => ({
  auth: state.auth,
  router: state.router
}), { ...authActions, ...userActions })
export default class RequireAuth extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object,
    history: PropTypes.object.isRequired,
    router: PropTypes.shape({
      location: PropTypes.object.isRequired
    }).isRequired,
    initAuth: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.initAuth();
  }

  componentWillReceiveProps(nextProps) {
    const { auth: nextAuth } = nextProps;

    // just after the user has logged out
    if (nextAuth.authenticated === AUTH_LOGOUT) {
      return this.handleAfterLogout();
    }

    // just after authentication has failed
    else if (nextAuth.authenticated === AUTH_DENY) {
      return this.handleNotAuthenticated();
    }
  }

  handleAfterLogout() {
    const { history } = this.props;
    history.replaceState(null, POST_LOGOUT_PATH);
  }

  handleNotAuthenticated() {
    const { history, router: { location: { pathname }}} = this.props;
    return history.replaceState(null, LOGIN_PATH, {
      // prevent infinite loop
      redirectTo: pathname != LOGIN_PATH ? pathname : ''
    });
  }

  render() {
    const { auth, children } = this.props;
    return (
      <div>{ auth.authenticated === AUTH_ALLOW && children }</div>
    )
  }
}
