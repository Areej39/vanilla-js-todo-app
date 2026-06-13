// script.js - Todo App 

let tasks = [];
let currentFilter = 'all'

const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("tasklist");
const taskCount = document.getElementById("taskCount");
const filters = document.querySelector('.filters');

function render() {
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    taskList.innerHTML = '';

    filteredTasks.forEach((task, displayIndex) => {
        const orignalIndex = tasks.findIndex(t => t.id === tasks.id);

        const li = document.createElement("li");
        li.className = task.completed ? 'completed' : '';
        li.innerHTML =
            `<input type="checkbox" ${task.completed ? 'checked' : ''}>
         <span>${task.text}</span>
         <button class="deleteBtn" data-id="${task.id}">Delete</button>
         <button class="editBtn" data-id="${task.id}">Edit</button>`;

        taskList.appendChild(li);
    });

    updateCount();
}

function updateCount() {
    const activeTasks = tasks.filter(task => !task.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

function addTask(text) {
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks = [...tasks, newTask];
    render();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    render();
}

function editTask(id, newText) {
    if (newText.trim() === '') return;
    tasks = tasks.map(task => task.id === id ? { ...task, text: newText.trim() } : task);
    render();
}
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;
    addTask(text);
    taskInput.value = '';
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addBtn.click();
    }
});

taskList.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li) return;

    const deleteBtn = li.querySelector('.deleteBtn');
    const taskId = parseInt(deleteBtn.dataset.id);

    if (e.target.classList.contains("deleteBtn")) {
        deleteTask(taskId);
    }
    else if (e.target.type === 'checkbox') {
        toggleTask(taskId);
    }
    else if (e.target.classList.contains("editBtn")) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        let modalBox = document.createElement("div");
        modalBox.className = "modal";
        modalBox.innerHTML =
            `<div>
            <input type="text" id="modalBoxText" value="${task.text}">
            <button class="saveBtn">Save</button>
            <button class="cancelBtn">Cancel</button>
            </div>`;
        document.body.appendChild(modalBox);


        function escapeHandler(e) {
            if (e.key === 'Escape') {
                modalBox.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        }
        document.addEventListener('keydown', escapeHandler);


        const saveBtn = modalBox.querySelector(".saveBtn");
        saveBtn.addEventListener('click', () => {
            const updatedText = document.getElementById("modalBoxText").value.trim();
            if (updatedText !== '') {
                editTask(taskId, updatedText);
            }
            modalBox.remove();
            document.removeEventListener('keydown', escapeHandler);
        });


        const cancelBtn = modalBox.querySelector(".cancelBtn");
        cancelBtn.addEventListener('click', () => {
            modalBox.remove();
            document.removeEventListener('keydown', escapeHandler);
        });


        modalBox.addEventListener('click', (event) => {
            if (event.target === modalBox) {
                modalBox.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });
    }
});


filters.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        currentFilter = e.target.dataset.filter;

        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        render();
    }
});


