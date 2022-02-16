import * as React from "react";
import * as ReactDOM from "react-dom";
import "./_style/antd.less";
import "./_style/index.scss";
import MkTools from "./MkTools";

function render() {
  ReactDOM.render(<MkTools />, document.getElementById("app"));
}

render();
