import React, { Component } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    backgroundColor: "#f5f1ee",
    borderColor: "#dbdbdb",
    borderTopWidth: 1,
    flexDirection: "row"
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  input: {
    backgroundColor: "white",
    borderColor: "#dbdbdb",
    borderRadius: 15,
    borderWidth: 3,
    color: "black",
    height: 40,
    paddingHorizontal: 15,
    fontSize: 15
  },
  sendButtonContainer: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingVertical: 6
  },
  sendButton: {
    height: 30,
    width: 30,
    alignSelf: "center"
    //backgroundColor:'red'
  },
  iconStyle: {
    marginRight: 0 // default is 12
  }
});

const sendButton = send => (
  <Icon.Button
    backgroundColor={"gray"}
    borderRadius={15}
    color={"white"}
    iconStyle={styles.iconStyle}
    name="send"
    onPress={send}
    size={15}
    style={styles.sendButton}
  />
);

class MessageInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.send = this.send.bind(this);
  }

  send() {
    this.props.send(this.state.text);
    this.textInput.clear();
    this.textInput.blur();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref => {
              this.textInput = ref;
            }}
            autoCapitalize="none"
            onChangeText={text => this.setState({ text })}
            style={styles.input}
            placeholder="Type your message here!"
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.sendButtonContainer}>{sendButton(this.send)}</View>
      </View>
    );
  }
}

export default MessageInput;
