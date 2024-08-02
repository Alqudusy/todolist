function generateUniqueId() {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('todo-input');
    const newTask = input.value.trim();
    if (newTask) {
        const listContainer = document.getElementById('2');
        const newDiv = document.createElement('div');
        const uniqueId = generateUniqueId();
        newDiv.setAttribute('id', uniqueId);
        newDiv.className = 'task';
        newDiv.innerHTML = `
            <input type="checkbox" class="done-checkbox">
            <span class="task-text">${newTask}</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;
        listContainer.appendChild(newDiv);
        input.value = '';
        listContainer.classList.remove('hidden'); // Show the list container

        // Add event listeners for the new buttons and checkbox
        newDiv.querySelector('.edit-btn').addEventListener('click', editTask);
        newDiv.querySelector('.delete-btn').addEventListener('click', deleteTask);
        newDiv.querySelector('.done-checkbox').addEventListener('change', markDone);

        saveTasksToLocalStorage();
    }
});

function editTask(event) {
    const taskDiv = event.target.parentElement;
    const taskText = taskDiv.querySelector('.task-text');
    const newText = prompt('Edit your task:', taskText.textContent);
    if (newText !== null && newText.trim() !== '') {
        taskText.textContent = newText.trim();
        saveTasksToLocalStorage();
    }
}

function deleteTask(event) {
    const taskDiv = event.target.parentElement;
    taskDiv.remove();
    const listContainer = document.getElementById('2');
    if (listContainer.children.length === 0) {
        listContainer.classList.add('hidden'); // Hide the list container
    }
    saveTasksToLocalStorage();
}

function markDone(event) {
    const taskText = event.target.nextElementSibling;
    if (event.target.checked) {
        taskText.classList.add('done');
    } else {
        taskText.classList.remove('done');
    }
    saveTasksToLocalStorage();
}


function saveTasksToLocalStorage() {
    const tasks = Array.from(document.querySelectorAll('.task'))
                        .map(task => ({
                            html: task.outerHTML,
                            checked: task.querySelector('.done-checkbox').checked
                        }));
    localStorage.setItem('savedTasks', JSON.stringify(tasks));
}


function loadTasksFromLocalStorage() {
    const savedTasks = JSON.parse(localStorage.getItem('savedTasks'));
    if (savedTasks) {
        const listContainer = document.getElementById('2');
        savedTasks.forEach(taskData => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = taskData.html;
            listContainer.appendChild(taskDiv);
            
            // Restore checkbox state
            const checkbox = taskDiv.querySelector('.done-checkbox');
            if (checkbox) {
                checkbox.checked = taskData.checked;
                checkbox.nextElementSibling.classList.toggle('done', checkbox.checked);
            }
            
            // Add event listeners to the newly added tasks
            taskDiv.querySelector('.edit-btn').addEventListener('click', editTask);
            taskDiv.querySelector('.delete-btn').addEventListener('click', deleteTask);
            taskDiv.querySelector('.done-checkbox').addEventListener('change', markDone);
        });
        const childrenDiv = listContainer.querySelectorAll('div');
        if (childrenDiv.length !== 0) {
            listContainer.classList.remove('hidden');
        } else {
            listContainer.classList.add('hidden');
        }
    }
}


// Load tasks on page load
loadTasksFromLocalStorage();
