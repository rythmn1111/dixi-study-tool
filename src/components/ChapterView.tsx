import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronRight, Code2, MessageSquare, Zap, Star } from 'lucide-react';
import type { Chapter, Section } from '../types';
import { parseContent } from '../utils/parseContent';

interface Props {
  chapter: Chapter;
  readSections: Set<string>;
  onMarkRead: (sectionId: string) => void;
  onQuizSection: (section: Section) => void;
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block mt-4">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 size={13} className="text-slate-500" />
          <span className="text-xs text-slate-400 font-medium">{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-sm">{code}</pre>
    </div>
  );
}

function InterviewQA({ questions }: { questions: Section['interviewQs'] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (questions.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={14} className="text-amber-400" />
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Interview Questions</span>
      </div>
      <div className="space-y-2">
        {questions.map((qa, idx) => (
          <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/50 transition-colors"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <span className="text-sm text-slate-200 font-medium leading-snug">{qa.q}</span>
              {openIdx === idx ? (
                <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronRight size={14} className="text-slate-400 flex-shrink-0" />
              )}
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-4 pt-1 border-t border-slate-800 bg-slate-900/50 animate-in">
                <p className="text-sm text-slate-400 leading-relaxed">{qa.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  section,
  chapterColor,
  isRead,
  onMarkRead,
  onQuiz,
}: {
  section: Section;
  chapterColor: string;
  isRead: boolean;
  onMarkRead: () => void;
  onQuiz: () => void;
}) {
  return (
    <div
      id={`section-${section.id}`}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden mb-6 animate-in"
    >
      {/* Section header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${chapterColor}22`, background: `${chapterColor}08` }}
      >
        <h2 className="text-base font-bold text-slate-100">{section.title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onQuiz}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: `${chapterColor}22`, color: chapterColor }}
          >
            <Zap size={11} />
            Quiz
          </button>
          <button
            onClick={onMarkRead}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 ${
              isRead
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle size={11} />
            {isRead ? 'Read' : 'Mark Read'}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Content */}
        {parseContent(section.content)}

        {/* Key Points */}
        <div
          className="mt-5 p-4 rounded-xl"
          style={{ backgroundColor: `${chapterColor}0d`, border: `1px solid ${chapterColor}22` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Star size={13} style={{ color: chapterColor }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: chapterColor }}>
              Key Points to Remember
            </span>
          </div>
          <ul className="space-y-2">
            {section.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: chapterColor }}
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Code example */}
        {section.codeExample && (
          <CodeBlock code={section.codeExample.code} label={section.codeExample.label} />
        )}

        {/* Interview Q&A */}
        <InterviewQA questions={section.interviewQs} />
      </div>
    </div>
  );
}

export function ChapterView({ chapter, readSections, onMarkRead, onQuizSection }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Chapter header */}
      <div
        className="rounded-2xl p-8 mb-8"
        style={{
          background: `linear-gradient(135deg, ${chapter.color}18 0%, ${chapter.color}08 100%)`,
          border: `1px solid ${chapter.color}30`,
        }}
      >
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: `${chapter.color}20`, border: `1px solid ${chapter.color}40` }}
          >
            {chapter.icon}
          </div>
          <div>
            <div
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: chapter.color }}
            >
              Chapter {chapter.number} · {chapter.tag}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-50 mb-2">{chapter.title}</h1>
            <p className="text-slate-400 text-sm">{chapter.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span>{chapter.sections.length} sections</span>
              <span>·</span>
              <span>
                {chapter.sections.filter(s => readSections.has(s.id)).length} / {chapter.sections.length} read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      {chapter.sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          chapterColor={chapter.color}
          isRead={readSections.has(section.id)}
          onMarkRead={() => onMarkRead(section.id)}
          onQuiz={() => onQuizSection(section)}
        />
      ))}
    </div>
  );
}
