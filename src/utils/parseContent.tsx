import React from 'react';

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let last = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[2]) {
      parts.push(<strong key={i++} className="text-slate-100 font-semibold">{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(<code key={i++}>{match[3]}</code>);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function parseContent(raw: string): React.ReactNode {
  const lines = raw.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    // Heading
    if (line.startsWith('**') && line.endsWith(':**')) {
      elements.push(
        <h3 key={key++} className="text-slate-100 font-bold text-sm mt-5 mb-2">
          {line.replace(/\*\*/g, '').replace(/:$/, '')}:
        </h3>
      );
      i++;
      continue;
    }

    // Bullet list block
    if (line.startsWith('- ') || line.startsWith('• ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        items.push(lines[i].replace(/^[-•] /, ''));
        i++;
      }
      elements.push(
        <ul key={key++} className="list-disc pl-5 space-y-1 my-2">
          {items.map((item, j) => (
            <li key={j} className="text-slate-400 leading-relaxed text-sm">
              {parseInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\./.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="list-decimal pl-5 space-y-1 my-2">
          {items.map((item, j) => (
            <li key={j} className="text-slate-400 leading-relaxed text-sm">
              {parseInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-slate-400 leading-relaxed text-sm mb-3">
        {parseInline(line)}
      </p>
    );
    i++;
  }

  return <div className="prose-content">{elements}</div>;
}
