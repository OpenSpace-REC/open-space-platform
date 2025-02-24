import { useState, useEffect } from 'react';
import { useUser } from '@/components/user-context';

export function usePlatformAccess() {
    const [isAdminOnly, setIsAdminOnly] = useState(false);
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
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                // Default to non-admin-only mode in case of error to prevent lockout
                setIsAdminOnly(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkPlatformAccess();
    }, [user]);

    // Consider user as having access if:
    // 1. Platform is not in admin-only mode, OR
    // 2. User is an admin
    const hasAccess = !isLoading && (!isAdminOnly || user?.role === 'ADMIN');

    return { isAdminOnly, isLoading, error, hasAccess };
}
