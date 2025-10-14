"use client";

interface UserData {
  sessionId: string;
  timestamp: number;
  fingerprint: string;
  device: any;
  browser: any;
  network: any;
  behavior: any;
  location: any;
}

class UserTracker {
  private sessionId: string;
  private userData: Partial<UserData> = {};
  private behaviorData: any[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initTracking();
  }

  private generateSessionId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initTracking() {
    await this.collectDeviceInfo();
    await this.collectBrowserInfo();
    await this.collectNetworkInfo();
    await this.collectFingerprint();
    await this.collectLocationInfo();
    this.setupBehaviorTracking();
    this.sendData();
  }

  private async collectDeviceInfo() {
    const screen = window.screen;
    const nav = navigator;
    
    this.userData.device = {
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      touchSupport: 'ontouchstart' in window,
      maxTouchPoints: nav.maxTouchPoints || 0,
      hardwareConcurrency: nav.hardwareConcurrency || 'unknown',
      deviceMemory: (nav as any).deviceMemory || 'unknown',
      platform: nav.platform,
      userAgent: nav.userAgent,
      cookieEnabled: nav.cookieEnabled,
      onLine: nav.onLine,
      languages: nav.languages,
      doNotTrack: nav.doNotTrack,
    };

    // Battery API (if available)
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.userData.device.battery = {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        };
      } catch (e) {
        console.log('Battery API not available');
      }
    }
  }

  private async collectBrowserInfo() {
    this.userData.browser = {
      vendor: navigator.vendor,
      product: navigator.product,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      buildID: (navigator as any).buildID || 'unknown',
      plugins: Array.from(navigator.plugins).map(p => ({
        name: p.name,
        description: p.description,
        filename: p.filename,
      })),
      mimeTypes: Array.from(navigator.mimeTypes).map(m => ({
        type: m.type,
        description: m.description,
        suffixes: m.suffixes,
      })),
      webdriver: (navigator as any).webdriver || false,
    };

    // Installed fonts detection
    this.userData.browser.fonts = await this.detectFonts();
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
    
    this.userData.network = {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 'unknown',
      rtt: connection?.rtt || 'unknown',
      saveData: connection?.saveData || false,
      type: connection?.type || 'unknown',
    };

    // Speed test (basic)
    try {
      const startTime = performance.now();
      await fetch('/next.svg', { cache: 'no-cache' });
      const endTime = performance.now();
      this.userData.network.pingTime = Math.round(endTime - startTime);
    } catch (e) {
      this.userData.network.pingTime = 'failed';
    }
  }

  private async collectFingerprint() {
    // Canvas fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Canvas fingerprint test 🎨', 2, 2);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Canvas fingerprint test 🎨', 4, 4);
    const canvasFingerprint = canvas.toDataURL();

    // WebGL fingerprint
    let webglFingerprint = 'not supported';
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        webglFingerprint = {
          vendor: gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL || gl.VENDOR),
          renderer: gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL || gl.RENDERER),
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        };
      }
    } catch (e) {
      console.log('WebGL not available');
    }

    // Audio fingerprint
    let audioFingerprint = 'not supported';
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    } catch (e) {
      console.log('Audio fingerprint failed');
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

    // Geolocation API (requires permission)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userData.location.gps = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          this.sendData(); // Update with GPS data
        },
        (error) => {
          this.userData.location.gpsError = error.message;
        },
        { timeout: 5000 }
      );
    }
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

    // Also send to Google Analytics as custom event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'user_fingerprint', {
        custom_parameter_fingerprint: this.userData.fingerprint,
        custom_parameter_device: JSON.stringify(this.userData.device),
      });
    }
  }

  private sendBehaviorData() {
    const data = {
      sessionId: this.sessionId,
      behaviorData: this.behaviorData.slice(),
      timestamp: Date.now(),
    };

    console.log('🎯 Behavior Data:', data);
    
    // Store behavior data
    const existingBehavior = JSON.parse(localStorage.getItem('behaviorTracking') || '[]');
    existingBehavior.push(data);
    localStorage.setItem('behaviorTracking', JSON.stringify(existingBehavior));

    // Clear sent data
    this.behaviorData = [];
  }

  // Public method to get current session data
  public getSessionData() {
    return {
      sessionId: this.sessionId,
      userData: this.userData,
      behaviorData: this.behaviorData,
    };
  }
}

export default UserTracker;
