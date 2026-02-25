import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  type ServiceType = {
    #incomeTaxFiling;
    #corporateTaxFiling;
    #audits;
    #payrollAdmin;
    #ledgerMaintenance;
    #bankReconciliation;
    #other;
  };

  type ServiceRequest = {
    id : Nat;
    client : Principal;
    serviceType : ServiceType;
    description : Text;
    status : RequestStatus;
    createdAt : Time.Time;
    deadline : Time.Time;
    name : ?Text;
    email : ?Text;
    company : ?Text;
    phone : ?Text;
  };

  type RequestStatus = {
    #pending;
    #inProgress;
    #completed;
    #cancelled;
  };

  type ClientDocument = {
    id : Nat;
    client : Principal;
    docType : DocumentType;
    name : Text;
    uploadedAt : Time.Time;
    file : Blob;
  };

  type DocumentType = {
    #taxFiling;
    #payrollReport;
    #auditDoc;
  };

  type ComplianceDeliverable = {
    id : Nat;
    client : Principal;
    title : Text;
    status : DeliverableStatus;
    dueDate : Time.Time;
    deliverableType : DeliverableType;
  };

  type DeliverableStatus = {
    #drafting;
    #inReview;
    #completed;
    #approved;
    #rejected;
  };

  type DeliverableType = {
    #consulting;
    #monthly;
    #annual;
    #quarterly;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    company : Text;
  };

  type PaymentMethod = {
    #paypal;
    #creditCard;
    #debitCard;
    #applePay;
    #googlePay;
  };

  type PaymentStatus = {
    #pending;
    #completed;
    #failed;
  };

  type PaymentRecord = {
    id : Nat;
    client : Principal;
    amount : Nat;
    currencyCode : Text;
    paymentMethod : PaymentMethod;
    cardType : ?Text;
    status : PaymentStatus;
    timestamp : Time.Time;
  };

  type AdminPaymentSettings = {
    paypalEmail : Text;
  };

  type ClientDeliverableStatus = {
    #pending;
    #accepted;
    #rejected;
  };

  type ClientDeliverable = {
    id : Nat;
    submitter : Principal;
    title : Text;
    description : Text;
    file : Blob;
    createdAt : Time.Time;
    status : ClientDeliverableStatus;
  };

  type LeadGenerationMetrics = {
    formSubmissions : Nat;
    clickToCallCount : Nat;
    leadQualityBreakup : {
      high : Nat;
      medium : Nat;
      low : Nat;
    };
  };

  type TrustMetrics = {
    blogEngagement : Nat;
    aboutPageAvgTime : Nat;
    testimonialClicks : Nat;
  };

  type SearchIntentMetrics = {
    localSeoRankings : Nat;
    seasonalKeywordTrends : [Text];
    aiVisibilityScore : Nat;
  };

  type TechnicalReliabilityMetrics = {
    sslStatus : Bool;
    mobileScore : Nat;
    pageLoadMs : Nat;
  };

  type ClientRetentionMetrics = {
    returningUserRatio : Float;
    portalFunnelDropoffs : Nat;
  };

  type NewAnalyticsSummary = {
    leadGeneration : LeadGenerationMetrics;
    trust : TrustMetrics;
    searchIntent : SearchIntentMetrics;
    technicalReliability : TechnicalReliabilityMetrics;
    clientRetention : ClientRetentionMetrics;
  };

  type TrafficSourceReport = {
    source : Text;
    visits : Nat;
    conversions : Nat;
  };

  type SessionMetrics = {
    averageTimeOnPage : Float;
    bounceRate : Float;
    pageViews : Nat;
    sessions : Nat;
  };

  type SEOScore = {
    score : Nat;
    keywords : Nat;
    backlinks : Nat;
  };

  type WebVitals = {
    performance : Float;
    accessibility : Float;
    bestPractices : Float;
    seo : Float;
  };

  type ConversionRate = {
    rate : Float;
    value : Nat;
  };

  type AnalyticsSummary = {
    sources : [TrafficSourceReport];
    sessionMetrics : SessionMetrics;
    seoScore : SEOScore;
    webVitals : WebVitals;
    conversionRate : ConversionRate;
  };

  type ToDoItem = {
    id : Nat;
    title : Text;
    description : Text;
    status : ToDoStatus;
    priority : ToDoPriority;
    assignedClient : ?Principal;
    createdAt : Time.Time;
    clientPrincipal : ?Principal;
  };

  type ToDoStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  type ToDoPriority = {
    #low;
    #medium;
    #high;
  };

  type TimelineEntry = {
    id : Nat;
    title : Text;
    description : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    taskReference : ?Nat;
    status : TimelineStatus;
    clientPrincipal : ?Principal;
  };

  type TimelineStatus = {
    #planned;
    #inProgress;
    #completed;
  };

  type FollowUpItem = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    clientReference : ?Principal;
    status : FollowUpStatus;
    notes : Text;
    clientPrincipal : ?Principal;
  };

  type FollowUpStatus = {
    #pending;
    #completed;
  };

  // Temporarily keep the deprecated types during migration
  type DeadlineRecord = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    deliverableReference : ?Nat;
    urgencyLevel : UrgencyLevel;
    status : DeadlineStatus;
    clientPrincipal : ?Principal;
  };

  type UrgencyLevel = {
    #high;
    #medium;
    #low;
  };

  type DeadlineStatus = {
    #active;
    #completed;
    #missed;
  };

  type Actor = {
    nextRequestId : Nat;
    nextDocumentId : Nat;
    nextDeliverableId : Nat;
    nextPaymentId : Nat;
    nextClientDeliverableId : Nat;
    nextToDoId : Nat;
    nextTimelineId : Nat;
    nextFollowUpId : Nat;
    nextDeadlineId : Nat;
    serviceRequests : Map.Map<Nat, ServiceRequest>;
    clientDocuments : Map.Map<Nat, ClientDocument>;
    complianceDeliverables : Map.Map<Nat, ComplianceDeliverable>;
    paymentRecords : Map.Map<Nat, PaymentRecord>;
    userProfiles : Map.Map<Principal, UserProfile>;
    clientDeliverables : Map.Map<Nat, ClientDeliverable>;
    toDoItems : Map.Map<Nat, ToDoItem>;
    timelineEntries : Map.Map<Nat, TimelineEntry>;
    followUpItems : Map.Map<Nat, FollowUpItem>;
    deadlineRecords : Map.Map<Nat, DeadlineRecord>;
    adminPaymentSettings : ?AdminPaymentSettings;
    analyticsSummary : ?AnalyticsSummary;
    newAnalyticsSummary : ?NewAnalyticsSummary;
  };

  // Explicitly discard deprecated variables
  public func run(old : Actor) : {
    nextRequestId : Nat;
    nextDocumentId : Nat;
    nextDeliverableId : Nat;
    nextPaymentId : Nat;
    nextClientDeliverableId : Nat;
    nextToDoId : Nat;
    nextTimelineId : Nat;
    nextFollowUpId : Nat;
    serviceRequests : Map.Map<Nat, ServiceRequest>;
    clientDocuments : Map.Map<Nat, ClientDocument>;
    complianceDeliverables : Map.Map<Nat, ComplianceDeliverable>;
    paymentRecords : Map.Map<Nat, PaymentRecord>;
    userProfiles : Map.Map<Principal, UserProfile>;
    clientDeliverables : Map.Map<Nat, ClientDeliverable>;
    toDoItems : Map.Map<Nat, ToDoItem>;
    timelineEntries : Map.Map<Nat, TimelineEntry>;
    followUpItems : Map.Map<Nat, FollowUpItem>;
    adminPaymentSettings : ?AdminPaymentSettings;
    analyticsSummary : ?AnalyticsSummary;
    newAnalyticsSummary : ?NewAnalyticsSummary;
  } {
    {
      nextRequestId = old.nextRequestId;
      nextDocumentId = old.nextDocumentId;
      nextDeliverableId = old.nextDeliverableId;
      nextPaymentId = old.nextPaymentId;
      nextClientDeliverableId = old.nextClientDeliverableId;
      nextToDoId = old.nextToDoId;
      nextTimelineId = old.nextTimelineId;
      nextFollowUpId = old.nextFollowUpId;
      serviceRequests = old.serviceRequests;
      clientDocuments = old.clientDocuments;
      complianceDeliverables = old.complianceDeliverables;
      paymentRecords = old.paymentRecords;
      userProfiles = old.userProfiles;
      clientDeliverables = old.clientDeliverables;
      toDoItems = old.toDoItems;
      timelineEntries = old.timelineEntries;
      followUpItems = old.followUpItems;
      adminPaymentSettings = old.adminPaymentSettings;
      analyticsSummary = old.analyticsSummary;
      newAnalyticsSummary = old.newAnalyticsSummary;
    };
  };
};
