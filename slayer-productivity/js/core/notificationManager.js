/**
 * Notification Manager
 * Handles notifications, toasts, and user feedback
 */

const NotificationManager = {
    /**
     * Show toast notification
     */
    toast(message, type = 'info', duration = 3000) {
        const container = this.getContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, duration);
        }

        return toast;
    },

    /**
     * Show success notification
     */
    success(message, duration = 3000) {
        EventManager.emit(EventTypes.NOTIFICATION_SENT, {
            type: 'success',
            message
        });
        return this.toast(message, 'success', duration);
    },

    /**
     * Show error notification
     */
    error(message, duration = 5000) {
        EventManager.emit(EventTypes.NOTIFICATION_SENT, {
            type: 'error',
            message
        });
        return this.toast(message, 'error', duration);
    },

    /**
     * Show warning notification
     */
    warning(message, duration = 4000) {
        EventManager.emit(EventTypes.NOTIFICATION_SENT, {
            type: 'warning',
            message
        });
        return this.toast(message, 'warning', duration);
    },

    /**
     * Show info notification
     */
    info(message, duration = 3000) {
        return this.toast(message, 'info', duration);
    },

    /**
     * Get or create notification container
     */
    getContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }
};