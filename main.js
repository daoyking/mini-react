console.log("hello, main");

// const dom = document.createElement("div");
// dom.id = "app";
// document.getElementById("root").appendChild(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = "Hello, main!";
// dom.appendChild(textNode);

// const textEl = createTextNode("Hello, main.js!");
// const App = createElement("div", { id: "app" }, textEl);

// const dom = document.createElement(App.type);
// dom.id = App.props.id;
// document.getElementById("root").appendChild(dom);

// const textNode = document.createTextNode("");
// textNode.nodeValue = elText.props.nodeValue;
// dom.appendChild(textNode);

// const textEl = createTextNode("Hello, mini-react!");
// const App = createElement("div", { id: "app" }, "Hello, ", "Mini-React!");
// console.log("----------", App);
// render(App, document.querySelector("#root"));

// ReactDOM.render(<App />, document.querySelector("#root"));

import ReactDOM from "./core/ReactDOM.js";
import App from "./App.js";

ReactDOM.createRoot(document.querySelector("#root")).render(App);
