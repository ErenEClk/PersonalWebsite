"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface DeviceInfo {
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  touchSupport: boolean;
  maxTouchPoints: number;
  hardwareConcurrency: number | string;
  deviceMemory: number | string;
  platform: string;
  userAgent: string;
  cookieEnabled: boolean;
  onLine: boolean;
  languages: readonly string[];
  doNotTrack: string | null;
  battery?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
}

interface BrowserInfo {
  vendor: string;
  product: string;
  appName: string;
  appVersion: string;
  buildID: string;
  plugins: Array<{
    name: string;
    description: string;
    filename: string;
  }>;
  mimeTypes: Array<{
    type: string;
    description: string;
    suffixes: string;
  }>;
  webdriver: boolean;
  fonts: string[];
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number | string;
  rtt: number | string;
  saveData: boolean;
  type: string;
  pingTime: number | string;
}

interface LocationInfo {
  timezone: string;
  locale: string;
  currency: string;
  ip?: {
    ip: string;
    city: string;
    region: string;
    country: string;
    isp: string;
    lat: number;
    lon: number;
  };
  gps?: {
    lat: number;
    lon: number;
    accuracy: number;
  };
  gpsError?: string;
}

interface UserData {
  sessionId: string;
  timestamp: number;
  fingerprint: string;
  device: DeviceInfo;
  browser: BrowserInfo;
  network: NetworkInfo;
  behavior: unknown[];
  location: LocationInfo;
}

