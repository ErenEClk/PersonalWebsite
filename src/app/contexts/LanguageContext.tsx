"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Çeviri verileri
const translations = {
  tr: {
    // Ana Sayfa
    'about': 'Hakkımda',
    'interests': 'İlgi Alanları',
    'projects': 'Projeler',
    'certificates': 'Sertifikalar',
    'languages': 'Konuşulan Diller',
    'projects.coming.soon': 'Projeler bölümü yakında güncellenecek...',
    
    // Projeler
    'project.1.title': 'Micro Fundus Camera Ar-Ge',
    'project.1.description': 'Minyatürleştirilmiş retina görüntüleme cihazları üzerine araştırma ve geliştirme projesine katkıda bulunmaya başladım. Optik, fizik ve yapay zeka alanlarını birleştiriyor.',
    'project.2.title': 'Teorik Matematik Araştırması',
    'project.2.description': 'Collatz konjektürü, tersinir hesaplama ve P vs NP gibi problemleri mantık ve bilgi teorisini birleştirerek bağımsız olarak araştırıyorum.',
    'project.3.title': 'Mobil ve Web Uygulama Geliştirme',
    'project.3.description': 'Kişisel ve işbirlikçi kullanım için mobil uygulamalar ve web siteleri geliştirdim. Kullanıcı deneyimi ve sistem mantığına odaklanıyorum.',
    'detailed.cv': 'Detaylı CV',
    'cv.pdf': 'CV (PDF)',
    
    // Hakkımda metni
    'about.text': 'İzmir Yüksek Teknoloji Enstitüsü (İYTE) Fizik bölümü birinci sınıf öğrencisiyim ve hem teorik hem de uygulamalı fizik ile kuantum hesaplama konularında güçlü bir tutkuya sahibim. Akademik ilgi alanlarım Collatz konjektürü, P vs NP, tersinir hesaplama ve bilgi teorisinin fizik ve bilgisayar bilimi ile entegrasyonu gibi temel problemler etrafında şekilleniyor. C, C# ve Python dillerinde yetkinim ve birçok mobil uygulama ve website geliştirdim, bu da full-stack geliştirme ve kullanıcı odaklı tasarım becerilerimi güçlendirdi. Ayrıca tersinir mantık ve kriptografik sistemleri içeren bir proje dahil olmak üzere bağımsız araştırma projeleri yürüttüm ve bilgiyi koruyan yeni hesaplama modellerini keşfetmeyi hedefliyorum. Yakın zamanda Almanya\'da bir yarı iletken şirketinde staj yaptım ve burada çip üretim teknolojilerinde hands-on deneyim kazandım. Hedefim, bilim ve teknolojinin öncüsü olan disiplinler arası ekiplerle işbirliği yaparak kuantum hesaplama ve hesaplamalı fizik alanında öncü araştırmalara katkıda bulunmaktır.',
    
    // ProfileCard kısa özet
    'profile.short.bio': 'İYTE Fizik birinci sınıf öğrencisi. Kuantum hesaplama ve hesaplamalı fizik alanında öncü araştırmalara katkıda bulunmayı hedefliyorum.',
    
    // CV Sayfası
    'cv.title': 'Özgeçmiş',
    'back.to.home': '← Ana Sayfa',
    'personal.info': 'Kişisel Bilgiler',
    'education': 'Eğitim',
    'experience': 'İş Deneyimi',
    'skills': 'Teknik Beceriler',
    'download.full.cv': 'Tam CV\'yi PDF Olarak İndir',
    
    // CV Detayları
    'cv.name': 'Ad Soyad',
    'cv.email': 'E-posta',
    'cv.phone': 'Telefon',
    'cv.department': 'Bölüm',
    'cv.class': 'Sınıf',
    'cv.focus.areas': 'Odak Alanları',
    'cv.transcript.download': 'Transkript İndir',
    'cv.courses.taken': 'Alınan Dersler',
    'cv.course': 'Ders',
    'cv.status': 'Durum',
    'cv.successfully.completed': 'Başarıyla tamamlandı',
    'cv.description': 'Açıklama',
    'cv.kadir.has.summer': 'Kadir Has Üniversitesi - Yaz Okulu',
    'cv.12th.grade.summer': '12. Sınıf Yaz',
    'cv.kadir.has.description': 'Lise eğitimi sırasında üniversite düzeyinde dersler alarak akademik gelişimi destekleme',
    'cv.course.1.certificate': 'Augmented Electricity and Magnetism',
    'cv.course.2.certificate': 'Augmented Mechanics',
    'cv.ap.courses': 'Advanced Placement (AP) Dersleri',
    'cv.high.school.period': 'Lise Dönemi',
    'cv.program': 'Program',
    'cv.ap.description': 'Lise düzeyinde üniversite kredili dersler alarak akademik mükemmellik gösterme',
    'cv.ap.score.report': 'AP Skor Raporu İndir',
    'cv.ap.awards': 'AP Ödülleri İndir',
    'cv.high.school.education': 'Lise Eğitimi',
    'cv.graduation': 'Mezuniyet',
    'cv.special.achievements': 'Özel Başarılar',
    'cv.high.school.achievements': 'AP dersleri, 11. sınıfta üniversite yaz okulu, 12. sınıfta staj deneyimi',
    'cv.diploma.download': 'Diploma İndir',
    'cv.internship.title': 'Stajyer - Yarı İletken Teknolojileri',
    'cv.germany': 'Almanya',
    'cv.12th.grade.break': '12. Sınıf Ara Tatil',
    'cv.period': 'Dönem',
    'cv.internship.period': 'Lise son sınıf ara tatil dönemi',
    'cv.duties': 'Görevler',
    'cv.duty.1': 'Çip üretim süreçlerinde hands-on deneyim kazanma',
    'cv.duty.2': 'Yarı iletken teknolojilerinde araştırma ve gözlem',
    'cv.duty.3': 'Uygulamalı fizik ve teknoloji entegrasyonu öğrenme',
    'cv.duty.4': 'Uluslararası çalışma ortamında deneyim kazanma',
    'cv.duty.5': 'Alman iş kültürü ve teknik terminoloji öğrenme',
    'cv.achievements': 'Kazanımlar',
    'cv.internship.achievements': 'Teorik fizik bilgilerini endüstriyel uygulamalarla birleştirme, teknoloji sektöründe kariyer planlaması',
    'cv.internship.certificate': 'Staj Belgesi İndir',
    'cv.programming.languages': 'Programlama Dilleri',
    'cv.other.languages': 'Diğer diller',
    'cv.technologies.tools': 'Teknolojiler & Araçlar',
    'cv.other.tools': 'Diğer araçlar',
    'cv.academic.fields': 'Akademik Alanlar',
    'cv.theoretical.physics': 'Teorik Fizik',
    'cv.algorithm.analysis': 'Algoritma Analizi',
    'cv.quantum.computing': 'Kuantum Hesaplama',
    'cv.institution': 'Kurum',
    'cv.year': 'Yıl',
    'cv.score': 'Skor',
    'cv.certificate.download': 'Sertifika İndir',
    'cv.language.skills': 'Dil Becerileri',
    'cv.turkish': 'Türkçe',
    'cv.native': 'Ana Dil',
    'cv.english': 'İngilizce',
    'cv.advanced': 'İleri Seviye',
    'cv.german': 'Almanca',
    'cv.beginner': 'Başlangıç',
    
    // Eğitim
    'education.iztech': 'İzmir Yüksek Teknoloji Enstitüsü (İYTE)',
    'education.physics': 'Fizik (Lisans)',
    'education.first.year': '1. Sınıf',
    'education.continuing': 'Devam Ediyor',
    'education.focus.areas': 'Teorik Fizik, Matematik, Bilgisayar Bilimi',
    
    // İlgi Alanları
    'interest.collatz': 'Collatz Konjektürü',
    'interest.p.vs.np': 'P vs NP Problemi',
    'interest.reversible': 'Tersinir Hesaplama',
    'interest.quantum': 'Kuantum Fiziği',
    'interest.algorithms': 'Algoritma Analizi',
    'interest.crypto': 'SHA-256 & Kriptografi',
    'interest.semiconductor': 'Yarıiletken Teknolojisi',
    
    // Diller
    'lang.turkish': 'Türkçe (Ana dil)',
    'lang.english': 'İngilizce (İleri seviye)',
    'lang.german': 'Almanca (Başlangıç)',
  },
  en: {
    // Main Page
    'about': 'About',
    'interests': 'Interests',
    'projects': 'Projects',
    'certificates': 'Certificates',
    'languages': 'Languages',
    'projects.coming.soon': 'Projects section will be updated soon...',
    
    // Projects
    'project.1.title': 'Micro Fundus Camera R&D',
    'project.1.description': 'Recently started contributing to a research and development project focused on miniaturized retinal imaging devices, combining optics, physics, and AI.',
    'project.2.title': 'Theoretical Math Research',
    'project.2.description': 'Independently exploring problems such as the Collatz conjecture, reversible computation, and P vs NP through combining logic and information theory.',
    'project.3.title': 'Mobile & Web App Development',
    'project.3.description': 'Created mobile apps and websites for personal and collaborative use, with emphasis on user experience and system logic.',
    'detailed.cv': 'Detailed CV',
    'cv.pdf': 'CV (PDF)',
    
    // About text
          'about.text': 'I am a first-year Physics student at İzmir Institute of Technology (İZTECH), with a strong passion for both theoretical and applied physics, as well as quantum computing. My academic interests revolve around foundational problems such as the Collatz conjecture, P vs NP, reversible computation, and the integration of information theory with physics and computer science. I am proficient in C, C#, and Python, and have developed several mobile applications and websites, which have strengthened my skills in full-stack development and user-focused design. I have also conducted independent research projects, including one involving reversible logic and cryptographic systems, aiming to explore new models of computation that preserve information. Recently, I completed an internship at a semiconductor company in Germany, where I gained hands-on experience in chip manufacturing technologies. My goal is to contribute to pioneering research in quantum computing and computational physics by collaborating with interdisciplinary teams working at the cutting edge of science and technology.',
      
      // ProfileCard short bio
      'profile.short.bio': 'First-year Physics student at İZTECH. Aiming to contribute to pioneering research in quantum computing and computational physics.',
    
    // CV Page
    'cv.title': 'Curriculum Vitae',
    'back.to.home': '← Home',
    'personal.info': 'Personal Information',
    'education': 'Education',
    'experience': 'Work Experience',
    'skills': 'Technical Skills',
    'download.full.cv': 'Download Full CV as PDF',
    
    // CV Details
    'cv.name': 'Name',
    'cv.email': 'Email',
    'cv.phone': 'Phone',
    'cv.department': 'Department',
    'cv.class': 'Year',
    'cv.focus.areas': 'Focus Areas',
    'cv.transcript.download': 'Download Transcript',
    'cv.courses.taken': 'Courses Taken',
    'cv.course': 'Course',
    'cv.status': 'Status',
    'cv.successfully.completed': 'Successfully Completed',
    'cv.description': 'Description',
    'cv.kadir.has.summer': 'Kadir Has University - Summer School',
    'cv.12th.grade.summer': '12th Grade Summer',
    'cv.kadir.has.description': 'Taking university-level courses during high school to support academic development',
    'cv.course.1.certificate': 'Augmented Electricity and Magnetism',
    'cv.course.2.certificate': 'Augmented Mechanics',
    'cv.ap.courses': 'Advanced Placement (AP) Courses',
    'cv.high.school.period': 'High School Period',
    'cv.program': 'Program',
    'cv.ap.description': 'Taking university-credit courses at high school level to demonstrate academic excellence',
    'cv.ap.score.report': 'Download AP Score Report',
    'cv.ap.awards': 'Download AP Awards',
    'cv.high.school.education': 'High School Education',
    'cv.graduation': 'Graduation',
    'cv.special.achievements': 'Special Achievements',
    'cv.high.school.achievements': 'AP courses, university summer school in 11th grade, internship in 12th grade',
    'cv.diploma.download': 'Download Diploma',
    'cv.internship.title': 'Intern - Semiconductor Technologies',
    'cv.germany': 'Germany',
    'cv.12th.grade.break': '12th Grade Break',
    'cv.period': 'Period',
    'cv.internship.period': 'Senior year break period',
    'cv.duties': 'Duties',
    'cv.duty.1': 'Gaining hands-on experience in chip production processes',
    'cv.duty.2': 'Research and observation in semiconductor technologies',
    'cv.duty.3': 'Learning applied physics and technology integration',
    'cv.duty.4': 'Gaining experience in international work environment',
    'cv.duty.5': 'Learning German work culture and technical terminology',
    'cv.achievements': 'Achievements',
    'cv.internship.achievements': 'Combining theoretical physics knowledge with industrial applications, career planning in technology sector',
    'cv.internship.certificate': 'Download Internship Certificate',
    'cv.programming.languages': 'Programming Languages',
    'cv.other.languages': 'Other languages',
    'cv.technologies.tools': 'Technologies & Tools',
    'cv.other.tools': 'Other tools',
    'cv.academic.fields': 'Academic Fields',
    'cv.theoretical.physics': 'Theoretical Physics',
    'cv.algorithm.analysis': 'Algorithm Analysis',
    'cv.quantum.computing': 'Quantum Computing',
    'cv.institution': 'Institution',
    'cv.year': 'Year',
    'cv.score': 'Score',
    'cv.certificate.download': 'Download Certificate',
    'cv.language.skills': 'Language Skills',
    'cv.turkish': 'Turkish',
    'cv.native': 'Native',
    'cv.english': 'English',
    'cv.advanced': 'Advanced',
    'cv.german': 'German',
    'cv.beginner': 'Beginner',
    
    // Education
    'education.iztech': 'Izmir Institute of Technology (IZTECH)',
    'education.physics': 'Physics (Bachelor)',
    'education.first.year': '1st Year',
    'education.continuing': 'Ongoing',
    'education.focus.areas': 'Theoretical Physics, Mathematics, Computer Science',
    
          // Interests
      'interest.collatz': 'Collatz Conjecture',
      'interest.p.vs.np': 'P vs NP Problem',
      'interest.reversible': 'Reversible Computing',
      'interest.quantum': 'Quantum Physics',
      'interest.algorithms': 'Algorithm Analysis',
      'interest.crypto': 'SHA-256 & Cryptography',
      'interest.semiconductor': 'Semiconductor Technology',
    
    // Languages
    'lang.turkish': 'Turkish (Native)',
    'lang.english': 'English (Advanced)',
    'lang.german': 'German (Beginner)',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['tr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 