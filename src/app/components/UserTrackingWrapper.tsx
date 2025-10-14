"use client";
import { useEffect } from 'react';

export default function UserTrackingWrapper() {
  useEffect(() => {
    // Only run on client side and not in admin page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin')) {
      // Dynamic import to avoid SSR issues
      import('../utils/UserTracker').then((module) => {
        const UserTracker = module.default;
        new UserTracker();
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