class UserTracker {
  private sessionId: string;
  private userData: Partial<UserData> = {};
  private behaviorData: any[] = [];
  private sessionSent: boolean = false; // Track if session data already sent

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initTracking();
  }

  private getOrCreateSessionId(): string {
    // Check if session already exists in localStorage
    const existingSessionId = localStorage.getItem('userTracker_sessionId');
    
    if (existingSessionId) {
      console.log('♻️ Reusing existing session ID:', existingSessionId);
      // Also check if session was already sent
      const sessionSent = localStorage.getItem('userTracker_sessionSent');
      if (sessionSent === 'true') {
        this.sessionSent = true;
        console.log('✅ Session data already sent for this session');
      }
      return existingSessionId;
    }
    
    // Create new session ID
    const newSessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userTracker_sessionId', newSessionId);
    console.log('🆕 Created new session ID:', newSessionId);
    return newSessionId;
  }

  private generateSessionId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initTracking() {
    console.log('🕵️ UserTracker: Starting tracking...');
    
    try {
      await this.collectDeviceInfo();
      console.log('✅ Device info collected');
    } catch (error) {
      console.error('❌ Device info failed:', error);
    }
    
    try {
      await this.collectBrowserInfo();
      console.log('✅ Browser info collected');
    } catch (error) {
      console.error('❌ Browser info failed:', error);
    }
    
    try {
      await this.collectNetworkInfo();
      console.log('✅ Network info collected');
    } catch (error) {
      console.error('❌ Network info failed:', error);
    }
    
    try {
      await this.collectFingerprint();
      console.log('✅ Fingerprint created');
    } catch (error) {
      console.error('❌ Fingerprint failed:', error);
    }
    
    try {
      await this.collectLocationInfo();
      console.log('✅ Location info collected');
    } catch (error) {
      console.error('❌ Location info failed:', error);
    }
    
    try {
      this.setupBehaviorTracking();
      console.log('✅ Behavior tracking setup');
    } catch (error) {
      console.error('❌ Behavior tracking failed:', error);
    }
    
    // Always try to send data, even if some collection failed
    this.sendData();
    console.log('✅ Data sent to storage');
  }

  private async collectDeviceInfo() {
    try {
      const screen = window.screen;
      const nav = navigator;
      
      this.userData.device = {
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth || 24,
        pixelRatio: window.devicePixelRatio || 1,
        touchSupport: 'ontouchstart' in window,
        maxTouchPoints: nav.maxTouchPoints || 0,
        hardwareConcurrency: nav.hardwareConcurrency || 'unknown',
        deviceMemory: (nav as any).deviceMemory || 'unknown',
        platform: nav.platform || 'unknown',
        userAgent: nav.userAgent || 'unknown',
        cookieEnabled: nav.cookieEnabled,
        onLine: nav.onLine,
        languages: nav.languages || ['unknown'],
        doNotTrack: nav.doNotTrack || null,
      };
      console.log('📱 Device info:', this.userData.device);
    } catch (error) {
      console.error('❌ Device info collection failed:', error);
      this.userData.device = {
        screenResolution: 'unknown',
        colorDepth: 24,
        pixelRatio: 1,
        touchSupport: true,
        maxTouchPoints: 1,
        hardwareConcurrency: 'unknown',
        deviceMemory: 'unknown',
        platform: 'mobile',
        userAgent: 'unknown',
        cookieEnabled: true,
        onLine: true,
        languages: ['unknown'],
        doNotTrack: null,
      };
    }

    // Battery API (if available)
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        if (this.userData.device) {
          this.userData.device.battery = {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
          };
        }
      } catch {
        console.log('Battery API not available');
      }
    }
  }

  private async collectBrowserInfo() {
    try {
      // Installed fonts detection (may fail on mobile)
      let fonts: string[] = [];
      try {
        fonts = await this.detectFonts();
      } catch (error) {
        console.log('📱 Font detection failed (mobile limitation):', error);
        fonts = ['Arial', 'Helvetica', 'Times New Roman']; // Default mobile fonts
      }
      
      this.userData.browser = {
        vendor: navigator.vendor || 'unknown',
        product: navigator.product || 'unknown',
        appName: navigator.appName || 'unknown',
        appVersion: navigator.appVersion || 'unknown',
        buildID: (navigator as any).buildID || 'unknown',
        plugins: navigator.plugins ? Array.from(navigator.plugins).map(p => ({
          name: p.name || 'unknown',
          description: p.description || 'unknown',
          filename: p.filename || 'unknown',
        })) : [],
        mimeTypes: navigator.mimeTypes ? Array.from(navigator.mimeTypes).map(m => ({
          type: m.type || 'unknown',
          description: m.description || 'unknown',
          suffixes: m.suffixes || 'unknown',
        })) : [],
        webdriver: (navigator as any).webdriver || false,
        fonts: fonts,
      };
      console.log('🌐 Browser info:', this.userData.browser);
    } catch (error) {
      console.error('❌ Browser info collection failed:', error);
      this.userData.browser = {
        vendor: 'mobile',
        product: 'mobile',
        appName: 'mobile',
        appVersion: 'mobile',
        buildID: 'mobile',
        plugins: [],
        mimeTypes: [],
        webdriver: false,
        fonts: ['Arial'],
      };
    }
  }

  private async detectFonts(): Promise<string[]> {
    const testFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana',
      'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
      'Trebuchet MS', 'Arial Black', 'Impact', 'Calibri', 'Cambria',
      'Segoe UI', 'Tahoma', 'Geneva', 'Lucida Console', 'Monaco'
    ];

    const availableFonts: string[] = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';

    const baseFontWidths: { [key: string]: number } = {};
    
    for (const baseFont of baseFonts) {
      ctx.font = `${testSize} ${baseFont}`;
      baseFontWidths[baseFont] = ctx.measureText(testString).width;
    }

    for (const font of testFonts) {
      let detected = false;
      for (const baseFont of baseFonts) {
        ctx.font = `${testSize} ${font}, ${baseFont}`;
        const width = ctx.measureText(testString).width;
        if (width !== baseFontWidths[baseFont]) {
          detected = true;
          break;
        }
      }
      if (detected) {
        availableFonts.push(font);
      }
    }

    return availableFonts;
  }

  private async collectNetworkInfo() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    // Speed test (basic)
    let pingTime: number | string = 'unknown';
    try {
      const startTime = performance.now();
      await fetch('/next.svg', { cache: 'no-cache' });
      const endTime = performance.now();
      pingTime = Math.round(endTime - startTime);
    } catch {
      pingTime = 'failed';
    }
    
    this.userData.network = {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 'unknown',
      rtt: connection?.rtt || 'unknown',
      saveData: connection?.saveData || false,
      type: connection?.type || 'unknown',
      pingTime: pingTime,
    };
  }

  private async collectFingerprint() {
    let canvasFingerprint = 'mobile_fallback';
    let webglFingerprint: any = 'mobile_fallback';
    let audioFingerprint = 'mobile_fallback';

    // Create canvas element for both canvas and WebGL fingerprinting
    const canvas = document.createElement('canvas');

    try {
      // Canvas fingerprint
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Canvas fingerprint test 🎨', 2, 2);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Canvas fingerprint test 🎨', 4, 4);
        canvasFingerprint = canvas.toDataURL();
      }
    } catch (error) {
      console.log('📱 Canvas fingerprint failed (mobile limitation):', error);
    }

    // WebGL fingerprint
    try {
      const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        webglFingerprint = {
          vendor: gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL || gl.VENDOR),
          renderer: gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL || gl.RENDERER),
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        };
      } else {
        webglFingerprint = 'not supported';
      }
    } catch {
      console.log('WebGL not available');
      webglFingerprint = 'not supported';
    }

    // Audio fingerprint
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        oscillator.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(0);
        
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
        
        audioFingerprint = Array.from(frequencyData).join(',');
        
        oscillator.stop();
        audioContext.close();
      }
    } catch (e) {
      console.log('Audio fingerprint failed');
      audioFingerprint = 'not supported';
    }

    this.userData.fingerprint = this.hashCode(
      canvasFingerprint + JSON.stringify(webglFingerprint) + audioFingerprint
    ).toString();
  }

  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  private async collectLocationInfo() {
    this.userData.location = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      currency: Intl.NumberFormat().resolvedOptions().currency || 'unknown',
    };

    // IP-based location (using a free service)
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      this.userData.location.ip = {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        isp: data.org,
        lat: data.latitude,
        lon: data.longitude,
      };
    } catch (e) {
      console.log('IP location failed');
    }

    // Geolocation API (optional - don't request automatically)
    // Removed automatic GPS request to avoid Instagram/social media warnings
  }

  private setupBehaviorTracking() {
    let mouseMovements: any[] = [];
    let scrollData: any[] = [];
    let clickData: any[] = [];
    let keystrokes: any[] = [];

    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
      mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      });
      
      // Keep only last 100 movements
      if (mouseMovements.length > 100) {
        mouseMovements = mouseMovements.slice(-100);
      }
    });

    // Click tracking
    document.addEventListener('click', (e) => {
      clickData.push({
        x: e.clientX,
        y: e.clientY,
        target: (e.target as Element).tagName,
        timestamp: Date.now(),
      });
    });

    // Scroll tracking
    document.addEventListener('scroll', () => {
      scrollData.push({
        scrollY: window.scrollY,
        timestamp: Date.now(),
      });
    });

    // Keystroke tracking (timing only, not content)
    document.addEventListener('keydown', (e) => {
      keystrokes.push({
        key: e.key.length === 1 ? 'char' : e.key, // Don't log actual characters
        timestamp: Date.now(),
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
      });
    });

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      this.behaviorData.push({
        type: 'visibility',
        hidden: document.hidden,
        timestamp: Date.now(),
      });
    });

    // Send behavior data every 30 seconds
    setInterval(() => {
      if (mouseMovements.length > 0 || scrollData.length > 0 || clickData.length > 0) {
        this.behaviorData.push({
          type: 'behavior_batch',
          mouseMovements: mouseMovements.slice(),
          scrollData: scrollData.slice(),
          clickData: clickData.slice(),
          keystrokes: keystrokes.slice(),
          timestamp: Date.now(),
        });

        // Clear arrays
        mouseMovements = [];
        scrollData = [];
        clickData = [];
        keystrokes = [];

        this.sendBehaviorData();
      }
    }, 30000);
  }

  private sendData() {
    // Only send session data once per session
    if (this.sessionSent) {
      console.log('⏭️ Session data already sent for this session, skipping...');
      return;
    }

    const data = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      ...this.userData,
    };

    // Send to your analytics endpoint
    console.log('📊 User Data:', data);
    
    // Store in localStorage for now (in production, send to server)
    const existingData = JSON.parse(localStorage.getItem('userTracking') || '[]');
    existingData.push(data);
    localStorage.setItem('userTracking', JSON.stringify(existingData));

    // YENI: Verileri merkezi bir endpoint'e gönder
    this.sendToServer(data);
    
    // Mark session as sent
    this.sessionSent = true;
    localStorage.setItem('userTracker_sessionSent', 'true');

    // Also send to Google Analytics as custom event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'user_fingerprint', {
        custom_parameter_fingerprint: this.userData.fingerprint,
        custom_parameter_device: JSON.stringify(this.userData.device),
      });
    }
  }

  private async sendToServer(data: any) {
    console.log('🚀 UserTracker: Attempting to send data to API...');
    
    // Always save to localStorage first (guaranteed to work)
    this.saveToLocalStorage(data);
    
    try {
      // Then try to send to API
      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('📤 API Response Status:', response.status, response.ok);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Data successfully sent to API. Total sessions:', result.totalSessions);
      } else {
        console.error('❌ API returned error status:', response.status);
      }
    } catch (error) {
      console.error('❌ Server send failed:', error);
      console.log('💾 Data saved to localStorage as fallback');
    }
  }

  private sendBehaviorData() {
    const data = {
      type: 'behavior',
      sessionId: this.sessionId,
      behaviorData: this.behaviorData.slice(),
      timestamp: Date.now(),
    };

    console.log('🎯 Behavior Data:', data);
    
    // Store behavior data locally
    const existingBehavior = JSON.parse(localStorage.getItem('behaviorTracking') || '[]');
    existingBehavior.push(data);
    localStorage.setItem('behaviorTracking', JSON.stringify(existingBehavior));

    // Send to server
    this.sendBehaviorToServer(data);

    // Clear sent data
    this.behaviorData = [];
  }

  private async sendBehaviorToServer(data: any) {
    console.log('🎯 UserTracker: Sending behavior data to API...');
    
    // Always save to localStorage first
    this.saveToLocalStorage(data);
    
    try {
      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('📤 Behavior API Response:', response.status, response.ok);
      
      if (response.ok) {
        console.log('✅ Behavior data successfully sent to API');
      } else {
        console.error('❌ Behavior API returned error:', response.status);
      }
    } catch (error) {
      console.error('❌ Behavior server send failed:', error);
      console.log('💾 Behavior data saved to localStorage as fallback');
    }
  }

  // Save data to localStorage for persistence
  private saveToLocalStorage(data: any) {
    try {
      const storageKey = data.type === 'behavior' ? 'userTracker_behavior' : 'userTracker_sessions';
      const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingData.push(data);
      
      // Keep only last 100 entries to prevent storage overflow
      if (existingData.length > 100) {
        existingData.splice(0, existingData.length - 100);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingData));
      console.log(`💾 Data saved to localStorage (${storageKey}). Total: ${existingData.length}`);
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }

  // Public method to get current session data
  public getSessionData() {
    return {
      sessionId: this.sessionId,
      userData: this.userData,
      behaviorData: this.behaviorData,
    };
  }

  // Public method to get localStorage data
  public static getLocalStorageData() {
    try {
      const sessions = JSON.parse(localStorage.getItem('userTracker_sessions') || '[]');
      const behavior = JSON.parse(localStorage.getItem('userTracker_behavior') || '[]');
      return { sessions, behavior };
    } catch (error) {
      console.error('❌ Error reading localStorage:', error);
      return { sessions: [], behavior: [] };
    }
  }
}

export default UserTracker;
