import { ExtractedNoticeData } from '../types/scholarship';
import { formatINR } from './matching';
import { formatDate } from './dates';

/**
 * Deterministically parses scholarship circular or notification text.
 * Extracts: Title, Benefactor, Amount, Academic Cutoff, Income Ceiling,
 * Deadlines, Required Documents, Renewal Rules, and Official Portal URL.
 */
export function parseScholarshipNotice(text: string): ExtractedNoticeData {
  if (!text || text.trim().length === 0) {
    return {
      confidenceScore: 0,
      confidence: 0,
      rawPastedText: '',
      requiredDocuments: [],
      minPercentage: null,
      maxIncome: null,
    };
  }

  const cleanText = text.trim();
  let extractedFields = 0;

  // 1. Extract Title
  let schemeName: string | undefined;
  const titleRegex = /(?:scheme|fellowship|grant|scholarship|award|programme|initiative):\s*([^\n\r.]+)/i;
  const titleMatch = cleanText.match(titleRegex);
  if (titleMatch && titleMatch[1]) {
    schemeName = titleMatch[1].trim();
    extractedFields++;
  } else {
    // Fallback: look for common scheme names in line 1-3
    const firstLines = cleanText.split('\n').slice(0, 3).join(' ');
    const nameMatch = firstLines.match(/([A-Z][A-Za-z0-9\s&'-]+(?:Scholarship|Fellowship|Grant|Scheme))/);
    if (nameMatch) {
      schemeName = nameMatch[1].trim();
      extractedFields++;
    }
  }

  // 2. Extract Benefactor / Ministry
  let benefactor: string | undefined;
  const benefactorRegex = /(?:issued by|department|ministry|benefactor|organization|trust|foundation):\s*([^\n\r.]+)/i;
  const benMatch = cleanText.match(benefactorRegex);
  if (benMatch && benMatch[1]) {
    benefactor = benMatch[1].trim();
    extractedFields++;
  } else {
    const orgs = ['Ministry of Education', 'AICTE', 'UGC', 'Department of Higher Education', 'Tata Trusts', 'Reliance Foundation', 'HDFC Bank', 'Google', 'DST INSPIRE'];
    for (const org of orgs) {
      if (new RegExp(org, 'i').test(cleanText)) {
        benefactor = org;
        extractedFields++;
        break;
      }
    }
  }

  // 3. Extract Amount (INR)
  let amount: number | undefined;
  let amountFormatted: string | undefined;
  // Match patterns like ₹50,000, Rs. 2,00,000, 50,000/-, 2.5 Lakhs
  const amountMatch = cleanText.match(/(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d+)?)/i);
  if (amountMatch && amountMatch[1]) {
    const rawNum = parseInt(amountMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(rawNum) && rawNum > 0) {
      amount = rawNum;
      amountFormatted = formatINR(rawNum);
      if (/per year|\/year|annum|p\.a\./i.test(cleanText)) {
        amountFormatted += ' / year';
      }
      extractedFields += 2;
    }
  } else {
    const lakhMatch = cleanText.match(/([\d.]+)\s*(?:lakh|lacs|lakhs)/i);
    if (lakhMatch && lakhMatch[1]) {
      const lakhs = parseFloat(lakhMatch[1]);
      amount = Math.round(lakhs * 100000);
      amountFormatted = formatINR(amount);
      extractedFields += 2;
    }
  }

  // 4. Extract Academic Cutoff Percentage
  let minPercentage: number | undefined;
  const cutoffMatch = cleanText.match(/(?:minimum|at least|cutoff|aggregate|marks|score of)\s*(\d{2}(?:\.\d+)?)\s*%/i);
  if (cutoffMatch && cutoffMatch[1]) {
    const parsedPercent = parseFloat(cutoffMatch[1]);
    if (parsedPercent >= 40 && parsedPercent <= 100) {
      minPercentage = parsedPercent;
      extractedFields++;
    }
  }

  // 5. Extract Family Income Ceiling
  let maxIncome: number | undefined;
  const incomeMatch = cleanText.match(/(?:income|family income|annual income|ceiling)[^.\n]*?(?:₹|Rs\.?|INR)\s*([\d,]+)/i);
  if (incomeMatch && incomeMatch[1]) {
    const parsedIncome = parseInt(incomeMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(parsedIncome) && parsedIncome >= 50000) {
      maxIncome = parsedIncome;
      extractedFields++;
    }
  } else {
    const incomeLakhMatch = cleanText.match(/(?:income|family income)[^.\n]*?([\d.]+)\s*(?:lakh|lacs|lakhs|LPA)/i);
    if (incomeLakhMatch && incomeLakhMatch[1]) {
      maxIncome = Math.round(parseFloat(incomeLakhMatch[1]) * 100000);
      extractedFields++;
    }
  }

  // 6. Extract Deadline
  let deadline: string | undefined;
  let deadlineFormatted: string | undefined;
  // Match YYYY-MM-DD or standard dates like 30th November 2026 or 30-11-2026
  const isoMatch = cleanText.match(/\b(202\d-[01]\d-[0-3]\d)\b/);
  if (isoMatch) {
    deadline = isoMatch[1];
    deadlineFormatted = formatDate(deadline);
    extractedFields++;
  } else {
    const textDateMatch = cleanText.match(/(?:last date|deadline|closing date|valid through)[:\s]+([0-3]?\d(?:st|nd|rd|th)?\s+[A-Za-z]+,?\s+202\d)/i);
    if (textDateMatch) {
      deadlineFormatted = textDateMatch[1].trim();
      extractedFields++;
    }
  }

  // 7. Extract Required Documents
  const knownDocs = [
    'Income Certificate',
    'Academic Transcript / Marksheet',
    'Bonafide Student Certificate',
    'Identity Proof (Aadhaar / Passport)',
    'Bank Passbook / Cancelled Cheque',
    'Caste / Category Certificate',
    'College Fee Structure Receipt',
    'Domicile Certificate',
    'Passport Size Photograph',
  ];
  const requiredDocuments: string[] = [];
  knownDocs.forEach((doc) => {
    const docKeywords = doc.toLowerCase().split(/[\s/]+/);
    const hasMatch = docKeywords.some((kw) => kw.length > 4 && cleanText.toLowerCase().includes(kw));
    if (hasMatch && !requiredDocuments.includes(doc)) {
      requiredDocuments.push(doc);
    }
  });
  if (requiredDocuments.length > 0) extractedFields++;

  // 8. Extract Renewal Conditions
  let renewalConditions: string | undefined;
  const renewalMatch = cleanText.match(/(?:renewal|subsequent years|continue receiving)[^.\n]*?:\s*([^\n\r]+)/i);
  if (renewalMatch && renewalMatch[1]) {
    renewalConditions = renewalMatch[1].trim();
    extractedFields++;
  } else if (/renewal/i.test(cleanText)) {
    const sentence = cleanText.split('.').find((s) => /renewal/i.test(s));
    if (sentence) {
      renewalConditions = sentence.trim();
      extractedFields++;
    }
  }

  // 9. Extract Application Instructions & Portal Link
  const applicationInstructions: string[] = [];
  const urlMatch = cleanText.match(/(https?:\/\/[^\s]+)/i);
  const officialPortalUrl = urlMatch ? urlMatch[1].replace(/[),.;]+$/, '') : undefined;
  if (officialPortalUrl) extractedFields++;

  const stepMatches = cleanText.match(/(?:step \d|how to apply|\d\.)\s*([^\n\r.]+)/gi);
  if (stepMatches && stepMatches.length > 0) {
    stepMatches.slice(0, 4).forEach((st) => {
      applicationInstructions.push(st.trim());
    });
    extractedFields++;
  }

  // Confidence calculation (scale 0-100)
  const confidenceScore = Math.min(100, Math.round((extractedFields / 9) * 100));
  const resolvedSchemeName = schemeName || (extractedFields > 0 ? 'Extracted Scheme (Unconfirmed Title)' : undefined);

  return {
    schemeName: resolvedSchemeName,
    schemeTitle: resolvedSchemeName,
    benefactor: benefactor || (extractedFields > 0 ? 'Benefactor Specified in Notice' : undefined),
    amount,
    amountFormatted: amountFormatted || (amount ? formatINR(amount) : (extractedFields > 0 ? 'Amount Unspecified in Notice' : undefined)),
    minPercentage: minPercentage !== undefined ? minPercentage : null,
    maxIncome: maxIncome !== undefined ? maxIncome : null,
    deadline,
    deadlineFormatted: deadlineFormatted || (deadline ? formatDate(deadline) : (extractedFields > 0 ? 'Refer to Notice Schedule' : undefined)),
    requiredDocuments,
    renewalConditions,
    applicationInstructions: applicationInstructions.length > 0 ? applicationInstructions : undefined,
    officialPortalUrl,
    portalLink: officialPortalUrl,
    confidenceScore,
    confidence: confidenceScore,
    rawPastedText: cleanText,
  };
}

/**
 * Realistic sample circulars for instant 1-click student testing.
 */
export const SAMPLE_SCHOLARSHIP_NOTICES = [
  {
    id: 'sample-nsp-central',
    title: 'NSP Central Sector Scheme 2026-27 Gazetted Circular',
    snippet: 'Ministry of Education official notification for college degree scholars.',
    text: `GOVERNMENT OF INDIA
MINISTRY OF EDUCATION
DEPARTMENT OF HIGHER EDUCATION
SCHEME: Central Sector Scheme of Scholarship for College and University Students
ACADEMIC YEAR: 2026-2027

1. OBJECTIVE:
To provide financial assistance to meritorious students from economically weaker sections.

2. ELIGIBILITY CRITERIA:
- Students who are above 80th percentile of successful candidates in the relevant stream from a recognized Class 12 board.
- Pursuing regular (not correspondence or distance mode) degree courses in recognized universities.
- Gross annual family income not exceeding ₹4,50,000 per annum.
- Minimum 60% aggregate in Class 12 examination.

3. RATE OF SCHOLARSHIP:
₹20,000 per annum for the first three years of undergraduate study.

4. MANDATORY DOCUMENTS REQUIRED:
- Class 12 Academic Transcript / Marksheet
- Verified Income Certificate issued by competent Revenue Authority (Tahsil)
- College Bonafide Student Certificate
- Aadhaar Card / Identity Proof
- Bank Passbook / Cancelled Cheque (Aadhaar-seeded savings account)

5. RENEWAL CONDITIONS:
Renewal in subsequent years is strictly subject to maintaining at least 50% marks in the annual university examination and minimum 75% attendance.

6. APPLICATION PROCEDURE:
Last date for online submission on the National Scholarship Portal: 2026-11-25.
Official Portal: https://scholarships.gov.in`,
  },
  {
    id: 'sample-aicte-girls',
    title: 'AICTE Pragati Technical Fellowship Notification',
    snippet: 'Council notification for girl students pursuing engineering & diploma.',
    text: `ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
SCHEME: AICTE Pragati Scholarship for Girl Students
FELLOWSHIP NOTICE NO: AICTE/RIFD/PRAGATI/2026

Applications are invited from eligible girl students admitted to first year of Degree/Diploma level technical courses in AICTE approved institutions.

CRITERIA & ASSISTANCE:
- The girl candidate should be admitted to 1st year of Degree level course.
- Maximum two girl children per family are eligible.
- Family income should be less than ₹8,00,000 per annum.
- Candidate must score minimum 60% marks in qualifying examination.
- Total Assistance: ₹50,000 per annum for every year of study towards tuition fee and purchase of books/laptop.

REQUIRED PROOFS:
- Income Certificate
- Bonafide Student Certificate
- Academic Transcript / Marksheet
- Identity Proof (Aadhaar / Passport)
- Bank Passbook

IMPORTANT RESTRICTION:
Candidate must not be receiving any other scholarship or tuition waiver from Central/State Government.
Last date for submission of application: 2026-11-20.
Apply online at: https://scholarships.gov.in`,
  },
  {
    id: 'sample-csr-merit',
    title: 'Reliance Foundation Undergraduate Merit Notice',
    snippet: 'Corporate CSR circular for undergraduate scholars across India.',
    text: `RELIANCE FOUNDATION UNDERGRADUATE SCHOLARSHIP 2026-27
PROGRAMME: Reliance Foundation UG Merit-cum-Means Grant
BENEFACTOR: Reliance Foundation

Applications are invited from all first-year full-time undergraduate students across all disciplines.
- Scholarship Amount: Up to ₹2,00,000 over the duration of the degree programme.
- Eligibility: Minimum 60% marks in Class 12 board examinations.
- Annual Family Income: Up to ₹15,00,000 (preference for income under ₹2,50,000).
- Application Process includes an online aptitude assessment.
- Stacking Permission: May be held concurrently with government tuition waivers and college fee concessions.
- Required Documents: Income Certificate, Academic Transcript, Bonafide Student Certificate, Passport Photograph.
- Closing Date: 2026-11-28.
Official Portal: https://www.scholarships.reliancefoundation.org`,
  },
];
