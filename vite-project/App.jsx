import React from "./core/React.js";
// const App = React.createElement("div", { id: "app" }, "Hello-", "Mini-React!");

// let count = 1;
// let props = {
// 	id: "counter",
// };

// let check = false;
// function Counter({ num }) {
// 	// case 1
// 	// console.log("counter");
// 	// function handleClick() {
// 	// 	console.log("handleClick");
// 	// 	count++;
// 	// 	props = {};
// 	// 	React.update();
// 	// }

// 	// return (
// 	// 	<div {...props}>
// 	// 		counter: {count}
// 	// 		<button onClick={handleClick}>click me</button>
// 	// 	</div>
// 	// );

// 	// case 2
// 	const div = <div>div</div>;
// 	const p = (
// 		<div>
// 			p<div>child1</div>
// 			<div>child2</div>
// 		</div>
// 	);
// 	// function ComP() {
// 	// 	return <div>p</div>;
// 	// }

// 	function handleCheck() {
// 		console.log("handleCheck");
// 		check = !check;
// 		React.update();
// 	}
// 	return (
// 		<div>
// 			{/* <div>{check ? div : <ComP></ComP>}</div> */}
// 			{/* hahah */}
// 			{check && div}
// 			<button onClick={handleCheck}>check</button>
// 			{/* {!check && div} */}
// 		</div>
// 	);
// }

function Countiner() {
	return <Counter></Counter>;
}

let foo = 1;
function Foo() {
	console.log("Foo:click:");
	const update = React.update();
	function handleClick() {
		foo++;
		update();
	}

	return (
		<div>
			Foo:{foo}
			<button onClick={handleClick}>Foo add</button>
		</div>
	);
}

let bar = 1;
function Bar() {
	console.log("Bar:click:");
	const update = React.update();
	function handleClick() {
		bar++;
		update();
	}

	return (
		<div>
			Bar: {bar}
			<button onClick={handleClick}>Bar add</button>
		</div>
	);
}

let count = 1;
function Counter() {
	console.log("Counter:click:");
	const update = React.update();
	function handleClick() {
		count++;
		update();
	}

	return (
		<div>
			<div>{count > 3 ? <Foo></Foo> : <Bar></Bar>}</div>
			counter: {count}
			<button onClick={handleClick}>Counter add</button>
		</div>
	);
}

function App() {
	console.log("App");
	return (
		<div>
			hello-mini-react
			{/* <Countiner></Countiner> */}
			{/* <Counter num={10}></Counter> */}
			{/* <Counter num={20}></Counter> */}
			<Counter></Counter>
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
