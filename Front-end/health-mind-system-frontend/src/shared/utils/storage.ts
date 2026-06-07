export const storage = {
    get: <T>(key: string): T | null => {
        const item = localStorage.getItem(key);

        if (!item) return null;

        return JSON.parse(item);
    },

    set: (key: string, value: unknown): void => {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove: (key: string): void => {
        localStorage.removeItem(key);
    },

    clear: (): void => {
        localStorage.clear();
    }
};