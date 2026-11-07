import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FolderArchive,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { evaluateScholarshipMatch, formatINR } from '../utils/matching';

export const EligibilityGapAnalyzerView: React.FC = () => {
  const {
    scholarships,
    profile,
    documents,
    gapAnalyzerScholarshipId,
    setGapAnalyzerScholarshipId,
    setSelectedScholarshipId,
    setShowOnboardingModal,
    setTab,
  } = useApp();

  // Active selected scholarship for deep inspection
  const selectedId = gapAnalyzerScholarshipId || scholarships[0]?.id;
  const currentScholarship = useMemo(() => {
    return scholarships.find((s) => s.id === selectedId) || scholarships[0];
  }, [scholarships, selectedId]);

  const match = useMemo(() => {
    return evaluateScholarshipMatch(currentScholarship, profile, documents);
  }, [currentScholarship, profile, documents]);

  // Separate criteria that do not meet required thresholds
  const notSatisfiedCriteria = useMemo(() => {
    return match.criteriaBreakdown.filter((c) => c.status === 'not_satisfied');
  }, [match]);

  // Cross-scheme unlock leverage calculation:
  // For each missing document, find other scholarships needing it and total value
  const crossSchemeDocumentImpact = useMemo(() => {
    return match.missingDocuments.map((docName) => {
      const lower = docName.toLowerCase().trim();
      const otherNeeding = scholarships.filter((s) =>
        s.id !== currentScholarship.id &&
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
      const totalUnlockedValue = otherNeeding.reduce((sum, s) => sum + s.amount, 0);
      return {
        docName,
        otherCount: otherNeeding.length,
        totalUnlockedValue,
      };
    });
  }, [match.missingDocuments, scholarships, currentScholarship.id]);

  // Total cross-scheme value unlockable
  const totalCrossSchemeValue = useMemo(() => {
    const uniqueScholarshipIds = new Set<string>();
    match.missingDocuments.forEach((docName) => {
      const lower = docName.toLowerCase().trim();
      scholarships.forEach((s) => {
        if (s.id !== currentScholarship.id) {
          const matches = s.requiredDocuments.some((req) => {
            const r = req.toLowerCase().trim();
            return (
              r.includes(lower) ||
              lower.includes(r) ||
              (lower.includes('income') && r.includes('income')) ||
              (lower.includes('transcript') && r.includes('marksheet'))
            );
          });
          if (matches) uniqueScholarshipIds.add(s.id);
        }
      });
    });
    return scholarships
      .filter((s) => uniqueScholarshipIds.has(s.id))
      .reduce((sum, s) => sum + s.amount, 0);
  }, [match.missingDocuments, scholarships, currentScholarship.id]);

  // Alternative recommendations if not eligible
  const alternatives = useMemo(() => {
    return scholarships
      .filter((s) => s.id !== currentScholarship.id)
