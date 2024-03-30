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
	let currentFiber = wipFiber;

	return () => {
		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
		};
		// wipRoot = {
		// 	dom: currentRoot.dom,
		// 	props: currentRoot.props,
		// 	alternate: currentRoot,
		// };
		nextWorkOfUnit = wipRoot;
	};
}

let stateHooks;
let stateHooksIdx;
function useState(initial) {
	let currentFiber = wipFiber;
	const oldHook = currentFiber.alternate?.stateHooks[stateHooksIdx];
	const stateHook = {
		state: oldHook ? oldHook.state : initial,
		queue: oldHook ? oldHook.queue : [],
	};

	stateHook.queue.forEach((action) => {
		stateHook.state = action(stateHook.state);
	});

	stateHook.queue = [];

	stateHooksIdx++;
	stateHooks.push(stateHook);
	currentFiber.stateHooks = stateHooks;

	function setState(action) {
		const eagerState =
			typeof action === "function" ? action(stateHook.state) : action;

		if (eagerState === stateHook.state) return;

		stateHook.queue.push(
			typeof action === "function" ? action : () => action
		);

		wipRoot = {
			...currentFiber,
			alternate: currentFiber,
		};
		nextWorkOfUnit = wipRoot;
	}

	return [stateHook.state, setState];
}

function useEffect(callback, deps) {
	const effectHook = {
		callback,
		deps,
		cleanup: undefined,
	};

	effectHooks.push(effectHook);

	wipFiber.effectHooks = effectHooks;
}

let nextWorkOfUnit = null;
let wipRoot = null;
let currentRoot = null;
let wipFiber = null;
function workLoop(deadline) {
	let shouldYield = false;
	while (!shouldYield && nextWorkOfUnit) {
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

		if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
			nextWorkOfUnit = undefined;
		}

		// 执行任务
		shouldYield = deadline.timeRemaining() < 1;
	}

	if (!nextWorkOfUnit && wipRoot) {
		commitRoot();
	}
	requestIdleCallback(workLoop);
}

function commitRoot() {
	deletions.forEach(commitDeletion);
	commitWork(wipRoot.child);
	commitEffectHooks();
	currentRoot = wipRoot;
	wipRoot = null;
	deletions = [];
}

let effectHooks;
function commitEffectHooks() {
	function run(fiber) {
		if (!fiber) return;
		// init
		if (!fiber.alternate) {
			fiber.effectHooks?.forEach((hook) => {
				hook.cleanup = hook.callback();
			});
		} else {
			// update
			fiber.effectHooks?.forEach((newHook, index) => {
				if (newHook.deps.length > 0) {
					const oldEffectHook = fiber.alternate?.effectHooks[index];

					const needUpdate = oldEffectHook?.deps.some(
						(oldDep, idx) => {
							return oldDep !== newHook.deps[idx];
						}
					);

					needUpdate && (newHook.cleanup = newHook.callback());
				}
			});
		}
		run(fiber.child);
		run(fiber.sibling);
	}

	function runCleanup(fiber) {
		if (!fiber) return;

		fiber.alternate?.effectHooks?.forEach((hook) => {
			if (hook.deps.length > 0) {
				hook.cleanup && hook.cleanup();
			}
		});

		runCleanup(fiber.child);
		runCleanup(fiber.sibling);
	}
	runCleanup(wipRoot);
	run(wipRoot);
}

function commitDeletion(fiber) {
	if (fiber.dom) {
		let domParent = fiber.parent;
		while (!domParent.dom) {
			domParent = domParent.parent;
		}
		domParent.dom.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child);
	}
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

let deletions = [];
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
			if (child) {
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

			oldFiber && deletions.push(oldFiber);
		}

		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}

		// 当prevChild不存在时需要把指针置回
		if (index === 0 && !prevChild) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		if (newFiber) {
			prevChild = newFiber;
		}
	});

	while (oldFiber) {
		deletions.push(oldFiber);
		oldFiber = oldFiber.sibling;
	}
}

function updateFunctionComp(fiber) {
	wipFiber = fiber;
	stateHooks = [];
	stateHooksIdx = 0;
	effectHooks = [];
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
	useState,
	useEffect,
};

export default React;
