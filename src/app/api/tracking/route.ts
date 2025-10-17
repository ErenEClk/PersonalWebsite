import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Create Redis client using REDIS_URL
const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: '', // URL already includes auth
});

// Storage keys
const SESSIONS_KEY = 'userTracker:sessions';
const BEHAVIOR_KEY = 'userTracker:behavior';

export async function POST(request: NextRequest) {
  console.log('🔥 API POST called at:', new Date().toISOString());
  try {
    const data = await request.json();
    console.log('📦 Received data type:', data.type || 'user_session');
    
    if (data.type === 'behavior') {
      // Behavior verilerini Redis'e ekle
      await redis.rpush(BEHAVIOR_KEY, JSON.stringify(data));
      const totalBehavior = await redis.llen(BEHAVIOR_KEY);
      console.log('📊 Behavior data saved to Redis. Total behavior entries:', totalBehavior);
    } else {
      // Session verilerini Redis'e ekle
      await redis.rpush(SESSIONS_KEY, JSON.stringify(data));
      const totalSessions = await redis.llen(SESSIONS_KEY);
      console.log('📊 User session saved to Redis. Total sessions:', totalSessions);
      console.log('🔍 Session fingerprint:', data.fingerprint?.substring(0, 10) + '...');
    }
    
    const totalSessions = await redis.llen(SESSIONS_KEY);
    return NextResponse.json({ success: true, totalSessions });
  } catch (error) {
    console.error('❌ Tracking API POST error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log('🔥 API GET called at:', new Date().toISOString());
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    console.log('🔑 Password provided:', password ? 'YES' : 'NO');
    
    // Simple password protection
    if (password !== 'erenegeCELIK1182@') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Redis'ten verileri çek
    const sessionsRaw = await redis.lrange(SESSIONS_KEY, 0, -1) || [];
    const behaviorRaw = await redis.lrange(BEHAVIOR_KEY, 0, -1) || [];
    
    // Parse JSON strings
    const trackingData = sessionsRaw.map((item: any) => 
      typeof item === 'string' ? JSON.parse(item) : item
    );
    const behaviorData = behaviorRaw.map((item: any) => 
      typeof item === 'string' ? JSON.parse(item) : item
    );
    
    console.log('📊 Returning data from Redis - Sessions:', trackingData.length, 'Behavior:', behaviorData.length);
    
    return NextResponse.json({
      userSessions: trackingData,
      behaviorData: behaviorData,
      stats: {
        totalSessions: trackingData.length,
        uniqueUsers: new Set(trackingData.map(d => d.fingerprint)).size,
        todaySessions: trackingData.filter(d => 
          new Date(d.timestamp).toDateString() === new Date().toDateString()
        ).length,
      }
    });
  } catch (error) {
    console.error('❌ Tracking API GET error:', error);
    return NextResponse.json({ error: 'Failed to get data' }, { status: 500 });
  }
}
