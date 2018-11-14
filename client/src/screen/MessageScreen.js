import { _ } from "lodash";
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  ActivityIndicator,
  Keyboard
} from "react-native";
import React, { Component } from "react";
import moment from "moment";

import { Mutation, Query } from "react-apollo";
import { client } from "../constant";

import Message from "../components/message";
import MessageInput from "../components/messageInput";
import AppLoading from "../components/loading";

import { createMessageMutation } from "../graphql/mutation/createMessage";
import { getGroupMessage } from "../graphql/query/getGroupMessages";
import { MESSAGE_ADDED_SUBSCRIPTION } from "../graphql/subscription/messageAdded";

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    backgroundColor: "#e5ddd5",
    flex: 1,
    flexDirection: "column"
  }
});

class Messages extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: state.params.title,
      headerStyle: {
        backgroundColor: "purple"
      },
      headerTintColor: "#fff"
    };
  };
  constructor(props) {
    super(props);

    this.state = {
      _id: "",
      data: []
    };
  }

  async componentDidMount() {
    const _id = await AsyncStorage.getItem("_id");
    this.setState({ _id });
    this._keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyBoardDidShow
    );
    this._keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyBoardDidHide
    );
  }
  _keyBoardDidShow = e => {
    this.flatList.scrollToEnd({ animated: true });
  };

  _keyBoardDidHide = () => {
    this.flatList.scrollToEnd({ animated: true });
  };

  componentWillUnmount() {
    this._keyboardDidShowListener.remove();
    this._keyboardDidHideListener.remove();
  }
  renderFlarBottom = () => this.flatList.scrollToEnd({ animated: true });
  keyExtractor = item => item._id;

  render() {
    const { messages, groupId, title } = this.props.navigation.state.params;
    // render list of messages for group
    return (
      <Query
        query={getGroupMessage}
        variables={{ groupId }}
        pollInterval={500}
        //  update={(cache, { data: { createMessage } }) => {
        //    const AllGroupsQuery = cache.readQuery({ query: getGroups });
        //    const index=AllGroupsQuery.getGroups.findIndex(item=>item._id===groupId);
        //    let newMessage = createMessage;
        //     newMessage.from.email="Darrion.Nitzsche@gmail.com"
        //     newMessage.to._id=groupId;
        //    AllGroupsQuery.getGroups[index].messages.push(newMessage)
        //     cache.writeQuery({
        //       query: getGroups,
        //       data: {
        //         getGroups:AllGroupsQuery.getGroups
        //       }
        //     });
        //     messages.push(newMessage)
        //  }}
      >
        {({ data, loading, error, subscribeToMore }) => {
          if (loading)
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ActivityIndicator size="large" />
              </View>
            );
          if (error) {
            if (error.message === "Network error: Network request failed") {
              return (
                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                    height: 30,
                    backgroundColor: "red",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 14, fontWeight: "800" }}
                  >
                    no internet connection!!
                  </Text>
                </View>
              );
            }
            return <Text>{error.graphQLErrors[0].message}</Text>;
          }

          return (
            <View style={styles.container}>
              <FlatList
                ref={ref => {
                  this.flatList = ref;
                }}
                data={
                  data.getMessages
                  // .length === 0
                  //   ? this.state.data
                  //   : data.getMessages
                }
                keyExtractor={this.keyExtractor}
                // initialScrollIndex={data.getMessages.length - 1}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.flatList.scrollToEnd({ animated: true });
                }}
                onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                renderItem={({ item, index }) => (
                  <View>
                    {(index === 0 ||
                      moment(item.createdAt).format("MMM Do YY") !==
                        moment(data.getMessages[index - 1].createdAt).format(
                          "MMM Do YY"
                        )) && (
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginVertical: 5
                        }}
                      >
                        <Text>
                          {moment(item.createdAt).format("MMM Do YY")}
                        </Text>
                      </View>
                    )}
                    <Message
                      subscribeToNewComments={() =>
                        subscribeToMore({
                          document: MESSAGE_ADDED_SUBSCRIPTION,
                          //     variables: { repoName: params.repoName },
                          updateQuery: (prev, { subscriptionData }) => {
                            console.log("====================================");
                            console.log("sup", subscriptionData);
                            console.log("====================================");
                            if (!subscriptionData.data) return prev;
                            if (
                              subscriptionData.data.messageAdded.to._id !==
                              groupId
                            )
                              return prev;
                            if (
                              data.getMessages.length > 0 &&
                              prev.getMessages[prev.getMessages.length - 1]
                                ._id === subscriptionData.data.messageAdded._id
                            )
                              return prev;
                            const newFeedItem =
                              subscriptionData.data.messageAdded;
                            return Object.assign({}, prev, {
                              getMessages: [...prev.getMessages, newFeedItem]
                            });
                          }
                        })
                      }
                      isCurrentUser={item.from._id === this.state._id}
                      {...item}
                    />
                  </View>
                )}
                ListEmptyComponent={<View />}
              />
              <MessageInput
                send={
                  text =>
                    client
                      .mutate({
                        mutation: createMessageMutation,
                        variables: { text, groupId },
                        update: (store, { data: { createMessage } }) => {
                          // Read the data from our cache for this query.
                          const data = store.readQuery({
                            query: getGroupMessage,
                            variables: { groupId }
                          });
                          // Add our comment from the mutation to the end.

                          if (data.getMessages.length === 0) {
                            data.getMessages.push(createMessage);
                            //   // Write our data back to the cache.
                            store.writeQuery({
                              query: getGroupMessage,
                              variables: { groupId },
                              data
                            });
                          }
                        }
                      })
                      .then(r => {
                        if (data.getMessages.length === 0) {
                          return;
                        }
                        this.flatList.scrollToEnd({ animated: true });
                      })
                      .catch(e => {
                        console.log(e);
                      })

                  // createMessage({
                  //   variables: {
                  //     text,
                  //     userId: "5bb9f0a9e0842f20159e3a2d",
                  //     groupId
                }
                // optimisticResponse: {
                //   __typename: "Mutation",
                //   createMessage: {
                //     __typename: "Message",
                //     _id: Math.random()
                //       .toString(36)
                //       .substr(2, 9),
                //     text,
                //     createdAt: Date.now(),
                //     to: {
                //       __typename: "Group",
                //       name: title,
                //       _id: groupId
                //     },
                //     from: {
                //       __typename: "User",
                //       _id: "5bb9f0a9e0842f20159e3a2f",
                //       username: "Nadia.Nicolas",
                //       email: "Jeramy_Greenfelder68@hotmail.com"
                //     }
                //   }
                // },
                // update: (proxy, { data: { createMessage } }) => {
                //   // Read the data from our cache for this query.
                //   const data = proxy.readQuery({ query: getGroups });
                //   // Add our comment from the mutation to the end.

                //   const index = data.getGroups.findIndex(
                //     item => item._id === groupId
                //   );
                //   let newMessage = createMessage;
                //   newMessage.from.email = "Darrion.Nitzsche@gmail.com";
                //   newMessage.to._id = groupId;
                //   data.getGroups[index].messages.push(newMessage);
                //   this.flatList.scrollToEnd({ animated: true });
                //   messages.push(newMessage);
                //   proxy.writeQuery({ query: getGroups, data });
                // }
                //})
                //}
              />
            </View>
          );
        }}
      </Query>
    );
  }
}

export default Messages;
