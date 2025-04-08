import { useState, useEffect } from 'react';
import { useUser } from '@/components/user-context';
import { usePlatformAccess } from '@/hooks/usePlatformAccess';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export const useLoadingStates = () => {
  const { user, isLoading: userLoading } = useUser();
  const { hasAccess, isLoading: accessLoading } = usePlatformAccess();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/google-signin');
      return;
    }
  }, [userLoading, user, router]);

  useEffect(() => {
    const checkBanStatus = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch('/api/check-ban-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.error === 'User is banned') {
            await signOut();
            window.location.href = '/banned';
            return;
          }
        }
      } catch (error) {
        console.error('Error checking ban status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkBanStatus();
  }, [user?.email]);

  useEffect(() => {
    if (!accessLoading && !hasAccess) {
      router.push("/restricted");
    }
  }, [hasAccess, accessLoading, router]);

  const isPageLoading = userLoading || accessLoading || loading;
  const shouldShowContent = !isPageLoading && user && hasAccess;

  return {
    isPageLoading,
    shouldShowContent
  };
};
