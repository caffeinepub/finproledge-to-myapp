import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, BarChart3, Star, BookOpen, MapPin, ShieldCheck, RefreshCw, Globe, Users, Search, Zap, Target } from 'lucide-react';
import { useGetAnalyticsSummary, useGetNewAnalyticsSummary } from '../hooks/useAnalytics';
import TrafficAcquisitionSection from './analytics/TrafficAcquisitionSection';
import UserBehaviorSection from './analytics/UserBehaviorSection';
import SEOAnalysisSection from './analytics/SEOAnalysisSection';
import TechnicalPerformanceSection from './analytics/TechnicalPerformanceSection';
import ConversionAnalysisSection from './analytics/ConversionAnalysisSection';
import LeadGenerationSection from './analytics/LeadGenerationSection';
import TrustMetricsSection from './analytics/TrustMetricsSection';
import SearchIntentSection from './analytics/SearchIntentSection';
import TechnicalReliabilitySection from './analytics/TechnicalReliabilitySection';
import ClientRetentionSection from './analytics/ClientRetentionSection';

// Fallback mock data when backend returns null
const MOCK_ANALYTICS = {
  sources: [
    { source: 'Google', visits: BigInt(5420), conversions: BigInt(312) },
    { source: 'Social Media', visits: BigInt(2180), conversions: BigInt(145) },
    { source: 'Direct', visits: BigInt(1870), conversions: BigInt(198) },
    { source: 'Referral', visits: BigInt(980), conversions: BigInt(67) },
    { source: 'Email', visits: BigInt(470), conversions: BigInt(89) },
  ],
  sessionMetrics: {
    averageTimeOnPage: 154,
    bounceRate: 0.384,
    pageViews: BigInt(10920),
    sessions: BigInt(6840),
  },
  seoScore: {
    score: BigInt(78),
    keywords: BigInt(142),
    backlinks: BigInt(384),
  },
  webVitals: {
    performance: 0.82,
    accessibility: 0.94,
    bestPractices: 0.88,
    seo: 0.91,
  },
  conversionRate: {
    rate: 0.0842,
    value: BigInt(1400),
  },
};

const MOCK_NEW_ANALYTICS = {
  leadGeneration: {
    formSubmissions: BigInt(100),
    clickToCallCount: BigInt(50),
    leadQualityBreakup: { high: BigInt(60), medium: BigInt(30), low: BigInt(10) },
  },
  trust: {
    blogEngagement: BigInt(200),
    aboutPageAvgTime: BigInt(120),
    testimonialClicks: BigInt(40),
  },
  searchIntent: {
    localSeoRankings: BigInt(5),
    seasonalKeywordTrends: ['tax season', 'accounting tips'],
    aiVisibilityScore: BigInt(80),
  },
  technicalReliability: {
    sslStatus: true,
    mobileScore: BigInt(90),
    pageLoadMs: BigInt(1500),
  },
  clientRetention: {
    returningUserRatio: 0.7,
    portalFunnelDropoffs: BigInt(20),
  },
};

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('traffic');
  const { data: analyticsData, isLoading: analyticsLoading, isError: analyticsError } = useGetAnalyticsSummary();
  const { data: newAnalyticsData, isLoading: newAnalyticsLoading } = useGetNewAnalyticsSummary();

  const analytics = analyticsData ?? MOCK_ANALYTICS;
  const newAnalytics = newAnalyticsData ?? MOCK_NEW_ANALYTICS;

  const isLoading = analyticsLoading || newAnalyticsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 py-2">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-serif font-semibold text-foreground">Site Analytics</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <Skeleton key={i} className="h-9 w-full rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (analyticsError) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analytics data. Displaying sample data instead.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Site Analytics</h2>
        <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">10 sections</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-1 h-auto gap-1">
          <TabsTrigger value="traffic" className="flex items-center gap-1 text-xs py-2 px-1">
            <Globe className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Traffic</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-1 text-xs py-2 px-1">
            <Users className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Behavior</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-1 text-xs py-2 px-1">
            <Search className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-1 text-xs py-2 px-1">
            <Zap className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Web Vitals</span>
          </TabsTrigger>
          <TabsTrigger value="conversion" className="flex items-center gap-1 text-xs py-2 px-1">
            <Target className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Conversion</span>
          </TabsTrigger>
        </TabsList>

        <TabsList className="grid w-full grid-cols-5 mb-4 h-auto gap-1">
          <TabsTrigger value="leads" className="flex items-center gap-1 text-xs py-2 px-1">
            <Star className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Leads</span>
          </TabsTrigger>
          <TabsTrigger value="trust" className="flex items-center gap-1 text-xs py-2 px-1">
            <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Trust</span>
          </TabsTrigger>
          <TabsTrigger value="search-intent" className="flex items-center gap-1 text-xs py-2 px-1">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Search Intent</span>
          </TabsTrigger>
          <TabsTrigger value="reliability" className="flex items-center gap-1 text-xs py-2 px-1">
            <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Reliability</span>
          </TabsTrigger>
          <TabsTrigger value="retention" className="flex items-center gap-1 text-xs py-2 px-1">
            <RefreshCw className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Retention</span>
          </TabsTrigger>
        </TabsList>

        {/* Existing 5 sections */}
        <TabsContent value="traffic">
          <TrafficAcquisitionSection sources={analytics.sources} />
        </TabsContent>

        <TabsContent value="behavior">
          <UserBehaviorSection sessionMetrics={analytics.sessionMetrics} />
        </TabsContent>

        <TabsContent value="seo">
          <SEOAnalysisSection seoScore={analytics.seoScore} />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalPerformanceSection webVitals={analytics.webVitals} />
        </TabsContent>

        <TabsContent value="conversion">
          <ConversionAnalysisSection conversionRate={analytics.conversionRate} />
        </TabsContent>

        {/* New 5 sections */}
        <TabsContent value="leads">
          <LeadGenerationSection data={newAnalytics.leadGeneration} />
        </TabsContent>

        <TabsContent value="trust">
          <TrustMetricsSection data={newAnalytics.trust} />
        </TabsContent>

        <TabsContent value="search-intent">
          <SearchIntentSection data={newAnalytics.searchIntent} />
        </TabsContent>

        <TabsContent value="reliability">
          <TechnicalReliabilitySection data={newAnalytics.technicalReliability} />
        </TabsContent>

        <TabsContent value="retention">
          <ClientRetentionSection data={newAnalytics.clientRetention} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
