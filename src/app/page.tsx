"use client";
// import Image from "next/image";
import styles from "./page.module.css";
import ProfileCard from "./ProfileCard";
import SectionCard from "./SectionCard";
import DoubleSlit from "./DoubleSlit";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useLanguage } from './contexts/LanguageContext';
import { useState, useEffect } from 'react';

const profile = {
  name: "Eren Ege Çelik",
  bio: `I am a second-year Physics student at Middle East Technical University (METU), having transferred from İzmir Institute of Technology (İZTECH) where I completed my first year with a 3.56 GPA. I have a strong interest in mathematics, logic, and computer science, particularly in theoretical problems such as the Collatz conjecture, P vs NP, and reversible computing. I aim to develop new mathematical frameworks by integrating principles from information theory and computation. I have built solid skills in analytical thinking, problem-solving, and programming—especially in C—and have independently explored topics like reversible SAT circuits and SHA-256 logic design. Recently, I completed an internship at a semiconductor company in Germany, where I gained hands-on experience in chip production and deepened my understanding of applied physics and technology. My goal is to contribute to cutting-edge research in computational physics or theoretical computer science, and to work with innovative teams that tackle complex scientific challenges through creativity and rigorous logic.`,
  github: "https://github.com/ErenEClk",
  cv: "/cv.pdf",
  photo: "/IMG_0367.jpg",
};

export default function Home() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const interests = [
    t('interest.collatz'),
    t('interest.p.vs.np'), 
    t('interest.reversible'),
    t('interest.quantum'),
    t('interest.algorithms'),
    t('interest.crypto'),
    t('interest.semiconductor')
  ];

  const languages = [
    t('lang.turkish'),
    t('lang.english'),
    t('lang.german')
  ];

  const certificates = [
    { title: "TOEFL IBT", issuer: "ETS", year: 2024 },
    { title: "Advanced Placement (AP) Awards", issuer: "College Board", year: "Lise" },
    { title: "Augmented Electricity and Magnetism", issuer: "Kadir Has Üniversitesi", year: 2023 },
    { title: "Augmented Mechanics", issuer: "Kadir Has Üniversitesi", year: 2023 },
  ];

  const projects = [
    {
      title: t('project.1.title'),
      description: t('project.1.description')
    },
    {
      title: t('project.2.title'),
      description: t('project.2.description')
    },
    {
      title: t('project.3.title'),
      description: t('project.3.description')
    }
  ];

  return (
    <div className={styles.pageModern}>
      <LanguageSwitcher />
      {!isMobile && <DoubleSlit />}
      <ProfileCard profile={profile} />
      <SectionCard title={t('about')}>
        <p>{t('about.text')}</p>
      </SectionCard>
      <SectionCard title={t('interests')}>
        <ul className={styles.tags}>{interests.map((i) => <li key={i}>{i}</li>)}</ul>
      </SectionCard>
      <SectionCard title={t('projects')}>
        <div className={styles.projectsList}>
          {projects.map((project, index) => (
            <div key={index} className={styles.projectItem}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title={t('certificates')}>
        <ul>{certificates.map((c) => <li key={c.title}>{c.title} - {c.issuer} ({c.year})</li>)}</ul>
      </SectionCard>
      <SectionCard title={t('languages')}>
        <ul>{languages.map((l) => <li key={l}>{l}</li>)}</ul>
      </SectionCard>
    </div>
  );
}
