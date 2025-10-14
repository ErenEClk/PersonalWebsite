"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import styles from '../page.module.css';

interface UserSession {
  sessionId: string;
  timestamp: number;
  url: string;
  referrer: string;
  fingerprint: string;
  device: any;
  browser: any;
  network: any;
  location: any;
}

interface BehaviorData {
  sessionId: string;
  behaviorData: any[];
  timestamp: number;
}

export default function AdminDashboard() {
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [behaviorData, setBehaviorData] = useState<BehaviorData[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Simple password protection
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'authorized') {
      setIsAuthorized(true);
      loadData();
    }
  }, []);

  const handleLogin = () => {
    if (password === 'erenegeCELIK1182@') {
      setIsAuthorized(true);
      localStorage.setItem('adminAuth', 'authorized');
      loadData();
    } else {
      alert('Wrong password!');
    }
  };

  const loadData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userTracking') || '[]');
      const behaviorData = JSON.parse(localStorage.getItem('behaviorTracking') || '[]');
      
      console.log('📊 Admin: Loaded user sessions:', userData.length);
      console.log('📊 Admin: Loaded behavior data:', behaviorData.length);
      
      setUserSessions(userData);
      setBehaviorData(behaviorData);
    } catch (error) {
      console.error('❌ Admin: Error loading data:', error);
      setUserSessions([]);
      setBehaviorData([]);
    }
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all tracking data?')) {
      localStorage.removeItem('userTracking');
      localStorage.removeItem('behaviorTracking');
      setUserSessions([]);
      setBehaviorData([]);
    }
  };

  const exportData = () => {
    const allData = {
      userSessions,
      behaviorData,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-tracking-${Date.now()}.json`;
    a.click();
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR');
  };

  const getUniqueUsers = () => {
    const fingerprints = new Set(userSessions.map(s => s.fingerprint));
    return fingerprints.size;
  };

  const getSessionsToday = () => {
    const today = new Date().toDateString();
    return userSessions.filter(s => new Date(s.timestamp).toDateString() === today).length;
  };

  if (!isAuthorized) {
    return (
      <div className={styles.pageModern} style={{ padding: '50px', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'rgba(22, 36, 71, 0.9)', padding: '30px', borderRadius: '20px' }}>
          <h2 style={{ color: '#ffb347', marginBottom: '20px' }}>Admin Dashboard</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '8px',
              border: '1px solid #ffb347',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
            }}
          />
          <button
            onClick={handleLogin}
            style={{
              background: '#ffb347',
              color: '#0a1931',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageModern} style={{ padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#ffb347' }}>🕵️ User Tracking Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={loadData} style={{ background: '#4fc3f7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              🔄 Refresh
            </button>
            <button onClick={exportData} style={{ background: '#4fc3f7', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              📥 Export
            </button>
            <button onClick={clearData} style={{ background: '#ff6b6b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: 'rgba(22, 36, 71, 0.9)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>Total Sessions</h3>
            <p style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{userSessions.length}</p>
          </div>
          <div style={{ background: 'rgba(22, 36, 71, 0.9)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>Unique Users</h3>
            <p style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{getUniqueUsers()}</p>
          </div>
          <div style={{ background: 'rgba(22, 36, 71, 0.9)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>Today</h3>
            <p style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{getSessionsToday()}</p>
          </div>
          <div style={{ background: 'rgba(22, 36, 71, 0.9)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>Behavior Events</h3>
            <p style={{ fontSize: '2rem', margin: 0, color: 'white' }}>{behaviorData.length}</p>
          </div>
        </div>

        {/* Sessions List */}
        <div style={{ background: 'rgba(22, 36, 71, 0.9)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          <h2 style={{ color: '#ffb347', marginBottom: '20px' }}>User Sessions</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {userSessions.map((session, index) => (
              <div
                key={session.sessionId}
                onClick={() => setSelectedSession(selectedSession === session.sessionId ? null : session.sessionId)}
                style={{
                  background: selectedSession === session.sessionId ? 'rgba(255, 179, 71, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  margin: '10px 0',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedSession === session.sessionId ? '2px solid #ffb347' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: '#4fc3f7' }}>Session #{index + 1}</strong>
                    <span style={{ color: '#ccc', marginLeft: '10px' }}>
                      {formatTimestamp(session.timestamp)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                    {session.device?.platform} • {session.location?.ip?.city || 'Unknown'}
                  </div>
                </div>
                
                {selectedSession === session.sessionId && (
                  <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#e0e6ed' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                      <div>
                        <h4 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>🖥️ Device Info</h4>
                        <p><strong>Screen:</strong> {session.device?.screenResolution}</p>
                        <p><strong>Platform:</strong> {session.device?.platform}</p>
                        <p><strong>Touch:</strong> {session.device?.touchSupport ? 'Yes' : 'No'}</p>
                        <p><strong>CPU Cores:</strong> {session.device?.hardwareConcurrency}</p>
                        <p><strong>Memory:</strong> {session.device?.deviceMemory}GB</p>
                        {session.device?.battery && (
                          <p><strong>Battery:</strong> {session.device.battery.level}% {session.device.battery.charging ? '⚡' : '🔋'}</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>🌐 Browser Info</h4>
                        <p><strong>Browser:</strong> {session.browser?.appName}</p>
                        <p><strong>Version:</strong> {session.browser?.appVersion?.split(' ')[0] || 'Unknown'}</p>
                        <p><strong>Plugins:</strong> {session.browser?.plugins?.length || 0}</p>
                        <p><strong>Fonts:</strong> {session.browser?.fonts?.length || 0} detected</p>
                        <p><strong>WebDriver:</strong> {session.browser?.webdriver ? 'Yes (Bot?)' : 'No'}</p>
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>📍 Location Info</h4>
                        <p><strong>Timezone:</strong> {session.location?.timezone}</p>
                        <p><strong>Locale:</strong> {session.location?.locale}</p>
                        {session.location?.ip && (
                          <>
                            <p><strong>IP:</strong> {session.location.ip.ip}</p>
                            <p><strong>City:</strong> {session.location.ip.city}, {session.location.ip.country}</p>
                            <p><strong>ISP:</strong> {session.location.ip.isp}</p>
                          </>
                        )}
                        {session.location?.gps && (
                          <p><strong>GPS:</strong> {session.location.gps.lat.toFixed(4)}, {session.location.gps.lon.toFixed(4)}</p>
                        )}
                      </div>
                      
                      <div>
                        <h4 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>🌐 Network Info</h4>
                        <p><strong>Connection:</strong> {session.network?.effectiveType}</p>
                        <p><strong>Downlink:</strong> {session.network?.downlink} Mbps</p>
                        <p><strong>RTT:</strong> {session.network?.rtt}ms</p>
                        <p><strong>Ping:</strong> {session.network?.pingTime}ms</p>
                        <p><strong>Save Data:</strong> {session.network?.saveData ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <h4 style={{ color: '#ffb347', margin: '0 0 10px 0' }}>🔍 Fingerprint</h4>
                      <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                        {session.fingerprint}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Behavior Data */}
        {behaviorData.length > 0 && (
          <div style={{ background: 'rgba(22, 36, 71, 0.9)', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ color: '#ffb347', marginBottom: '20px' }}>🎯 Behavior Data</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {behaviorData.map((behavior, index) => (
                <div key={index} style={{ background: 'rgba(255, 255, 255, 0.05)', margin: '10px 0', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#4fc3f7' }}>Session: {behavior.sessionId.split('_')[2]}</span>
                    <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{formatTimestamp(behavior.timestamp)}</span>
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#e0e6ed' }}>
                    Mouse moves: {behavior.behaviorData[0]?.mouseMovements?.length || 0} • 
                    Clicks: {behavior.behaviorData[0]?.clickData?.length || 0} • 
                    Scrolls: {behavior.behaviorData[0]?.scrollData?.length || 0} •
                    Keystrokes: {behavior.behaviorData[0]?.keystrokes?.length || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
