import React from "../core/React.js";
import "../style.css";

export function TodoList() {
	const [todos, setTodos] = React.useState([
		// {
		// 	text: "Learn React",
		// 	id: crypto.randomUUID(),
		// 	status: "active",
		// },
		// {
		// 	text: "Build a todo app",
		// 	id: crypto.randomUUID(),
		// 	status: "done",
		// },
		// {
		// 	text: "Deploy to Vercel",
		// 	id: crypto.randomUUID(),
		// 	status: "done",
		// },
	]);
	let [inputText, setInputText] = React.useState("");
	const [filter, setFilter] = React.useState("all");
	const [filteredTodos, setFilteredTodos] = React.useState(todos);

	React.useEffect(() => {
		switch (filter) {
			case "all":
				setFilteredTodos(todos);
				break;
			case "active":
				const activeTodos = todos.filter(
					(todo) => todo.status === "active"
				);
				setFilteredTodos(activeTodos);
				break;
			case "done":
				const doneTodos = todos.filter(
					(todo) => todo.status === "done"
				);
				setFilteredTodos(doneTodos);
				break;
			default:
				break;
		}
	}, [filter, todos]);

	function handleAdd() {
		addTodo(inputText);

		setInputText("");
	}

	function createTodo(text) {
		return {
			id: crypto.randomUUID(),
			text: text,
			status: "active",
		};
	}

	function addTodo(text) {
		// 处理添加操作
		setTodos((todo) => {
			return [...todo, createTodo(text)];
		});
	}

	function handleRemove(id) {
		const newTodo = todos.filter((todo) => todo.id !== id);
		setTodos(newTodo);
	}
	function handleDone(id) {
		const newTodo = todos.map((todo) => {
			if (todo.id === id) {
				return {
					...todo,
					status: "done",
				};
			}
			return todo;
		});
		setTodos(newTodo);
	}
	function handleCancel(id) {
		const newTodo = todos.map((todo) => {
			if (todo.id === id) {
				return {
					...todo,
					status: "active",
				};
			}
			return todo;
		});
		setTodos(newTodo);
	}

	function handleSave() {
		localStorage.setItem("todos", JSON.stringify(todos));
	}

	React.useEffect(() => {
		const rawTodos = localStorage.getItem("todos");
		if (rawTodos) {
			setTodos(JSON.parse(rawTodos));
		}
	}, []);

	return (
		<div>
			<h1>Todo List</h1>
			<div>
				<input
					type="text"
					value={inputText}
					onChange={(e) => setInputText(e.target.value)}
				/>
				<button onClick={handleAdd}>Add</button>
				<button onClick={handleSave}>Save</button>
			</div>
			<div>
				<input
					type="radio"
					name="filter"
					value="all"
					checked={filter === "all"}
					onChange={() => setFilter("all")}
				/>
				<label htmlFor="all">All</label>
				<input
					type="radio"
					name="filter"
					value="active"
					checked={filter === "active"}
					onChange={() => setFilter("active")}
				/>
				<label htmlFor="active">active</label>
				<input
					type="radio"
					name="filter"
					value="done"
					checked={filter === "done"}
					onChange={() => setFilter("done")}
				/>
				<label htmlFor="done">Done</label>
			</div>
			<ul>
				{...filteredTodos.map((todo) => (
					<TodoItem
						todo={todo}
						handleRemove={handleRemove}
						handleDone={handleDone}
						handleCancel={handleCancel}
					></TodoItem>
				))}
			</ul>
		</div>
	);
}

function TodoItem({ todo, handleRemove, handleDone, handleCancel }) {
	return (
		<div className={todo.status}>
			<li key={todo.id}>
				{todo.text}
				<button onClick={() => handleRemove(todo.id)}>remove</button>
				{todo.status === "done" ? (
					<button onClick={() => handleCancel(todo.id)}>
						cancel
					</button>
				) : (
					<button onClick={() => handleDone(todo.id)}>done</button>
				)}
			</li>
		</div>
	);
}
