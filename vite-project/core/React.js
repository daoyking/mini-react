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
	wipRoot = {
		dom: container,
		props: {
			children: [el],
		},
	};
	nextWorkOfUnit = wipRoot;
}

function update() {
	wipRoot = {
		dom: currantRoot.dom,
		props: currantRoot.props,
		alternate: currantRoot,
	};
	nextWorkOfUnit = wipRoot;
}

let nextWorkOfUnit = null;
let wipRoot = null;
let currantRoot = null;
function workLoop(deadline) {
	let shouldYield = false;
	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		// 执行任务
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextWorkOfUnit && wipRoot) {
		commitRoot();
	}
	requestIdleCallback(workLoop);
}

function commitRoot() {
	commitWork(wipRoot.child);
	currantRoot = wipRoot;
	wipRoot = null;
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

	// if (fiber.effectTag === "update") {
	// 	console.log("fiber.effectTag", fiber);
	// 	updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
	// } else if (fiber.effectTag === "placement") {
	// 	fiber.dom && domParent.dom.append(fiber.dom);
	// }

	switch (fiber.effectTag) {
		case "update":
			updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
			break;
		case "placement":
			fiber.dom && domParent.dom.append(fiber.dom);
			break;
		default:
			break;
	}

	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function createDom(type) {
	return type === "text_element"
		? document.createTextNode("")
		: document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
	Object.keys(prevProps).forEach((key) => {
		if (key !== "children") {
			if (!(key in nextProps)) {
				dom.removeAttribute(key);
			}
		}
	});

	Object.keys(nextProps).forEach((key) => {
		if (key !== "children") {
			if (nextProps[key] !== prevProps[key]) {
				if (key.startsWith("on")) {
					const event = key.slice(2).toLocaleLowerCase();
					dom.removeEventListener(event, prevProps[key]);
					dom.addEventListener(event, nextProps[key]);
				} else {
					dom[key] = nextProps[key];
				}
			}
		}
	});
}

function initChild(fiber, children) {
	let prevChild = null;
	let oldFiber = fiber.alternate?.child;
	children.forEach((child, index) => {
		const isSame = oldFiber && oldFiber.type === child.type;
		let newFiber;
		if (isSame) {
			// update
			newFiber = {
				dom: oldFiber.dom,
				props: child.props,
				type: child.type,
				parent: fiber,
				child: null,
				sibling: null,
				effectTag: "update",
				alternate: oldFiber,
			};
		} else {
			// placement
			newFiber = {
				dom: null,
				props: child.props,
				type: child.type,
				parent: fiber,
				child: null,
				sibling: null,
				effectTag: "placement",
			};
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

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
		updateProps(dom, fiber.props, {});
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
	update,
};

export default React;
