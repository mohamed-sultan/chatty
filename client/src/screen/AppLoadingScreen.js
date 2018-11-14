import React, { Component } from "react";
import { View, Text, AsyncStorage } from "react-native";

import AppLoading from "../components/loading";

export default class componentName extends Component {
  constructor(props) {
    super(props);
    // this._clearLocalStorageAsync();
    this._bootstrapAsync();
  }

  _clearLocalStorageAsync = async () => {
    await AsyncStorage.clear();
  };

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem("token");
    const _id = await AsyncStorage.getItem("_id");

    this.props.navigation.navigate(userToken ? "App" : "Auth");
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppLoading />
      </View>
    );
  }
}
