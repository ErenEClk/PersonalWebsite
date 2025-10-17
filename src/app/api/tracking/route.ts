import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (production'da database kullan) - Updated
let trackingData: any[] = [];
let behaviorData: any[] = [];

export async function POST(request: NextRequest) {
  console.log('🔥 API POST called at:', new Date().toISOString());
  try {
    const data = await request.json();
    console.log('📦 Received data type:', data.type || 'user_session');
    
    if (data.type === 'behavior') {
      behaviorData.push(data);
      console.log('📊 Behavior data saved. Total behavior entries:', behaviorData.length);
    } else {
      trackingData.push(data);
      console.log('📊 User session saved. Total sessions:', trackingData.length);
      console.log('🔍 Session fingerprint:', data.fingerprint?.substring(0, 10) + '...');
    }
    
    return NextResponse.json({ success: true, totalSessions: trackingData.length });
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
    
    console.log('📊 Returning data - Sessions:', trackingData.length, 'Behavior:', behaviorData.length);
    
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
