import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  ShieldCheck, 
  Award, 
  Copy, 
  Check, 
  FileText, 
  Calendar, 
  User, 
  ArrowLeft,
  Download,
  BookOpen
} from 'lucide-react';
import { Case } from '../types';

interface EvaluationResult {
  score?: number;
  grade?: string;
  verdict?: string;
  analysis?: string;
  unlockedBadges?: string[];
  correctTimelineCount?: number;
}

interface DigitalSafetyReportProps {
  caseData: Case;
  evaluationResult: EvaluationResult;
  investigatorName?: string;
  onConclude: () => void;
}

export default function DigitalSafetyReport({
  caseData,
  evaluationResult,
  investigatorName = 'Senior Cyber Detective',
  onConclude
}: DigitalSafetyReportProps) {
  const [copied, setCopied] = useState(false);

  const score = evaluationResult.score ?? 0;
  const grade = evaluationResult.grade ?? 'VERIFIED';
  const verdict = evaluationResult.verdict ?? 'Forensic investigation completed and verified.';
  const analysis = evaluationResult.analysis ?? 'No detailed forensic analysis available.';
  const unlockedBadges = evaluationResult.unlockedBadges ?? [];

  const reportId = `CYBER-AUDIT-${(caseData.id || 'CASE').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const timestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const caseTitle = caseData.title || 'Digital Safety Investigation';
  const caseTopic = caseData.topic || 'Cyber Awareness';
  const caseDifficulty = caseData.difficulty || 'STANDARD';
  const caseThreatActor = caseData.threatActor || 'Digital Threat Actor';

  const handleCopyReport = () => {
    const fullText = `
================================================================
UNESCO CYBER TRAINING LABS // OFFICIAL SAFETY ASSESSMENT REPORT
================================================================
REPORT ID: ${reportId}
CASE TITLE: ${caseTitle}
CATEGORY: ${caseTopic}
DATE: ${timestamp}
INVESTIGATOR: ${investigatorName}
ACADEMY SCORE: ${score}/100 [${grade}]
JUDGMENT VERDICT: ${verdict}

----------------------------------------------------------------
EXECUTIVE ANALYSIS & DETAILED FINDINGS
----------------------------------------------------------------
${analysis}

----------------------------------------------------------------
HONOR BADGES AWARDED: ${unlockedBadges.join(', ') || 'None'}
================================================================
    `.trim();

    void navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => { setCopied(false); }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 space-y-8 animate-fade-in text-slate-100 select-text">
      
      {/* Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel bg-slate-900/80 p-4 sm:p-5 rounded-2xl border border-white/15">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              Digital Safety Assessment Report
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Official forensic audit & pedagogical evaluation dossier
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyReport}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
            title="Copy entire text report to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-teal-400" />
                <span className="text-teal-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Copy Full Report</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
            title="Print or save as PDF"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export / Print</span>
          </button>

          <button
            onClick={onConclude}
            className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Library</span>
          </button>
        </div>
      </div>

      {/* Main Official Report Paper Dossier Container */}
      <div className="relative bg-[#0b101d] border-2 border-slate-700/70 rounded-[32px] p-6 sm:p-10 shadow-2xl space-y-8 overflow-hidden">
        
        {/* Decorative Top Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-purple-500 to-sky-500" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Official Header & Metadata Stamp */}
        <div className="border-b border-slate-800 pb-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UNESCO CYBER TRAINING LABS // INCIDENT AUDIT</span>
              </div>
              
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {caseTitle}
              </h1>

              <p className="text-sm font-mono text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Focus Topic: <strong className="text-amber-300">{caseTopic}</strong></span>
              </p>
            </div>

            {/* Stamp Box */}
            <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl text-right font-mono text-xs space-y-1 shadow-inner shrink-0">
              <div className="text-amber-400 font-extrabold uppercase tracking-wider text-[11px]">
                AUTHENTICATED DOSSIER
              </div>
              <div className="text-slate-300 font-bold">{reportId}</div>
              <div className="text-slate-400 text-[10px]">{timestamp}</div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Investigator</span>
              <span className="text-white font-bold flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                {investigatorName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Classification</span>
              <span className="text-amber-400 font-bold mt-0.5 block">
                CONFIDENTIAL // EDUCATIONAL
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Difficulty Rating</span>
              <span className="text-slate-200 font-bold mt-0.5 block">
                {caseDifficulty} LEVEL
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block uppercase font-bold">Threat Vector</span>
              <span className="text-rose-400 font-bold mt-0.5 block truncate" title={caseThreatActor}>
                {caseThreatActor}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Executive Scorecard Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/80 border-2 border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          
          {/* Score */}
          <div className="text-center md:border-r border-slate-800 flex flex-col justify-center items-center p-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-extrabold tracking-wider">
              ACADEMY EVALUATION SCORE
            </span>
            <div className="font-sans text-5xl font-black mt-2 text-amber-400 tracking-tight">
              {score}<span className="text-2xl text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-xs font-mono text-slate-400 mt-1">
              Performance Index
            </span>
          </div>

          {/* Grade */}
          <div className="text-center md:border-r border-slate-800 flex flex-col justify-center items-center p-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-extrabold tracking-wider">
              QUALIFICATION RANK
            </span>
            <div className="font-serif text-4xl font-extrabold mt-2 text-sky-400">
              {grade}
            </div>
            <span className="text-xs font-mono text-emerald-400 mt-1 font-bold">
              Verified Competency
            </span>
          </div>

          {/* Verdict */}
          <div className="flex flex-col justify-center p-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-extrabold tracking-wider mb-1">
              JUDICIAL VERDICT SUMMARY
            </span>
            <p className="text-xs font-sans font-medium text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              "{verdict}"
            </p>
          </div>
        </div>

        {/* 3. Main Report Body (Markdown Analysis) */}
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-2xl font-bold text-white">
              Detailed Safety & Forensics Breakdown
            </h2>
          </div>

          {/* Markdown Content Container - Generous spacing & full visibility */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-inner space-y-6">
            <div className="markdown-body">
              <Markdown>{analysis}</Markdown>
            </div>
          </div>
        </div>

        {/* 4. Honor Badges & Commendations */}
        {unlockedBadges.length > 0 && (
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Award className="w-5 h-5 text-purple-400" />
              <span>HONOR BADGES & COMMENDATIONS CONFERRED</span>
            </div>

            <div className="flex flex-wrap gap-3">
              {unlockedBadges.map((badge: string, bIdx: number) => (
                <div 
                  key={bIdx}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-purple-500/40 text-sm font-mono font-bold text-white flex items-center gap-2.5 shadow-md"
                >
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Footer Certification Stamp */}
        <div className="pt-8 border-t border-slate-800 text-center font-mono text-xs text-slate-400 space-y-2">
          <p className="flex items-center justify-center gap-2 font-bold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OFFICIALLY AUDITED BY UNESCO CYBER SAFETY ACADEMY</span>
          </p>
          <p className="text-[11px] text-slate-400">
            This digital safety report serves as an educational record of critical thinking, media literacy, and cyber hazard recognition.
          </p>
        </div>

      </div>

      {/* Bottom Conclude Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onConclude}
          className="btn-primary py-4 px-10 text-sm font-extrabold flex items-center gap-3 cursor-pointer shadow-2xl"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Conclude Session & Return to Case Library</span>
        </button>
      </div>

    </div>
  );
}
