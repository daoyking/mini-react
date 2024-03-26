import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, "Hello-", "Mini-React!");

function Counter({ num }) {
	const handleClick = () => {
		console.log("handleClick");
	};

	return (
		<div>
			counter: {num}
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
