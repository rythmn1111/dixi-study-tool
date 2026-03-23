import { useState, useCallback } from 'react';
import { Home } from 'lucide-react';
import { chapters } from './data/content';
import { Sidebar } from './components/Sidebar';
import { ChapterView } from './components/ChapterView';
import { QuizModal } from './components/QuizModal';
import { HomeView } from './components/HomeView';
import type { Section } from './types';

function App() {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [readSections, setReadSections] = useState<Set<string>>(new Set());
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizSection, setQuizSection] = useState<Section | null>(null);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId) ?? null;

  const handleMarkRead = useCallback((sectionId: string) => {
    setReadSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const handleQuizSection = useCallback((section: Section) => {
    if (section.interviewQs.length === 0) return;
    setQuizSection(section);
    setQuizOpen(true);
  }, []);

  const handleQuizAll = useCallback(() => {
    setQuizSection(null);
    setQuizOpen(true);
  }, []);

  const handleSelectChapter = useCallback((id: string) => {
    setSelectedChapterId(id);
    // scroll main to top
    const el = document.querySelector('.main-content');
    if (el) el.scrollTop = 0;
  }, []);

  return (
    <div>
      <Sidebar
        chapters={chapters}
        selectedChapterId={selectedChapterId ?? ''}
        readSections={readSections}
        onSelectChapter={handleSelectChapter}
        onQuizAll={handleQuizAll}
      />

      <main className="main-content">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur border-b border-slate-800/60 px-8 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedChapterId(null)}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Home size={13} />
            Home
          </button>
          {selectedChapter && (
            <>
              <span className="text-slate-700">/</span>
              <span className="text-xs text-slate-400">{selectedChapter.icon} {selectedChapter.title}</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {/* Mini progress */}
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((readSections.size / chapters.reduce((s, c) => s + c.sections.length, 0)) * 100)}%`,
                    background: 'linear-gradient(90deg, #818cf8, #c084fc)',
                  }}
                />
              </div>
              <span className="text-xs text-slate-500">
                {Math.round((readSections.size / chapters.reduce((s, c) => s + c.sections.length, 0)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {selectedChapter ? (
          <ChapterView
            chapter={selectedChapter}
            readSections={readSections}
            onMarkRead={handleMarkRead}
            onQuizSection={handleQuizSection}
          />
        ) : (
          <HomeView
            chapters={chapters}
            readSections={readSections}
            onSelectChapter={handleSelectChapter}
            onQuizAll={handleQuizAll}
          />
        )}
      </main>

      {quizOpen && (
        <QuizModal
          chapters={chapters}
          initialSection={quizSection}
          onClose={() => { setQuizOpen(false); setQuizSection(null); }}
        />
      )}
    </div>
  );
}

export default App;
