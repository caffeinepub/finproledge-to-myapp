import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Migration "migration";

// Explicitly import migration and use with-clause for data upgrade.

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  var userApprovalState : UserApproval.UserApprovalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type ExportFormat = {
    #pdf;
    #docx;
    #xlsx;
    #csv;
    #zip;
    #image;
  };

  public type ServiceType = {
    #incomeTaxFiling;
    #corporateTaxFiling;
    #audits;
    #payrollAdmin;
    #ledgerMaintenance;
    #bankReconciliation;
    #gstFiling;
    #tdsFiling;
    #financialManagement;
    #accountingServices;
    #loanFinancing;
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
    mimeType : Text;
    uploadedAt : Time.Time;
    file : Storage.ExternalBlob;
  };

  public type DocumentType = {
    #taxFiling;
    #payrollReport;
    #auditDoc;
    #gstFiling;
    #tdsFiling;
    #financialManagement;
    #accountingServices;
    #loanFinancing;
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

  public type ExportableFile = {
    id : Nat;
    name : Text;
    originalFormat : Text;
    availableFormats : [ExportFormat];
    file : Storage.ExternalBlob;
  };

  public type CompanyContactDetails = {
    phoneNumber : Text;
    email : Text;
  };

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

  // Optional document blob for To-Do attachments
  public type ToDoDocument = {
    fileName : Text;
    mimeType : Text;
    file : Storage.ExternalBlob;
  };

  public type ToDoItem = {
    id : Nat;
    title : Text;
    description : Text;
    status : ToDoStatus;
    priority : ToDoPriority;
    assignedClient : ?Principal;
    createdAt : Time.Time;
    clientPrincipal : ?Principal;
    document : ?ToDoDocument;
  };

  public type ToDoStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  public type ToDoPriority = {
    #low;
    #medium;
    #high;
  };

  public type TimelineEntry = {
    id : Nat;
    title : Text;
    description : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    taskReference : ?Nat;
    status : TimelineStatus;
    clientPrincipal : ?Principal;
  };

  public type TimelineStatus = {
    #planned;
    #inProgress;
    #completed;
  };

  public type FollowUpItem = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    clientReference : ?Principal;
    status : FollowUpStatus;
    notes : Text;
    clientPrincipal : ?Principal;
  };

  public type FollowUpStatus = {
    #pending;
    #completed;
  };

  var nextRequestId = 0;
  var nextDocumentId = 0;
  var nextDeliverableId = 0;
  var nextPaymentId = 0;
  var nextClientDeliverableId = 0;
  var nextToDoId = 0;
  var nextTimelineId = 0;
  var nextFollowUpId = 0;

  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  let clientDocuments = Map.empty<Nat, ClientDocument>();
  let complianceDeliverables = Map.empty<Nat, ComplianceDeliverable>();
  let paymentRecords = Map.empty<Nat, PaymentRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let clientDeliverables = Map.empty<Nat, ClientDeliverable>();
  let toDoItems = Map.empty<Nat, ToDoItem>();
  let timelineEntries = Map.empty<Nat, TimelineEntry>();
  let followUpItems = Map.empty<Nat, FollowUpItem>();

  var adminPaymentSettings : ?AdminPaymentSettings = null;
  var analyticsSummary : ?AnalyticsSummary = null;
  var newAnalyticsSummary : ?NewAnalyticsSummary = null;

  var companyContactDetails : CompanyContactDetails = {
    phoneNumber = "+91 123-456-7890";
    email = "info@finlogic.co.in";
  };

  // Returns whether the actual message caller is an admin.
  // Uses shared({ caller }) so the IC-authenticated principal is checked,
  // not an arbitrary principal supplied by the client.
  public shared query ({ caller }) func isAdminUser() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // Returns whether the actual message caller is an approved user or admin.
  // Uses shared query so the IC-authenticated principal is used.
  public shared query ({ caller }) func isAnyUser() : async Bool {
    UserApproval.isApproved(userApprovalState, caller) or AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getNewAnalyticsSummary() : async { leadGeneration : LeadGenerationMetrics; trust : TrustMetrics; searchIntent : SearchIntentMetrics; technicalReliability : TechnicalReliabilityMetrics; clientRetention : ClientRetentionMetrics } {
    if (not (UserApproval.isApproved(userApprovalState, caller) or AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only approved users and admins can access this data");
    };
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
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getUserProfileByPrincipal(user : Principal) : async ?UserProfile {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view profiles by principal");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // The rest of your actor code remains unchanged.
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

  // Visitor request: no auth required (public contact/service inquiry form)
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

  public shared ({ caller }) func uploadDocument(docType : DocumentType, name : Text, mimeType : Text, file : Storage.ExternalBlob) : async UploadDocumentResult {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can upload documents");
    };
    let docId = nextDocumentId;
    let newDoc : ClientDocument = {
      id = docId;
      client = caller;
      docType;
      name;
      mimeType;
      uploadedAt = Time.now();
      file;
    };

    clientDocuments.add(docId, newDoc);
    nextDocumentId += 1;

    #ok(docId);
  };

  public query ({ caller }) func getMyDocuments() : async [ClientDocument] {
    if (not UserApproval.isApproved(userApprovalState, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can view documents");
    };
    let values = clientDocuments.values().toArray();
    values.filter(func(doc) { doc.client == caller });
  };

  public query ({ caller }) func getClientDocuments(client : Principal) : async [ClientDocument] {
    if (caller != client and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own documents");
    };
    let values = clientDocuments.values().toArray();
    values.filter(func(doc) { doc.client == client });
  };

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
    if (caller != client and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own requests");
    };
    let values = serviceRequests.values().toArray();
    values.filter(func(request) { request.client == client });
  };

  public query ({ caller }) func getMyRequests() : async [ServiceRequest] {
    if (not UserApproval.isApproved(userApprovalState, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can view their requests");
    };
    let values = serviceRequests.values().toArray();
    values.filter(func(request) { request.client == caller });
  };

  public query ({ caller }) func getClientDeliverables(client : Principal) : async [ComplianceDeliverable] {
    if (caller != client and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own deliverables");
    };
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) { deliverable.client == client });
  };

  public query ({ caller }) func getMyDeliverables() : async [ComplianceDeliverable] {
    if (not UserApproval.isApproved(userApprovalState, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can view their deliverables");
    };
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) { deliverable.client == caller });
  };

  public query ({ caller }) func getPendingDeliverables(client : Principal) : async [ComplianceDeliverable] {
    if (caller != client and not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Can only view your own pending deliverables");
    };
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) {
      deliverable.client == client and (Time.now() < deliverable.dueDate)
    });
  };

  public query ({ caller }) func getMyPendingDeliverables() : async [ComplianceDeliverable] {
    if (not UserApproval.isApproved(userApprovalState, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can view their pending deliverables");
    };
    let values = complianceDeliverables.values().toArray();
    values.filter(func(deliverable) {
      deliverable.client == caller and (Time.now() < deliverable.dueDate)
    });
  };

  public shared ({ caller }) func updateStatus(requestId : Nat, status : RequestStatus) : async () {
    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdminCaller and not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can update request status");
    };
    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (not isAdminCaller and request.client != caller) {
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

  public query ({ caller }) func getAllComplianceDeliverables() : async [ComplianceDeliverable] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all compliance deliverables");
    };
    complianceDeliverables.values().toArray();
  };

  public type ClientDeliverableInput = {
    title : Text;
    description : Text;
    file : Storage.ExternalBlob;
  };

  public type AdminClientDeliverableInput = {
    clientPrincipal : Principal;
    title : Text;
    description : Text;
    file : Storage.ExternalBlob;
  };

  public shared ({ caller }) func submitDeliverable(input : ClientDeliverableInput) : async Nat {
    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdminCaller and not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can submit deliverables");
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

  public shared ({ caller }) func submitDeliverableForClient(input : AdminClientDeliverableInput) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can submit deliverables on behalf of clients");
    };
    let deliverableId = nextClientDeliverableId;
    let newDeliverable : ClientDeliverable = {
      id = deliverableId;
      submitter = input.clientPrincipal;
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
    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdminCaller and not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can update deliverable status");
    };
    switch (clientDeliverables.get(deliverableId)) {
      case (null) { Runtime.trap("Deliverable not found") };
      case (?deliverable) {
        if (not isAdminCaller and deliverable.submitter != caller) {
          Runtime.trap("Unauthorized: Can only update your own deliverables");
        };
        let updatedDeliverable = {
          deliverable with
          status = newStatus;
        };
        clientDeliverables.add(deliverableId, updatedDeliverable);
      };
    };
  };

  public query ({ caller }) func getMySubmittedDeliverables() : async [ClientDeliverable] {
    if (not UserApproval.isApproved(userApprovalState, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can view their submitted deliverables");
    };
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
    if (not UserApproval.isApproved(userApprovalState, caller) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can view their payments");
    };
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

  public shared ({ caller }) func createToDo(title : Text, description : Text, priority : ToDoPriority, status : ToDoStatus, assignedClient : ?Principal, document : ?ToDoDocument) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create to-dos");
    };
    let toDoId = nextToDoId;
    let newToDo : ToDoItem = {
      id = toDoId;
      title;
      description;
      status;
      priority;
      assignedClient;
      createdAt = Time.now();
      clientPrincipal = assignedClient;
      document;
    };

    toDoItems.add(toDoId, newToDo);
    nextToDoId += 1;

    toDoId;
  };

  public shared ({ caller }) func createTimelineEntry(title : Text, description : Text, startDate : Time.Time, endDate : Time.Time, status : TimelineStatus, taskReference : ?Nat, clientPrincipal : ?Principal) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create timeline entries");
    };
    let timelineId = nextTimelineId;
    let newTimelineEntry : TimelineEntry = {
      id = timelineId;
      title;
      description;
      startDate;
      endDate;
      status;
      taskReference;
      clientPrincipal;
    };

    timelineEntries.add(timelineId, newTimelineEntry);
    nextTimelineId += 1;

    timelineId;
  };

  public shared ({ caller }) func createFollowUp(title : Text, description : Text, dueDate : Time.Time, clientReference : ?Principal, status : FollowUpStatus, notes : Text) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create follow-ups");
    };
    let followUpId = nextFollowUpId;
    let newFollowUp : FollowUpItem = {
      id = followUpId;
      title;
      description;
      dueDate;
      clientReference;
      status;
      notes;
      clientPrincipal = clientReference;
    };

    followUpItems.add(followUpId, newFollowUp);
    nextFollowUpId += 1;

    followUpId;
  };

  public query ({ caller }) func getAllToDos() : async [ToDoItem] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all to-dos");
    };
    toDoItems.values().toArray();
  };

  public query ({ caller }) func getAllTimelines() : async [TimelineEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all timelines");
    };
    timelineEntries.values().toArray();
  };

  public query ({ caller }) func getAllFollowUps() : async [FollowUpItem] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access all follow-ups");
    };
    followUpItems.values().toArray();
  };

  public query ({ caller }) func getMyToDos() : async [ToDoItem] {
    if (not (UserApproval.isApproved(userApprovalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can access their to-dos");
    };
    let toDos = toDoItems.values().toArray();
    toDos.filter(
      func(toDo) {
        switch (toDo.clientPrincipal) {
          case (?client) { client == caller };
          case (null) { false };
        };
      }
    );
  };

  public query ({ caller }) func getMyTimelines() : async [TimelineEntry] {
    if (not (UserApproval.isApproved(userApprovalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can access their timelines");
    };
    let timelines = timelineEntries.values().toArray();
    timelines.filter(
      func(timeline) {
        switch (timeline.clientPrincipal) {
          case (?client) { client == caller };
          case (null) { false };
        };
      }
    );
  };

  public query ({ caller }) func getMyFollowUps() : async [FollowUpItem] {
    if (not (UserApproval.isApproved(userApprovalState, caller) or AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only approved users can access their follow-ups");
    };
    let followUps = followUpItems.values().toArray();
    followUps.filter(
      func(followUp) {
        switch (followUp.clientPrincipal) {
          case (?client) { client == caller };
          case (null) { false };
        };
      }
    );
  };

  public shared ({ caller }) func createClientToDo(title : Text, description : Text, priority : ToDoPriority, status : ToDoStatus, document : ?ToDoDocument) : async Nat {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can create to-dos");
    };
    let toDoId = nextToDoId;
    let newToDo : ToDoItem = {
      id = toDoId;
      title;
      description;
      status;
      priority;
      assignedClient = ?caller;
      createdAt = Time.now();
      clientPrincipal = ?caller;
      document;
    };

    toDoItems.add(toDoId, newToDo);
    nextToDoId += 1;

    toDoId;
  };

  public shared ({ caller }) func createClientTimeline(title : Text, description : Text, startDate : Time.Time, endDate : Time.Time, status : TimelineStatus) : async Nat {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can create timelines");
    };
    let timelineId = nextTimelineId;
    let newTimelineEntry : TimelineEntry = {
      id = timelineId;
      title;
      description;
      startDate;
      endDate;
      status;
      taskReference = null;
      clientPrincipal = ?caller;
    };

    timelineEntries.add(timelineId, newTimelineEntry);
    nextTimelineId += 1;

    timelineId;
  };

  public shared ({ caller }) func createClientFollowUp(title : Text, description : Text, dueDate : Time.Time, status : FollowUpStatus, notes : Text) : async Nat {
    if (not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users can create follow-ups");
    };
    let followUpId = nextFollowUpId;
    let newFollowUp : FollowUpItem = {
      id = followUpId;
      title;
      description;
      dueDate;
      clientReference = ?caller;
      status;
      notes;
      clientPrincipal = ?caller;
    };

    followUpItems.add(followUpId, newFollowUp);
    nextFollowUpId += 1;

    followUpId;
  };

  public shared ({ caller }) func updateToDoStatus(toDoId : Nat, newStatus : ToDoStatus) : async () {
    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdminCaller and not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can update To-Dos");
    };
    switch (toDoItems.get(toDoId)) {
      case (null) { Runtime.trap("To-Do item not found") };
      case (?toDo) {
        if (not isAdminCaller) {
          switch (toDo.clientPrincipal) {
            case (?client) {
              if (client != caller) {
                Runtime.trap("Unauthorized: Can only update your own to-dos");
              };
            };
            case (null) {
              Runtime.trap("Unauthorized: Can only update your own to-dos");
            };
          };
        };
        let updatedToDo = {
          toDo with
          status = newStatus;
        };
        toDoItems.add(toDoId, updatedToDo);
      };
    };
  };

  public shared ({ caller }) func updateTimelineStatus(timelineId : Nat, newStatus : TimelineStatus) : async () {
    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdminCaller and not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can update Timelines");
    };
    switch (timelineEntries.get(timelineId)) {
      case (null) { Runtime.trap("Timeline entry not found") };
      case (?timeline) {
        if (not isAdminCaller) {
          switch (timeline.clientPrincipal) {
            case (?client) {
              if (client != caller) {
                Runtime.trap("Unauthorized: Can only update your own timelines");
              };
            };
            case (null) {
              Runtime.trap("Unauthorized: Can only update your own timelines");
            };
          };
        };
        let updatedTimeline = {
          timeline with
          status = newStatus;
        };
        timelineEntries.add(timelineId, updatedTimeline);
      };
    };
  };

  public shared ({ caller }) func updateFollowUpStatus(followUpId : Nat, newStatus : FollowUpStatus) : async () {
    let isAdminCaller = AccessControl.isAdmin(accessControlState, caller);
    if (not isAdminCaller and not UserApproval.isApproved(userApprovalState, caller)) {
      Runtime.trap("Unauthorized: Only approved users or admins can update Follow-Ups");
    };
    switch (followUpItems.get(followUpId)) {
      case (null) { Runtime.trap("Follow-up item not found") };
      case (?followUp) {
        if (not isAdminCaller) {
          switch (followUp.clientPrincipal) {
            case (?client) {
              if (client != caller) {
                Runtime.trap("Unauthorized: Can only update your own follow-ups");
              };
            };
            case (null) {
              Runtime.trap("Unauthorized: Can only update your own follow-ups");
            };
          };
        };
        let updatedFollowUp = {
          followUp with
          status = newStatus;
        };
        followUpItems.add(followUpId, updatedFollowUp);
      };
    };
  };

  // New endpoints for download functionality
  public query ({ caller }) func getExportableFiles() : async [ExportableFile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can access exportable files");
    };

    let fileList = clientDocuments.values().toArray();
    let deliverablesList = clientDeliverables.values().toArray();

    let exportableFiles = fileList.map(
      func(doc) {
        {
          id = doc.id;
          name = doc.name;
          originalFormat = doc.mimeType;
          availableFormats = [#pdf, #docx, #xlsx, #csv];
          file = doc.file;
        };
      }
    );

    let deliverablesFiles = deliverablesList.map(
      func(deliverable) {
        {
          id = deliverable.id;
          name = deliverable.title;
          originalFormat = "application/pdf";
          availableFormats = [#pdf, #docx, #xlsx];
          file = deliverable.file;
        };
      }
    );

    let toDoFiles = [] : [ExportableFile];

    exportableFiles.concat(deliverablesFiles).concat(toDoFiles);
  };

  // Public endpoint: company contact details are publicly visible
  public query func getCompanyContactDetails() : async CompanyContactDetails {
    companyContactDetails;
  };

  public shared ({ caller }) func updateCompanyContactDetails(newDetails : CompanyContactDetails) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact details");
    };
    companyContactDetails := newDetails;
  };
};
