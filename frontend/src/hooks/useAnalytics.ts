import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { LeadGenerationMetrics, TrustMetrics, SearchIntentMetrics, TechnicalReliabilityMetrics, ClientRetentionMetrics } from '../backend';
import { TrafficSourceReport } from '../components/analytics/TrafficAcquisitionSection';
import { SessionMetrics } from '../components/analytics/UserBehaviorSection';
import { SEOScore } from '../components/analytics/SEOAnalysisSection';
import { WebVitals } from '../components/analytics/TechnicalPerformanceSection';
import { ConversionRate } from '../components/analytics/ConversionAnalysisSection';

export interface AnalyticsSummary {
  sources: TrafficSourceReport[];
  sessionMetrics: SessionMetrics;
  seoScore: SEOScore;
  webVitals: WebVitals;
  conversionRate: ConversionRate;
}

export function useGetAnalyticsSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalyticsSummary | null>({
    queryKey: ['analyticsSummary'],
    queryFn: async () => {
      if (!actor) return null;
      // getAnalyticsSummary may not exist on the backend; return null gracefully
      try {
        return await (actor as any).getAnalyticsSummary();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export interface NewAnalyticsSummaryData {
  leadGeneration: LeadGenerationMetrics;
  trust: TrustMetrics;
  searchIntent: SearchIntentMetrics;
  technicalReliability: TechnicalReliabilityMetrics;
  clientRetention: ClientRetentionMetrics;
}

export function useGetNewAnalyticsSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<NewAnalyticsSummaryData | null>({
    queryKey: ['newAnalyticsSummary'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNewAnalyticsSummary();
    },
    enabled: !!actor && !isFetching,
  });
}
