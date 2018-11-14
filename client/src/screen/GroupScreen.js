import { _ } from "lodash";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  YellowBox,
  NetInfo
} from "react-native";
import { Query, Subscription } from "react-apollo";
import Dialog from "react-native-dialog";

import { client } from "../constant";
import { getGroups } from "../graphql/query/getGroupMessages";
import { GROUP_ADDED_SUBSCRIPTION } from "../graphql/subscription/groupAdded";
import { GROUP_Deleted_SUBSCRIPTION } from "../graphql/subscription/groupDeleted";
import { CREATE_GROUP_MUTATION } from "../graphql/mutation/createGroup";

import RenderGroup from "../components/renderGroups";
import AppLoading from "../components/loading";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  },
  groupContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  groupName: {
    fontWeight: "bold",
    flex: 0.7
  },
  createGroup: {
    position: "absolute",
    bottom: 10,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 200
  },
  createGroupText: {
    fontSize: 30,
    color: "white",
    fontWeight: "900"
  }
});

class Groups extends Component {
  static navigationOptions = {
    title: "Chats"
  };
  state = {
    visiblePrompt: false,
    promptValue: "",
    isConnected: null,
    ready: false
  };

  async componentDidMount() {
    try {
      const t = await AsyncStorage.getItem("token");
      const _id = await AsyncStorage.getItem("_id");
    } catch (error) {
      throw error;
    }
  }

  _handleCreateGroup = async () => {
    this.setState({ visiblePrompt: false });
    const { promptValue, visiblePrompt } = this.state;

    if (promptValue.length > 0) {
      await client.mutate({
        mutation: CREATE_GROUP_MUTATION,
        variables: { name: this.state.promptValue }
      });
    }
  };
  render() {
    return (
      <Query query={getGroups}>
        {({ loading, error, data, subscribeToMore }) => {
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
              <TouchableOpacity
                style={styles.createGroup}
                onPress={() => this.setState({ visiblePrompt: true })}
              >
                <Text style={styles.createGroupText}>+</Text>
              </TouchableOpacity>
              <View>
                <Dialog.Container visible={this.state.visiblePrompt}>
                  <Dialog.Title>create new group</Dialog.Title>
                  <Dialog.Description>creating new group</Dialog.Description>
                  <Dialog.Input
                    label="group name"
                    onChangeText={promptValue => this.setState({ promptValue })}
                    autoFocus={true}
                    autoCapitalize="none"
                    style={{
                      borderRadius: 14,
                      borderWidth: 2,
                      color: "gray",
                      borderColor: "green",
                      fontWeight: "400",
                      marginTop: 5,
                      paddingLeft: 10
                    }}
                  />
                  <Dialog.Button
                    label="Cancel"
                    onPress={() =>
                      this.setState({ visiblePrompt: false, promptValue: "" })
                    }
                  />
                  <Dialog.Button label="Ok" onPress={this._handleCreateGroup} />
                </Dialog.Container>
              </View>

              <RenderGroup
                subscribeToDeletedGroup={() =>
                  subscribeToMore({
                    document: GROUP_Deleted_SUBSCRIPTION,
                    //     variables: { repoName: params.repoName },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;
                      if (subscriptionData.data.groupDeleted) {
                        const DeletedItem = subscriptionData.data.groupDeleted;
                        return Object.assign({}, prev, {
                          getGroups: prev.getGroups.filter(
                            g => g._id != DeletedItem._id
                          )
                        });
                      }
                    }
                  })
                }
                subscribeToNewGroup={() =>
                  subscribeToMore({
                    document: GROUP_ADDED_SUBSCRIPTION,
                    //     variables: { repoName: params.repoName },
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;
                      const newFeedItem = subscriptionData.data.groupAdded;
                      return Object.assign({}, prev, {
                        getGroups: [newFeedItem, ...prev.getGroups]
                      });
                    }
                  })
                }
                data={data}
                onPress={item => {
                  this.props.navigation.navigate("MessageScreen", {
                    groupId: item._id,
                    title: item.name,
                    messages: item.messages.filter(
                      item => (item.to._id = item._id)
                    )
                  });
                }}
              />
            </View>
          );
        }}
      </Query>
    );
  }
}

export default Groups;
