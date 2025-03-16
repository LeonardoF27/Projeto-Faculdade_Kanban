document.addEventListener("DOMContentLoaded", loadTasks);
function allowDrop(event) { event.preventDefault(); }
function drag(event) { event.dataTransfer.setData("text", event.target.id); }
function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let task = document.getElementById(taskId);
    event.target.appendChild(task);
    saveTasks();
}
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskOwner = document.getElementById("taskOwner");
    let taskDeadline = document.getElementById("taskDeadline");
    if (taskInput.value.trim() !== "") {
        let task = document.createElement("div");
        task.className = "task";
        task.draggable = true;
        task.ondragstart = drag;
        task.id = "task" + new Date().getTime();
        task.innerHTML = `<strong>${taskInput.value}</strong><br>
                          <small>Responsável: ${taskOwner.value || 'Não definido'}</small><br>
                          <small>Prazo: ${taskDeadline.value || 'Sem prazo'}</small>
                          <button class='delete-btn' onclick='deleteTask("${task.id}")'>X</button>`;
        document.getElementById("todo").appendChild(task);
        taskInput.value = "";
        taskOwner.value = "";
        taskDeadline.value = "";
        saveTasks();
    }
}
function deleteTask(id) {
    document.getElementById(id).remove();
    saveTasks();
}
function saveTasks() {
    let tasks = {};
    document.querySelectorAll(".kanban-column").forEach(column => {
        let columnId = column.id;
        tasks[columnId] = [];
        column.querySelectorAll(".task").forEach(task => {
            tasks[columnId].push(task.innerHTML);
        });
    });
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || {};
    Object.keys(tasks).forEach(columnId => {
        let column = document.getElementById(columnId);
        tasks[columnId].forEach(taskHTML => {
            let task = document.createElement("div");
            task.className = "task";
            task.draggable = true;
            task.ondragstart = drag;
            task.id = "task" + new Date().getTime();
            task.innerHTML = taskHTML;
            column.appendChild(task);
        });
    });
}
