// script.js - Todo App 
const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("tasklist");
const taskCount = document.getElementById("taskCount");
const filters = document.querySelector('.filters');

addBtn.addEventListener('click', () => { 
    const text = taskInput.value.trim();
    if (text === '') return;
    console.log(text);
    let newTask = document.createElement("li");
    newTask.innerHTML = 
        `<input type="checkbox">
         <span>${text}</span>
         <button class="deleteBtn">X</button>`;
    taskList.append(newTask);
    taskInput.value = '';
    updateCount();
});

taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        addBtn.click();
    }
});

taskList.addEventListener('click', (e) => {
    if(e.target.classList.contains("deleteBtn")) {
        e.target.parentElement.remove();
    }
    if(e.target.type === 'checkbox') {
        e.target.parentElement.classList.toggle('completed');
    }
    updateCount();
});

function updateCount() {
    let totalTasks = taskList.children.length;
    let completedTasks = taskList.querySelectorAll(".completed").length;
    let activeTasks = totalTasks - completedTasks;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1? 's': ''} left`;
}


filters.addEventListener('click', (e) => {
    if(e.target.classList.contains('filter-btn')) {
        let filter = e.target.dataset.filter;

        document.querySelectorAll('.filter-btn').forEach( btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        taskList.querySelectorAll('li').forEach(li => {
            if(filter === 'all') li.style.display = 'flex';
            if(filter === 'active') li.style.display = li.classList.contains('completed') ? 'none': 'flex'
            if(filter === 'completed') li.style.display = li.classList.contains('completed') ? 'flex': 'none';
        });
    }
});


