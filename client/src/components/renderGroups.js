import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import { client } from "../constant";
import { Delete_GROUP_MUTATION } from "../graphql/mutation/deleteGroup";

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
  }
});

class Group extends Component {
  _handelDeleteGroup = async _id => {
    try {
      await client.mutate({
        mutation: Delete_GROUP_MUTATION,
        variables: { _id }
      });
    } catch (error) {
      throw error;
    }
  };
  render() {
    const { _id, name } = this.props.group;
    const { isAdmin } = this.props;

    return (
      <TouchableHighlight key={_id} onPress={this.props.onPress}>
        <View style={styles.groupContainer}>
          <Text style={styles.groupName}>{`${name}`}</Text>
          {isAdmin && (
            //  <Text onPress={() => this._handelDeleteGroup(_id)}>delete</Text>
            <AntDesign
              name="delete"
              size={25}
              onPress={() => this._handelDeleteGroup(_id)}
            />
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

export default class RenderGroups extends Component {
  state = {
    _id: "",
    ready: false
  };
  async componentDidMount() {
    const _id = await AsyncStorage.getItem("_id");

    if (_id) {
      this.setState({ _id, ready: true });
    }
    this.props.subscribeToNewGroup();
    this.props.subscribeToDeletedGroup();
  }

  keyExtractor = item => item._id;

  renderItem = ({ item }) => {
    return (
      <Group
        isAdmin={this.state._id === item.admin}
        group={item}
        onPress={() => this.props.onPress(item)}
      />
    );
  };

  render() {
    if (!this.state.ready) return null;
    return (
      <View>
        <FlatList
          data={this.props.data.getGroups}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
