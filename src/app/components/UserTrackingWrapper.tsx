"use client";
import { useEffect } from 'react';

export default function UserTrackingWrapper() {
  useEffect(() => {
    // Only run on client side (allow admin page too for testing)
    if (typeof window !== 'undefined') {
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
      console.log('⏭️ UserTrackingWrapper: Skipping (SSR)');
    }
  }, []);

  return null; // This component doesn't render anything
}
