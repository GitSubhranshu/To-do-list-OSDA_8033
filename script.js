document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const showAllTasksBtn = document.getElementById('showAllTasks');
const showCompletedTasksBtn = document.getElementById('showCompletedTasks');

let tasks = []; 

addTaskBtn.addEventListener('click', addTask);
showAllTasksBtn.addEventListener('click', showAllTasks);
showCompletedTasksBtn.addEventListener('click', showCompletedTasks);

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks(tasks); 
}

function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const newTask = { text: taskText, completed: false };
        tasks.push(newTask);
        saveTasksToLocalStorage();
        renderTasks(tasks);
        taskInput.value = '';
    }
}

function renderTasks(tasksToRender) {
    taskList.innerHTML = ''; 
    tasksToRender.forEach(task => createTaskElement(task.text, task.completed));
}

function createTaskElement(text, completed) {
    const li = document.createElement('li');
    
    li.textContent = text;

    if (completed) {
        li.classList.add('completed');
    }
    
    li.addEventListener('click', toggleTaskCompletion);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(li);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        editTask(li);
    });

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    
    taskList.appendChild(li);
}

function toggleTaskCompletion(event) {
   const li = event.currentTarget;

   li.classList.toggle('completed');

   const taskText = li.textContent.replace("EditDelete", "").trim();
   
   tasks.forEach(task => {
       if (task.text === taskText) {
           task.completed = !task.completed; 
       }
   });

   saveTasksToLocalStorage();
}

function deleteTask(li) {
   const taskText = li.textContent.replace('EditDelete', '').trim();
   
   li.remove();
      tasks = tasks.filter(task => task.text !== taskText);
   
   saveTasksToLocalStorage();
}

function editTask(li) {
   const currentText = li.firstChild.textContent.trim();
   
   taskInput.value = currentText;
   deleteTask(li);

   addTaskBtn.textContent = 'Update';
      addTaskBtn.onclick = function () {
       const updatedText = taskInput.value.trim();

       if (updatedText) {
           createTaskElement(updatedText, false);
           const updatedTask = { text: updatedText, completed: false };
           tasks.push(updatedTask); 
           saveTasksToLocalStorage();
           taskInput.value = '';
           addTaskBtn.textContent = 'Add Task'; 
           addTaskBtn.onclick = addTask; 
       }
   };
}

function saveTasksToLocalStorage() {
   localStorage.setItem('tasks', JSON.stringify(tasks));
}


function showAllTasks() {
   renderTasks(tasks); 
}

function showCompletedTasks() {
   const completedTasks = tasks.filter(task => task.completed); 
   renderTasks(completedTasks); 
}
