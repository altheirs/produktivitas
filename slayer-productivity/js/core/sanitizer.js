/**
 * Security Layer - Input Sanitizer
 * Prevents XSS attacks and sanitizes user input
 * Never uses innerHTML - only textContent for user-provided data
 */

const Sanitizer = {
    /**
     * Sanitize string input to prevent XSS
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return '';

        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Sanitize HTML content (limited tags allowed)
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') return '';

        // Only allow specific safe tags
        const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Remove all scripts
        temp.querySelectorAll('script').forEach(script => script.remove());

        // Remove disallowed tags
        temp.querySelectorAll('*').forEach(element => {
            if (!allowedTags.includes(element.tagName.toLowerCase())) {
                while (element.firstChild) {
                    element.parentNode.insertBefore(
                        element.firstChild,
                        element
                    );
                }
                element.parentNode.removeChild(element);
            }
        });

        // Remove event handlers
        temp.querySelectorAll('*').forEach(element => {
            for (let i = element.attributes.length - 1; i >= 0; i--) {
                const attr = element.attributes[i];
                if (attr.name.startsWith('on')) {
                    element.removeAttribute(attr.name);
                }
            }
        });

        return temp.innerHTML;
    },

    /**
     * Escape special characters
     */
    escape(str) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        return String(str).replace(/[&<>"'\/]/g, char => map[char]);
    },

    /**
     * Validate URL to prevent javascript: and data: URIs
     */
    sanitizeUrl(url) {
        if (typeof url !== 'string') return '';

        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:'];
        const lowerUrl = url.toLowerCase().trim();

        for (const protocol of dangerousProtocols) {
            if (lowerUrl.startsWith(protocol)) {
                return '';
            }
        }

        return url;
    },

    /**
     * Sanitize object recursively
     */
    sanitizeObject(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return typeof obj === 'string' ? this.sanitizeString(obj) : obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }

        const sanitized = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                sanitized[key] = this.sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
};

/**
 * Safe DOM manipulation helper
 */
const SafeDOM = {
    /**
     * Create element with text content safely
     */
    createElement(tag, text = '', className = '') {
        const element = document.createElement(tag);
        if (text) {
            element.textContent = text;
        }
        if (className) {
            element.className = className;
        }
        return element;
    },

    /**
     * Set text content safely
     */
    setText(element, text) {
        if (element instanceof Element) {
            element.textContent = Sanitizer.sanitizeString(String(text || ''));
        }
    },

    /**
     * Append element safely
     */
    append(parent, child) {
        if (parent instanceof Element && child instanceof Element) {
            parent.appendChild(child);
        }
    },

    /**
     * Add HTML attribute safely
     */
    setAttribute(element, attr, value) {
        if (element instanceof Element) {
            // Block dangerous attributes
            const dangerousAttrs = [
                'onload', 'onerror', 'onclick', 'onmouseover',
                'onmouseout', 'onkeyup', 'onkeydown'
            ];

            if (!dangerousAttrs.includes(attr.toLowerCase())) {
                element.setAttribute(attr, Sanitizer.sanitizeString(String(value || '')));
            }
        }
    }
};
