export interface InterviewQ {
  q: string;
  a: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  codeExample?: {
    language: string;
    label: string;
    code: string;
  };
  interviewQs: InterviewQ[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  tag: string;
  sections: Section[];
}

export type ViewMode = 'read' | 'quiz';
