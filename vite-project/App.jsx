import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, "Hello-", "Mini-React!");

function Counter({ num }) {
	return <div>counter: {num}</div>;
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
			<Counter num={20}></Counter>
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
