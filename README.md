# 📝 Task Manager App

[![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML) 
[![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS) 
[![JavaScript](https://img.shields.io/badge/JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript) 
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/) 
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

A simple **Task Management App** built with **HTML, CSS, JavaScript, PHP**, and **Supabase** as the backend.  
Add, view, and delete tasks with a clean, interactive UI.

---

## 🚀 Features

- Add new tasks with title and optional description  
- View tasks in a list with their status (`todo` by default)  
- Delete tasks easily  
- Lightweight frontend using vanilla JS (no frameworks)  
- Powered by **Supabase REST API**  

---

## 🛠️ Technologies Used

| Frontend      | Backend | Database             |
|---------------|---------|-------------------|
| HTML, CSS, JS | PHP     | Supabase (PostgreSQL) |

---

## 📁 Project Structure
task-manager/
├─ index.html # Main frontend page
├─ app.js # JavaScript for CRUD operations
├─ style.css # Styling for the app
└─ api/
├─ config.php # Supabase URL & KEY (ignored by git)
├─ create_task.php # Add new task
├─ get_tasks.php # Get all tasks
├─ delete_task.php # Delete a task


---

## ⚡ Setup / Installation

1. Clone the repository:

git clone https://github.com/charlespura/task-manager.git


Copy config.php.example → config.php and add your Supabase credentials


<?php
define('SUPABASE_URL', 'your-supabase-url');
define('SUPABASE_KEY', 'your-supabase-key');


Open on a local server (XAMPP, MAMP, etc.):

http://localhost/task-manager/index.html
Start adding tasks! ✅


