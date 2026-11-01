import { useEffect, useRef } from 'react';
import { AudioPlayer } from './components/AudioPlayer';
import { BackToTop } from './components/BackToTop';
import { ChapterBar, ChapterPager } from './components/ChapterChrome';
import { ChapterGrid } from './components/ChapterGrid';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatsBand } from './components/StatsBand';
import { chapters } from './content/chapters';
import { LangProvider, useLang } from './i18n/LangContext';
import { useRoute } from './lib/router';
import { TtsProvider, useTts } from './lib/TtsContext';
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

const chapterViews = [
  Chapter01, Chapter02, Chapter03, Chapter04, Chapter05, Chapter06, Chapter07,
  Chapter08, Chapter09, Chapter10, Chapter11, Chapter12, Chapter13, Chapter14,
];

const SITE_TITLE = 'Agent Loop Engineering · 智能体循环工程实战指南';

function chapterOf(id: string) {
  const index = chapters.findIndex((chapter) => chapter.id === id);
  return index >= 0 ? { meta: chapters[index], View: chapterViews[index] } : undefined;
}

function Site() {
  const { lang, t } = useLang();
  const route = useRoute();
  const tts = useTts();
  const ttsRef = useRef(tts);
  ttsRef.current = tts;

  const routeId = route.view === 'chapter' ? route.id : null;
  const chapter = routeId ? chapterOf(routeId) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);

    const current = ttsRef.current;
    const live = current.status === 'playing' || current.status === 'paused' || current.status === 'loading';
    if (live && routeId !== current.chapterId) current.stop();
  }, [routeId]);

  useEffect(() => {
    const meta = routeId ? chapterOf(routeId)?.meta : undefined;
    document.title = meta ? `${meta.title[lang]} · ${t(`第 ${meta.num} 章`, `CH ${meta.num}`)} — Agent Loop Engineering` : SITE_TITLE;
  }, [routeId, lang, t]);

  return (
    <div
      className={`min-h-screen bg-[var(--bg)] ${chapter ? 'lg:pl-[306px]' : ''}`}
      style={tts.open ? { paddingBottom: 'calc(var(--player-h, 0px) + 24px)' } : undefined}
    >
      <Navbar activeId={routeId ?? ''} />
      {chapter && routeId && <Sidebar activeId={routeId} />}

      <div className="pt-[68px]">
        <main>
          {chapter && routeId ? (
            <div className="container-x">
              <div key={`${lang}-${routeId}`} className="lang-fade mx-auto max-w-[980px]">
                <ChapterBar id={routeId} />
                <chapter.View />
                <ChapterPager id={routeId} />
              </div>
            </div>
          ) : (
            <>
              <Hero />
              <StatsBand />
              <ChapterGrid />
            </>
          )}
        </main>

        <div className="container-x">
          <Footer />
        </div>
      </div>

      <AudioPlayer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <TtsProvider>
        <Site />
      </TtsProvider>
    </LangProvider>
  );
}
