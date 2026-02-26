import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ServiceRequest {
    id: bigint;
    status: RequestStatus;
    client: Principal;
    serviceType: ServiceType;
    name?: string;
    createdAt: Time;
    description: string;
    deadline: Time;
    email?: string;
    company?: string;
    phone?: string;
}
export interface ComplianceDeliverable {
    id: bigint;
    status: DeliverableStatus;
    client: Principal;
    title: string;
    dueDate: Time;
    deliverableType: DeliverableType;
}
export type Time = bigint;
export interface TechnicalReliabilityMetrics {
    pageLoadMs: bigint;
    sslStatus: boolean;
    mobileScore: bigint;
}
export interface PaymentRecord {
    id: bigint;
    status: PaymentStatus;
    client: Principal;
    paymentMethod: PaymentMethod;
    cardType?: string;
    timestamp: Time;
    currencyCode: string;
    amount: bigint;
}
export interface LeadGenerationMetrics {
    leadQualityBreakup: {
        low: bigint;
        high: bigint;
        medium: bigint;
    };
    formSubmissions: bigint;
    clickToCallCount: bigint;
}
export interface CompanyContactDetails {
    email: string;
    phoneNumber: string;
}
export interface TimelineEntry {
    id: bigint;
    status: TimelineStatus;
    title: string;
    endDate: Time;
    description: string;
    clientPrincipal?: Principal;
    taskReference?: bigint;
    startDate: Time;
}
export interface TrustMetrics {
    testimonialClicks: bigint;
    blogEngagement: bigint;
    aboutPageAvgTime: bigint;
}
export interface ClientDocument {
    id: bigint;
    client: Principal;
    file: ExternalBlob;
    name: string;
    mimeType: string;
    docType: DocumentType;
    uploadedAt: Time;
}
export interface ClientDeliverableInput {
    title: string;
    file: ExternalBlob;
    description: string;
}
export interface ClientDeliverable {
    id: bigint;
    status: ClientDeliverableStatus;
    title: string;
    submitter: Principal;
    file: ExternalBlob;
    createdAt: Time;
    description: string;
}
export interface ExportableFile {
    id: bigint;
    originalFormat: string;
    file: ExternalBlob;
    name: string;
    availableFormats: Array<ExportFormat>;
}
export interface ClientRetentionMetrics {
    portalFunnelDropoffs: bigint;
    returningUserRatio: number;
}
export interface FollowUpItem {
    id: bigint;
    status: FollowUpStatus;
    title: string;
    dueDate: Time;
    description: string;
    clientPrincipal?: Principal;
    notes: string;
    clientReference?: Principal;
}
export type UploadDocumentResult = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "notApproved";
    notApproved: null;
};
export interface ToDoDocument {
    file: ExternalBlob;
    mimeType: string;
    fileName: string;
}
export interface AdminPaymentSettings {
    paypalEmail: string;
}
export interface ToDoItem {
    id: bigint;
    status: ToDoStatus;
    title: string;
    createdAt: Time;
    description: string;
    clientPrincipal?: Principal;
    assignedClient?: Principal;
    document?: ToDoDocument;
    priority: ToDoPriority;
}
export interface AdminClientDeliverableInput {
    title: string;
    file: ExternalBlob;
    description: string;
    clientPrincipal: Principal;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface SearchIntentMetrics {
    localSeoRankings: bigint;
    seasonalKeywordTrends: Array<string>;
    aiVisibilityScore: bigint;
}
export interface ServiceRequestInput {
    serviceType: ServiceType;
    name: string;
    description: string;
    deadline: Time;
    email: string;
    company: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
    company: string;
}
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ClientDeliverableStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum DeliverableStatus {
    completed = "completed",
    approved = "approved",
    inReview = "inReview",
    rejected = "rejected",
    drafting = "drafting"
}
export enum DeliverableType {
    consulting = "consulting",
    annual = "annual",
    quarterly = "quarterly",
    monthly = "monthly"
}
export enum DocumentType {
    accountingServices = "accountingServices",
    gstFiling = "gstFiling",
    financialManagement = "financialManagement",
    tdsFiling = "tdsFiling",
    payrollReport = "payrollReport",
    auditDoc = "auditDoc",
    taxFiling = "taxFiling",
    loanFinancing = "loanFinancing"
}
export enum ExportFormat {
    csv = "csv",
    pdf = "pdf",
    zip = "zip",
    docx = "docx",
    xlsx = "xlsx",
    image = "image"
}
export enum FollowUpStatus {
    pending = "pending",
    completed = "completed"
}
export enum PaymentMethod {
    creditCard = "creditCard",
    applePay = "applePay",
    googlePay = "googlePay",
    debitCard = "debitCard",
    paypal = "paypal"
}
export enum PaymentStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum RequestStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum ServiceType {
    bankReconciliation = "bankReconciliation",
    accountingServices = "accountingServices",
    incomeTaxFiling = "incomeTaxFiling",
    gstFiling = "gstFiling",
    financialManagement = "financialManagement",
    other = "other",
    tdsFiling = "tdsFiling",
    audits = "audits",
    corporateTaxFiling = "corporateTaxFiling",
    payrollAdmin = "payrollAdmin",
    ledgerMaintenance = "ledgerMaintenance",
    loanFinancing = "loanFinancing"
}
export enum TimelineStatus {
    completed = "completed",
    planned = "planned",
    inProgress = "inProgress"
}
export enum ToDoPriority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum ToDoStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClientFollowUp(title: string, description: string, dueDate: Time, status: FollowUpStatus, notes: string): Promise<bigint>;
    createClientTimeline(title: string, description: string, startDate: Time, endDate: Time, status: TimelineStatus): Promise<bigint>;
    createClientToDo(title: string, description: string, priority: ToDoPriority, status: ToDoStatus, document: ToDoDocument | null): Promise<bigint>;
    createDeliverable(clientPrincipal: Principal, title: string, dueDate: Time, deliverableType: DeliverableType): Promise<bigint>;
    createFollowUp(title: string, description: string, dueDate: Time, clientReference: Principal | null, status: FollowUpStatus, notes: string): Promise<bigint>;
    createPayment(amount: bigint, currencyCode: string, paymentMethod: PaymentMethod, cardType: string | null): Promise<bigint>;
    createRequest(serviceType: ServiceType, description: string, deadline: Time): Promise<bigint>;
    createTimelineEntry(title: string, description: string, startDate: Time, endDate: Time, status: TimelineStatus, taskReference: bigint | null, clientPrincipal: Principal | null): Promise<bigint>;
    createToDo(title: string, description: string, priority: ToDoPriority, status: ToDoStatus, assignedClient: Principal | null, document: ToDoDocument | null): Promise<bigint>;
    createVisitorRequest(input: ServiceRequestInput): Promise<bigint>;
    getAdminPaymentSettings(): Promise<AdminPaymentSettings | null>;
    getAllComplianceDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getAllDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getAllDocuments(): Promise<Array<ClientDocument>>;
    getAllFollowUps(): Promise<Array<FollowUpItem>>;
    getAllPayments(): Promise<Array<PaymentRecord>>;
    getAllRequests(): Promise<Array<ServiceRequest>>;
    getAllSubmittedDeliverables(): Promise<Array<ClientDeliverable>>;
    getAllTimelines(): Promise<Array<TimelineEntry>>;
    getAllToDos(): Promise<Array<ToDoItem>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientDeliverables(client: Principal): Promise<Array<ComplianceDeliverable>>;
    getClientDocuments(client: Principal): Promise<Array<ClientDocument>>;
    getClientRequests(client: Principal): Promise<Array<ServiceRequest>>;
    getClientSubmissions(owner: Principal): Promise<Array<ClientDeliverable>>;
    getCompanyContactDetails(): Promise<CompanyContactDetails>;
    getExportableFiles(): Promise<Array<ExportableFile>>;
    getMyDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getMyDocuments(): Promise<Array<ClientDocument>>;
    getMyFollowUps(): Promise<Array<FollowUpItem>>;
    getMyPayments(): Promise<Array<PaymentRecord>>;
    getMyPendingDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getMyRequests(): Promise<Array<ServiceRequest>>;
    getMySubmittedDeliverables(): Promise<Array<ClientDeliverable>>;
    getMyTimelines(): Promise<Array<TimelineEntry>>;
    getMyToDos(): Promise<Array<ToDoItem>>;
    getNewAnalyticsSummary(): Promise<{
        searchIntent: SearchIntentMetrics;
        trust: TrustMetrics;
        technicalReliability: TechnicalReliabilityMetrics;
        leadGeneration: LeadGenerationMetrics;
        clientRetention: ClientRetentionMetrics;
    }>;
    getPendingDeliverables(client: Principal): Promise<Array<ComplianceDeliverable>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfileByPrincipal(user: Principal): Promise<UserProfile | null>;
    isAdminUser(): Promise<boolean>;
    isAnyUser(_caller: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminPaymentSettings(settings: AdminPaymentSettings): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitDeliverable(input: ClientDeliverableInput): Promise<bigint>;
    submitDeliverableForClient(input: AdminClientDeliverableInput): Promise<bigint>;
    updateClientDeliverableStatus(deliverableId: bigint, newStatus: ClientDeliverableStatus): Promise<void>;
    updateCompanyContactDetails(newDetails: CompanyContactDetails): Promise<void>;
    updateFollowUpStatus(followUpId: bigint, newStatus: FollowUpStatus): Promise<void>;
    updatePaymentStatus(paymentId: bigint, status: PaymentStatus): Promise<void>;
    updateStatus(requestId: bigint, status: RequestStatus): Promise<void>;
    updateTimelineStatus(timelineId: bigint, newStatus: TimelineStatus): Promise<void>;
    updateToDoStatus(toDoId: bigint, newStatus: ToDoStatus): Promise<void>;
    uploadDocument(docType: DocumentType, name: string, mimeType: string, file: ExternalBlob): Promise<UploadDocumentResult>;
}
