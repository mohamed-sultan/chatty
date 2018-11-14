/** @format */
import React from 'react';
import {AppRegistry} from 'react-native';
import { ApolloProvider } from "react-apollo";

import {name as appName} from './app.json';
import App from './App'

AppRegistry.registerComponent(appName, () =>App);
