import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, "Hello-", "Mini-React!");

let count = 1;
let props = {
	id: "counter",
};
function Counter({ num }) {
	console.log("counter");
	function handleClick() {
		console.log("handleClick");
		count++;
		props = {};
		React.update();
	}

	return (
		<div {...props}>
			counter: {count}
			<button onClick={handleClick}>click me</button>
		</div>
	);
}

function Countiner() {
	return <Counter></Counter>;
}

function App() {
	return (
		<div>
			hello-mini-react
			{/* <Countiner></Countiner> */}
			<Counter num={10}></Counter>
			{/* <Counter num={20}></Counter> */}
		</div>
	);
}

// function App() {
// 	return (
// 		<div>
// 			hello-mini-react
// 			<Counter num={10}></Counter>
// 		</div>
// 	);
// }

export default App;
