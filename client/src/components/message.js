import moment from 'moment';
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  message: {
    flex: 0.8,
    backgroundColor: 'white',
    borderRadius: 6,
    marginHorizontal: 16,
    marginVertical: 2,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
    },
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
  },
  messageUsername: {
    color: 'red',
    fontWeight: 'bold',
    paddingBottom: 12,
  },
  messageTime: {
    color: '#8c8c8c',
    fontSize: 11,
    textAlign: 'right',
  },
  messageSpacer: {
    flex: 0.2,
  },
});

class Message extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewComments();
  }
  render() {
    const { _id, text,from,createdAt,isCurrentUser } = this.props;

    return (
      <View key={_id} style={styles.container}>
        {isCurrentUser ? <View style={styles.messageSpacer} /> : undefined }
        <View
          style={[styles.message, isCurrentUser && styles.myMessage]}
        >
          <Text
            style={[
              styles.messageUsername,
              { color:isCurrentUser?"red":"purple" },
            ]}
          >{from.username}</Text>
          <Text>{text}</Text>
          <Text style={styles.messageTime}>{moment(createdAt).format('h:mm A')}</Text>
        </View>
        {!isCurrentUser ? <View style={styles.messageSpacer} /> : undefined }
      </View>
    );
  }
}


export default Message;