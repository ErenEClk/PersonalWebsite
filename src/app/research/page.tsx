"use client";
import { useRef, useEffect, useState } from "react";
import styles from "../page.module.css";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from '../contexts/LanguageContext';

interface ResearchSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

function ResearchSection({ title, children, icon }: ResearchSectionProps) {
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
    <div ref={ref} className={`${styles.sectionCard} ${visible ? styles.sectionCardVisible : ""}`}>
      <h2>
        {icon && <span style={{ marginRight: "8px" }}>{icon}</span>}
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export default function ResearchPage() {
  const { t } = useLanguage();

  return (
    <div className={styles.pageModern}>
      <LanguageSwitcher />
      {/* Header */}
      <div className={styles.cvHeader}>
        <Link href="/" className={styles.backButton}>
          {t('back.to.home')}
        </Link>
        <h1 className={styles.cvTitle}>Research & Publications</h1>
        <div className={styles.cvSubtitle}>Eren Ege Çelik</div>
      </div>

      {/* Ongoing Research */}
      <ResearchSection title="Ongoing Research" icon="🔬">
        <div className={styles.experienceSection}>
          <div className={styles.experienceItem}>
            <div className={styles.experienceHeader}>
              <h3>Collatz Conjecture Analysis</h3>
              <span className={styles.experienceDate}>2024 - Present</span>
            </div>
            <div className={styles.experienceDetails}>
              <p>Independent research on the Collatz conjecture using computational approaches and mathematical analysis. Exploring patterns and potential proofs through algorithmic verification.</p>
              <ul>
                <li>Computational verification of sequences up to large numbers</li>
                <li>Pattern analysis and statistical approaches</li>
                <li>Development of new algorithmic approaches</li>
              </ul>
            </div>
          </div>

          <div className={styles.experienceItem}>
            <div className={styles.experienceHeader}>
              <h3>Reversible Computing & P vs NP</h3>
              <span className={styles.experienceDate}>2024 - Present</span>
            </div>
            <div className={styles.experienceDetails}>
              <p>Investigating the relationship between reversible computation and computational complexity theory, particularly focusing on the P vs NP problem.</p>
              <ul>
                <li>Reversible SAT circuit design and implementation</li>
                <li>Information-theoretic approaches to complexity</li>
                <li>SHA-256 logic design and cryptographic applications</li>
              </ul>
            </div>
          </div>

          <div className={styles.experienceItem}>
            <div className={styles.experienceHeader}>
              <h3>Micro Fundus Camera R&D</h3>
              <span className={styles.experienceDate}>2024 - Present</span>
            </div>
            <div className={styles.experienceDetails}>
              <p>Contributing to research and development of miniaturized retinal imaging devices, combining optics, physics, and artificial intelligence.</p>
              <ul>
                <li>Optical system design and optimization</li>
                <li>Physics-based modeling of light propagation</li>
                <li>AI integration for image processing and analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </ResearchSection>

      {/* Future Publications */}
      <ResearchSection title="Planned Publications" icon="📝">
        <div className={styles.projectsList}>
          <div className={styles.projectItem}>
            <h3 className={styles.projectTitle}>Computational Approaches to the Collatz Conjecture</h3>
            <p className={styles.projectDescription}>
              A comprehensive analysis of computational methods for investigating the Collatz conjecture, 
              including new algorithmic approaches and statistical analysis of sequence behaviors.
            </p>
            <p><strong>Status:</strong> In preparation</p>
          </div>

          <div className={styles.projectItem}>
            <h3 className={styles.projectTitle}>Reversible Logic Circuits for Cryptographic Applications</h3>
            <p className={styles.projectDescription}>
              Design and implementation of reversible logic circuits with applications to cryptography, 
              focusing on SHA-256 and other hash functions.
            </p>
            <p><strong>Status:</strong> Research phase</p>
          </div>

          <div className={styles.projectItem}>
            <h3 className={styles.projectTitle}>Information Theory and Computational Complexity</h3>
            <p className={styles.projectDescription}>
              Exploring the connections between information theory and computational complexity, 
              with particular focus on the P vs NP problem and reversible computation.
            </p>
            <p><strong>Status:</strong> Conceptual development</p>
          </div>
        </div>
      </ResearchSection>

      {/* Research Interests */}
      <ResearchSection title="Research Interests" icon="🎯">
        <div className={styles.tags}>
          <span className={styles.tag}>Collatz Conjecture</span>
          <span className={styles.tag}>P vs NP Problem</span>
          <span className={styles.tag}>Reversible Computing</span>
          <span className={styles.tag}>Quantum Physics</span>
          <span className={styles.tag}>Algorithm Analysis</span>
          <span className={styles.tag}>Cryptography</span>
          <span className={styles.tag}>Information Theory</span>
          <span className={styles.tag}>Computational Complexity</span>
          <span className={styles.tag}>Semiconductor Physics</span>
        </div>
      </ResearchSection>

      {/* Contact for Collaboration */}
      <ResearchSection title="Collaboration" icon="🤝">
        <div className={styles.personalInfo}>
          <p>
            I am always interested in collaborating on research projects related to theoretical physics, 
            mathematics, and computer science. If you have similar research interests or would like to 
            discuss potential collaborations, please feel free to reach out.
          </p>
          <div className={styles.infoGrid}>
            <div><strong>Email:</strong> <a href="mailto:erenegecelik62@gmail.com">erenegecelik62@gmail.com</a></div>
            <div><strong>GitHub:</strong> <a href="https://github.com/ErenEClk" target="_blank" rel="noopener noreferrer">github.com/ErenEClk</a></div>
          </div>
        </div>
      </ResearchSection>

      {/* Download CV */}
      <div className={styles.downloadSection}>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className={styles.downloadButton}>
          📄 Download Full CV
        </a>
      </div>
    </div>
  );
}
