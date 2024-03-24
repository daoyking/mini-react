let taskId = 1;
function workLoop(deadline) {
	taskId++;

	let shouldYield = false;
	while (!shouldYield) {
		// 执行任务
		console.log(`taskId: ${taskId} run task`);
		shouldYield = deadline.timeRemaining() < 1;
	}
	requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
