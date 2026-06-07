import { useState } from "react";

export function useLocalStorage(key: string, initialValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
        const item = localStorage.getItem(key);

        return item ? JSON.parse(item) : initialValue;
    });

    function setValue(value: any) {
        localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
    }

    return [storedValue, setValue];
}