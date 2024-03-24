const el = document.createElement("div");
el.innerText = "Hello World";
document.body.appendChild(el);

let i = 1;
while (i < 100000000) {
	// 执行任务
	i++;
}
