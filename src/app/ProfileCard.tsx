"use client";
import Image from "next/image";
import styles from "./page.module.css";
import CanvasThreeBody from "./CanvasThreeBody";
import TypingEffect from "./TypingEffect";
import { useLanguage } from './contexts/LanguageContext';

interface ProfileProps {
  name: string;
  bio: string;
  github: string;
  cv: string;
  photo: string;
}

export default function ProfileCard({ profile }: { profile: ProfileProps }) {
  const { t } = useLanguage();

  return (
    <div className={styles.profileCard}>
      <CanvasThreeBody />
      <div className={styles.profileCardContent}>
        <div className={styles.profilePhotoCol}>
          <Image src={profile.photo} alt="Profil Fotoğrafı" width={120} height={120} className={styles.profilePhotoModern} />
        </div>
        <div className={styles.profileInfoCol}>
          <h1 className={styles.profileName}>
            <TypingEffect text={profile.name} />
          </h1>
          <div className={styles.profileLinks}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/cv">{t('detailed.cv')}</a>
            <a href={profile.cv} target="_blank" rel="noopener noreferrer">{t('cv.pdf')}</a>
            <a href="/research">{t('research.publications')}</a>
          </div>
          <p className={styles.profileBioShort}>{t('profile.short.bio')}</p>
        </div>
      </div>
    </div>
  );
} 