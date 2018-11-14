import React, { Component } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage,
  FlatList
} from "react-native";
import { Query, Subscription } from "react-apollo";
import { NavigationEvents } from "react-navigation";
import RNRestart from "react-native-restart";

import { client } from "../constant";
import { getGroups } from "../graphql/query/getGroupMessages";
import { GROUP_ADDED_SUBSCRIPTION } from "../graphql/subscription/groupAdded";
import { GROUP_Deleted_SUBSCRIPTION } from "../graphql/subscription/groupDeleted";
import { CREATE_GROUP_MUTATION } from "../graphql/mutation/createGroup";

import RenderGroup from "../components/renderMyGroup";
import AppLoading from "../components/loading";

import AntDesign from "react-native-vector-icons/AntDesign";

import { MeQuery } from "../graphql/query/me";

const RenderRow = ({ item, value }) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowItem}>{item}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10
  },
  loading: {
    justifyContent: "center",
    alignItems: "center"
  },
  logOut: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "black",
    zIndex: 1000
  },
  logOutText: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
    textAlign: "center"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 3,
    backgroundColor: "red",

    margin: 5,
    borderColor: "black",
    height: 40
  },
  rowItem: {
    fontSize: 16,
    fontWeight: "900",
    color: "black"
  },
  rowValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "white"
  },
  myGroupHeader: {
    fontSize: 27,
    fontWeight: "900",
    color: "black",
    margin: 10
  }
});

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      me: {},
      error: false
    };
  }
  async componentDidMount() {
    console.log("mount--------------");
    try {
      const res = await client.query({ query: MeQuery });
      console.log("====================================");
      console.log("res", res);
      console.log("====================================");
      this.setState({ me: res.data.me });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ error: true });
      this.setState({ loading: false });
    }
  }
  _handleMeQuery = async () => {
    const res = await client.query({ query: MeQuery });
    if (!res.loading && res.data) {
      this.setState({ me: res.data.me });
    }
  };
  _onLogoutPressed = async () => {
    await AsyncStorage.clear();
    //this.props.navigation.navigate("Auth");
    RNRestart.Restart();
  };
  render() {
    const { loading, me } = this.state;
    if (this.state.error) {
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
          <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
            no internet connection!!
          </Text>
        </View>
      );
    }
    if (loading) {
      return (
        <View style={[styles.loading, styles.container]}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <Query query={getGroups}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) {
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
          }
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
              {/* <NavigationEvents
                onDidFocus={async payload => {
                  await this._handleMeQuery();
                  alert("awesom");
                }}
              > */}
              <View style={{ margin: 30, flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.myGroupHeader}>My Info:- </Text>
                  <RenderRow item="email :-" value={me.email} />
                  <RenderRow item="username :-" value={me.username} />
                </View>
                <View style={{ flex: 2, marginTop: 30 }}>
                  <Text style={styles.myGroupHeader}>My Groups:- </Text>

                  <RenderGroup
                    subscribeToDeletedGroup={() =>
                      subscribeToMore({
                        document: GROUP_Deleted_SUBSCRIPTION,
                        //     variables: { repoName: params.repoName },
                        updateQuery: (prev, { subscriptionData }) => {
                          if (!subscriptionData.data) return prev;
                          if (subscriptionData.data.groupDeleted) {
                            const DeletedItem =
                              subscriptionData.data.groupDeleted;
                            return Object.assign({}, prev, {
                              getGroups: prev.getGroups.filter(
                                g => g._id != DeletedItem._id
                              )
                            });
                          }
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
                <TouchableOpacity
                  style={styles.logOut}
                  onPress={this._onLogoutPressed}
                >
                  <Text style={styles.logOutText}>log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </Query>
    );
  }
}
{
}
