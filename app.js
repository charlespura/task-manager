// -------------------
// app.js - Enhanced Task Manager with Modern UI
// -------------------

let currentFilter = 'all';
let currentSort = 'newest';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function addTask() {
    const input = document.getElementById("taskInput");
    const title = input.value.trim();

    if (!title) {
        showNotification("Please enter a task!", "error");
        return;
    }

    // Show loading state
    toggleLoading(true);
    
    fetch("api/create_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: "", status: "pending" })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Task added:", data);
        input.value = "";
        showNotification("Task added successfully!", "success");
        loadTasks();
    })
    .catch(err => {
        console.error("Error:", err);
        showNotification("Failed to add task. Please try again.", "error");
        toggleLoading(false);
    });
}

function loadTasks() {
    toggleLoading(true);
    
    fetch("api/get_tasks.php")
        .then(res => res.json())
        .then(tasks => {
            toggleLoading(false);
            renderTasks(tasks);
            updateStats(tasks);
        })
        .catch(err => {
            console.error("Error:", err);
            toggleLoading(false);
            showNotification("Failed to load tasks. Please refresh.", "error");
        });
}

function renderTasks(tasks) {
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => t.status === 'pending');
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.status === 'completed');
    }
    
    // Sort tasks based on current sort
    filteredTasks = sortTaskList(filteredTasks);
    
    const ul = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    
    if (filteredTasks.length === 0) {
        ul.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    ul.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.status === 'completed' ? 'completed' : ''}" data-id="${task.id}">
            <div class="task-checkbox ${task.status === 'completed' ? 'checked' : ''}" 
                 onclick="toggleTaskStatus('${task.id}')"></div>
            
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span>Created: ${formatDate(task.created_at)}</span>
                    <span class="task-status ${task.status}">${task.status}</span>
                </div>
            </div>
            
            <div class="task-actions">
                <button class="task-btn edit-btn" onclick="editTask('${task.id}', '${escapeHtml(task.title)}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete-btn" onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join("");
}

function sortTaskList(tasks) {
    switch(currentSort) {
        case 'oldest':
            return [...tasks].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        case 'title':
            return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
        case 'newest':
        default:
            return [...tasks].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
}

function sortTasks() {
    currentSort = document.getElementById("sortSelect").value;
    loadTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadTasks();
}

function toggleTaskStatus(id) {
    const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
    const isCompleted = taskItem.classList.contains('completed');
    const newStatus = isCompleted ? 'pending' : 'completed';
    
    fetch("api/update_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id: id, 
            status: newStatus 
        })
    })
    .then(res => res.json())
    .then(() => {
        showNotification(`Task marked as ${newStatus}!`, "success");
        loadTasks();
    })
    .catch(err => {
        console.error("Error:", err);
        showNotification("Failed to update task.", "error");
    });
}

function editTask(id, currentTitle) {
    const newTitle = prompt("Edit task:", currentTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
        fetch("api/update_task.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                id: id, 
                title: newTitle.trim()
            })
        })
        .then(res => res.json())
        .then(() => {
            showNotification("Task updated successfully!", "success");
            loadTasks();
        })
        .catch(err => {
            console.error("Error:", err);
            showNotification("Failed to update task.", "error");
        });
    }
}

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }
    
    fetch("api/delete_task.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(() => {
        showNotification("Task deleted successfully!", "success");
        loadTasks();
    })
    .catch(err => {
        console.error("Error deleting task:", err);
        showNotification("Failed to delete task.", "error");
    });
}

function updateStats(tasks) {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
}

function toggleLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
    
    if (!show) {
        const emptyState = document.getElementById('emptyState');
        const taskList = document.getElementById('taskList');
        
        if (taskList.children.length === 0) {
            emptyState.style.display = 'block';
        }
    }
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification.success {
        background: linear-gradient(to right, #4CAF50, #45a049);
    }
    
    .notification.error {
        background: linear-gradient(to right, #f44336, #d32f2f);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);