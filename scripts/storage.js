const KEY = 'app:data';

export const load = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
        console.error("Malformed state dataset found. Corrupted profile reset initiated.", e);
        return [];
    }
};

export const save = (data) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed writing state properties to browser context storage.", e);
    }
};