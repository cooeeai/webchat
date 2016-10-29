import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

import 'styles/MessageForm.scss';

@reduxForm({
  form: 'compose-message',
  fields: ['text']
})
export default class MessageForm extends Component {
  static propTypes = {
    fields: PropTypes.shape({
      text: PropTypes.object.isRequired
    }).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    submitAction: PropTypes.func.isRequired
  }

  constructor(props, ctx) {
    super(props, ctx);
    this.submit = this.submit.bind(this);
  }

  submit() {
    const { resetForm, submitAction, fields: { text } } = this.props;
    submitAction(text.value);
    resetForm();
  }

  render() {
    const {
      fields: { text },
      handleSubmit
    } = this.props;
    return (
      <form className="message-form" onSubmit={ handleSubmit(this.submit) }>
        <div className="input-group">
          <input type="text"
            name="text"
            className="form-control message-text"
            ref="text"
            placeholder="Type your message"
            autoComplete="off"
            autoFocus
            { ...text }/>
          <span className="input-group-btn">
            <button type="submit"
              className="btn btn-primary"
              disabled={ !text.value || text.value.trim().length === 0 }>
              <b className="glyphicon glyphicon-send"/>Post
            </button>
          </span>
        </div>
      </form>
    )
  }
}
