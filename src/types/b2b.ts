/* ===================================================
   B2B Customer Portal — Type Definitions
   =================================================== */

// ─── User Roles ──────────────────────────────────────
export type UserRole = 'admin' | 'client';
export type BusinessType = 'fashion_brand' | 'wholesaler' | 'retailer';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

// ─── Client / Brand User ────────────────────────────
export interface B2BClient {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: RegistrationStatus;
  companyName: string;
  country: string;
  contactPerson: string;
  phone: string;
  businessType: BusinessType;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  rejectionReason?: string;
}

// ─── Session ────────────────────────────────────────
export interface B2BSession {
  token: string;
  clientId: string;
  role: UserRole;
  expiresAt: string;
}

// ─── Sample Request ─────────────────────────────────
export type SampleStatus = 'requested' | 'approved' | 'in_production' | 'shipped';

export interface SampleRequest {
  id: string;
  clientId: string;
  modelId: string;
  modelName: string;
  colorPreference: string;
  quantity: number;
  deliveryCountry: string;
  notes: string;
  status: SampleStatus;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Production Request ─────────────────────────────
export type ProductionStatus = 'submitted' | 'under_review' | 'quoted' | 'approved' | 'in_production' | 'completed';

export interface ProductionRequest {
  id: string;
  clientId: string;
  modelId: string;
  modelName: string;
  estimatedQuantity: number;
  preferredYarn: string;
  preferredColor: string;
  targetDeliveryDate: string;
  notes: string;
  status: ProductionStatus;
  adminResponse?: string;
  quotedPrice?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Favorites ──────────────────────────────────────
export interface ClientFavorite {
  id: string;
  clientId: string;
  modelId: string;
  modelName: string;
  modelImage: string;
  collection: string;
  addedAt: string;
}

// ─── B2B Messages ───────────────────────────────────
export interface B2BMessage {
  id: string;
  conversationId: string;
  clientId: string;
  senderRole: UserRole;
  senderName: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface B2BConversation {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  subject: string;
  lastMessageAt: string;
  unreadAdmin: number;
  unreadClient: number;
}

// ─── Documents ──────────────────────────────────────
export type DocumentCategory = 'technical_sheet' | 'fabric_detail' | 'catalog' | 'price_list' | 'other';

export interface B2BDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  fileUrl: string;         // base64 data URL or external URL
  fileSize: number;        // bytes
  fileType: string;        // mime type
  uploadedBy: string;      // admin user
  visibility: 'all_clients' | 'specific';
  allowedClientIds?: string[];
  createdAt: string;
}

// ─── Password Reset ─────────────────────────────────
export interface PasswordResetToken {
  token: string;
  clientId: string;
  expiresAt: string;
  used: boolean;
}

// ─── Dashboard Stats ────────────────────────────────
export interface B2BDashboardStats {
  activeClients: number;
  pendingRegistrations: number;
  pendingSamples: number;
  pendingProduction: number;
  unreadMessages: number;
  recentActivity: B2BActivityEntry[];
}

export interface B2BActivityEntry {
  id: string;
  action: string;
  entity: string;
  entityName: string;
  clientId?: string;
  timestamp: string;
}
