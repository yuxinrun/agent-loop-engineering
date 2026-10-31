import { BackToTop } from './components/BackToTop';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatsBand } from './components/StatsBand';
import { chapterIds } from './content/chapters';
import { LangProvider, useLang } from './i18n/LangContext';
import { useActiveSection } from './lib/hooks';
import { Chapter01 } from './sections/Chapter01';
import { Chapter02 } from './sections/Chapter02';
import { Chapter03 } from './sections/Chapter03';
import { Chapter04 } from './sections/Chapter04';
import { Chapter05 } from './sections/Chapter05';
import { Chapter06 } from './sections/Chapter06';
import { Chapter07 } from './sections/Chapter07';
import { Chapter08 } from './sections/Chapter08';
import { Chapter09 } from './sections/Chapter09';
import { Chapter10 } from './sections/Chapter10';
import { Chapter11 } from './sections/Chapter11';
import { Chapter12 } from './sections/Chapter12';
import { Chapter13 } from './sections/Chapter13';
import { Chapter14 } from './sections/Chapter14';

function Site() {
  const { lang } = useLang();
  const activeId = useActiveSection(chapterIds);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar activeId={activeId} />
      <Sidebar activeId={activeId} />

      <div className="pt-16 lg:pl-[260px]">
        <main>
          <Hero />
          <StatsBand />

          <div className="container-x pb-8">
            <div key={lang} className="lang-fade">
              <Chapter01 />
              <Chapter02 />
              <Chapter03 />
              <Chapter04 />
              <Chapter05 />
              <Chapter06 />
              <Chapter07 />
              <Chapter08 />
              <Chapter09 />
              <Chapter10 />
              <Chapter11 />
              <Chapter12 />
              <Chapter13 />
              <Chapter14 />
            </div>
          </div>
        </main>

        <div className="container-x">
          <Footer />
        </div>
      </div>

      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  );
}
