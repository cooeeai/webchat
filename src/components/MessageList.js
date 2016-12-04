import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import last from 'lodash/last';
import MessageItem from 'components/MessageItem';
import MessagesLoading from 'components/MessagesLoading';
import HeroCard from 'components/HeroCard';
import QuickReply from 'components/QuickReply';
import Address from 'components/Address';

import 'styles/MessageList';

export default class MessageList extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
    submitAction: PropTypes.func.isRequired,
    postbackAction: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { auth, messages } = this.props;
    const { messages: nextMessages } = nextProps;

    // when message list is updated
    if (messages && nextMessages && messages.length !== nextMessages.length) {
      // when I post a message just now
      const latestMessage = last(nextMessages);
      if (latestMessage && latestMessage.userId === auth.id) {
        this.scrollToBottom();
      }
    }
  }

  componentWillUpdate() {
    const node = findDOMNode(this);
    this.shouldScrollToBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const node = findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  renderItem(message, users, submitAction, postbackAction) {
    if (message.type == 'carousel') {
      return (
        <HeroCard { ...message } user={ users[message.userId] } submitAction={ submitAction } postbackAction={ postbackAction }/>
      );
    } else if (message.type == 'quickReply') {
      return (
        <QuickReply { ...message } user={ users[message.userId] } submitAction={ submitAction }/>
      );
    } else if (message.type == 'address') {
      return (
        <Address { ...message } user={ users[message.userId] }/>
      );
    } else {
      return (
        <MessageItem { ...message } user={ users[message.userId] }/>
      );
    }
  }

  render() {
    const {
      loading,
      messages,
      users,
      submitAction,
      postbackAction
    } = this.props;
    return (
      <div className="messages-list">
        {
          loading && <MessagesLoading/>
        }
        <ul ref="list">
          {
            messages.map((message) =>
              <li key={ message.id }>
                { this.renderItem(message, users, submitAction, postbackAction) }
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}
