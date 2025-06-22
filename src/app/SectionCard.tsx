"use client";
import { useRef, useEffect, useState } from "react";
import styles from "./page.module.css";

export default function SectionCard({ title, children }: { title: string, children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { 
      if (currentRef) observer.unobserve(currentRef); 
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={styles.sectionCard + (visible ? " " + styles.sectionCardVisible : "") }>
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
} 