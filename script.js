const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.name;
    li.className = task.done ? "done" : "";
    li.onclick = () => toggleDone(index);
    const delBtn = document.createElement("button");
    delBtn.textContent = "x";
    delBtn.onclick = (e) => { e.stopPropagation(); deleteTask(index); };
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  if(input.value.trim() === "") return;
  tasks.push({ name: input.value, done: false });
  input.value = "";
  saveTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
