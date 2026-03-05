import { useQuery } from "@tanstack/react-query";
import type {
  ClientRetentionMetrics,
  LeadGenerationMetrics,
  SearchIntentMetrics,
  TechnicalReliabilityMetrics,
  TrustMetrics,
} from "../backend";
import type { ConversionRate } from "../components/analytics/ConversionAnalysisSection";
import type { SEOScore } from "../components/analytics/SEOAnalysisSection";
import type { WebVitals } from "../components/analytics/TechnicalPerformanceSection";
import type { TrafficSourceReport } from "../components/analytics/TrafficAcquisitionSection";
import type { SessionMetrics } from "../components/analytics/UserBehaviorSection";
import { useActor } from "./useActor";

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
    queryKey: ["analyticsSummary"],
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
    queryKey: ["newAnalyticsSummary"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNewAnalyticsSummary();
    },
    enabled: !!actor && !isFetching,
  });
}
