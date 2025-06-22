"use client";
// import Image from "next/image";
import styles from "./page.module.css";
import ProfileCard from "./ProfileCard";
import SectionCard from "./SectionCard";
import DoubleSlit from "./DoubleSlit";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useLanguage } from './contexts/LanguageContext';

const profile = {
  name: "Eren Ege Çelik",
  bio: `I am a first-year Physics student at İzmir Institute of Technology (İZTECH), with a strong interest in mathematics, logic, and computer science. I am particularly passionate about theoretical problems such as the Collatz conjecture, P vs NP, and reversible computing, and I aim to develop new mathematical frameworks by integrating principles from information theory and computation. I have built solid skills in analytical thinking, problem-solving, and programming—especially in C—and have independently explored topics like reversible SAT circuits and SHA-256 logic design. Recently, I completed an internship at a semiconductor company in Germany, where I gained hands-on experience in chip production and deepened my understanding of applied physics and technology. My goal is to contribute to cutting-edge research in computational physics or theoretical computer science, and to work with innovative teams that tackle complex scientific challenges through creativity and rigorous logic.`,
  github: "https://github.com/ErenEClk",
  cv: "/cv.pdf",
  photo: "/profile.JPG",
};

export default function Home() {
  const { t } = useLanguage();

  const interests = [
    t('interest.math'),
    t('interest.logic'), 
    t('interest.cs'),
    t('interest.quantum'),
    t('interest.physics'),
    t('interest.reversible'),
    t('interest.crypto')
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

  // const projects = [
  //   // Projeler geçici olarak kaldırıldı - yakında güncellenecek
  // ];

  return (
    <div className={styles.pageModern}>
      <LanguageSwitcher />
      <DoubleSlit />
      <ProfileCard profile={profile} />
      <SectionCard title={t('about')}>
        <p>{t('about.text')}</p>
      </SectionCard>
      <SectionCard title={t('interests')}>
        <ul className={styles.tags}>{interests.map((i) => <li key={i}>{i}</li>)}</ul>
      </SectionCard>
      <SectionCard title={t('projects')}>
        <p style={{ color: "#e0e6ed", fontStyle: "italic" }}>
          {t('projects.coming.soon')}
        </p>
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
