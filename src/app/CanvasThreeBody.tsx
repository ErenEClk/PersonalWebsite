"use client";
import { useEffect, useRef } from "react";

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
  trail: { x: number; y: number }[];
}

export default function CanvasThreeBody() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas boyutunu ayarla
    const width = 300;
    const height = 150;
    canvas.width = width;
    canvas.height = height;

    // 3 cisim başlangıç değerleri
    const bodies: Body[] = [
      {
        x: 100,
        y: 60,
        vx: 0.2,
        vy: 0.8,
        mass: 8,
        color: "#ffb347",
        trail: [],
      },
      {
        x: 150,
        y: 90,
        vx: -0.4,
        vy: -0.3,
        mass: 10,
        color: "#4fc3f7",
        trail: [],
      },
      {
        x: 200,
        y: 60,
        vx: 0.1,
        vy: -0.5,
        mass: 9,
        color: "#ff4f81",
        trail: [],
      },
    ];

    const G = 50; // Gravitasyon sabiti

    const updatePhysics = () => {
      // Her cisim için kuvvet hesapla
      for (let i = 0; i < bodies.length; i++) {
        let fx = 0;
        let fy = 0;

        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue;

          const dx = bodies[j].x - bodies[i].x;
          const dy = bodies[j].y - bodies[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 1) {
            const force = (G * bodies[i].mass * bodies[j].mass) / (distance * distance);
            fx += (force * dx) / distance / bodies[i].mass;
            fy += (force * dy) / distance / bodies[i].mass;
          }
        }

        // Hızı güncelle
        bodies[i].vx += fx * 0.01;
        bodies[i].vy += fy * 0.01;
      }

      // Pozisyonları güncelle
      for (const body of bodies) {
        body.x += body.vx;
        body.y += body.vy;

        // Sınırlardan çıkarsa geri getir
        if (body.x < 10 || body.x > width - 10) body.vx *= -0.8;
        if (body.y < 10 || body.y > height - 10) body.vy *= -0.8;

        body.x = Math.max(10, Math.min(width - 10, body.x));
        body.y = Math.max(10, Math.min(height - 10, body.y));

        // Trail güncelle
        body.trail.push({ x: body.x, y: body.y });
        if (body.trail.length > 30) body.trail.shift();
      }
    };

    const draw = () => {
      if (!ctx) return;
      
      // Canvas'ı temizle
      ctx.fillStyle = "rgba(10, 25, 49, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Trail çiz
      for (const body of bodies) {
        ctx.strokeStyle = body.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        for (let i = 0; i < body.trail.length - 1; i++) {
          if (i === 0) {
            ctx.moveTo(body.trail[i].x, body.trail[i].y);
          } else {
            ctx.lineTo(body.trail[i].x, body.trail[i].y);
          }
        }
        ctx.stroke();
      }

      // Cisimleri çiz
      ctx.globalAlpha = 0.8;
      for (const body of bodies) {
        ctx.fillStyle = body.color;
        ctx.beginPath();
        ctx.arc(body.x, body.y, Math.sqrt(body.mass), 0, Math.PI * 2);
        ctx.fill();
        
        // Glow efekti
        ctx.shadowColor = body.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(body.x, body.y, Math.sqrt(body.mass) * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    const animate = () => {
      updatePhysics();
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6,
      }}
    />
  );
} 