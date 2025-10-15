import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (production'da database kullan) - Updated
let trackingData: any[] = [];
let behaviorData: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (data.type === 'behavior') {
      behaviorData.push(data);
      console.log('📊 Behavior data received:', data.sessionId);
    } else {
      trackingData.push(data);
      console.log('📊 User data received:', data.sessionId);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Tracking API error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    // Simple password protection
    if (password !== 'erenegeCELIK1182@') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
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
