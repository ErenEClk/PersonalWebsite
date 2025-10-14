"use client";
import { useEffect } from 'react';

export default function UserTrackingWrapper() {
  useEffect(() => {
    // Only run on client side and not in admin page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin')) {
      console.log('🚀 UserTrackingWrapper: Initializing tracker...');
      // Dynamic import to avoid SSR issues
      import('../utils/UserTracker').then((module) => {
        const UserTracker = module.default;
        console.log('📦 UserTracker module loaded');
        new UserTracker();
      }).catch((error) => {
        console.error('❌ Failed to load UserTracker:', error);
      });
    } else {
      console.log('⏭️ UserTrackingWrapper: Skipping (admin page or SSR)');
    }
  }, []);

  return null; // This component doesn't render anything
}
