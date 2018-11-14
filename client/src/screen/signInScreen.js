import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
  TextInput,
  AsyncStorage
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Fumi } from "react-native-textinput-effects";
import * as Yup from "yup";

import { client } from "../constant";
import { LoginQuery } from "../graphql/query/login";
import { MeQuery } from "../graphql/query/me";
import { SIGNUP_MUTATION } from "../graphql/mutation/signup";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Not Valid Email !")
    .required("Email Required !"),
  password: Yup.string()
    .required("Password Required !")
    .min(6, "Password Must Be at Least 6 char "),
  userName: Yup.string()
    .required("Username Required !")
    .min(6, "Username Must Be at Least 6 char ")
});

const INTAIL_STATE = {
  showLogin: true,
  formTitle: "login to your account",
  ButtonTitle: "login",
  errorMessage: "",
  email: "",
  password: "",
  username: "",
  loading: false,
  netWorkErro: false
};
const DURATION = 200;
const { height, width } = Dimensions.get("window");

export default class TextInputEffectsExample extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      ...INTAIL_STATE,
      flatListHeight: new Animated.Value(Dimensions.get("window").height),
      screenHeight: height
    };
    this.animate = new Animated.Value(0);
    this.animateText = new Animated.Value(0);
    this.animateForm = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.animate, {
        toValue: 100,
        easing: Easing.quad,
        delay: 500
      }),
      Animated.timing(this.animateText, {
        toValue: 100,
        easing: Easing.exp,
        delay: 500
      }),
      Animated.timing(this.animateForm, {
        toValue: 100,
        easing: Easing.bounce,
        delay: 500
      })
    ]).start();

    this._keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyBoardDidShow
    );
    this._keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyBoardDidHide
    );
  }

  componentWillUnmount() {
    this._keyboardDidShowListener.remove();
    this._keyboardDidHideListener.remove();
  }

  _keyBoardDidShow = e => {
    this.ScrollView.scrollTo({ x: 0, y: 150, animated: true });
    Animated.timing(this.state.flatListHeight, {
      toValue: height - e.endCoordinates.height,
      duration: DURATION
    }).start();
  };

  _keyBoardDidHide = () => {
    this.ScrollView.scrollTo({ x: 0, y: 0, animated: true });

    Animated.timing(this.state.flatListHeight, {
      toValue: height,
      duration: DURATION
    }).start();
  };
  _isValidForm = async () => {
    if (this.state.loading || this.state.errorMessage.length) return false;
    if (this.state.showLogin) {
      try {
        await schema.validate({
          email: this.state.email,
          password: this.state.password,
          userName: "randomusername"
        });
        return true;
      } catch (error) {
        return false;
      }
    } else {
      try {
        await schema.validate({
          email: this.state.email,
          password: this.state.password,
          userName: this.state.username
        });
        return true;
      } catch (error) {
        return false;
      }
    }
  };
  handleLogin = async () => {
    this.setState(INTAIL_STATE);
  };
  handleRegister = () => {
    this.setState({
      ...INTAIL_STATE,
      showLogin: false,
      formTitle: "register new account",
      ButtonTitle: "register"
    });
  };
  _saveTokenAndIdToLocalStorage = async token => {
    try {
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      throw error;
    }
    try {
      const { data } = await client.query({
        query: MeQuery
      });

      await AsyncStorage.setItem("_id", data.me._id);
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  handlePressed = async () => {
    const { email, password, username } = this.state;
    this.setState({ loading: true });
    if (this.state.showLogin) {
      try {
        const response = await client.query({
          query: LoginQuery,
          variables: { email, password }
        });
        await this._saveTokenAndIdToLocalStorage(response.data.login.token);
        this.props.navigation.navigate("App");
      } catch (error) {
        if (error.message === "Network error: Network request failed") {
          this.setState({ netWorkErro: true });
        } else {
          this.setState({ errorMessage: error.graphQLErrors[0].message });
        }
      }
    } else {
      try {
        const response = await client.mutate({
          mutation: SIGNUP_MUTATION,
          variables: { email, password, username }
        });
        await this._saveTokenAndIdToLocalStorage(response.data.signup.token);
        this.props.navigation.navigate("App");
      } catch (error) {
        if (error.message === "Network error: Network request failed") {
          this.setState({ netWorkErro: true });
        } else {
          this.setState({ errorMessage: error.graphQLErrors[0].message });
        }
      }
    }
    this.setState({ loading: false });
  };
  render() {
    const imageMargin = this.animate.interpolate({
      inputRange: [0, 100],
      outputRange: [-100, 10]
    });

    const textMargin = this.animateText.interpolate({
      inputRange: [0, 100],
      outputRange: [width, 0]
    });
    const formMargin = this.animateForm.interpolate({
      inputRange: [0, 100],
      outputRange: [width + 100, 10]
    });
    if (this.state.netWorkErro) {
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
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
              no internet connection!!
            </Text>
          </View>
        );
      }
    }

    return (
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={styles.content}
        ref={ref => {
          this.ScrollView = ref;
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Image
          source={require("../assests/logo.png")}
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            marginTop: imageMargin,
            marginBottom: 10
          }}
        />
        <Animated.Text
          style={{
            marginRight: textMargin,
            alignSelf: "center",
            color: "red",
            fontSize: 30,
            fontWeight: "800"
          }}
        >
          yalla chat
        </Animated.Text>

        <Animated.View style={{ marginTop: formMargin }}>
          <View style={[styles.card2, { backgroundColor: "#a9ceca" }]}>
            <Text style={styles.text}>{this.state.formTitle}</Text>
            <Fumi
              label={"email"}
              labelStyle={{ color: "#a3a3a3" }}
              value={this.state.email}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email })}
              inputStyle={{
                color: "#f95a25"
              }}
              style={{
                borderBottomColor: "#a9ceca",
                borderBottomWidth: this.state.showLogin ? 0 : 3
              }}
              iconClass={MaterialCommunityIcons}
              iconName={"email"}
              iconColor={"#f95a25"}
              onEndEditing={async () => {
                try {
                  await schema.validate({
                    email: this.state.email,
                    password: "334444",
                    userName: "eerrrwre"
                  });
                  this.setState({ errorMessage: "" });
                } catch (error) {
                  this.setState({ errorMessage: error.message });
                }
              }}
            />
            {!this.state.showLogin && (
              <Fumi
                label={"username"}
                value={this.state.username}
                autoCapitalize="none"
                onChangeText={username => this.setState({ username })}
                labelStyle={{ color: "#a3a3a3" }}
                inputStyle={{ color: "#f95a25" }}
                iconClass={FontAwesome}
                iconName={"user"}
                iconColor={"#f95a25"}
                onEndEditing={async () => {
                  try {
                    await schema.validate({
                      email: this.state.email,
                      password: "334444",
                      userName: this.state.username
                    });
                    this.setState({ errorMessage: "" });
                  } catch (error) {
                    this.setState({ errorMessage: error.message });
                  }
                }}
              />
            )}
            <Fumi
              style={styles.input}
              value={this.state.password}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              label={"password"}
              iconClass={SimpleLineIcons}
              iconName={"key"}
              iconColor={"#77116a"}
              onEndEditing={async () => {
                try {
                  await schema.validate({
                    email: this.state.email,
                    password: this.state.password,
                    userName: this.state.showLogin
                      ? "rrrrrrr"
                      : this.state.username
                  });
                  this.setState({ errorMessage: "" });
                } catch (error) {
                  this.setState({ errorMessage: error.message });
                }
              }}
            />
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 5
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                fontSize: 15,
                color: "red",
                fontWeight: "900"
              }}
            >
              {this.state.errorMessage}
            </Text>
            <TouchableOpacity
              onPress={this.handlePressed}
              style={[
                styles.button,
                {
                  backgroundColor: this._isValidForm() ? "#a9ceca" : "gray"
                }
              ]}
              disabled={
                (!this.state.showLogin && !this.state.username.length > 5) ||
                this.state.loading ||
                this.state.errorMessage.length > 0 ||
                this.state.email === "" ||
                this.state.password === ""
              }
            >
              {this.state.loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  style={{ color: "white", fontSize: 20, fontWeight: "800" }}
                >
                  {this.state.ButtonTitle}
                </Text>
              )}
            </TouchableOpacity>
            {this.state.showLogin && (
              <View>
                <Text style={styles.text}>Don't Have Account?</Text>
                <Text onPress={this.handleRegister} style={styles.text}>
                  Register Now!
                </Text>
              </View>
            )}
            {!this.state.showLogin && (
              <View>
                <Text style={styles.text}>already have account?</Text>
                <Text onPress={this.handleLogin} style={styles.text}>
                  Login now
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: "white"
  },
  content: {
    paddingBottom: 300
  },
  card1: {
    paddingVertical: 16
  },
  card2: {
    padding: 1,
    width: "95%",
    alignSelf: "center",
    marginBottom: 10,
    borderColor: "#a9ceca",
    borderWidth: 1
  },
  input: {
    marginTop: 4
  },
  title: {
    paddingBottom: 16,
    textAlign: "center",
    color: "#404d5b",
    fontSize: 20,
    fontWeight: "bold",
    opacity: 0.8
  },
  text: {
    color: "black",
    fontSize: 18,
    fontWeight: "900",
    marginVertical: 5,
    alignSelf: "center"
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center"
  }
});
