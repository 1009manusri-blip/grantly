import { Scholarship } from '../types/scholarship';
import { formatINR } from './matching';

export type StackingSeverity = 'conflict' | 'warning' | 'info' | 'insufficient_info';

export interface StackingConflict {
  scholarshipA: string;
  scholarshipB: string;
  reason: string;
  severity: StackingSeverity;
  statusLabel: 'Confirmed Conflict' | 'Possible Conflict' | 'No Known Conflict' | 'Insufficient Information';
}

export interface StackingSimulationResult {
  selectedScholarships: Scholarship[];
  grossPotentialFunding: number;
  allowableStackedFunding: number;
  conflicts: StackingConflict[];
  hasBlockingConflicts: boolean;
  optimizationStrategy?: string;
  notes: string[];
  assumptions: string[];
  disclaimer: string;
}

/**
 * Evaluates combination rules and calculates potential stackable funding.
 * Distinguishes between 4 clear classifications:
 * - 'conflict' (Confirmed Conflict): e.g., Dual Central Government tuition schemes or explicit exclusivity clauses
 * - 'warning' (Possible Conflict): e.g., State fee waiver + Central merit grant requiring institutional NOC
 * - 'info' (No Known Conflict): Verified complementary awards with published mutual allowances
 * - 'insufficient_info' (Insufficient Information): Combination terms unverified in published gazettes
 */
export function simulateScholarshipStacking(selectedScholarships: Scholarship[]): StackingSimulationResult {
  const conflicts: StackingConflict[] = [];
  const notes: string[] = [];
  const assumptions: string[] = [
    'Assuming tuition fee reimbursements are capped at the institution’s audited annual tuition structure.',
    'Dual central government awards covering tuition are mutually exclusive per Ministry of Education / UGC regulations; highest-value award retained.',
    'State-level fee concessions combined with merit maintenance allowances assume formal institutional No Objection Certificate (NOC).',
    'Private CSR scholarships assume non-exclusive terms only when explicit concurrent aid permissions are stated by the benefactor.',
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
            statusLabel: 'Confirmed Conflict',
          });
        } else {
          // One might be state fee concession and one central grant
          conflicts.push({
            scholarshipA: gA.name,
            scholarshipB: gB.name,
            reason: 'Possible Regulatory Conflict: Combination of state and central government awards typically requires college Principal NOC certifying no overlap between tuition and maintenance allowances.',
            severity: 'warning',
            statusLabel: 'Possible Conflict',
          });
        }
      }
    }
  }

  // Rule 2: Pairwise analysis of all selected scholarships
  for (let i = 0; i < selectedScholarships.length; i++) {
    const sA = selectedScholarships[i];
    if (!sA.combinationRestrictions.allowsStacking && selectedScholarships.length > 1) {
      notes.push(`${sA.name} specifies single-scholarship exclusivity: "${sA.combinationRestrictions.stackingNotes}"`);
    }

    for (let j = i + 1; j < selectedScholarships.length; j++) {
      const sB = selectedScholarships[j];

      // Skip if already evaluated under multi-govt rule
      const alreadyCheckedGovt =
        sA.providerType === 'Government' &&
        sB.providerType === 'Government' &&
        conflicts.some((c) => (c.scholarshipA === sA.name && c.scholarshipB === sB.name) || (c.scholarshipA === sB.name && c.scholarshipB === sA.name));

      if (alreadyCheckedGovt) continue;

      const conflictFound = sA.combinationRestrictions.conflictsWith.some((c) =>
        sB.name.toLowerCase().includes(c.toLowerCase()) ||
        sB.provider.toLowerCase().includes(c.toLowerCase()) ||
        sB.category.toLowerCase().includes(c.toLowerCase())
      ) || sB.combinationRestrictions.conflictsWith.some((c) =>
        sA.name.toLowerCase().includes(c.toLowerCase()) ||
        sA.provider.toLowerCase().includes(c.toLowerCase()) ||
        sA.category.toLowerCase().includes(c.toLowerCase())
      );

      if (conflictFound || (!sA.combinationRestrictions.allowsStacking && !sB.combinationRestrictions.allowsStacking)) {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: `Provider condition: Concurrent receipt of ${sA.name} and ${sB.name} is explicitly prohibited by provider guidelines.`,
          severity: 'conflict',
          statusLabel: 'Confirmed Conflict',
        });
      } else if (
        sA.verificationStatus === 'Demo Information' ||
        sB.verificationStatus === 'Demo Information' ||
        !sA.combinationRestrictions.stackingNotes ||
        !sB.combinationRestrictions.stackingNotes
      ) {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: 'Insufficient Information: Combination rules between these awards have not been verified in official provider gazettes. Consult your university financial aid office.',
          severity: 'insufficient_info',
          statusLabel: 'Insufficient Information',
        });
      } else if (
        sA.combinationRestrictions.allowsStacking &&
        sB.combinationRestrictions.allowsStacking &&
        (sA.combinationRestrictions.stackingNotes.toLowerCase().includes('concurrent') ||
         sA.combinationRestrictions.stackingNotes.toLowerCase().includes('stacking') ||
         sB.combinationRestrictions.stackingNotes.toLowerCase().includes('concurrent') ||
         sB.combinationRestrictions.stackingNotes.toLowerCase().includes('stacking'))
      ) {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: 'No Known Conflict: Both scholarship providers explicitly permit stacking alongside other accredited educational assistance.',
          severity: 'info',
          statusLabel: 'No Known Conflict',
        });
      } else {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: 'Possible Conflict: Inter-provider compatibility is contingent on expense segregation (e.g. tuition vs living stipend) and institutional NOC.',
          severity: 'warning',
          statusLabel: 'Possible Conflict',
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

  let optimizationStrategy: string | undefined;
  if (hasBlockingConflicts && govtScholarships.length > 1) {
    const highestGovt = govtScholarships.reduce((max, s) => s.amount > max.amount ? s : max, govtScholarships[0]);
    optimizationStrategy = `Statutory Prioritization Strategy: Central Ministry and UGC regulations prohibit dual public tuition funding for the same course. Retaining your highest-paying award (${highestGovt.name}, ${formatINR(highestGovt.amount)}) maximizes allowable stacked aid to ${formatINR(allowableStackedFunding)} while avoiding disqualification penalties from dual central submissions.`;
  } else if (!hasBlockingConflicts && selectedScholarships.length > 1) {
    optimizationStrategy = `Concurrent Stacking Strategy: All ${selectedScholarships.length} selected schemes permit concurrent receipt under published benefactor terms. Ensure college accounts branch issues an institutional No Objection Certificate (NOC) confirming segregation between tuition and maintenance allowances.`;
  }

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
    optimizationStrategy,
    notes,
    assumptions,
    disclaimer,
  };
}
