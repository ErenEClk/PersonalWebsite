"use client";
import { useLanguage } from '../contexts/LanguageContext';
import styles from '../page.module.css';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={`${styles.langButton} ${language === 'tr' ? styles.langButtonActive : ''}`}
        onClick={() => setLanguage('tr')}
      >
        TR
      </button>
      <span className={styles.langSeparator}>|</span>
      <button
        className={`${styles.langButton} ${language === 'en' ? styles.langButtonActive : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
} 