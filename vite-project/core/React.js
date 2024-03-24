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
	// 创建节点
	const dom =
		el.type === "text_element"
			? document.createTextNode("")
			: document.createElement(el.type);

	// 设置属性
	Object.keys(el.props).forEach((key) => {
		if (key !== "children") {
			dom[key] = el.props[key];
		}
	});

	// 设置子节点
	const children = el.props.children;
	children.forEach((child) => {
		render(child, dom);
	});

	// 递归渲染子节点
	container.append(dom);
}

const React = {
	createElement,
	render,
};

export default React;
