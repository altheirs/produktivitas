/**
 * Search Engine
 * Global search across all entities with filtering and ranking
 */

const SearchEngine = {
    /**
     * Search across all entities
     */
    search(query, entityType = null, limit = 50) {
        if (!query || query.length < 2) {
            return [];
        }

        const lowerQuery = query.toLowerCase();
        const results = [];

        const entityTypes = entityType
            ? [entityType]
            : ['tasks', 'projects', 'notes', 'goals', 'habits'];

        for (const type of entityTypes) {
            const items = Database.read(type);
            
            items.forEach(item => {
                const score = this.calculateScore(item, lowerQuery);
                if (score > 0) {
                    results.push({
                        ...item,
                        entityType: type,
                        searchScore: score
                    });
                }
            });
        }

        // Sort by relevance score
        results.sort((a, b) => b.searchScore - a.searchScore);

        EventManager.emit(EventTypes.SEARCH_QUERY, {
            query,
            resultsCount: results.length
        });

        return results.slice(0, limit);
    },

    /**
     * Calculate relevance score for search result
     */
    calculateScore(item, query) {
        let score = 0;

        // Search in title/name (highest weight)
        if (item.title) {
            if (item.title.toLowerCase() === query) score += 100;
            else if (item.title.toLowerCase().includes(query)) score += 50;
        }

        if (item.name) {
            if (item.name.toLowerCase() === query) score += 100;
            else if (item.name.toLowerCase().includes(query)) score += 50;
        }

        // Search in description (medium weight)
        if (item.description) {
            if (item.description.toLowerCase().includes(query)) score += 25;
        }

        // Search in content (medium weight)
        if (item.content) {
            if (item.content.toLowerCase().includes(query)) score += 20;
        }

        // Search in tags (low weight)
        if (item.tags && Array.isArray(item.tags)) {
            if (item.tags.some(tag => tag.toLowerCase().includes(query))) {
                score += 10;
            }
        }

        // Search in notes (low weight)
        if (item.notes) {
            if (item.notes.toLowerCase().includes(query)) score += 10;
        }

        return score;
    },

    /**
     * Advanced search with filters
     */
    advancedSearch(query, filters = {}) {
        let results = this.search(query);

        // Filter by type
        if (filters.type) {
            results = results.filter(r => r.entityType === filters.type);
        }

        // Filter by status
        if (filters.status) {
            results = results.filter(r => r.status === filters.status);
        }

        // Filter by priority
        if (filters.priority) {
            results = results.filter(r => r.priority === filters.priority);
        }

        // Filter by date range
        if (filters.dateFrom) {
            results = results.filter(r =>
                new Date(r.createdAt) >= new Date(filters.dateFrom)
            );
        }

        if (filters.dateTo) {
            results = results.filter(r =>
                new Date(r.createdAt) <= new Date(filters.dateTo)
            );
        }

        // Filter by tags
        if (filters.tags && Array.isArray(filters.tags)) {
            results = results.filter(r =>
                r.tags && filters.tags.some(tag => r.tags.includes(tag))
            );
        }

        return results;
    },

    /**
     * Get search suggestions/autocomplete
     */
    getSuggestions(query, limit = 5) {
        if (query.length < 2) return [];

        const allItems = [];
        ['tasks', 'projects', 'notes', 'goals', 'habits'].forEach(type => {
            const items = Database.read(type);
            items.forEach(item => {
                allItems.push({
                    ...item,
                    entityType: type
                });
            });
        });

        const lowerQuery = query.toLowerCase();
        const matches = allItems.filter(item => {
            const title = (item.title || item.name || '').toLowerCase();
            return title.startsWith(lowerQuery);
        });

        return matches
            .slice(0, limit)
            .map(item => ({
                title: item.title || item.name,
                type: item.entityType,
                id: item.id
            }));
    },

    /**
     * Search by tag
     */
    searchByTag(tag) {
        const results = [];
        ['tasks', 'projects', 'notes', 'goals', 'habits'].forEach(type => {
            const items = Database.read(type);
            items.forEach(item => {
                if (item.tags && item.tags.includes(tag)) {
                    results.push({
                        ...item,
                        entityType: type
                    });
                }
            });
        });
        return results;
    },

    /**
     * Get popular searches
     */
    getPopularSearches(limit = 10) {
        const logs = Database.getActivityLogs(1000);
        const searchQueries = {};

        logs.forEach(log => {
            if (log.action === 'search') {
                const query = log.details.query;
                searchQueries[query] = (searchQueries[query] || 0) + 1;
            }
        });

        return Object.entries(searchQueries)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([query, count]) => ({ query, count }));
    }
};