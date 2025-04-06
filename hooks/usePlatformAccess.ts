import { useState, useEffect } from 'react';
import { useUser } from '@/components/user-context';

export function usePlatformAccess() {
    const [isAdminOnly, setIsAdminOnly] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const checkPlatformAccess = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/admin/toggle-platform-access');
                if (!response.ok) {
                    throw new Error('Failed to fetch platform access status');
                }
                const data = await response.json();
                setIsAdminOnly(data.adminOnlyAccess);
                setHasAccess(data.hasAccess);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsAdminOnly(false);
                setHasAccess(true);
            } finally {
                setIsLoading(false);
            }
        };

        checkPlatformAccess();
    }, [user]);

    return { isAdminOnly, isLoading, error, hasAccess };
}
