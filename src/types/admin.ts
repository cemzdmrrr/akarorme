/* ===================================================
   Admin CMS type definitions
   =================================================== */

export interface AdminModel {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  collection: string;
  season: string;
  fabricType: string;
  yarnType: string;
  gauge: string;
  description: string;
  technicalDetails: { label: string; value: string }[];
  coverImage?: string;
  colors: { name: string; hex: string; image?: string; images?: string[] }[];
  images: string[];
  status: 'published' | 'draft';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  season: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFabricType {
  id: string;
  name: string;
  slug: string;
  gauge: string;
  composition: string;
  weight: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReference {
  id: string;
  initials: string;
  name: string;
  country: string;
  logo: string;
  website: string;
  description: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  read: boolean;
  responded: boolean;
  respondedAt?: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;           // base64 data URL for local storage
  type: string;          // mime type
  size: number;          // bytes
  width?: number;
  height?: number;
  folder: string;        // folder path e.g. 'general', 'products', 'references'
  alt?: string;
  createdAt: string;
}

export interface PageContent {
  id: string;
  slug: string;          // 'home' | 'about' | 'contact' etc
  title: string;
  sections: PageSection[];
  updatedAt: string;
}

export interface PageSection {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'rich-text';
  content: string;
  visible: boolean;
  order: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerText: string;
  socialLinks: { platform: string; url: string }[];
  updatedAt: string;
}

export interface DashboardStats {
  totalModels: number;
  totalCollections: number;
  totalReferences: number;
  unreadMessages: number;
  totalMedia: number;
  totalFabrics: number;
}

export interface ActivityEntry {
  id: string;
  action: string;       // 'created' | 'updated' | 'deleted'
  entity: string;       // 'model' | 'collection' etc
  entityName: string;
  timestamp: string;
}

export interface AdminAuth {
  username: string;
  passwordHash: string;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
}
