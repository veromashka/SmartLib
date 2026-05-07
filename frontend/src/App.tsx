import { useEffect } from 'react';
import { AppRouter } from '@/app/router';
import { useAppDispatch } from '@/app/hooks';
import { rehydrateAuth } from '@/features/auth/authSlice';

/**
 * App is intentionally thin — composition only.
 * Routing lives in `app/router`, store in `app/store`.
 */
export default function App() {
  const dispatch = useAppDispatch();

  // Pull persisted token (if any) into Redux on first mount.
  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  return <AppRouter />;
}
