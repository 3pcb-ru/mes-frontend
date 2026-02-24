import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useEffect } from 'react';

export function SessionExpiredAlert() {
  useEffect(() => {
    // Remove the flag after showing once
    localStorage.removeItem('session_expired');
  }, []);

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-full max-w-md">
      <Alert variant="destructive">
        <AlertTitle>Session expired</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again to continue.
        </AlertDescription>
      </Alert>
    </div>
  );
}
