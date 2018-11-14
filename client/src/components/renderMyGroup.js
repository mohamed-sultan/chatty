import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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

  group: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "purple",
    marginHorizontal: 5,
    marginVertical: 5
  },
  groupName: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
    color: "white",
    fontWeight: "900"
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    position: "absolute",
    bottom: 10,
    right: 35
  },
  iconText: {
    fontSize: 60
  },
  hairLine: {
    position: "absolute",
    top: 40,
    fontSize: 10,
    fontWeight: "900",
    color: "white"
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

    return (
      <TouchableOpacity
        key={_id}
        style={styles.group}
        onPress={this.props.onPress}
      >
        <Text style={styles.groupName}>{name}</Text>
        <Text style={styles.hairLine}>_____________________</Text>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => {
            this._handelDeleteGroup(_id);
          }}
        >
          <AntDesign name="delete" size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

export default class RenderGroups extends Component {
  state = {
    _id: "",
    ready: false
  };
  async componentWillMount() {
    const _id = await AsyncStorage.getItem("_id");

    if (_id) {
      this.setState({ _id, ready: true });
    }
    this.props.subscribeToDeletedGroup();
  }

  keyExtractor = item => item._id;

  renderItem = ({ item }) => {
    return <Group group={item} onPress={() => this.props.onPress(item)} />;
  };

  render() {
    const filterd = this.props.data.getGroups.filter(
      g => g.admin === this.state._id
    );

    if (!this.state.ready) return <Text>not ready</Text>;
    if (filterd.length === 0) {
      return (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontWeight: "900", fontSize: 20 }}>
            no groups to show!!
          </Text>
        </View>
      );
    }
    return (
      <View>
        <FlatList
          data={filterd}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          horizontal={true}
        />
      </View>
    );
  }
}
