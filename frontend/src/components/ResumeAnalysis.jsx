import { useEffect, useState } from 'react';
import useResumeStore from '../store/resumeStore';
import { resumeAPI } from '../services/api';

export default function ResumeAnalysis({ resumeId }) {
  const [loading, setLoading] = useState(false);
  const analysis = useResumeStore((state) => state.analysis);
  const setAnalysis = useResumeStore((state) => state.setAnalysis);

  useEffect(() => {
    if (!analysis) {
      loadAnalysis();
    }
  }, [resumeId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      const response = await resumeAPI.analyze(resumeId);
      setAnalysis(response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8 bg-surface-container rounded-xl p-8">
      {/* Score Card */}
      <div className="bg-surface p-6 rounded-lg border border-outline/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-sm">Resume Score</p>
            <p className="text-display-lg text-primary">{analysis.score || 0}/100</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/50 flex items-center justify-center">
            <span className="text-on-primary font-bold">{Math.round(analysis.score)}</span>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths && (
        <div>
          <h3 className="text-headline-h2 text-on-surface mb-4">✓ Strengths</h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3 text-on-surface">
                <span className="text-tertiary text-xl mt-1">●</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses && (
        <div>
          <h3 className="text-headline-h2 text-on-surface mb-4">⚠ Weaknesses</h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start gap-3 text-on-surface">
                <span className="text-error text-xl mt-1">●</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {analysis.improvements && (
        <div>
          <h3 className="text-headline-h2 text-on-surface mb-4">→ Top Improvements</h3>
          <ol className="space-y-3">
            {analysis.improvements.map((improvement, i) => (
              <li key={i} className="flex gap-4 text-on-surface">
                <span className="text-primary font-bold flex-shrink-0">{i + 1}</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}