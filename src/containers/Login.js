import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { DEFAULT_POST_LOGIN_PATH } from 'config';
import { AUTH_ALLOW } from 'constants/authStatus';
import * as authActions from 'actions/auth';
import * as userActions from 'actions/users';

import 'styles/login.scss';

@connect((state) => ({
  auth: state.auth,
  router: state.router
}), { ...authActions, ...userActions })
export default class Login extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    router: PropTypes.shape({
      location: PropTypes.object.isRequired
    }).isRequired,
    registerUser: PropTypes.func.isRequired,
    loginWithTwitter: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = this.props;
    const { auth: nextAuth } = nextProps;

    // just after the user has logged in
    if (auth.authenticated !== AUTH_ALLOW &&
      nextAuth.authenticated === AUTH_ALLOW) {
        this.handleAfterLogin();
      }
  }

  handleAfterLogin() {
    const { history, router, registerUser } = this.props;
    registerUser();
    const redirectTo = router.location.query.redirectTo || DEFAULT_POST_LOGIN_PATH;
    return history.replaceState(null, redirectTo);
  }

  render() {
    const { loginWithTwitter } = this.props;
    return (
      <div className="row">
        <div className="col-sm-offset-3 col-sm-6">
          <div className="login-panel text-center">
            <h2>Login</h2>
            <div>
              <button className="login-button" onClick={ loginWithTwitter }>Twitter</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
