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
    let taskInput = document.getElementById("taskNome");
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

// Criação do card

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let task = document.getElementById(data);
    event.target.appendChild(task);
}

// Função que adiciona dados do input
function addTask() {
    let taskInput = document.getElementById("taskNome");
    let taskOwner = document.getElementById("taskOwner"); // Novo campo de entrada
    if (taskInput.value.trim() !== "") {
        let task = document.createElement("div");
        task.className = "task";
        task.draggable = true;
        task.ondragstart = drag;
        task.id = "task" + new Date().getTime();
        // Use o nome da tarefa e o responsável - Front-end 
        task.innerHTML = `<h5>Responsável: ${taskInput.value}</h5>
                          <p>Tarefa: ${taskOwner.value || 'Não definido'}</p>
                          <div><button type="button" onclick="markAsCompleted('${task.id}')" class="btn btn-success">Concluido</button>
                          <button type="button" onclick="taskDelete('${task.id}')" class="btn btn-danger">Apagar</button></div>`;
        document.querySelector(".kanban-column").appendChild(task);
        taskInput.value = "";
        taskOwner.value = "";  // Limpa o campo de responsável
    }
}

// Botão de DELETE do card

function taskDelete(taskId) {
    let task = document.getElementById(taskId);
    if (task) {
        task.remove(); // Remove o card da tarefa
    }
}

// Concluido falta finalizar ;D
function markAsCompleted(taskId) {
    let task = document.getElementById(taskId);
    
    // Adiciona uma classe ou altera o estilo para marcar a tarefa como concluída
    task.style.textDecoration = "line-through"; // Risca a tarefa
    task.querySelector(".btn-success").disabled = true; // Desabilita o botão "Concluído" para essa tarefa
    task.querySelector(".btn-success").innerText = "Concluída"; // Altera o texto do botão
}


// function addTask() {
//     let taskInput = document.getElementById("taskNome");
//     if (taskInput.value.trim() !== "") {
//         let task = document.createElement("div");
//         task.className = "task";
//         task.draggable = true;
//         task.ondragstart = drag;
//         task.id = "task" + new Date().getTime();
//         task.innerText = taskInput.value;
//         document.querySelector(".kanban-column").appendChild(task);
//         taskInput.value = "";
//     }
// }

// function addTask() {
//     let taskInput = document.getElementById("taskNome");
//     if (taskInput.value.trim() !== "") {
//         let task = document.createElement("div");
//         task.className = "task";
//         task.draggable = true;
//         task.ondragstart = drag;
//         task.id = "task" + new Date().getTime();
//         task.innerText = taskInput.value;
//         document.querySelector(".kanban-column").appendChild(task);
//         taskInput.value = "";
//     }
// }


