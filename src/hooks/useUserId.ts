import { useCallback, useEffect, useState } from 'react';
import {
    getOrCreateUserId,
    getStoredUserId,
    resetStoredUserId,
} from '../lib/userId';

export function useUserId() {
    const [userId, setUserId] = useState<string | null>(() => {
        if (typeof window === 'undefined') {
            return null;
        }
        return getStoredUserId();
    });

    useEffect(() => {
        if (userId) {
            return;
        }

        const id = getOrCreateUserId();
        setUserId(id);
    }, [userId]);

    const resetUserId = useCallback(() => {
        const next = resetStoredUserId();
        setUserId(next);
        return next;
    }, []);

    return { userId, resetUserId };
}
