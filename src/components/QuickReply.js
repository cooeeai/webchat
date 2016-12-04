import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import 'styles/QuickReply.scss';

export default class QuickReply extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    buttons: PropTypes.array.isRequired,
    timestamp: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    }),
    submitAction: PropTypes.func.isRequired
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.click = this.click.bind(this);
  }

  click(text, btn) {
    const { submitAction, dispatch } = this.props;
    submitAction(text, 'tombot');
    submitAction(btn.title);
  }

  render() {
    const { text, buttons, timestamp, user, submitAction } = this.props;
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
        <div className="text"dangerouslySetInnerHTML={{__html: text.replace(/\n/g, '<br>')}}/>
        <div className="quick-reply">
          {
            buttons.map((btn, i) => {
              return (
                <button key={ `btn${i}` } className="btn btn-default" type="button"
                  onClick={ () => {this.click(text, btn)} }>
                  { btn.title }
                </button>
              )
            })
          }
        </div>
      </div>
    );
  }
}
