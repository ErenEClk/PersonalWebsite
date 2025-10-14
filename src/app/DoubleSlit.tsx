"use client";
import { useEffect, useRef, useState } from "react";

interface PhotonHit {
  x: number;
  intensity: number;
  time: number;
}

export default function DoubleSlit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [photonHits, setPhotonHits] = useState<PhotonHit[]>([]);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [photonActive, setPhotonActive] = useState(false);

  useEffect(() => {
    let lastTime = Date.now();
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      const deltaScroll = currentScrollY - lastScrollY;
      const velocity = deltaTime > 0 ? Math.abs(deltaScroll) / deltaTime : 0;
      
      setScrollY(currentScrollY);
      setScrollVelocity(velocity);
      setScrollDirection(deltaScroll);
      setLastScrollY(currentScrollY);
      lastTime = currentTime;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Foton kontrol sistemi
  useEffect(() => {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
    
    // En üste çıkınca yeni foton oluştur
    if (scrollProgress < 0.05 && !photonActive) {
      setPhotonActive(true);
    }
    
    // Ortada bırakınca foton yok olsun
    if (photonActive && scrollDirection < 0 && scrollProgress > 0.1 && scrollProgress < 0.9) {
      setPhotonActive(false);
    }
    
        // En alta inince perdede çarpma
    if (photonActive && scrollProgress > 0.9) {
      const screenWidth = 200; // Canvas genişliği
      let hitX: number;
      
              // Çok fazla git-gel varsa dalga davranışı
        if (photonHits.length > 50) {
          // Dalga interferans deseni
          const center = screenWidth / 2;
          const wavePattern = Math.sin(photonHits.length * 0.3) * 60 * Math.exp(-Math.pow((photonHits.length % 20 - 10) / 8, 2));
          hitX = center + wavePattern;
        } else {
          // Parçacık davranışı - rastgele ama gerçekçi
          const slitChoice = Math.random() > 0.5 ? 0 : 1;
          const slitOffset = slitChoice === 0 ? -30 : 30;
          hitX = screenWidth / 2 + slitOffset + (Math.random() - 0.5) * 20;
        }
      
      setPhotonHits(prev => [...prev, {
        x: hitX,
        intensity: 1,
        time: Date.now()
      }].slice(-300));
      
      setPhotonActive(false);
    }
  }, [scrollY, scrollDirection, photonHits.length, photonActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mobile responsive width
    const isMobile = window.innerWidth <= 700;
    const isSmallMobile = window.innerWidth <= 480;
    
    let width = 200; // Desktop default
    if (isSmallMobile) {
      width = 60;
    } else if (isMobile) {
      width = 80;
    }
    
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const draw = () => {
      if (!ctx) return;
      
      // Canvas temizle ve arka plan deseni
      ctx.fillStyle = "rgba(10, 25, 49, 0.95)";
      ctx.fillRect(0, 0, width, height);
      
      // Arka plan deseni - Fizik formülleri ve geometrik şekiller
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#4fc3f7";
      
      // Floating matematik sembolleri
      const time = Date.now() * 0.001;
      for (let i = 0; i < 8; i++) {
        const x = (width * 0.1) + Math.sin(time + i) * 20;
        const y = (height * 0.1) + i * (height * 0.1) + Math.cos(time + i * 0.5) * 15;
        
        ctx.font = "16px serif";
        const symbols = ["λ", "ψ", "∆", "∇", "∫", "∂", "π", "φ"];
        ctx.fillText(symbols[i % symbols.length], x, y);
      }
      
      // Dalga çizgileri (sağ tarafta)
      ctx.strokeStyle = "#4fc3f7";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const baseY = height * 0.2 + i * height * 0.15;
        for (let x = width * 0.7; x < width; x += 2) {
          const waveY = baseY + Math.sin((x - width * 0.7) * 0.1 + time + i) * 8;
          if (x === width * 0.7) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }
      
      // Geometrik noktalar
      for (let i = 0; i < 12; i++) {
        const x = width * 0.05 + (i % 3) * width * 0.03;
        const y = height * 0.3 + Math.floor(i / 3) * height * 0.15 + Math.sin(time * 2 + i) * 5;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;

      // Scroll progress'e göre yarık ve perde pozisyonu
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      
      // Yarık perdesi alttan yukarı çıkar (scroll 0.4+) - ÇİFT YARIK
      if (scrollProgress > 0.4) {
        const slitAppearProgress = Math.min((scrollProgress - 0.4) / 0.2, 1); // 0.4-0.6 arası tam çıkar
        const slitY = height - (height * 0.4 * slitAppearProgress); // Alttan yukarı
        const wallHeight = 10; // Perde kalınlığı
        const slitWidth = 20; // Boşluk uzunluğu
        const slitHeight = wallHeight; // Boşluk perde ile aynı kalınlıkta
        const dividerWidth = 2; // Ortadaki ayırıcı çizgi kalınlığı

        ctx.fillStyle = "#ffb347";
        
        // ANA PERDE (tam genişlik)
        ctx.fillRect(0, slitY - wallHeight/2, width, wallHeight);
        
        // ORTASINDA BOŞLUK AÇ (siyah ile kes)
        ctx.fillStyle = "rgba(10, 25, 49, 0.95)"; // Background rengi
        ctx.fillRect(width * 0.45, slitY - slitHeight/2, slitWidth, slitHeight);
        
        // BOŞLUĞUN ORTASINA İNCE ÇİZGİ (çift yarık için)
        ctx.fillStyle = "#ffb347";
        ctx.fillRect(width * 0.45 + slitWidth/2 - dividerWidth/2, slitY - slitHeight/2, dividerWidth, slitHeight);
      }

      // Perde alttan yukarı çıkar (scroll 0.8+) - EKRANIN SOLUNA KADAR
      if (scrollProgress > 0.8) {
        const screenAppearProgress = Math.min((scrollProgress - 0.8) / 0.15, 1); // 0.8-0.95 arası tam çıkar
        const screenY = height - (height * 0.15 * screenAppearProgress); // Alttan yukarı
        const screenWidth = width; // EKRANIN SOLUNA KADAR
        ctx.fillStyle = "#e0e6ed";
        ctx.fillRect(0, screenY, screenWidth, 10);
      }

      // Foton pozisyonu (scroll'a göre)
      const photonY = height * 0.1 + (height * 0.75) * scrollProgress;

      // Foton çiz (sadece aktifse)
      if (photonActive && scrollProgress < 0.9) {
        const photonX = width * 0.5; // Merkez
        ctx.fillStyle = "#ffb347";
        ctx.beginPath();
        ctx.arc(photonX, photonY, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Foton izi
        ctx.fillStyle = "rgba(255, 179, 71, 0.3)";
        ctx.beginPath();
        ctx.arc(photonX, photonY, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Çift yarıktan geçme animasyonu (sadece foton aktifse ve yarıklar görünürken)
      if (photonActive && scrollProgress > 0.6 && scrollProgress < 0.8) {
        const slitProgress = (scrollProgress - 0.6) / 0.2;
        const slitAppearProgress = Math.min((scrollProgress - 0.4) / 0.2, 1);
        const slitY = height - (height * 0.4 * slitAppearProgress);
        
        // Foton hangi yarıktan geçecek (sol veya sağ)
        const chosenSlit = Math.random() > 0.5 ? 0 : 1; // 0=sol yarık, 1=sağ yarık
        const slitCenterX = width * 0.45 + (chosenSlit === 0 ? 5 : 15); // Sol yarık 5px, sağ yarık 15px
        
        ctx.fillStyle = "#ffb347";
        ctx.beginPath();
        ctx.arc(slitCenterX, slitY + slitProgress * 30, 3, 0, Math.PI * 2);
        ctx.fill();
      }

             // Perdede çarpma izleri (sadece perde görünürken)
      if (scrollProgress > 0.8) {
        const screenAppearProgress = Math.min((scrollProgress - 0.8) / 0.15, 1);
        const screenY = height - (height * 0.15 * screenAppearProgress);
        photonHits.forEach((hit) => {
          const age = Date.now() - hit.time;
          const alpha = Math.max(0, 1 - age / 15000); // 15 saniye sonra kaybolur
          
          if (alpha > 0) {
            ctx.fillStyle = `rgba(255, 179, 71, ${alpha})`;
            ctx.beginPath();
            ctx.arc(hit.x, screenY + 5, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // Dalga interferans deseni (ÇOK FAZLA çarpma varsa - 100+ kere)
      if (photonHits.length > 100 && scrollProgress > 0.8) {
        const screenAppearProgress = Math.min((scrollProgress - 0.8) / 0.15, 1);
        const screenY = height - (height * 0.15 * screenAppearProgress);
        const screenWidth = width; // Ekranın soluna kadar
        const histogram = new Array(Math.floor(screenWidth / 4)).fill(0);
        
        photonHits.forEach(hit => {
          const bin = Math.floor(hit.x / 4);
          if (bin >= 0 && bin < histogram.length) {
            histogram[bin]++;
          }
        });
        
        const maxCount = Math.max(...histogram);
        if (maxCount > 0) {
          ctx.fillStyle = "rgba(79, 195, 247, 0.4)";
          histogram.forEach((count, i) => {
            const intensity = count / maxCount;
            const barHeight = intensity * 50;
            ctx.fillRect(i * 4, screenY - barHeight, 4, barHeight);
          });
        }
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const isMobile = window.innerWidth <= 700;
      const isSmallMobile = window.innerWidth <= 480;
      
      let newWidth = 200;
      if (isSmallMobile) {
        newWidth = 60;
      } else if (isMobile) {
        newWidth = 80;
      }
      
      canvas.width = newWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [scrollY, scrollVelocity, photonHits, photonActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 2,
        pointerEvents: "none",
        opacity: 0.8,
        width: "200px", // Desktop genişliği
      }}
      className="doubleSlit"
    />
  );
} 