/**
 * Task Modal Component
 * Handles creation and editing of tasks with full form validation
 */

let currentEditingTaskId = null;

function openTaskModal(taskId = null) {
    currentEditingTaskId = taskId;
    const task = taskId ? TaskService.getById(taskId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'task-modal-overlay';
    modal.id = 'task-modal';
    
    const title = task ? 'Edit Task' : 'Create New Task';
    const buttonText = task ? 'Update Task' : 'Create Task';
    
    modal.innerHTML = Sanitizer.sanitizeHTML(`
        <div class="task-modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeTaskModal()">&times;</button>
            </div>
            
            <form id="task-form" class="task-form">
                <div class="form-group">
                    <label for="task-title">Title *</label>
                    <input 
                        type="text" 
                        id="task-title" 
                        name="title"
                        placeholder="Enter task title"
                        value="${task ? Sanitizer.escapeHTML(task.title) : ''}"
                        required
                    />
                </div>
                
                <div class="form-group">
                    <label for="task-description">Description</label>
                    <textarea 
                        id="task-description" 
                        name="description"
                        placeholder="Enter task description"
                        rows="4"
                    >${task ? Sanitizer.escapeHTML(task.description) : ''}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="task-priority">Priority</label>
                        <select id="task-priority" name="priority">
                            <option value="Low" ${task && task.priority === 'Low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${task && task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${task && task.priority === 'High' ? 'selected' : ''}>High</option>
                            <option value="Critical" ${task && task.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="task-status">Status</label>
                        <select id="task-status" name="status">
                            <option value="Todo" ${task && task.status === 'Todo' ? 'selected' : ''}>To Do</option>
                            <option value="In Progress" ${task && task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Review" ${task && task.status === 'Review' ? 'selected' : ''}>Review</option>
                            <option value="Completed" ${task && task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="task-dueDate">Due Date</label>
                    <input 
                        type="date" 
                        id="task-dueDate" 
                        name="dueDate"
                        value="${task && task.dueDate ? task.dueDate.split('T')[0] : ''}"
                    />
                </div>
                
                <div class="form-group">
                    <label for="task-tags">Tags (comma-separated)</label>
                    <input 
                        type="text" 
                        id="task-tags" 
                        name="tags"
                        placeholder="e.g. work, urgent, important"
                        value="${task && task.tags ? task.tags.join(', ') : ''}"
                    />
                </div>
                
                <div class="form-group">
                    <label for="task-notes">Notes</label>
                    <textarea 
                        id="task-notes" 
                        name="notes"
                        placeholder="Additional notes"
                        rows="3"
                    >${task ? Sanitizer.escapeHTML(task.notes) : ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeTaskModal()">Cancel</button>
                    <button type="submit" class="btn-primary">${buttonText}</button>
                    ${task ? `<button type="button" class="btn-danger" onclick="deleteTaskFromModal()">Delete</button>` : ''}
                </div>
            </form>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    const form = document.getElementById('task-form');
    form.addEventListener('submit', handleTaskFormSubmit);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTaskModal();
    });
}

function closeTaskModal() {
    const modal = document.getElementById('task-modal');
    if (modal) {
        modal.remove();
    }
    currentEditingTaskId = null;
}

function handleTaskFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const taskData = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        priority: formData.get('priority'),
        status: formData.get('status'),
        dueDate: formData.get('dueDate'),
        tags: formData.get('tags')
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0),
        notes: formData.get('notes').trim()
    };
    
    if (!taskData.title) {
        NotificationManager.show('Task title is required', 'error');
        return;
    }
    
    try {
        if (currentEditingTaskId) {
            TaskService.update(currentEditingTaskId, taskData);
        } else {
            TaskService.create(taskData);
        }
        
        closeTaskModal();
        navigate('tasks');
    } catch (error) {
        console.error('Task form submission error:', error);
        NotificationManager.show('Error saving task: ' + error.message, 'error');
    }
}

function deleteTaskFromModal() {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            TaskService.delete(currentEditingTaskId);
            closeTaskModal();
            navigate('tasks');
        } catch (error) {
            console.error('Task deletion error:', error);
            NotificationManager.show('Error deleting task: ' + error.message, 'error');
        }
    }
}

function editTask(taskId) {
    openTaskModal(taskId);
}
