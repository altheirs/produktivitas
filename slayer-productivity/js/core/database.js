/**
 * Central Database Layer
 * Manages all data operations with validation, schema enforcement,
 * and event emission for real-time updates
 */

const Database = {
    // Schema definitions for all entities
    schema: {
        tasks: {
            id: 'number',
            title: 'string',
            description: 'string',
            priority: 'string', // Critical, High, Medium, Low
            status: 'string', // Pending, In Progress, Completed, Archived
            dueDate: 'string', // ISO date
            projectId: 'number',
            tags: 'array',
            subtasks: 'array',
            notes: 'string',
            createdAt: 'string',
            updatedAt: 'string'
        },
        projects: {
            id: 'number',
            name: 'string',
            description: 'string',
            status: 'string', // Planning, Active, Review, Completed
            progress: 'number', // 0-100
            milestones: 'array',
            tasks: 'array',
            notes: 'string',
            startDate: 'string',
            endDate: 'string',
            createdAt: 'string',
            updatedAt: 'string'
        },
        notes: {
            id: 'number',
            title: 'string',
            content: 'string',
            tags: 'array',
            isFavorite: 'boolean',
            isTemplate: 'boolean',
            templateName: 'string',
            createdAt: 'string',
            updatedAt: 'string'
        },
        goals: {
            id: 'number',
            title: 'string',
            description: 'string',
            category: 'string',
            startDate: 'string',
            targetDate: 'string',
            progress: 'number', // 0-100
            milestones: 'array',
            status: 'string', // Active, Completed, Paused
            createdAt: 'string',
            updatedAt: 'string'
        },
        habits: {
            id: 'number',
            title: 'string',
            description: 'string',
            frequency: 'string', // Daily, Weekly, Monthly
            streak: 'number',
            longestStreak: 'number',
            completionDates: 'array',
            createdAt: 'string',
            updatedAt: 'string'
        },
        kanban: {
            id: 'number',
            boardId: 'number',
            title: 'string',
            columns: 'array', // [{ id, title, taskIds }]
            createdAt: 'string',
            updatedAt: 'string'
        },
        settings: {
            theme: 'string',
            language: 'string',
            notifications: 'boolean',
            autoBackup: 'boolean',
            focusMode: 'string'
        },
        activity_logs: {
            id: 'number',
            action: 'string',
            entity: 'string', // task, project, note, etc
            entityId: 'number',
            details: 'object',
            timestamp: 'string',
            userId: 'string'
        }
    },

    /**
     * Initialize database with seed data
     */
    init() {
        if (!Storage.load('db-initialized')) {
            this.seedData();
            Storage.save('db-initialized', true);
        }
    },

    /**
     * Seed initial data
     */
    seedData() {
        const defaultSettings = {
            theme: 'dark',
            language: 'en',
            notifications: true,
            autoBackup: true,
            focusMode: 'pomodoro'
        };
        
        Storage.save('settings', defaultSettings);
        Storage.save('tasks', []);
        Storage.save('projects', []);
        Storage.save('notes', []);
        Storage.save('goals', []);
        Storage.save('habits', []);
        Storage.save('kanban', []);
        Storage.save('activity_logs', []);
    },

    /**
     * Validate data against schema
     */
    validate(entity, data) {
        if (!this.schema[entity]) {
            throw new Error(`Unknown entity: ${entity}`);
        }

        const schema = this.schema[entity];
        const errors = [];

        for (const field in schema) {
            const expectedType = schema[field];
            const value = data[field];

            if (value === undefined) continue;

            const actualType = Array.isArray(value)
                ? 'array'
                : typeof value;

            if (actualType !== expectedType) {
                errors.push(
                    `Field "${field}" expected ${expectedType}, got ${actualType}`
                );
            }
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }

        return true;
    },

    /**
     * Create entity with auto-generated ID and timestamps
     */
    create(entity, data) {
        this.validate(entity, data);

        const collection = this.read(entity);
        const id = collection.length > 0
            ? Math.max(...collection.map(item => item.id)) + 1
            : 1;

        const newEntity = {
            id,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        collection.push(newEntity);
        this.write(entity, collection);

        // Log activity
        this.logActivity('create', entity, id, { data });

        // Emit event
        EventManager.emit(`${entity}:created`, newEntity);

        return newEntity;
    },

    /**
     * Read all entities of a type
     */
    read(entity) {
        const data = Storage.load(entity);
        return Array.isArray(data) ? data : [];
    },

    /**
     * Read single entity by ID
     */
    readOne(entity, id) {
        const collection = this.read(entity);
        return collection.find(item => item.id === id) || null;
    },

    /**
     * Read with filters
     */
    readFiltered(entity, filter) {
        const collection = this.read(entity);
        return collection.filter(item => {
            for (const key in filter) {
                if (item[key] !== filter[key]) return false;
            }
            return true;
        });
    },

    /**
     * Update entity
     */
    update(entity, id, data) {
        this.validate(entity, data);

        const collection = this.read(entity);
        const index = collection.findIndex(item => item.id === id);

        if (index === -1) {
            throw new Error(`${entity} with id ${id} not found`);
        }

        const updatedEntity = {
            ...collection[index],
            ...data,
            updatedAt: new Date().toISOString()
        };

        collection[index] = updatedEntity;
        this.write(entity, collection);

        // Log activity
        this.logActivity('update', entity, id, { before: collection[index], after: data });

        // Emit event
        EventManager.emit(`${entity}:updated`, updatedEntity);

        return updatedEntity;
    },

    /**
     * Delete entity
     */
    delete(entity, id) {
        const collection = this.read(entity);
        const filtered = collection.filter(item => item.id !== id);

        if (filtered.length === collection.length) {
            throw new Error(`${entity} with id ${id} not found`);
        }

        this.write(entity, filtered);

        // Log activity
        this.logActivity('delete', entity, id, {});

        // Emit event
        EventManager.emit(`${entity}:deleted`, { id });

        return true;
    },

    /**
     * Batch operations
     */
    bulkCreate(entity, dataArray) {
        return dataArray.map(data => this.create(entity, data));
    },

    /**
     * Search across all text fields
     */
    search(entity, query) {
        const collection = this.read(entity);
        const lowerQuery = query.toLowerCase();

        return collection.filter(item => {
            for (const key in item) {
                const value = item[key];
                if (typeof value === 'string' && value.toLowerCase().includes(lowerQuery)) {
                    return true;
                }
            }
            return false;
        });
    },

    /**
     * Write data to storage
     */
    write(entity, data) {
        Storage.save(entity, data);
    },

    /**
     * Log activity for audit trail
     */
    logActivity(action, entity, entityId, details) {
        const logs = this.read('activity_logs');
        const log = {
            id: logs.length > 0 ? Math.max(...logs.map(l => l.id)) + 1 : 1,
            action,
            entity,
            entityId,
            details,
            timestamp: new Date().toISOString(),
            userId: 'current-user'
        };
        logs.push(log);
        Storage.save('activity_logs', logs);
    },

    /**
     * Get activity logs
     */
    getActivityLogs(limit = 50) {
        const logs = this.read('activity_logs');
        return logs.slice(-limit).reverse();
    },

    /**
     * Export all data as JSON
     */
    export() {
        const backup = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            data: {
                tasks: this.read('tasks'),
                projects: this.read('projects'),
                notes: this.read('notes'),
                goals: this.read('goals'),
                habits: this.read('habits'),
                kanban: this.read('kanban'),
                settings: this.read('settings'),
                activity_logs: this.read('activity_logs')
            }
        };
        return backup;
    },

    /**
     * Import data from backup
     */
    import(backup) {
        if (!backup.data) {
            throw new Error('Invalid backup format');
        }

        for (const entity in backup.data) {
            if (this.schema[entity]) {
                this.write(entity, backup.data[entity]);
            }
        }

        EventManager.emit('database:imported', backup);
    },

    /**
     * Clear all data (with confirmation)
     */
    clear() {
        if (confirm('This will delete all data. Are you sure?')) {
            Storage.clear();
            this.init();
            EventManager.emit('database:cleared');
            return true;
        }
        return false;
    }
};

// Initialize on load
Document.addEventListener('DOMContentLoaded', () => {
    Database.init();
});
