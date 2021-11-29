import * as React from "react";
import * as ReactDOM from "react-dom";
import "./autosnipe.css";
interface Props {}

const Autosnipe = (props: Props) => {
  return <div>hi</div>;
};

var mountNode = document.getElementById("autosnipe");
ReactDOM.render(<Autosnipe />, mountNode);
