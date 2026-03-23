import { BookOpen, Target, Zap } from 'lucide-react';
import type { Chapter } from '../types';

interface Props {
  chapters: Chapter[];
  readSections: Set<string>;
  onSelectChapter: (id: string) => void;
  onQuizAll: () => void;
}

export function HomeView({ chapters, readSections, onSelectChapter, onQuizAll }: Props) {
  const totalSections = chapters.reduce((s, c) => s + c.sections.length, 0);
  const totalRead = readSections.size;
  const overallPct = Math.round((totalRead / totalSections) * 100);
  const totalQs = chapters.reduce((s, c) => s + c.sections.reduce((ss, sec) => ss + sec.interviewQs.length, 0), 0);

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Hero */}
      <div className="rounded-2xl p-8 mb-8 text-center"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid #3730a3' }}>
        <div className="text-5xl mb-4">🎯</div>
        <h1 className="text-3xl font-extrabold mb-2 gradient-text">Interview Prep — Dixit's Resume</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Everything on your resume, explained from scratch. Built for someone who needs to actually know this stuff before the interview.
        </p>
        <div className="flex justify-center gap-8 mb-6">
          <div>
            <div className="text-2xl font-extrabold text-slate-100">{chapters.length}</div>
            <div className="text-xs text-slate-500">Chapters</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-100">{totalSections}</div>
            <div className="text-xs text-slate-500">Sections</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-100">{totalQs}</div>
            <div className="text-xs text-slate-500">Interview Q&As</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold" style={{ color: overallPct > 0 ? '#818cf8' : '#475569' }}>
              {overallPct}%
            </div>
            <div className="text-xs text-slate-500">Complete</div>
          </div>
        </div>
        <button
          onClick={onQuizAll}
          className="inline-flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          <Zap size={15} />
          Start Full Quiz ({totalQs} questions)
        </button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: <BookOpen size={16} />, title: 'Deep Content', desc: 'Real explanations you can actually use in interviews' },
          { icon: <Target size={16} />, title: 'Interview Q&As', desc: 'Common questions with full model answers' },
          { icon: <Zap size={16} />, title: 'Flashcard Quiz', desc: 'Test yourself with spaced repetition cards' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-indigo-400 mb-2">{item.icon}</div>
            <div className="text-sm font-bold text-slate-200 mb-1">{item.title}</div>
            <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Chapter grid */}
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">All Chapters</h2>
      <div className="grid grid-cols-2 gap-3">
        {chapters.map((chapter) => {
          const done = chapter.sections.filter(s => readSections.has(s.id)).length;
          const pct = chapter.sections.length > 0 ? Math.round((done / chapter.sections.length) * 100) : 0;
          return (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className="text-left p-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 transition-all duration-200 hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{chapter.icon}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${chapter.color}20`, color: chapter.color }}
                >
                  Ch. {chapter.number}
                </span>
              </div>
              <div className="text-sm font-semibold text-slate-200 mb-1 leading-snug">{chapter.title}</div>
              <div className="text-xs text-slate-500 mb-3">{chapter.tag}</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: chapter.color }}
                  />
                </div>
                <span className="text-xs text-slate-600">{done}/{chapter.sections.length}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
