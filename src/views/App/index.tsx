import { hot } from "react-hot-loader/root";
import React, { Component, ReactNode } from "react";
import AppRouter from "routes/App";

class App extends Component<{}, {}> {
  render(): ReactNode {
    return <AppRouter />;
  }
}

export default hot(App);
