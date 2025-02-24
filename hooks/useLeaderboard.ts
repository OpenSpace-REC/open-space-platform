import { useState, useEffect } from 'react';

export function useLeaderboard() {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkLeaderboardStatus = async () => {
            try {
                const response = await fetch('/api/admin/toggle-leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard status');
                }
                const data = await response.json();
                setIsEnabled(data.leaderboardEnabled);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        checkLeaderboardStatus();
    }, []);

    return { isEnabled, isLoading, error };
}
