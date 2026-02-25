import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  var userApprovalState : UserApproval.UserApprovalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type ServiceType = {
    #incomeTaxFiling;
    #corporateTaxFiling;
    #audits;
    #payrollAdmin;
    #ledgerMaintenance;
    #bankReconciliation;
    #other;
  };

  public type ServiceRequest = {
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

  public type RequestStatus = {
    #pending;
    #inProgress;
    #completed;
    #cancelled;
  };

  public type ClientDocument = {
    id : Nat;
    client : Principal;
    docType : DocumentType;
    name : Text;
    uploadedAt : Time.Time;
    file : Storage.ExternalBlob;
  };

  public type DocumentType = {
    #taxFiling;
    #payrollReport;
    #auditDoc;
  };

  public type ComplianceDeliverable = {
    id : Nat;
    client : Principal;
    title : Text;
    status : DeliverableStatus;
    dueDate : Time.Time;
    deliverableType : DeliverableType;
  };

  public type DeliverableStatus = {
    #drafting;
    #inReview;
    #completed;
    #approved;
    #rejected;
  };

  public type DeliverableType = {
    #consulting;
    #monthly;
    #annual;
    #quarterly;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    company : Text;
  };

  public type ServiceRequestInput = {
    name : Text;
    email : Text;
    company : Text;
    phone : Text;
    serviceType : ServiceType;
    description : Text;
    deadline : Time.Time;
  };

  public type UploadDocumentResult = {
    #ok : Nat;
    #notApproved;
  };

  public type PaymentMethod = {
    #paypal;
    #creditCard;
    #debitCard;
    #applePay;
    #googlePay;
  };

  public type PaymentStatus = {
    #pending;
    #completed;
    #failed;
  };

  public type PaymentRecord = {
    id : Nat;
    client : Principal;
    amount : Nat;
    currencyCode : Text;
    paymentMethod : PaymentMethod;
    cardType : ?Text;
    status : PaymentStatus;
    timestamp : Time.Time;
  };

  public type AdminPaymentSettings = {
    paypalEmail : Text;
  };

  public type ClientDeliverableStatus = {
    #pending;
    #accepted;
    #rejected;
  };

  public type ClientDeliverable = {
    id : Nat;
    submitter : Principal;
    title : Text;
    description : Text;
    file : Storage.ExternalBlob;
    createdAt : Time.Time;
    status : ClientDeliverableStatus;
  };

  // --- New Metrics Types ---
  public type LeadGenerationMetrics = {
    formSubmissions : Nat;
    clickToCallCount : Nat;
    leadQualityBreakup : {
      high : Nat;
      medium : Nat;
      low : Nat;
    };
  };

  public type TrustMetrics = {
    blogEngagement : Nat;
    aboutPageAvgTime : Nat;
    testimonialClicks : Nat;
  };

  public type SearchIntentMetrics = {
    localSeoRankings : Nat;
    seasonalKeywordTrends : [Text];
    aiVisibilityScore : Nat;
  };

  public type TechnicalReliabilityMetrics = {
    sslStatus : Bool;
    mobileScore : Nat;
    pageLoadMs : Nat;
  };

  public type ClientRetentionMetrics = {
    returningUserRatio : Float;
    portalFunnelDropoffs : Nat;
  };

  public type NewAnalyticsSummary = {
    leadGeneration : LeadGenerationMetrics;
    trust : TrustMetrics;
    searchIntent : SearchIntentMetrics;
    technicalReliability : TechnicalReliabilityMetrics;
    clientRetention : ClientRetentionMetrics;
  };

  public type TrafficSourceReport = {
    source : Text;
    visits : Nat;
    conversions : Nat;
  };

  public type SessionMetrics = {
    averageTimeOnPage : Float;
    bounceRate : Float;
    pageViews : Nat;
    sessions : Nat;
  };

  public type SEOScore = {
    score : Nat;
    keywords : Nat;
    backlinks : Nat;
  };

  public type WebVitals = {
    performance : Float;
    accessibility : Float;
    bestPractices : Float;
    seo : Float;
  };

  public type ConversionRate = {
    rate : Float;
    value : Nat;
  };

  public type AnalyticsSummary = {
    sources : [TrafficSourceReport];
    sessionMetrics : SessionMetrics;
    seoScore : SEOScore;
    webVitals : WebVitals;
    conversionRate : ConversionRate;
  };

  var nextRequestId = 0;
  var nextDocumentId = 0;
  var nextDeliverableId = 0;
  var nextPaymentId = 0;
  var nextClientDeliverableId = 0;

  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  let clientDocuments = Map.empty<Nat, ClientDocument>();
  let complianceDeliverables = Map.empty<Nat, ComplianceDeliverable>();
  let paymentRecords = Map.empty<Nat, PaymentRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let clientDeliverables = Map.empty<Nat, ClientDeliverable>();

  var adminPaymentSettings : ?AdminPaymentSettings = null;
  var analyticsSummary : ?AnalyticsSummary = null;

  var newAnalyticsSummary : ?NewAnalyticsSummary = null;

  // --- New Analytics Endpoints ---
  public query ({ caller }) func getNewAnalyticsSummary() : async { leadGeneration : LeadGenerationMetrics; trust : TrustMetrics; searchIntent : SearchIntentMetrics; technicalReliability : TechnicalReliabilityMetrics; clientRetention : ClientRetentionMetrics } {
    if (UserApproval.isApproved(userApprovalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin)) {
      switch (newAnalyticsSummary) {
        case (?summary) {
          {
            leadGeneration = summary.leadGeneration;
            trust = summary.trust;
            searchIntent = summary.searchIntent;
            technicalReliability = summary.technicalReliability;
            clientRetention = summary.clientRetention;
          };
        };
        case (null) {
          {
            leadGeneration = {
              formSubmissions = 100;
              clickToCallCount = 50;
              leadQualityBreakup = {
                high = 60;
                medium = 30;
                low = 10;
              };
            };
            trust = {
              blogEngagement = 200;
              aboutPageAvgTime = 120;
              testimonialClicks = 40;
            };
            searchIntent = {
              localSeoRankings = 5;
              seasonalKeywordTrends = ["tax season", "accounting tips"];
              aiVisibilityScore = 80;
            };
            technicalReliability = {
              sslStatus = true;
              mobileScore = 90;
              pageLoadMs = 1500;
            };
            clientRetention = {
              returningUserRatio = 0.7;
              portalFunnelDropoffs = 20;
            };
          };
        };
      };
    } else {
      Runtime.trap("Unauthorized: Only approved users and admins can access this data");
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Admin-only function to fetch any user's profile by principal
  public query ({ caller }) func getUserProfileByPrincipal(user : Principal) : async ?UserProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view profiles by principal");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Service Request Management
  public shared ({ caller }) func createRequest(serviceType : ServiceType, description : Text, deadline : Time.Time) : async Nat {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can create requests");
    };
    let requestId = nextRequestId;
    let newRequest : ServiceRequest = {
      id = requestId;
      client = caller;
      serviceType;
      description;
      status = #pending;
      createdAt = Time.now();
      deadline;
      name = null;
      email = null;
      company = null;
      phone = null;
    };

    serviceRequests.add(requestId, newRequest);
    nextRequestId += 1;

    requestId;
  };

  public shared ({ caller }) func createVisitorRequest(input : ServiceRequestInput) : async Nat {
    let requestId = nextRequestId;
    let newRequest : ServiceRequest = {
      id = requestId;
      client = caller;
      serviceType = input.serviceType;
      description = input.description;
      status = #pending;
      createdAt = Time.now();
      deadline = input.deadline;
      name = ?input.name;
      email = ?input.email;
      company = ?input.company;
      phone = ?input.phone;
    };

    serviceRequests.add(requestId, newRequest);
    nextRequestId += 1;

    requestId;
  };

  public shared ({ caller }) func uploadDocument(docType : DocumentType, name : Text, file : Storage.ExternalBlob) : async UploadDocumentResult {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can upload documents");
    };
    let docId = nextDocumentId;
    let newDoc : ClientDocument = {
      id = docId;
      client = caller;
      docType;
      name;
      uploadedAt = Time.now();
      file;
    };

    clientDocuments.add(docId, newDoc);
    nextDocumentId += 1;

    #ok(docId);
  };

  // Admin-only: admins create compliance deliverables and assign them to clients
  public shared ({ caller }) func createDeliverable(clientPrincipal : Principal, title : Text, dueDate : Time.Time, deliverableType : DeliverableType) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create deliverables");
    };
    let deliverableId = nextDeliverableId;
    let newDeliverable : ComplianceDeliverable = {
      id = deliverableId;
      client = clientPrincipal;
      title;
      status = #drafting;
      dueDate;
      deliverableType;
    };

    complianceDeliverables.add(deliverableId, newDeliverable);
    nextDeliverableId += 1;

    deliverableId;
  };

  public query ({ caller }) func getClientRequests(client : Principal) : async [ServiceRequest] {
    let values = serviceRequests.values().toArray();
    values.filter(func(request) { request.client == client });
  };

  public query ({ caller }) func getMyRequests() : async [ServiceRequest] {
    let values = serviceRequests.values().toArray();
    values.filter(func(request) { request.client == caller });
  };

  public query ({ caller }) func getClientDeliverables(client : Principal) : async [ComplianceDeliverable] {
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) { deliverable.client == client });
  };

  public query ({ caller }) func getMyDeliverables() : async [ComplianceDeliverable] {
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) { deliverable.client == caller });
  };

  public query ({ caller }) func getPendingDeliverables(client : Principal) : async [ComplianceDeliverable] {
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) {
      deliverable.client == client and (Time.now() < deliverable.dueDate)
    });
  };

  public query ({ caller }) func getMyPendingDeliverables() : async [ComplianceDeliverable] {
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) {
      deliverable.client == caller and (Time.now() < deliverable.dueDate)
    });
  };

  // Update service request status
  public shared ({ caller }) func updateStatus(requestId : Nat, status : RequestStatus) : async () {
    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.client != caller) {
          Runtime.trap("Unauthorized: Can only update your own requests");
        };

        let updatedRequest = {
          request with
          status;
        };
        serviceRequests.add(requestId, updatedRequest);
      };
    };
  };

  // --- Compliance Dashboard Endpoints ---
  // Admin: get all compliance tasks across all clients
  public query ({ caller }) func getAllComplianceDeliverables() : async [ComplianceDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all compliance deliverables");
    };
    complianceDeliverables.values().toArray();
  };

  // New Client Deliverables section

  // Input type for submitting deliverables
  public type ClientDeliverableInput = {
    title : Text;
    description : Text;
    file : Storage.ExternalBlob;
  };

  public shared ({ caller }) func submitDeliverable(input : ClientDeliverableInput) : async Nat {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can submit deliverables");
    };
    let deliverableId = nextClientDeliverableId;
    let newDeliverable : ClientDeliverable = {
      id = deliverableId;
      submitter = caller;
      title = input.title;
      description = input.description;
      file = input.file;
      createdAt = Time.now();
      status = #pending;
    };

    clientDeliverables.add(deliverableId, newDeliverable);
    nextClientDeliverableId += 1;

    deliverableId;
  };

  public shared ({ caller }) func updateClientDeliverableStatus(deliverableId : Nat, newStatus : ClientDeliverableStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update deliverable status");
    };
    switch (clientDeliverables.get(deliverableId)) {
      case (null) { Runtime.trap("Deliverable not found") };
      case (?deliverable) {
        let updatedDeliverable = {
          deliverable with
          status = newStatus;
        };
        clientDeliverables.add(deliverableId, updatedDeliverable);
      };
    };
  };

  public query ({ caller }) func getMySubmittedDeliverables() : async [ClientDeliverable] {
    let values = clientDeliverables.values().toArray();
    values.filter(func(deliverable) { deliverable.submitter == caller });
  };

  public query ({ caller }) func getAllSubmittedDeliverables() : async [ClientDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all submitted deliverables");
    };
    clientDeliverables.values().toArray();
  };

  public query ({ caller }) func getClientSubmissions(owner : Principal) : async [ClientDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view client submissions");
    };
    let values = clientDeliverables.values().toArray();
    values.filter(func(deliverable) { deliverable.submitter == owner });
  };

  // ----- Payment Management -----
  public shared ({ caller }) func createPayment(amount : Nat, currencyCode : Text, paymentMethod : PaymentMethod, cardType : ?Text) : async Nat {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can create payments");
    };
    let paymentId = nextPaymentId;
    let newPayment : PaymentRecord = {
      id = paymentId;
      client = caller;
      amount;
      currencyCode;
      paymentMethod;
      cardType;
      status = #pending;
      timestamp = Time.now();
    };

    paymentRecords.add(paymentId, newPayment);
    nextPaymentId += 1;

    paymentId;
  };

  public query ({ caller }) func getMyPayments() : async [PaymentRecord] {
    let values = paymentRecords.values().toArray();
    values.filter(func(payment) { payment.client == caller });
  };

  public shared ({ caller }) func updatePaymentStatus(paymentId : Nat, status : PaymentStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };
    switch (paymentRecords.get(paymentId)) {
      case (null) { Runtime.trap("Payment record not found") };
      case (?payment) {
        let updatedPayment = {
          payment with
          status;
        };
        paymentRecords.add(paymentId, updatedPayment);
      };
    };
  };

  public query ({ caller }) func getAllPayments() : async [PaymentRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all payments");
    };
    paymentRecords.values().toArray();
  };

  public shared ({ caller }) func setAdminPaymentSettings(settings : AdminPaymentSettings) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set payment settings");
    };
    adminPaymentSettings := ?settings;
  };

  public query ({ caller }) func getAdminPaymentSettings() : async ?AdminPaymentSettings {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can get payment settings");
    };
    adminPaymentSettings;
  };

  // Admin-only functions
  public query ({ caller }) func getAllRequests() : async [ServiceRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all requests");
    };
    serviceRequests.values().toArray();
  };

  public query ({ caller }) func getAllDocuments() : async [ClientDocument] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all documents");
    };
    clientDocuments.values().toArray();
  };

  public query ({ caller }) func getAllDeliverables() : async [ComplianceDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all deliverables");
    };
    complianceDeliverables.values().toArray();
  };

  // User Approval Functions
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(userApprovalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(userApprovalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(userApprovalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(userApprovalState);
  };
};
