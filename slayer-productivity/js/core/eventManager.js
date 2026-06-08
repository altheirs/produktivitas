/**
 * Event Manager
 * Centralized event emitter for real-time updates and component synchronization
 */

const EventManager = {
    events: {},

    /**
     * Subscribe to an event
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(
                cb => cb !== callback
            );
        };
    },

    /**
     * Subscribe to event only once
     */
    once(event, callback) {
        const unsubscribe = this.on(event, (...args) => {
            callback(...args);
            unsubscribe();
        });
        return unsubscribe;
    },

    /**
     * Emit an event
     */
    emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    },

    /**
     * Remove specific event listener
     */
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(
            cb => cb !== callback
        );
    },

    /**
     * Remove all listeners for an event
     */
    offAll(event) {
        delete this.events[event];
    },

    /**
     * Get listener count for an event
     */
    listenerCount(event) {
        return this.events[event]?.length || 0;
    },

    /**
     * Get all event names
     */
    eventNames() {
        return Object.keys(this.events);
    }
};

// Pre-defined event types for documentation
const EventTypes = {
    // Task events
    TASK_CREATED: 'tasks:created',
    TASK_UPDATED: 'tasks:updated',
    TASK_DELETED: 'tasks:deleted',
    TASK_COMPLETED: 'tasks:completed',

    // Project events
    PROJECT_CREATED: 'projects:created',
    PROJECT_UPDATED: 'projects:updated',
    PROJECT_DELETED: 'projects:deleted',

    // Note events
    NOTE_CREATED: 'notes:created',
    NOTE_UPDATED: 'notes:updated',
    NOTE_DELETED: 'notes:deleted',

    // Goal events
    GOAL_CREATED: 'goals:created',
    GOAL_UPDATED: 'goals:updated',
    GOAL_DELETED: 'goals:deleted',

    // Habit events
    HABIT_CREATED: 'habits:created',
    HABIT_UPDATED: 'habits:updated',
    HABIT_COMPLETED: 'habits:completed',

    // Kanban events
    KANBAN_UPDATED: 'kanban:updated',
    CARD_MOVED: 'kanban:card-moved',

    // System events
    DATABASE_IMPORTED: 'database:imported',
    DATABASE_CLEARED: 'database:cleared',
    NOTIFICATION_SENT: 'notification:sent',
    SEARCH_QUERY: 'search:query'
};