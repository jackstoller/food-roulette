const STORAGE_KEY = 'food-roulette-user-id';

function safeGetItem(): string | null {
    if (typeof window === 'undefined' || !window?.localStorage) {
        return null;
    }

    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Unable to read user id from localStorage', error);
        return null;
    }
}

function safeSetItem(value: string): void {
    if (typeof window === 'undefined' || !window?.localStorage) {
        return;
    }

    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
        console.warn('Unable to persist user id to localStorage', error);
    }
}

function safeRemoveItem(): void {
    if (typeof window === 'undefined' || !window?.localStorage) {
        return;
    }

    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Unable to remove user id from localStorage', error);
    }
}

function fallbackUuid(): string {
    const randomHex = () =>
        Math.floor(Math.random() * 0xffff)
            .toString(16)
            .padStart(4, '0');
    return `fallback-${randomHex()}${randomHex()}-${randomHex()}-${randomHex()}-${randomHex()}${randomHex()}${randomHex()}`;
}

export function generateUserId(): string {
    if (
        typeof crypto !== 'undefined' &&
        typeof crypto.randomUUID === 'function'
    ) {
        return crypto.randomUUID();
    }

    return fallbackUuid();
}

export function getOrCreateUserId(): string {
    const existing = safeGetItem();
    if (existing) {
        return existing;
    }

    const newId = generateUserId();
    safeSetItem(newId);
    return newId;
}

export function getStoredUserId(): string | null {
    return safeGetItem();
}

export function clearStoredUserId(): void {
    safeRemoveItem();
}

export function resetStoredUserId(): string {
    const newId = generateUserId();
    safeSetItem(newId);
    return newId;
}
