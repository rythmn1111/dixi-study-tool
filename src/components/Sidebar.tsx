import { BookOpen, Zap } from 'lucide-react';
import type { Chapter } from '../types';

interface Props {
  chapters: Chapter[];
  selectedChapterId: string;
  readSections: Set<string>;
  onSelectChapter: (id: string) => void;
  onQuizAll: () => void;
}

function ChapterProgress({ chapter, readSections }: { chapter: Chapter; readSections: Set<string> }) {
  const total = chapter.sections.length;
  const done = chapter.sections.filter(s => readSections.has(s.id)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: chapter.color }}
        />
      </div>
      <span className="text-xs text-slate-600">{done}/{total}</span>
    </div>
  );
}

export function Sidebar({ chapters, selectedChapterId, readSections, onSelectChapter, onQuizAll }: Props) {
  const totalSections = chapters.reduce((sum, c) => sum + c.sections.length, 0);
  const totalRead = readSections.size;
  const overallPct = Math.round((totalRead / totalSections) * 100);

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg">
            📚
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">Dixit's Interview Prep</div>
            <div className="text-xs text-slate-500">Resume Deep Study</div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-slate-900 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 font-medium">Overall Progress</span>
            <span className="text-xs font-bold" style={{ color: '#818cf8' }}>{overallPct}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${overallPct}%`,
                background: 'linear-gradient(90deg, #818cf8, #c084fc)',
              }}
            />
          </div>
          <div className="text-xs text-slate-600 mt-1">{totalRead} / {totalSections} sections read</div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        {chapters.map((chapter) => {
          const isSelected = chapter.id === selectedChapterId;
          return (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-all duration-200 group ${
                isSelected
                  ? 'bg-slate-800'
                  : 'hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ backgroundColor: `${chapter.color}22`, border: `1px solid ${chapter.color}44` }}
                >
                  {chapter.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                      {chapter.title}
                    </span>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `${chapter.color}22`, color: chapter.color }}
                    >
                      {chapter.number}
                    </span>
                  </div>
                  <ChapterProgress chapter={chapter} readSections={readSections} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quiz button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onQuizAll}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          <Zap size={15} />
          Quiz Me
        </button>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500 justify-center">
          <BookOpen size={12} />
          <span>{chapters.length} chapters · {totalSections} sections</span>
        </div>
      </div>
    </div>
  );
}
