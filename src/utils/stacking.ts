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
  disclaimer: string;
}

/**
 * Evaluates combination rules and calculates potential stackable funding
 */
export function simulateScholarshipStacking(selectedScholarships: Scholarship[]): StackingSimulationResult {
  const conflicts: StackingConflict[] = [];
  const notes: string[] = [];

  const grossPotentialFunding = selectedScholarships.reduce((acc, s) => acc + s.amount, 0);

  // Group by providerType to check known statutory restrictions
  const govtScholarships = selectedScholarships.filter((s) => s.providerType === 'Government');
  const privateScholarships = selectedScholarships.filter((s) => s.providerType === 'Private' || s.providerType === 'Foundation');
  const institutional = selectedScholarships.filter((s) => s.providerType === 'Institutional');

  // Rule 1: Central & State Government Scholarships generally cannot be availed concurrently for same tuition/maintenance
  if (govtScholarships.length > 1) {
    for (let i = 0; i < govtScholarships.length; i++) {
      for (let j = i + 1; j < govtScholarships.length; j++) {
        conflicts.push({
          scholarshipA: govtScholarships[i].name,
          scholarshipB: govtScholarships[j].name,
          reason: 'Statutory Rule: Most Government / Central Sector schemes prohibit dual-receipt of another government scholarship concurrently for tuition.',
          severity: 'conflict',
        });
      }
    }
    notes.push('You have selected multiple government scholarships. In India, statutory regulations generally mandate choosing only one primary government scholarship.');
  }

  // Rule 2: Explicit combination restrictions from scholarship metadata
  for (let i = 0; i < selectedScholarships.length; i++) {
    const sA = selectedScholarships[i];
    if (!sA.combinationRestrictions.allowsStacking) {
      notes.push(`${sA.name} mentions strict single-scholarship exclusivity: "${sA.combinationRestrictions.stackingNotes}"`);
    }

    for (let j = i + 1; j < selectedScholarships.length; j++) {
      const sB = selectedScholarships[j];
      const conflictFound = sA.combinationRestrictions.conflictsWith.some((c) =>
        sB.name.toLowerCase().includes(c.toLowerCase()) || sB.provider.toLowerCase().includes(c.toLowerCase()) || sB.category.toLowerCase().includes(c.toLowerCase())
      );
      if (conflictFound) {
        conflicts.push({
          scholarshipA: sA.name,
          scholarshipB: sB.name,
          reason: `Provider condition: ${sA.name} explicitly conflicts with ${sB.name} (${sA.combinationRestrictions.stackingNotes}).`,
          severity: 'conflict',
        });
      }
    }
  }

  // Calculate allowable stacked funding
  // If there are conflicting govt scholarships, keep only the highest-paying one for allowable stack
  let allowableStackedFunding = 0;
  if (govtScholarships.length > 1) {
    const maxGovt = Math.max(...govtScholarships.map((s) => s.amount));
    const nonGovtTotal = selectedScholarships
      .filter((s) => s.providerType !== 'Government' && s.combinationRestrictions.allowsStacking)
      .reduce((acc, s) => acc + s.amount, 0);
    allowableStackedFunding = maxGovt + nonGovtTotal;
  } else {
    allowableStackedFunding = selectedScholarships
      .filter((s) => s.combinationRestrictions.allowsStacking || selectedScholarships.length === 1)
      .reduce((acc, s) => acc + s.amount, 0);
  }

  const hasBlockingConflicts = conflicts.some((c) => c.severity === 'conflict');

  if (selectedScholarships.length === 0) {
    notes.push('Select scholarships from the list to calculate cumulative funding scenarios.');
  } else if (!hasBlockingConflicts) {
    notes.push('No obvious direct policy conflicts detected between these awards. Verify respective institution policies upon award.');
  }

  const disclaimer =
    'Funding projections are estimates. Actual awards, disbursals, and combination permissions depend on each scholarship provider’s official guidelines and institution endorsement.';

  return {
    selectedScholarships,
    grossPotentialFunding,
    allowableStackedFunding: Math.min(grossPotentialFunding, allowableStackedFunding),
    conflicts,
    hasBlockingConflicts,
    notes,
    disclaimer,
  };
}
