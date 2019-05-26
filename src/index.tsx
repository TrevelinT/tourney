import "react-hot-loader";
import React, { ReactElement } from "react";
import { Provider } from "react-redux";
import configureStore from "store";
import { render } from "react-dom";
import App from "views/App";

const store = configureStore();
const Root = (): ReactElement => (
  <Provider store={store}>
    <App />
  </Provider>
);
const root = document.createElement("div");
document.body.appendChild(root);

render(<Root />, root);
