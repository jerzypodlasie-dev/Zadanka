const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const progress = document.getElementById("progress");
const dateElement = document.getElementById("date");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getToday() {
    const today = new Date();

    return today.toISOString().split("T")[0];
}

function showDate() {
    const today = new Date();

    const formatted = today.toLocaleDateString("pl-PL", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    dateElement.textContent =
        formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function cleanOldTasks() {
    const today = getToday();

    tasks = tasks.filter(task => {
        // Zadania nieukończone zostają.
        if (!task.completed) {
            return true;
        }

        // Ukończone zadania są usuwane po 24 godzinach.
        const completedTime = new Date(task.completedAt).getTime();
        const now = Date.now();

        const oneDay = 24 * 60 * 60 * 1000;

        return now - completedTime < oneDay;
    });

    saveTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    const completedCount = tasks.filter(task => task.completed).length;

    progress.textContent =
        `${completedCount} / ${tasks.length} wykonanych`;

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("div");

        checkbox.className = "checkbox";

        checkbox.addEventListener("click", () => {
            toggleTask(task.id);
        });

        const text = document.createElement("div");

        text.className = "task-text";
        text.textContent = task.text;

        const deleteButton = document.createElement("button");

        deleteButton.className = "delete";
        deleteButton.textContent = "×";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        completedAt: null
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map(task => {

        if (task.id === id) {

            const completed = !task.completed;

            return {
                ...task,
                completed: completed,
                completedAt: completed
                    ? new Date().toISOString()
                    : null
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

showDate();
cleanOldTasks();
renderTasks();