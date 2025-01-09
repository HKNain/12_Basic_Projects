document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const deleteAllButton = document.getElementById('deleteAllTask'); 
    deleteAllButton.textContent = 'Delete All';
    document.body.appendChild(deleteAllButton); 

    function addTask() {
        if (taskInput.value.trim() === "") return;

        let taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        let label = document.createElement('label');
        label.textContent = taskInput.value;

        let cancelButton = document.createElement('button');
        cancelButton.className = 'cancel';

        cancelButton.addEventListener('click', () => {
            taskContainer.remove();
        });

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                label.style.textDecoration = 'line-through';
            } else {
                label.style.textDecoration = 'none';
            }
        });

        taskContainer.append(checkbox, label, cancelButton);
        document.body.append(taskContainer);

        taskInput.value = "";
    }

    addTaskButton.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Event listener for the "Delete All" button
    deleteAllButton.addEventListener('click', () => {
        const allTasks = document.querySelectorAll('.task-container');
        allTasks.forEach(task => task.remove());
    });
});
