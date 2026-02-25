import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import Storage "blob-storage/Storage";



actor {
  let accessControlState = AccessControl.initState();

  let userApprovalState = UserApproval.initState(accessControlState);

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
    #notStarted;
    #inProgress;
    #awaitingReview;
    #completed;
    #overdue;
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

  var nextRequestId = 0;
  var nextDocumentId = 0;
  var nextDeliverableId = 0;
  var nextPaymentId = 0;

  let serviceRequests = Map.empty<Nat, ServiceRequest>();
  let clientDocuments = Map.empty<Nat, ClientDocument>();
  let complianceDeliverables = Map.empty<Nat, ComplianceDeliverable>();
  let paymentRecords = Map.empty<Nat, PaymentRecord>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var adminPaymentSettings : ?AdminPaymentSettings = null;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Admin-only function to fetch any user's profile by principal
  public query ({ caller }) func getUserProfileByPrincipal(user : Principal) : async ?UserProfile {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view any user profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Service Request Management
  public shared ({ caller }) func createRequest(serviceType : ServiceType, description : Text, deadline : Time.Time) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create requests");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can upload documents");
    };

    if (not AccessControl.isAdmin(accessControlState, caller) and not UserApproval.isApproved(userApprovalState, caller)) {
      return #notApproved;
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

  public shared ({ caller }) func createDeliverable(title : Text, dueDate : Time.Time, deliverableType : DeliverableType) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create deliverables");
    };

    let deliverableId = nextDeliverableId;
    let newDeliverable : ComplianceDeliverable = {
      id = deliverableId;
      client = caller;
      title;
      status = #notStarted;
      dueDate;
      deliverableType;
    };

    complianceDeliverables.add(deliverableId, newDeliverable);
    nextDeliverableId += 1;

    deliverableId;
  };

  public query ({ caller }) func getClientRequests(client : Principal) : async [ServiceRequest] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch requests");
    };

    if (caller != client and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own requests");
    };

    serviceRequests.values().toArray().filter(
      func(request) { request.client == client }
    );
  };

  public query ({ caller }) func getMyRequests() : async [ServiceRequest] {
    serviceRequests.values().toArray().filter(
      func(request) { request.client == caller }
    );
  };

  public query ({ caller }) func getClientDeliverables(client : Principal) : async [ComplianceDeliverable] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch deliverables");
    };

    if (caller != client and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own deliverables");
    };

    complianceDeliverables.values().toArray().filter(
      func(deliverable) { deliverable.client == client }
    );
  };

  public query ({ caller }) func getMyDeliverables() : async [ComplianceDeliverable] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch deliverables");
    };

    complianceDeliverables.values().toArray().filter(
      func(deliverable) { deliverable.client == caller }
    );
  };

  public query ({ caller }) func getPendingDeliverables(client : Principal) : async [ComplianceDeliverable] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch deliverables");
    };

    if (caller != client and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own deliverables");
    };

    let now = Time.now();

    complianceDeliverables.values().toArray().filter(
      func(deliverable) {
        deliverable.client == client and (now < deliverable.dueDate)
      }
    );
  };

  public query ({ caller }) func getMyPendingDeliverables() : async [ComplianceDeliverable] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch deliverables");
    };

    let now = Time.now();

    complianceDeliverables.values().toArray().filter(
      func(deliverable) {
        deliverable.client == caller and (now < deliverable.dueDate)
      }
    );
  };

  // Update status:
  public shared ({ caller }) func updateStatus(requestId : Nat, status : RequestStatus) : async () {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isUser = AccessControl.hasPermission(accessControlState, caller, #user);

    if (not isAdmin and not isUser) {
      Runtime.trap("Unauthorized: Only authenticated users or admins can update status");
    };

    switch (serviceRequests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (not isAdmin and request.client != caller) {
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

  public shared ({ caller }) func updateDeliverableStatus(deliverableId : Nat, newStatus : DeliverableStatus) : async () {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isUser = AccessControl.hasPermission(accessControlState, caller, #user);

    if (not isAdmin and not isUser) {
      Runtime.trap("Unauthorized: Only authenticated users or admins can update deliverable status");
    };

    switch (complianceDeliverables.get(deliverableId)) {
      case (null) { Runtime.trap("Deliverable not found") };
      case (?deliverable) {
        if (not isAdmin and deliverable.client != caller) {
          Runtime.trap("Unauthorized: Can only update your own deliverables");
        };

        let updatedDeliverable = {
          deliverable with
          status = newStatus;
        };
        complianceDeliverables.add(deliverableId, updatedDeliverable);
      };
    };
  };

  // Payment Management
  public shared ({ caller }) func createPayment(amount : Nat, currencyCode : Text, paymentMethod : PaymentMethod, cardType : ?Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create payments");
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can fetch payments");
    };

    paymentRecords.values().toArray().filter(
      func(payment) { payment.client == caller }
    );
  };

  public shared ({ caller }) func updatePaymentStatus(paymentId : Nat, status : PaymentStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
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
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all payments");
    };

    paymentRecords.values().toArray();
  };

  public shared ({ caller }) func setAdminPaymentSettings(settings : AdminPaymentSettings) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can set payment settings");
    };

    adminPaymentSettings := ?settings;
  };

  public query ({ caller }) func getAdminPaymentSettings() : async ?AdminPaymentSettings {
    adminPaymentSettings;
  };

  // Admin-only functions
  public query ({ caller }) func getAllRequests() : async [ServiceRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all requests");
    };

    serviceRequests.values().toArray();
  };

  public query ({ caller }) func getAllDocuments() : async [ClientDocument] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all documents");
    };

    clientDocuments.values().toArray();
  };

  public query ({ caller }) func getAllDeliverables() : async [ComplianceDeliverable] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all deliverables");
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

  public shared ({ caller }) func approveClient(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve clients");
    };
    UserApproval.setApproval(userApprovalState, user, #approved);
  };

  public shared ({ caller }) func rejectClient(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject clients");
    };
    UserApproval.setApproval(userApprovalState, user, #rejected);
  };

  public query ({ caller }) func getClientApprovalStatus(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own approval status");
    };
    UserApproval.isApproved(userApprovalState, user);
  };

  public query ({ caller }) func getAllPendingClients() : async [UserApproval.UserApprovalInfo] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending clients");
    };
    UserApproval.listApprovals(userApprovalState).filter(
      func(info) { info.status == #pending }
    );
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(userApprovalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(userApprovalState);
  };
};
