import { Scholarship } from '../types/scholarship';
import { formatINR } from './matching';

export interface StackingConflict {
  scholarshipA: string;
  scholarshipB: string;
  reason: string;
  severity: 'conflict' | 'warning' | 'info';
}

export interface StackingSimulationResult {
  selectedScholarships: Scholarship[];
  grossPotentialFunding: number;
  allowableStackedFunding: number;
  conflicts: StackingConflict[];
  hasBlockingConflicts: boolean;
  notes: string[];
  assumptions: string[];
  disclaimer: string;
}

/**
 * Evaluates combination rules and calculates potential stackable funding.
 * Distinguishes between:
 * - 'conflict' (Confirmed Policy Conflict): e.g., Dual Central Government tuition schemes
 * - 'warning' (Possible Conflict / Requires Institutional NOC): e.g., State fee waiver + Central merit grant
 * - 'info' (Permitted Stacking): e.g., Private merit grant + college fee reimbursement
 */
export function simulateScholarshipStacking(selectedScholarships: Scholarship[]): StackingSimulationResult {
  const conflicts: StackingConflict[] = [];
  const notes: string[] = [];
  const assumptions: string[] = [
    'Assuming tuition fee reimbursements are capped at the institution’s audited annual tuition structure.',
    'Dual central government awards covering tuition are mutually exclusive per Ministry of Education / UGC regulations; highest-value award retained.',
    'State-level fee concessions combined with merit maintenance allowances assume formal institutional No Objection Certificate (NOC).',
    'Private CSR scholarships assume non-exclusive terms unless explicit single-aid restrictions are specified by the benefactor.',
  ];

  const grossPotentialFunding = selectedScholarships.reduce((acc, s) => acc + s.amount, 0);

  // Group by providerType to check known statutory restrictions
  const govtScholarships = selectedScholarships.filter((s) => s.providerType === 'Government');
  const privateScholarships = selectedScholarships.filter((s) => s.providerType === 'Private' || s.providerType === 'Foundation');
  const institutional = selectedScholarships.filter((s) => s.providerType === 'Institutional');

  // Rule 1: Multi-Government scholarship analysis
  if (govtScholarships.length > 1) {
    for (let i = 0; i < govtScholarships.length; i++) {
      for (let j = i + 1; j < govtScholarships.length; j++) {
        const gA = govtScholarships[i];
        const gB = govtScholarships[j];

        // Check if both are national central schemes or both explicitly claim tuition
        const isDualCentral =
          (gA.tags?.includes('National') || gA.provider.includes('AICTE') || gA.provider.includes('Ministry')) &&
          (gB.tags?.includes('National') || gB.provider.includes('AICTE') || gB.provider.includes('Ministry'));

        if (isDualCentral || !gA.combinationRestrictions.allowsStacking || !gB.combinationRestrictions.allowsStacking) {
          conflicts.push({
            scholarshipA: gA.name,
            scholarshipB: gB.name,
            reason: 'Statutory Direct Conflict: Central Ministry / UGC guidelines strictly prohibit dual public funding for identical tuition expenses. Only one primary central award can be availed.',
            severity: 'conflict',
          });
        } else {
          // One might be state fee concession and one central grant
          conflicts.push({
            scholarshipA: gA.name,
            scholarshipB: gB.name,
            reason: 'Possible Regulatory Conflict: Combination of state and central government awards typically requires college Principal NOC certifying no overlap between tuition and maintenance allowances.',
            severity: 'warning',
          });
        }
      }
    }
  }

  // Rule 2: Explicit combination restrictions from scholarship metadata
  for (let i = 0; i < selectedScholarships.length; i++) {
    const sA = selectedScholarships[i];
    if (!sA.combinationRestrictions.allowsStacking && selectedScholarships.length > 1) {
      notes.push(`${sA.name} specifies single-scholarship exclusivity: "${sA.combinationRestrictions.stackingNotes}"`);
    }

    for (let j = i + 1; j < selectedScholarships.length; j++) {
      const sB = selectedScholarships[j];
      const conflictFound = sA.combinationRestrictions.conflictsWith.some((c) =>
        sB.name.toLowerCase().includes(c.toLowerCase()) ||
        sB.provider.toLowerCase().includes(c.toLowerCase()) ||
        sB.category.toLowerCase().includes(c.toLowerCase())
      );
      if (conflictFound) {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: `Provider condition: ${sA.name} explicitly excludes concurrent receipt of ${sB.name}. (${sA.combinationRestrictions.stackingNotes})`,
          severity: 'conflict',
        });
      } else if (
        (sA.providerType === 'Private' || sA.providerType === 'Foundation') &&
        sB.providerType === 'Government' &&
        sA.combinationRestrictions.allowsStacking
      ) {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: 'Permitted Complementary Funding: Private foundation grant can generally be held concurrently with government tuition waivers.',
          severity: 'info',
        });
      }
    }
  }

  // Calculate allowable stacked funding
  let allowableStackedFunding = 0;
  if (selectedScholarships.length === 0) {
    allowableStackedFunding = 0;
  } else if (selectedScholarships.length === 1) {
    allowableStackedFunding = selectedScholarships[0].amount;
  } else {
    // Collect non-conflicting awards
    // If multiple govt awards with blocking conflict, keep highest value one
    const hasGovtConflict = conflicts.some(
      (c) => c.severity === 'conflict' && govtScholarships.some((g) => g.name === c.scholarshipA) && govtScholarships.some((g) => g.name === c.scholarshipB)
    );

    const maxGovt = govtScholarships.length > 0 ? Math.max(...govtScholarships.map((s) => s.amount)) : 0;
    const govtTotal = hasGovtConflict ? maxGovt : govtScholarships.reduce((acc, s) => acc + s.amount, 0);

    // Private awards that allow stacking
    const allowablePrivate = privateScholarships
      .filter((s) => s.combinationRestrictions.allowsStacking)
      .reduce((acc, s) => acc + s.amount, 0);

    // Institutional awards
    const allowableInst = institutional
      .filter((s) => s.combinationRestrictions.allowsStacking)
      .reduce((acc, s) => acc + s.amount, 0);

    allowableStackedFunding = govtTotal + allowablePrivate + allowableInst;
  }

  const hasBlockingConflicts = conflicts.some((c) => c.severity === 'conflict');

  if (selectedScholarships.length === 0) {
    notes.push('Select scholarships from your radar or discovery to simulate cumulative award stacking.');
  } else if (!hasBlockingConflicts) {
    notes.push('No direct statutory exclusions detected between these awards. Verify respective institution policies upon award.');
  }

  const disclaimer =
    'Stacking projections are institutional estimates. Actual disbursals and combination approvals depend on provider guidelines, institute verification, and statutory Direct Benefit Transfer (DBT) rules.';

  return {
    selectedScholarships,
    grossPotentialFunding,
    allowableStackedFunding: Math.min(grossPotentialFunding, allowableStackedFunding),
    conflicts,
    hasBlockingConflicts,
    notes,
    assumptions,
    disclaimer,
  };
}
