console.log("Script carregado");

// Permite que os elementos sejam soltos em áreas válidas
function allowDrop(event) {
    event.preventDefault();
}

// Inicia o processo de arrastar um elemento
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Solta o elemento arrastado dentro de uma coluna do Kanban
function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData("text");
    let task = document.getElementById(taskId);
    if (task && event.target.classList.contains("kanban-column")) {
        event.target.appendChild(task);
        saveTasks();
    }
}

// Permite editar o nome e o responsável da tarefa
function editTask(id) {
    let task = document.getElementById(id);
    if (!task) return;
    
    let taskName = task.querySelector("strong").innerText;
    let taskOwner = task.querySelector("small:nth-of-type(1)").innerText.replace("Responsável: ", "");
    
    let newTaskName = prompt("Editar nome da tarefa:", taskName);
    let newTaskOwner = prompt("Editar responsável:", taskOwner);
    
    if (newTaskName) task.querySelector("strong").innerText = newTaskName;
    if (newTaskOwner) task.querySelector("small:nth-of-type(1)").innerText = "Responsável: " + newTaskOwner;
    
    saveTasks();
}

// Adiciona uma nova tarefa ao quadro
function addTask() {
    let taskInput = document.getElementById("taskNome");
    let taskOwner = document.getElementById("taskOwner");
    let taskDeadline = document.getElementById("taskDeadline");

    if (taskInput.value.trim() !== "") {
        let taskId = "task" + new Date().getTime();
        let task = document.createElement("div");
        task.className = "task";
        task.draggable = true;
        task.ondragstart = drag;
        task.id = taskId;
        task.innerHTML = `<strong>${taskInput.value}</strong><br>
                          <small>Tarefa: ${taskOwner.value || 'Não definido'}</small><br>
                          <small>Prazo: ${taskDeadline.value || 'Sem prazo'}</small><br>
                          <div class="task-buttons">
                              <button class='edit-btn btn btn-warning btn-sm' onclick='editTask("${taskId}")'>Editar</button>
                              <button class='delete-btn btn btn-danger btn-sm' onclick='deleteTask("${taskId}")'>Apagar</button>
                              <button  id='done' class='complete-btn btn btn-success btn-sm' onclick='markAsCompleted("${taskId}")'>Concluído</button>
                          </div>`;

        document.getElementById("todo").appendChild(task);
        taskInput.value = "";
        taskOwner.value = "";
        taskDeadline.value = "";
        saveTasks();
    }
}

// Remove uma tarefa do quadro
function deleteTask(id) {
    let task = document.getElementById(id);
    if (task) {
        task.remove();
        saveTasks();
    }
}

// Funcionamento dos botões para as proximos status
function markAsCompleted(id) {
    const task = document.getElementById(id); // Pega a tarefa
    const todoColumn = document.getElementById("todo");
    const inProgressColumn = document.getElementById("inProgress");
    const doneColumn = document.getElementById("done");

    if (!task || !todoColumn || !inProgressColumn || !doneColumn) return;

    // Se a tarefa está na coluna "Para Fazer"
    if (task.closest(".kanban-column").id === "todo") {
        inProgressColumn.appendChild(task);  // Mover para "Em Progresso"
    }
    // Se a tarefa está na coluna "Em Progresso"
    else if (task.closest(".kanban-column").id === "inProgress") {
        doneColumn.appendChild(task);  // Mover para "Concluído"
        task.style.textDecoration = "line-through";  // Risca a tarefa
        const completeBtn = task.querySelector(".complete-btn");
        if (completeBtn) {
            completeBtn.disabled = true;  // Desabilita o botão "Concluído"
            completeBtn.innerText = "Concluída";  // Altera o texto do botão
        }
    }

    saveTasks();  // Salva o estado atual
}

// Em progresso funcionamento do botão concluido
function addTask() {
    let taskInput = document.getElementById("taskNome");
    let taskOwner = document.getElementById("taskOwner");
    let taskDeadline = document.getElementById("taskDeadline");

    if (taskInput.value.trim() !== "") {
        let taskId = "task" + new Date().getTime();
        let task = document.createElement("div");
        task.className = "task";
        task.draggable = true;
        task.ondragstart = drag;
        task.id = taskId;
        task.innerHTML = `<strong>${taskInput.value}</strong><br>
                          <small>Tarefa: ${taskOwner.value || 'Não definido'}</small><br>
                          <small>Prazo: ${taskDeadline.value || 'Sem prazo'}</small><br>
                          <div class="task-buttons">
                              <button class='edit-btn btn btn-warning btn-sm' onclick='editTask("${taskId}")'>Editar</button>
                              <button class='delete-btn btn btn-danger btn-sm' onclick='deleteTask("${taskId}")'>Apagar</button>
                              <button class='complete-btn btn btn-success btn-sm' onclick='markAsCompleted("${taskId}")'>Concluído</button>
                          </div>`;

        document.getElementById("todo").appendChild(task);
        taskInput.value = "";
        taskOwner.value = "";
        taskDeadline.value = "";
        saveTasks();
    }
}

// Salva o estado das tarefas no LocalStorage
function saveTasks() {
    let tasks = {};
    document.querySelectorAll(".kanban-column").forEach(column => {
        let columnId = column.id;
        tasks[columnId] = [];
        column.querySelectorAll(".task").forEach(task => {
            tasks[columnId].push({
                id: task.id,
                name: task.querySelector("strong").innerText,
                owner: task.querySelector("small:nth-of-type(1)").innerText.replace("Responsável: ", ""),
                deadline: task.querySelector("small:nth-of-type(2)").innerText.replace("Prazo: ", "")
            });
        });
    });
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

// Carrega as tarefas salvas no LocalStorage ao recarregar a página
function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("kanbanTasks")) || {};
    Object.keys(tasks).forEach(columnId => {
        let column = document.getElementById(columnId);
        if (column) {
            tasks[columnId].forEach(taskData => {
                if (!document.getElementById(taskData.id)) { // Evita duplicatas
                    let task = document.createElement("div");
                    task.className = "task";
                    task.draggable = true;
                    task.ondragstart = drag;
                    task.id = taskData.id;
                    task.innerHTML = `<strong>${taskData.name}</strong><br>
                                      <small>Responsável: ${taskData.owner}</small><br>
                                      <small>Prazo: ${taskData.deadline}</small><br>
                                      <div class="task-buttons">
                                          <button class='edit-btn btn btn-warning btn-sm' onclick='editTask("${task.id}")'>Editar</button>
                                          <button class='delete-btn btn btn-danger btn-sm' onclick='deleteTask("${task.id}")'>Apagar</button>
                                          <button class='complete-btn btn btn-success btn-sm' onclick='markAsCompleted("${task.id}")'>Concluído</button>
                                      </div>`;
                    column.appendChild(task);
                }
            });
        }
    });
}

// Aguarda o carregamento do DOM para carregar as tarefas
document.addEventListener("DOMContentLoaded", loadTasks);
