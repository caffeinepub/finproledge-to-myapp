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
export type UploadDocumentResult = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "notApproved";
    notApproved: null;
};
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
export interface AdminPaymentSettings {
    paypalEmail: string;
}
export interface ClientDocument {
    id: bigint;
    client: Principal;
    file: ExternalBlob;
    name: string;
    docType: DocumentType;
    uploadedAt: Time;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
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
export enum DeliverableStatus {
    notStarted = "notStarted",
    awaitingReview = "awaitingReview",
    completed = "completed",
    overdue = "overdue",
    inProgress = "inProgress"
}
export enum DeliverableType {
    consulting = "consulting",
    annual = "annual",
    quarterly = "quarterly",
    monthly = "monthly"
}
export enum DocumentType {
    payrollReport = "payrollReport",
    auditDoc = "auditDoc",
    taxFiling = "taxFiling"
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
    incomeTaxFiling = "incomeTaxFiling",
    other = "other",
    audits = "audits",
    corporateTaxFiling = "corporateTaxFiling",
    payrollAdmin = "payrollAdmin",
    ledgerMaintenance = "ledgerMaintenance"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveClient(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDeliverable(title: string, dueDate: Time, deliverableType: DeliverableType): Promise<bigint>;
    createPayment(amount: bigint, currencyCode: string, paymentMethod: PaymentMethod, cardType: string | null): Promise<bigint>;
    createRequest(serviceType: ServiceType, description: string, deadline: Time): Promise<bigint>;
    createVisitorRequest(input: ServiceRequestInput): Promise<bigint>;
    getAdminPaymentSettings(): Promise<AdminPaymentSettings | null>;
    getAllDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getAllDocuments(): Promise<Array<ClientDocument>>;
    getAllPayments(): Promise<Array<PaymentRecord>>;
    getAllPendingClients(): Promise<Array<UserApprovalInfo>>;
    getAllRequests(): Promise<Array<ServiceRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientApprovalStatus(user: Principal): Promise<boolean>;
    getClientDeliverables(client: Principal): Promise<Array<ComplianceDeliverable>>;
    getClientRequests(client: Principal): Promise<Array<ServiceRequest>>;
    getMyDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getMyPayments(): Promise<Array<PaymentRecord>>;
    getMyPendingDeliverables(): Promise<Array<ComplianceDeliverable>>;
    getMyRequests(): Promise<Array<ServiceRequest>>;
    getPendingDeliverables(client: Principal): Promise<Array<ComplianceDeliverable>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfileByPrincipal(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    rejectClient(user: Principal): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminPaymentSettings(settings: AdminPaymentSettings): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    updateDeliverableStatus(deliverableId: bigint, newStatus: DeliverableStatus): Promise<void>;
    updatePaymentStatus(paymentId: bigint, status: PaymentStatus): Promise<void>;
    updateStatus(requestId: bigint, status: RequestStatus): Promise<void>;
    uploadDocument(docType: DocumentType, name: string, file: ExternalBlob): Promise<UploadDocumentResult>;
}
