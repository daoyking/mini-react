// 创建节点
function createTextNode(type) {
	return {
		type: "text_element",
		props: {
			nodeValue: type,
			children: [],
		},
	};
}

// 动态创建元素
function createElement(type, props, ...children) {
	return {
		type,
		props: {
			...props,
			children: children.map((child) => {
				const isTextNode =
					typeof child === "string" || typeof child === "number";
				return isTextNode ? createTextNode(child) : child;
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
	root = nextWorkOfUnit;
}

let nextWorkOfUnit = null;
let root = null;
let currantRoot = null;
function workLoop(deadline) {
	let shouldYield = false;
	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		// 执行任务
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextWorkOfUnit && root) {
		commitRoot();
	}
	requestIdleCallback(workLoop);
}

function commitRoot() {
	commitWork(root.child);
	currantRoot = root;
	root = null;
}

function commitWork(fiber) {
	if (!fiber) {
		return;
	}
	let domParent = fiber.parent;
	// 找到最近的父节点
	while (!domParent.dom) {
		domParent = domParent.parent;
	}
	if (fiber.dom) {
		domParent.dom.append(fiber.dom);
	}
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function createDom(type) {
	return type === "text_element"
		? document.createTextNode("")
		: document.createElement(type);
}

function updateProps(dom, prop) {
	Object.keys(prop).forEach((key) => {
		if (key !== "children") {
			if (key.startsWith("on")) {
				const event = key.slice(2).toLocaleLowerCase();
				dom.addEventListener(event, prop[key]);
			} else {
				dom[key] = prop[key];
			}
		}
	});
}

function initChild(fiber, children) {
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

function updateFunctionComp(fiber) {
	const children = [fiber.type(fiber.props)];
	initChild(fiber, children);
}

function updateHostComp(fiber) {
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type));
		updateProps(dom, fiber.props);
	}

	const children = fiber.props.children;
	initChild(fiber, children);
}

function performWorkOfUnit(fiber) {
	const isFunctionComponent = typeof fiber.type === "function";

	if (isFunctionComponent) {
		updateFunctionComp(fiber);
	} else {
		updateHostComp(fiber);
	}
	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) {
			return nextFiber.sibling;
		}
		nextFiber = nextFiber.parent;
	}
}

requestIdleCallback(workLoop);

const React = {
	createElement,
	render,
};

export default React;
