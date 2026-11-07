import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { parseScholarshipNotice, SAMPLE_SCHOLARSHIP_NOTICES } from '../utils/translator';
import { ExtractedNoticeData } from '../types/scholarship';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  DollarSign,
  GraduationCap,
  Scale,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';

export const NoticeTranslatorView: React.FC = () => {
  const { profile, documents, setTab } = useApp();

  const [noticeText, setNoticeText] = useState<string>(SAMPLE_SCHOLARSHIP_NOTICES[0].text);
  const [extractedData, setExtractedData] = useState<ExtractedNoticeData | null>(() =>
    parseScholarshipNotice(SAMPLE_SCHOLARSHIP_NOTICES[0].text)
  );
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const handleTranslate = () => {
    if (!noticeText.trim()) return;
    const result = parseScholarshipNotice(noticeText);
    setExtractedData(result);
  };

  const handleLoadSample = (sampleText: string) => {
    setNoticeText(sampleText);
    const result = parseScholarshipNotice(sampleText);
    setExtractedData(result);
  };

  // Compare profile against extracted requirements
  const compatibility = useMemo(() => {
    if (!extractedData) return null;

    let meetsAcademic = true;
    let meetsIncome = true;

    if (extractedData.minPercentage !== null) {
      meetsAcademic = (profile.academicPercentage || 0) >= extractedData.minPercentage;
    }

    if (extractedData.maxIncome !== null) {
      meetsIncome = (profile.familyIncome || 0) <= extractedData.maxIncome;
    }

    const userDocTypes = documents.map((d) => d.type.toLowerCase());
    const matchedDocs = extractedData.requiredDocuments.filter((d) =>
      userDocTypes.some((ud) => ud.includes(d.toLowerCase()) || d.toLowerCase().includes(ud))
    );
    const missingDocsCount = extractedData.requiredDocuments.length - matchedDocs.length;

    return {
      meetsAcademic,
      meetsIncome,
      matchedDocsCount: matchedDocs.length,
      missingDocsCount: Math.max(0, missingDocsCount),
      isOverallFit: meetsAcademic && meetsIncome,
    };
  }, [extractedData, profile, documents]);

  const handleCopySummary = async () => {
    if (!extractedData) return;
    const summary = `
[GRANTLY SCHOLARSHIP NOTICE TRANSLATION]
Scheme: ${extractedData.schemeTitle || 'Official Scholarship Notice'}
Provider: ${extractedData.benefactor || 'Official Body'}
Financial Grant: ${extractedData.amountFormatted || 'As per scheme terms'}
Deadline: ${extractedData.deadline || 'Consult circular'}
Academic Cutoff: ${extractedData.minPercentage ? `Min ${extractedData.minPercentage}%` : 'Not specified'}
Income Ceiling: ${extractedData.maxIncome ? `Max ₹${extractedData.maxIncome.toLocaleString('en-IN')}` : 'Not specified'}
Application Portal: ${extractedData.portalLink || 'National Portal'}
Required Documents:
${extractedData.requiredDocuments.map((d) => `- ${d}`).join('\n')}
Renewal Conditions: ${extractedData.renewalConditions || 'Standard academic progression'}
Extracted via Grantly Deterministic Notice Translator
    `.trim();

    try {
      await navigator.clipboard.writeText(summary);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* View Header */}
      <div className="bg-gradient-to-r from-white via-[#F4F7FF] to-[#EAF1FF] border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100/70 text-[#4169E1] rounded-full text-xs font-semibold tracking-wide">
              <FileText className="w-3.5 h-3.5" />
              <span>GRANTLY DECISION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Scholarship Notice Translator
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Paste dense official circulars, PDF gazettes, or university memos. Our deterministic regex parser extracts actionable eligibility thresholds, financial grants, required documents, and renewal fine-print instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block w-full lg:w-auto">
              Test Sample Circulars:
            </span>
            {SAMPLE_SCHOLARSHIP_NOTICES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample.text)}
                className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-blue-50 text-[#172554] hover:text-[#4169E1] border border-blue-200 rounded-2xl shadow-xs transition"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Circular */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4169E1]" />
                <h2 className="text-sm font-bold text-[#172554]">
                  Official Notice / Circular Text
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {noticeText.length} characters
              </span>
            </div>

            <textarea
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              placeholder="Paste raw circular text, PDF gazette copy, or university notification here..."
              rows={14}
              className="w-full text-xs sm:text-sm font-sans leading-relaxed text-slate-700 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1] transition resize-none"
              aria-label="Raw circular or scholarship notice text"
            />

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setNoticeText('');
                  setExtractedData(null);
                }}
                className="px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 transition"
              >
                Clear Text
              </button>

              <button
                type="button"
                onClick={handleTranslate}
                disabled={!noticeText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4169E1] hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-sm transition"
              >
                <Sparkles className="w-4 h-4" />
                Translate & Extract
              </button>
            </div>
          </div>

          {/* Safe Integrity Notice */}
          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs text-slate-600 space-y-1">
            <div className="font-bold text-[#172554] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
              Deterministic Rule-Based Intelligence
            </div>
            <p>
              Extraction uses multi-pattern regular expressions and government document heuristic parsing. No external LLM inference, hallucinations, or unverified claims.
            </p>
          </div>
        </div>

        {/* Right Column: Structured Intelligence Output */}
        <div className="lg:col-span-7 space-y-6">
          {!extractedData ? (
            <div className="bg-white border border-blue-100 rounded-3xl p-12 text-center shadow-sm space-y-3">
              <div className="w-12 h-12 mx-auto bg-blue-50 text-[#4169E1] rounded-2xl flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172554]">
                Awaiting Circular Input
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Paste an official government or foundation circular or choose one of the sample notices above to extract structured attributes.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header with Title and Copy */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confidence: {extractedData.confidence}% (Deterministic Extraction)
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight">
                    {extractedData.schemeTitle || 'Extracted Scholarship Scheme'}
                  </h2>
                  <div className="text-xs text-slate-500 font-medium">
                    Benefactor: {extractedData.benefactor || 'Official Grant Authority'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition shadow-2xs self-start"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Student Compatibility Strip */}
              {compatibility && (
                <div
                  className={`p-4 rounded-2xl border transition ${
                    compatibility.isOverallFit
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {compatibility.isOverallFit ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider">
                          Profile Match Result
                        </div>
                        <div className="text-sm font-extrabold">
                          {compatibility.isOverallFit
                            ? 'Your current profile satisfies all extracted criteria!'
                            : 'Potential criteria gap detected for this notice.'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className={compatibility.meetsAcademic ? 'text-emerald-700' : 'text-rose-600'}>
                        Academics: {compatibility.meetsAcademic ? 'Pass' : 'Below Cutoff'}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className={compatibility.meetsIncome ? 'text-emerald-700' : 'text-rose-600'}>
                        Income: {compatibility.meetsIncome ? 'Within Limit' : 'Exceeds Ceiling'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Extracted Key Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Financial Grant */}
                <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#4169E1]" />
                    Financial Grant Amount
                  </div>
                  <div className="text-base font-extrabold text-[#172554]">
                    {extractedData.amountFormatted || 'Not stated in excerpt'}
                  </div>
                </div>

                {/* Deadline */}
                <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#4169E1]" />
                    Application Deadline
                  </div>
                  <div className="text-base font-extrabold text-[#172554]">
                    {extractedData.deadline || 'Date not detected'}
                  </div>
                </div>

                {/* Academic Cutoff */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
                    Minimum Academic Cutoff
                  </div>
                  <div className="text-sm font-extrabold text-[#172554]">
                    {extractedData.minPercentage ? `Minimum ${extractedData.minPercentage}%` : 'Not explicitly specified'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Your profile: {profile.academicPercentage}%
                  </div>
                </div>

                {/* Family Income Limit */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-600" />
                    Family Income Ceiling
                  </div>
                  <div className="text-sm font-extrabold text-[#172554]">
                    {extractedData.maxIncome
                      ? `Max ₹${(extractedData.maxIncome / 100000).toFixed(1)} Lakhs / year`
                      : 'No strict ceiling mentioned'}
                  </div>
                  <div className="text-xs text-slate-500">
                    Your household: ₹{((profile.familyIncome || 0) / 100000).toFixed(1)} Lakhs
                  </div>
                </div>
              </div>

              {/* Required Documents Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#172554] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#4169E1]" />
                    Required Documents Checklist ({extractedData.requiredDocuments.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setTab('vault')}
                    className="text-xs font-semibold text-[#4169E1] hover:underline"
                  >
                    Open Document Vault →
                  </button>
                </div>

                {extractedData.requiredDocuments.length === 0 ? (
                  <p className="text-xs text-slate-500">No specific documents enumerated in excerpt.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {extractedData.requiredDocuments.map((doc, idx) => {
                      const userHasDoc = documents.some((d) =>
                        d.type.toLowerCase().includes(doc.toLowerCase()) || doc.toLowerCase().includes(d.type.toLowerCase())
                      );
                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between gap-2"
                        >
                          <span className="text-xs font-medium text-slate-800 line-clamp-1">
                            {doc}
                          </span>
                          {userHasDoc ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                              Missing
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Renewal & Fine-Print Section */}
              {extractedData.renewalConditions && (
                <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl space-y-1">
                  <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7664D8]" />
                    Renewal Benchmarks & Conditions
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {extractedData.renewalConditions}
                  </p>
                </div>
              )}

              {/* Portal Link */}
              {extractedData.portalLink && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-xs text-slate-600">
                    Official Portal: <span className="font-mono text-slate-900">{extractedData.portalLink}</span>
                  </div>
                  <a
                    href={extractedData.portalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#4169E1] hover:underline"
                  >
                    Visit Portal
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
