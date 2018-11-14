import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";

import { client } from "./src/constant";
import Nav from "./src/nav";

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Nav />
      </ApolloProvider>
    );
  }
}
