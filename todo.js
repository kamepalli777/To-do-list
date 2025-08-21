// Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const saveTaskBtn = document.getElementById('saveTask');
const cancelTaskBtn = document.getElementById('cancelTask');
const taskList = document.getElementById('taskList');
const taskHistory = document.getElementById('taskHistory');
const filterSelect = document.getElementById('filter');
const clearAllBtn = document.getElementById('clearAll');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Input fields
const taskTitle = document.getElementById('taskTitle');
const taskDesc = document.getElementById('taskDesc');
const taskPriority = document.getElementById('taskPriority');
const taskReminder = document.getElementById('taskReminder');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Open modal
addTaskBtn.onclick = () => {
  taskModal.style.display = 'flex';
};

// Close modal
cancelTaskBtn.onclick = () => {
  taskModal.style.display = 'none';
};

// Save task
saveTaskBtn.onclick = () => {
  const task = {
    id: Date.now(),
    title: taskTitle.value,
    desc: taskDesc.value,
    priority: taskPriority.value,
    reminder: taskReminder.value,
    completed: false,
    createdAt: new Date().toLocaleString()
  };
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  taskModal.style.display = 'none';
  taskTitle.value = '';
  taskDesc.value = '';
  taskReminder.value = '';
};

// Render tasks
function renderTasks() {
  taskList.innerHTML = '';
  taskHistory.innerHTML = '';

  let filtered = tasks;
  const filter = filterSelect.value;
  if (filter === 'pending') filtered = tasks.filter(t => !t.completed);
  if (filter === 'completed') filtered = tasks.filter(t => t.completed);
  if (filter === 'high') filtered = tasks.filter(t => t.priority === 'high');

  filtered.forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card ${task.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.desc}</p>
      <p class="task-meta">Priority: ${task.priority} | Created: ${task.createdAt}</p>
      ${task.reminder ? `<p class="task-meta">Reminder: ${task.reminder}</p>` : ''}
      <div class="task-actions">
        <button class="complete">✔</button>
        <button class="edit">✏</button>
        <button class="delete">🗑</button>
      </div>
    `;

    card.querySelector('.complete').onclick = () => {
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    };

    card.querySelector('.delete').onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    };

    card.querySelector('.edit').onclick = () => {
      taskTitle.value = task.title;
      taskDesc.value = task.desc;
      taskPriority.value = task.priority;
      taskReminder.value = task.reminder;
      taskModal.style.display = 'flex';
      saveTaskBtn.onclick = () => {
        task.title = taskTitle.value;
        task.desc = taskDesc.value;
        task.priority = taskPriority.value;
        task.reminder = taskReminder.value;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskModal.style.display = 'none';
      };
    };

    if (task.completed) {
      taskHistory.appendChild(card);
    } else {
      taskList.appendChild(card);
    }
  });
}

// Tabs
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tabContents.forEach(c => c.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Clear all
clearAllBtn.onclick = () => {
  tasks = [];
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
};

// Init
filterSelect.onchange = renderTasks;
renderTasks();
