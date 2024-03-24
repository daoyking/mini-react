// const elText = {
// 	type: "text_element",
// 	props: {
// 		nodeValue: "Hello, main.js!",
// 		children: [],
// 	},
// };

// 创建节点
function createTextNode(type, props) {
	return {
		type: "text_element",
		props: {
			nodeValue: type,
			children: [],
		},
	};
}

// const el = {
// 	type: "div",
// 	props: {
// 		id: "app",
// 		children: [elText],
// 	},
// };

// 动态创建元素
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				return typeof child !== "string"
					? child
					: createTextNode(child);
			}),
		},
	};
}

function render(el, container) {
	nextWorkOfUnit = {
		dom: container,
		props: {
			children: [el],
		},
	};
	// // 创建节点
	// const dom =
	// 	el.type === "text_element"
	// 		? document.createTextNode("")
	// 		: document.createElement(el.type);
	// // 设置属性
	// Object.keys(el.props).forEach((key) => {
	// 	if (key !== "children") {
	// 		dom[key] = el.props[key];
	// 	}
	// });
	// // 设置子节点
	// const children = el.props.children;
	// children.forEach((child) => {
	// 	render(child, dom);
	// });
	// // 递归渲染子节点
	// container.append(dom);
}

// let taskId = 1;
let nextWorkOfUnit = null;
function workLoop(deadline) {
	// taskId++;

	let shouldYield = false;
	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		// 执行任务
		// console.log(`taskId: ${taskId} run task`);
		shouldYield = deadline.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop);
}

function createDom(type) {
	return type === "text_element"
		? document.createTextNode("")
		: document.createElement(type);
}

function updateProps(dom, prop) {
	Object.keys(prop).forEach((key) => {
		if (key !== "children") {
			dom[key] = prop[key];
		}
	});
}

function initChild(fiber) {
	const children = fiber.props.children;
	let prevChild = null;
	children.forEach((child, index) => {
		const newFiber = {
			dom: null,
			props: child.props,
			type: child.type,
			parent: fiber,
			child: null,
			sibling: null,
		};
		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}

function performWorkOfUnit(fiber) {
	if (!fiber.dom) {
		// 1.创建dom
		const dom = (fiber.dom = createDom(fiber.type));
		fiber.parent.dom.append(dom);
		// 2.设置prop
		updateProps(dom, fiber.props);
	}
	// 3.创建链表，设置指针
	initChild(fiber);
	// 4.返回下一个需要执行的任务
	if (fiber.child) {
		return fiber.child;
	}

	if (fiber.sibling) {
		return fiber.sibling;
	}

	return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
	createElement,
	render,
};

export default React;
