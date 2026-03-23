import { useState, useCallback } from 'react';
import { X, RotateCcw, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import type { Chapter, Section } from '../types';

interface QuizCard {
  q: string;
  a: string;
  chapterTitle: string;
  chapterColor: string;
  chapterIcon: string;
}

interface Props {
  chapters: Chapter[];
  initialSection?: Section | null;
  onClose: () => void;
}

function buildCards(chapters: Chapter[], section?: Section | null): QuizCard[] {
  if (section) {
    const chapter = chapters.find(c => c.sections.some(s => s.id === section.id));
    return section.interviewQs.map(qa => ({
      q: qa.q,
      a: qa.a,
      chapterTitle: chapter?.title ?? '',
      chapterColor: chapter?.color ?? '#818cf8',
      chapterIcon: chapter?.icon ?? '📚',
    }));
  }
  const cards: QuizCard[] = [];
  for (const chapter of chapters) {
    for (const sec of chapter.sections) {
      for (const qa of sec.interviewQs) {
        cards.push({ q: qa.q, a: qa.a, chapterTitle: chapter.title, chapterColor: chapter.color, chapterIcon: chapter.icon });
      }
    }
  }
  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function QuizModal({ chapters, initialSection, onClose }: Props) {
  const [cards] = useState<QuizCard[]>(() => buildCards(chapters, initialSection));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<('good' | 'again')[]>([]);

  const card = cards[idx];
  const total = cards.length;
  const done = results.length;

  const next = useCallback((result: 'good' | 'again') => {
    setResults(r => [...r, result]);
    setFlipped(false);
    setTimeout(() => setIdx(i => i + 1), 200);
  }, []);

  const restart = useCallback(() => {
    setIdx(0);
    setFlipped(false);
    setResults([]);
  }, []);

  const good = results.filter(r => r === 'good').length;
  const pct = total > 0 ? Math.round((good / total) * 100) : 0;

  if (!card) {
    // Results screen
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
          <h2 className="text-2xl font-extrabold text-slate-50 mb-1">Session Complete</h2>
          <p className="text-slate-400 text-sm mb-6">You answered {total} interview questions</p>

          <div className="bg-slate-800 rounded-2xl p-6 mb-6">
            <div className="text-5xl font-extrabold mb-1" style={{ color: pct >= 70 ? '#4ade80' : '#f87171' }}>{pct}%</div>
            <div className="text-sm text-slate-400">Confidence Score</div>
            <div className="flex justify-center gap-8 mt-4 text-sm">
              <div>
                <div className="text-green-400 font-bold text-lg">{good}</div>
                <div className="text-slate-500 text-xs">Got it</div>
              </div>
              <div>
                <div className="text-red-400 font-bold text-lg">{total - good}</div>
                <div className="text-slate-500 text-xs">Study more</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={restart}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-sm transition-colors"
            >
              <RotateCcw size={14} />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-lg">{card.chapterIcon}</span>
            <div>
              <div className="text-xs text-slate-500">{card.chapterTitle}</div>
              <div className="text-xs font-semibold text-slate-300">
                Card {idx + 1} of {total}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((idx) / total) * 100}%`,
              backgroundColor: card.chapterColor,
            }}
          />
        </div>

        {/* Card */}
        <div className="p-6">
          <div className="flip-card" onClick={() => setFlipped(f => !f)}>
            <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div
                className="flip-card-front"
                style={{
                  background: `linear-gradient(135deg, ${card.chapterColor}20 0%, ${card.chapterColor}08 100%)`,
                  border: `1px solid ${card.chapterColor}30`,
                }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: card.chapterColor }}
                >
                  Question
                </div>
                <p className="text-slate-100 font-semibold text-lg leading-snug">{card.q}</p>
                <div className="mt-auto pt-4 text-xs text-slate-500">Click to reveal answer →</div>
              </div>

              {/* Back */}
              <div className="flip-card-back bg-slate-800 border border-slate-700">
                <div className="text-xs font-bold uppercase tracking-widest mb-3 text-emerald-400">Answer</div>
                <p className="text-slate-300 text-sm leading-relaxed overflow-y-auto">{card.a}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {flipped ? (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => next('again')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-semibold text-sm transition-all"
              >
                <XCircle size={15} />
                Study More
              </button>
              <button
                onClick={() => next('good')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl font-semibold text-sm transition-all"
              >
                <CheckCircle size={15} />
                Got It
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => { if (idx > 0) { setIdx(i => i - 1); setFlipped(false); } }}
                disabled={idx === 0}
                className="p-2 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-500">Click card to flip</span>
              <button
                onClick={() => { if (idx < total - 1) { setIdx(i => i + 1); setFlipped(false); } }}
                disabled={idx === total - 1}
                className="p-2 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Score footer */}
        <div className="px-6 pb-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="text-green-400">{results.filter(r => r === 'good').length} ✓</span>
          <span className="text-red-400">{results.filter(r => r === 'again').length} ✗</span>
          <span className="ml-auto">{total - done} remaining</span>
        </div>
      </div>
    </div>
  );
}
