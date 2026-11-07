import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderArchive,
  UploadCloud,
  FileCheck2,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  FileText,
  Plus,
} from 'lucide-react';
import { formatDate } from '../utils/dates';

const COMMON_DOC_TYPES = [
  'Income Certificate',
  'Academic Transcript / Marksheet',
  'Bonafide Student Certificate',
  'Identity Proof (Aadhaar / Passport)',
  'Bank Passbook / Cancelled Cheque',
  'Caste / Category Certificate',
  'College Fee Structure Receipt',
  'Domicile Certificate',
];

export const DocumentVaultView: React.FC = () => {
  const {
    documents,
    addDocument,
    removeDocument,
    scholarships,
    savedScholarshipIds,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>(COMMON_DOC_TYPES[0]);
  const [expiryInput, setExpiryInput] = useState<string>('2027-06-30');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Compute Document Reuse Intelligence
  // Count how many saved & total scholarships need each document
  const reuseStats = COMMON_DOC_TYPES.map((docType) => {
    const lower = docType.toLowerCase().trim();

    const neededInTotal = scholarships.filter((s) =>
      s.requiredDocuments.some((req) => {
        const r = req.toLowerCase().trim();
        return (
          r.includes(lower) ||
          lower.includes(r) ||
          (lower.includes('income') && r.includes('income')) ||
          (lower.includes('transcript') && r.includes('marksheet'))
        );
      })
    );

    const neededInSaved = scholarships
      .filter((s) => savedScholarshipIds.includes(s.id))
      .filter((s) =>
        s.requiredDocuments.some((req) => {
          const r = req.toLowerCase().trim();
          return (
            r.includes(lower) ||
            lower.includes(r) ||
            (lower.includes('income') && r.includes('income')) ||
            (lower.includes('transcript') && r.includes('marksheet'))
          );
        })
      );

    const isUploaded = documents.some((d) => d.type === docType);

    return {
      docType,
      totalCount: neededInTotal.length,
      savedCount: neededInSaved.length,
      isUploaded,
      sampleScholarships: neededInTotal.map((s) => s.name).slice(0, 3),
    };
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      addDocument({
        type: selectedDocType,
        fileName: file.name,
        fileSize: `${sizeMB} MB`,
        expiryDate: expiryInput,
        status: 'Verified',
      });
      setIsUploading(false);
      setSuccessToast(`Uploaded and verified "${file.name}" for ${selectedDocType}!`);
      setTimeout(() => setSuccessToast(null), 4000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF1FF] text-[#4169E1] text-xs font-semibold mb-2 border border-blue-200/60 shadow-xs">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Document Vault & Reuse Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] font-['Space_Grotesk'] tracking-tight">
            Centralized Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Upload certificates once, track validity windows, and see instant reuse leverage across multiple scholarship portals.
          </p>
        </div>

        {/* Client Demo Persistence Notice */}
        <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl text-xs text-slate-600 border border-blue-100 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Encrypted client-side storage for demo privacy</span>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* SIGNATURE SECTION: DOCUMENT REUSE INTELLIGENCE */}
      <div className="rounded-3xl bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#2563EB] text-white p-6 sm:p-8 border border-blue-400/20 shadow-xl space-y-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <h2 className="text-lg font-bold font-['Space_Grotesk'] tracking-tight">
            Signature Feature: Document Reuse Intelligence
          </h2>
        </div>
        <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
          Scholarship applications often repeat identical requirements. GRANTLY tracks which certificates satisfy multiple application portals simultaneously, preventing unnecessary visits to government tahsildar or notary offices.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {reuseStats.slice(0, 4).map((stat) => (
            <div
              key={stat.docType}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/15 transition-all"
            >
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-300 tracking-wide">
                  High Leverage Proof
                </span>
                <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">{stat.docType}</h4>
                <p className="text-xs text-cyan-200 font-bold mt-2">
                  Required by {stat.totalCount} scholarships ({stat.savedCount} saved)
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className={stat.isUploaded ? 'text-emerald-300 font-semibold' : 'text-amber-200 font-semibold'}>
                  {stat.isUploaded ? '✓ Uploaded in Vault' : '⚠ Missing from Vault'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VAULT REPOSITORY & UPLOAD CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
          <h3 className="text-base font-bold text-[#172554]">Add Certificate to Vault</h3>
          <p className="text-xs text-slate-500">
            Select standard document category, expiry date, and upload PDF or scan.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">Certificate Type</label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] bg-white text-[#172554]"
              >
                {COMMON_DOC_TYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172554] mb-1">
                Certificate Validity / Expiry Date
              </label>
              <input
                type="date"
                value={expiryInput}
                onChange={(e) => setExpiryInput(e.target.value)}
                className="w-full text-xs font-medium py-2 px-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4169E1] text-[#172554]"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                State income certificates are typically valid for 1-3 financial years.
              </p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-5 rounded-2xl border-2 border-dashed border-[#4169E1]/30 hover:border-[#4169E1] bg-[#F4F7FF] hover:bg-[#EAF1FF] text-[#4169E1] transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
            >
              <UploadCloud className="w-8 h-8 text-[#4169E1] group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="text-xs font-bold text-[#172554]">
                  {isUploading ? 'Validating certificate...' : 'Click to select file from device'}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">PDF, PNG, JPG up to 10MB</p>
              </div>
            </button>
          </div>
        </div>

        {/* Uploaded Documents List */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-blue-100 shadow-[0_4px_24px_rgb(65,105,225,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#172554]">
              Active Vault Documents ({documents.length})
            </h3>
            <span className="text-xs text-slate-500">Ready for application reuse</span>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="p-8 text-center bg-[#F4F7FF] rounded-2xl text-xs text-slate-500 border border-blue-100/60">
                No documents uploaded yet. Upload your first certificate using the form.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl border border-blue-100 hover:border-blue-200 hover:bg-[#F4F7FF]/30 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#EAF1FF] text-[#4169E1] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#172554]">{doc.type}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {doc.fileName} · {doc.fileSize} · Uploaded {formatDate(doc.uploadDate)}
                      </p>
                      {doc.expiryDate && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Valid through: {formatDate(doc.expiryDate)}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove certificate"
                      aria-label={`Remove certificate ${doc.fileName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
