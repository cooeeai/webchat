import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import uniq from 'lodash/uniq';
import forEach from 'lodash/forEach';
import sortBy from 'lodash/sortBy';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import * as channelActions from 'actions/channels';
import * as messageActions from 'actions/messages';
import * as userActions from 'actions/users';
import { messageInitialState } from 'reducers/messages';
import ChannelList from 'components/ChannelList';
import MessageList from 'components/MessageList';
import MessageForm from 'components/MessageForm';

import 'styles/Messages.scss';

@connect(mapStateToProps, {
  ...channelActions,
  ...messageActions,
  ...userActions
})
export default class MessageContainer extends Component {
  static propTypes = {
    channels: PropTypes.shape({
      entities: PropTypes.object.isRequired
    }).isRequired,
    messages: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      entities: PropTypes.object.isRequired
    }),
    users: PropTypes.shape({
      entities: PropTypes.object.isRequired
    }).isRequired,
    activeChannel: PropTypes.string,
    registerChannelListeners: PropTypes.func.isRequired,
    registerMessageListeners: PropTypes.func.isRequired,
    loadMessages: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { activeChannel, messages, registerChannelListeners } = this.props;
    registerChannelListeners();
    this.handleChangeChannel(activeChannel, messages);
  }

  componentWillReceiveProps(nextProps) {
    const { activeChannel, messages } = this.props;
    const {
      activeChannel: nextActiveChannel,
      messages: nextMessages
    } = nextProps;

    // when message list is updated
    if (messages &&
      nextMessages &&
      messages.entities !== nextMessages.entities) {
        this.handleUpdateMessages(messages.entities, nextMessages.entities);

        // when channel's messages have initially loaded
        if (!messages.loaded && nextMessages.loaded) {
          this.handleLoadedMessages();
        }
      }

    // when move to another channel
    if (nextActiveChannel && activeChannel !== nextActiveChannel) {
      this.handleChangeChannel(nextActiveChannel, nextMessages);
    }
  }

  handleChangeChannel(newChannel, newMessages) {
    if (isEmpty(newMessages.entities)) {
      this.props.loadMessages(newChannel);
    }
  }

  handleLoadedMessages() {
    const { activeChannel, registerMessageListeners } = this.props;
    // listen to incoming messages
    registerMessageListeners(activeChannel);
  }

  handleUpdateMessages(oldMessages, newMessages) {
    const userIds = uniq(values(newMessages).map(v => v.userId));
    this.loadUsers(userIds);
  }

  handlePostMessage() {
    this.scrollMessageListToBottom();
  }

  loadUsers(userIds) {
    const {
      users: { entities: users },
      loadUser
    } = this.props;
    userIds.forEach((userId) => {
      if (!users[userId]) {
        loadUser(userId);
      }
    })
  }

  render() {
    const { activeChannel, auth, channels, messages, users, postMessage, addChannel, deleteChannel } = this.props;
    if (!auth.authenticated) {
      return (<div/>);
    }
    const messageList =
      sortBy(
        forEach(messages.entities, (m, k) => { m.id = k }),
        m => m.timestamp
      );

    return (
      <div className="messages-container">
        <div>
          <div className="sidebar">
            <ChannelList channels={ channels.entities }/>
          </div>
          <div className="main">
            <MessageList
              auth={ auth }
              loading={ messages.loading }
              messages={ messageList }
              users={ users.entities }/>
            <div className="main-footer">
              {
                activeChannel &&
                  <MessageForm
                    auth={ auth }
                    submitAction={ (text) => {
                      if (text.startsWith('/add-channel')) {
                        addChannel(text.substring(13))
                      } else if (text.startsWith('/del-channel')) {
                        deleteChannel(text.substring(13))
                      } else {
                        postMessage(activeChannel, text)
                      }
                    }}/>//{ (text) => postMessage(activeChannel, text) }/>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    auth, form, channels, messages, users,
    router: { params: { channelName }}
  } = state;
  return {
    auth,
    form,
    channels,
    users,
    activeChannel: channelName,
    messages: messages[channelName] || messageInitialState
  };
}
