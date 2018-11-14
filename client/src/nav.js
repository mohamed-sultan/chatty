import React from "react";
import { Text } from "react-native";
import {
  createStackNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";

import GroupScreen from "./screen/GroupScreen";
import SettingScreen from "./screen/setting";
import MessageScreen from "./screen/MessageScreen";
import SignInScreen from "./screen/signInScreen";
import AuthLoadingScreen from "./screen/AppLoadingScreen";

const T = createMaterialTopTabNavigator(
  {
    Home: {
      screen: createStackNavigator({
        GroupScreen: {
          screen: GroupScreen,
          navigationOptions: () => ({
            header: null
          })
        }
      })
    },
    Setting: createStackNavigator({
      SettingScreen: {
        screen: SettingScreen,
        navigationOptions: () => ({
          header: null
        })
      }
    })
  },
  {
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: "white"
      },
      labelStyle: {
        fontSize: 15,
        fontWeight: "900"
      },
      tabStyle: {
        width: 200,
        height: 50
      },
      style: {
        backgroundColor: "black"
      }
    }
  }
);

const AppStack = createStackNavigator(
  {
    Main: {
      screen: T,
      navigationOptions: () => ({
        header: null
      })
    },
    MessageScreen: {
      screen: MessageScreen
    }
  },
  {
    mode: "modal"
  }
);

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);
