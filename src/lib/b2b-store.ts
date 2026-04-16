/* ===================================================
   B2B Store — localStorage-based CRUD operations
   for the B2B Customer Portal.
   =================================================== */

import type {
  B2BClient,
  SampleRequest,
  ProductionRequest,
  B2BOrder,
  ClientFavorite,
  B2BMessage,
  B2BConversation,
  B2BDocument,
  B2BDashboardStats,
  B2BActivityEntry,
  RegistrationStatus,
  SampleStatus,
  ProductionStatus,
  OrderStatus,
} from '@/types/b2b';

// ─── Keys ────────────────────────────────────────────
const KEYS = {
  clients: 'b2b_clients',
  samples: 'b2b_samples',
  production: 'b2b_production',
  orders: 'b2b_orders',
  favorites: 'b2b_favorites',
  messages: 'b2b_messages',
  conversations: 'b2b_conversations',
  documents: 'b2b_documents',
  activity: 'b2b_activity',
  initialized: 'b2b_initialized',
} as const;

// ─── Helpers ────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function generateTemporaryPassword(): string {
  return `Akar${Math.random().toString(36).slice(2, 6).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
}

function generateOrderNumber(): string {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  return `AKR-${stamp}-${Math.floor(100 + Math.random() * 900)}`;
}

function getDefaultOrderProgress(status: OrderStatus): number {
  const progressMap: Record<OrderStatus, number> = {
    confirmed: 10,
    in_production: 45,
    quality_control: 70,
    ready_to_ship: 85,
    shipped: 95,
    completed: 100,
  };

  return progressMap[status];
}

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Activity Log ───────────────────────────────────
export function logB2BActivity(action: string, entity: string, entityName: string, clientId?: string): void {
  const entries = getStore<B2BActivityEntry>(KEYS.activity);
  entries.unshift({
    id: generateId(),
    action,
    entity,
    entityName,
    clientId,
    timestamp: new Date().toISOString(),
  });
  setStore(KEYS.activity, entries.slice(0, 200));
}

export function getB2BActivity(clientId?: string): B2BActivityEntry[] {
  const all = getStore<B2BActivityEntry>(KEYS.activity);
  if (clientId) return all.filter((a) => a.clientId === clientId);
  return all;
}

// ─── CLIENTS ────────────────────────────────────────
export function getClients(): B2BClient[] {
  return getStore<B2BClient>(KEYS.clients);
}

export function getClient(id: string): B2BClient | undefined {
  return getClients().find((c) => c.id === id);
}

export function getClientByEmail(email: string): B2BClient | undefined {
  return getClients().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getClientsByStatus(status: RegistrationStatus): B2BClient[] {
  return getClients().filter((c) => c.status === status);
}

export function createClient(data: Omit<B2BClient, 'id' | 'role' | 'status' | 'createdAt' | 'updatedAt'>): B2BClient {
  const now = new Date().toISOString();
  const client: B2BClient = {
    ...data,
    id: generateId(),
    role: 'client',
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };
  const list = getClients();
  list.push(client);
  setStore(KEYS.clients, list);
  logB2BActivity('registered', 'client', client.companyName, client.id);
  return client;
}

export async function createApprovedClientAccount(
  data: Omit<B2BClient, 'id' | 'role' | 'status' | 'createdAt' | 'updatedAt' | 'passwordHash'> & {
    temporaryPassword?: string;
  },
): Promise<{ client: B2BClient; temporaryPassword: string }> {
  const existing = getClientByEmail(data.email);
  if (existing) {
    throw new Error('Bu e-posta ile kayitli bir musteri zaten var.');
  }

  const { sha256 } = await import('@/lib/b2b-auth');
  const now = new Date().toISOString();
  const temporaryPassword = data.temporaryPassword?.trim() || generateTemporaryPassword();

  const client: B2BClient = {
    id: generateId(),
    email: data.email.trim().toLowerCase(),
    passwordHash: await sha256(temporaryPassword),
    role: 'client',
    status: 'approved',
    companyName: data.companyName.trim(),
    country: data.country.trim(),
    contactPerson: data.contactPerson.trim(),
    phone: data.phone.trim(),
    businessType: data.businessType,
    avatar: data.avatar,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: undefined,
    rejectionReason: undefined,
  };

  const list = getClients();
  list.push(client);
  setStore(KEYS.clients, list);
  logB2BActivity('created', 'client', client.companyName, client.id);

  return { client, temporaryPassword };
}

export function updateClient(id: string, data: Partial<B2BClient>): B2BClient | undefined {
  const list = getClients();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  setStore(KEYS.clients, list);
  return list[idx];
}

export function approveClient(id: string): B2BClient | undefined {
  const client = updateClient(id, { status: 'approved' });
  if (client) logB2BActivity('approved', 'client', client.companyName, id);
  return client;
}

export function rejectClient(id: string, reason?: string): B2BClient | undefined {
  const client = updateClient(id, { status: 'rejected', rejectionReason: reason });
  if (client) logB2BActivity('rejected', 'client', client.companyName, id);
  return client;
}

export function deleteClient(id: string): boolean {
  const list = getClients();
  const item = list.find((c) => c.id === id);
  if (!item) return false;
  setStore(KEYS.clients, list.filter((c) => c.id !== id));
  logB2BActivity('deleted', 'client', item.companyName);
  return true;
}

// ─── SAMPLE REQUESTS ────────────────────────────────
export function getSampleRequests(clientId?: string): SampleRequest[] {
  const all = getStore<SampleRequest>(KEYS.samples);
  if (clientId) return all.filter((s) => s.clientId === clientId);
  return all;
}

export function getSampleRequest(id: string): SampleRequest | undefined {
  return getStore<SampleRequest>(KEYS.samples).find((s) => s.id === id);
}

export function createSampleRequest(data: Omit<SampleRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): SampleRequest {
  const now = new Date().toISOString();
  const req: SampleRequest = {
    ...data,
    id: generateId(),
    status: 'requested',
    createdAt: now,
    updatedAt: now,
  };
  const list = getStore<SampleRequest>(KEYS.samples);
  list.unshift(req);
  setStore(KEYS.samples, list);
  logB2BActivity('created', 'sample_request', req.modelName, req.clientId);
  return req;
}

export function updateSampleRequest(id: string, data: Partial<SampleRequest>): SampleRequest | undefined {
  const list = getStore<SampleRequest>(KEYS.samples);
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  setStore(KEYS.samples, list);
  logB2BActivity('updated', 'sample_request', list[idx].modelName, list[idx].clientId);
  return list[idx];
}

export function updateSampleStatus(id: string, status: SampleStatus, adminNotes?: string): SampleRequest | undefined {
  return updateSampleRequest(id, { status, adminNotes });
}

// ─── PRODUCTION REQUESTS ────────────────────────────
export function getProductionRequests(clientId?: string): ProductionRequest[] {
  const all = getStore<ProductionRequest>(KEYS.production);
  if (clientId) return all.filter((p) => p.clientId === clientId);
  return all;
}

export function getProductionRequest(id: string): ProductionRequest | undefined {
  return getStore<ProductionRequest>(KEYS.production).find((p) => p.id === id);
}

export function createProductionRequest(data: Omit<ProductionRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): ProductionRequest {
  const now = new Date().toISOString();
  const req: ProductionRequest = {
    ...data,
    id: generateId(),
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
  };
  const list = getStore<ProductionRequest>(KEYS.production);
  list.unshift(req);
  setStore(KEYS.production, list);
  logB2BActivity('created', 'production_request', req.modelName, req.clientId);
  return req;
}

export function updateProductionRequest(id: string, data: Partial<ProductionRequest>): ProductionRequest | undefined {
  const list = getStore<ProductionRequest>(KEYS.production);
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  setStore(KEYS.production, list);
  logB2BActivity('updated', 'production_request', list[idx].modelName, list[idx].clientId);
  return list[idx];
}

export function updateProductionStatus(id: string, status: ProductionStatus, adminResponse?: string, quotedPrice?: string): ProductionRequest | undefined {
  return updateProductionRequest(id, { status, adminResponse, quotedPrice });
}

// ─── FAVORITES ──────────────────────────────────────
export function getOrCreateProductionConversation(
  productionRequestId: string,
  clientName: string,
  companyName: string,
): B2BConversation {
  const request = getProductionRequest(productionRequestId);
  if (!request) {
    throw new Error('Uretim talebi bulunamadi.');
  }

  if (request.discussionConversationId) {
    const existingConversation = getConversation(request.discussionConversationId);
    if (existingConversation) {
      return existingConversation;
    }
  }

  const conversation = createConversation(
    request.clientId,
    clientName,
    companyName,
    `Production Request: ${request.modelName}`,
  );

  updateProductionRequest(request.id, {
    discussionConversationId: conversation.id,
  });

  return conversation;
}

export function respondToProductionQuote(
  productionRequestId: string,
  decision: 'approved' | 'revision_requested',
  clientName: string,
  companyName: string,
  response?: string,
): { request: ProductionRequest; conversation: B2BConversation } {
  const request = getProductionRequest(productionRequestId);
  if (!request) {
    throw new Error('Uretim talebi bulunamadi.');
  }

  if (request.status !== 'quoted') {
    throw new Error('Bu talep su anda musteri yaniti beklemiyor.');
  }

  const fallbackMessage =
    decision === 'approved'
      ? `We approve the quotation for ${request.modelName} and would like to proceed.`
      : `We would like to request a revision for ${request.modelName}.`;
  const messageBody = response?.trim() || fallbackMessage;

  const updatedRequest = updateProductionRequest(request.id, {
    status: decision,
    clientResponse: messageBody,
  });

  if (!updatedRequest) {
    throw new Error('Teklif yaniti kaydedilemedi.');
  }

  const conversation = getOrCreateProductionConversation(request.id, clientName, companyName);
  sendMessage(
    conversation.id,
    request.clientId,
    'client',
    clientName,
    conversation.subject,
    messageBody,
  );

  return {
    request: updatedRequest,
    conversation,
  };
}

export function getOrders(clientId?: string): B2BOrder[] {
  const all = getStore<B2BOrder>(KEYS.orders);
  const filtered = clientId ? all.filter((order) => order.clientId === clientId) : all;

  return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getOrder(id: string): B2BOrder | undefined {
  return getStore<B2BOrder>(KEYS.orders).find((order) => order.id === id);
}

export function getOrderByProductionRequestId(productionRequestId: string): B2BOrder | undefined {
  return getStore<B2BOrder>(KEYS.orders).find((order) => order.productionRequestId === productionRequestId);
}

export function createOrderFromProductionRequest(
  productionRequestId: string,
  overrides?: Partial<Pick<B2BOrder, 'estimatedShipDate' | 'adminNotes'>>,
): B2BOrder {
  const request = getProductionRequest(productionRequestId);
  if (!request) {
    throw new Error('Uretim talebi bulunamadi.');
  }

  if (request.convertedToOrderId) {
    const existingOrder = getOrder(request.convertedToOrderId);
    if (existingOrder) {
      return existingOrder;
    }
  }

  const existingFromRequest = getOrderByProductionRequestId(request.id);
  if (existingFromRequest) {
    updateProductionRequest(request.id, {
      convertedToOrderId: existingFromRequest.id,
      convertedToOrderAt: existingFromRequest.createdAt,
    });
    return existingFromRequest;
  }

  if (request.status !== 'approved') {
    throw new Error('Sadece onaylanan talepler siparise donusturulebilir.');
  }

  const now = new Date().toISOString();
  const order: B2BOrder = {
    id: generateId(),
    orderNumber: generateOrderNumber(),
    productionRequestId: request.id,
    clientId: request.clientId,
    modelId: request.modelId,
    modelName: request.modelName,
    quantity: request.estimatedQuantity,
    yarnDetails: request.preferredYarn,
    colorDetails: request.preferredColor,
    quotedPrice: request.quotedPrice,
    targetDeliveryDate: request.targetDeliveryDate,
    estimatedShipDate: overrides?.estimatedShipDate,
    status: 'confirmed',
    progressPercent: getDefaultOrderProgress('confirmed'),
    adminNotes: overrides?.adminNotes || request.adminResponse,
    latestUpdate: 'Order created and moved into production planning.',
    trackingNumber: undefined,
    createdAt: now,
    updatedAt: now,
  };

  const list = getStore<B2BOrder>(KEYS.orders);
  list.unshift(order);
  setStore(KEYS.orders, list);
  updateProductionRequest(request.id, {
    convertedToOrderId: order.id,
    convertedToOrderAt: now,
  });
  logB2BActivity('converted', 'order', order.orderNumber, order.clientId);
  return order;
}

export function updateOrder(id: string, data: Partial<B2BOrder>): B2BOrder | undefined {
  const list = getStore<B2BOrder>(KEYS.orders);
  const idx = list.findIndex((order) => order.id === id);
  if (idx === -1) return undefined;

  list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  setStore(KEYS.orders, list);
  logB2BActivity('updated', 'order', list[idx].orderNumber, list[idx].clientId);
  return list[idx];
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  adminNotes?: string,
  trackingNumber?: string,
): B2BOrder | undefined {
  return updateOrder(id, {
    status,
    progressPercent: getDefaultOrderProgress(status),
    adminNotes,
    latestUpdate: adminNotes,
    trackingNumber,
  });
}

export function getFavorites(clientId: string): ClientFavorite[] {
  return getStore<ClientFavorite>(KEYS.favorites).filter((f) => f.clientId === clientId);
}

export function addFavorite(data: Omit<ClientFavorite, 'id' | 'addedAt'>): ClientFavorite {
  const fav: ClientFavorite = {
    ...data,
    id: generateId(),
    addedAt: new Date().toISOString(),
  };
  const list = getStore<ClientFavorite>(KEYS.favorites);
  // Prevent duplicates
  if (list.some((f) => f.clientId === fav.clientId && f.modelId === fav.modelId)) {
    return list.find((f) => f.clientId === fav.clientId && f.modelId === fav.modelId)!;
  }
  list.unshift(fav);
  setStore(KEYS.favorites, list);
  return fav;
}

export function removeFavorite(clientId: string, modelId: string): boolean {
  const list = getStore<ClientFavorite>(KEYS.favorites);
  const filtered = list.filter((f) => !(f.clientId === clientId && f.modelId === modelId));
  if (filtered.length === list.length) return false;
  setStore(KEYS.favorites, filtered);
  return true;
}

export function isFavorited(clientId: string, modelId: string): boolean {
  return getStore<ClientFavorite>(KEYS.favorites).some(
    (f) => f.clientId === clientId && f.modelId === modelId
  );
}

// ─── CONVERSATIONS & MESSAGES ───────────────────────
export function getConversations(clientId?: string): B2BConversation[] {
  const all = getStore<B2BConversation>(KEYS.conversations);
  if (clientId) return all.filter((c) => c.clientId === clientId);
  return all.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getConversation(id: string): B2BConversation | undefined {
  return getStore<B2BConversation>(KEYS.conversations).find((c) => c.id === id);
}

export function getMessagesForConversation(conversationId: string): B2BMessage[] {
  return getStore<B2BMessage>(KEYS.messages)
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function createConversation(clientId: string, clientName: string, companyName: string, subject: string): B2BConversation {
  const conv: B2BConversation = {
    id: generateId(),
    clientId,
    clientName,
    companyName,
    subject,
    lastMessageAt: new Date().toISOString(),
    unreadAdmin: 0,
    unreadClient: 0,
  };
  const list = getStore<B2BConversation>(KEYS.conversations);
  list.unshift(conv);
  setStore(KEYS.conversations, list);
  return conv;
}

export function sendMessage(
  conversationId: string,
  clientId: string,
  senderRole: 'admin' | 'client',
  senderName: string,
  subject: string,
  body: string
): B2BMessage {
  const msg: B2BMessage = {
    id: generateId(),
    conversationId,
    clientId,
    senderRole,
    senderName,
    subject,
    body,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const messages = getStore<B2BMessage>(KEYS.messages);
  messages.push(msg);
  setStore(KEYS.messages, messages);

  // Update conversation
  const convs = getStore<B2BConversation>(KEYS.conversations);
  const idx = convs.findIndex((c) => c.id === conversationId);
  if (idx !== -1) {
    convs[idx].lastMessageAt = msg.createdAt;
    if (senderRole === 'client') convs[idx].unreadAdmin += 1;
    else convs[idx].unreadClient += 1;
    setStore(KEYS.conversations, convs);
  }

  logB2BActivity('sent', 'message', subject, clientId);
  return msg;
}

export function markConversationRead(conversationId: string, readerRole: 'admin' | 'client'): void {
  // Mark messages as read
  const msgs = getStore<B2BMessage>(KEYS.messages);
  msgs.forEach((m) => {
    if (m.conversationId === conversationId && m.senderRole !== readerRole) {
      m.read = true;
    }
  });
  setStore(KEYS.messages, msgs);

  // Reset unread count
  const convs = getStore<B2BConversation>(KEYS.conversations);
  const idx = convs.findIndex((c) => c.id === conversationId);
  if (idx !== -1) {
    if (readerRole === 'admin') convs[idx].unreadAdmin = 0;
    else convs[idx].unreadClient = 0;
    setStore(KEYS.conversations, convs);
  }
}

export function getUnreadMessageCount(clientId: string): number {
  return getConversations(clientId).reduce((sum, c) => sum + c.unreadClient, 0);
}

// ─── DOCUMENTS ──────────────────────────────────────
export function getDocuments(clientId?: string): B2BDocument[] {
  const all = getStore<B2BDocument>(KEYS.documents);
  if (!clientId) return all;
  return all.filter(
    (d) => d.visibility === 'all_clients' || (d.allowedClientIds && d.allowedClientIds.includes(clientId))
  );
}

export function getDocument(id: string): B2BDocument | undefined {
  return getStore<B2BDocument>(KEYS.documents).find((d) => d.id === id);
}

export function createDocument(data: Omit<B2BDocument, 'id' | 'createdAt'>): B2BDocument {
  const doc: B2BDocument = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const list = getStore<B2BDocument>(KEYS.documents);
  list.unshift(doc);
  setStore(KEYS.documents, list);
  logB2BActivity('uploaded', 'document', doc.name);
  return doc;
}

export function deleteDocument(id: string): boolean {
  const list = getStore<B2BDocument>(KEYS.documents);
  const item = list.find((d) => d.id === id);
  if (!item) return false;
  setStore(KEYS.documents, list.filter((d) => d.id !== id));
  logB2BActivity('deleted', 'document', item.name);
  return true;
}

// ─── DASHBOARD ──────────────────────────────────────
export function getB2BDashboardStats(): B2BDashboardStats {
  const clients = getClients();
  const convs = getConversations();
  return {
    activeClients: clients.filter((c) => c.status === 'approved').length,
    pendingRegistrations: clients.filter((c) => c.status === 'pending').length,
    pendingSamples: getSampleRequests().filter((s) => s.status === 'requested').length,
    pendingProduction: getProductionRequests().filter((p) => p.status === 'submitted').length,
    unreadMessages: convs.reduce((sum, c) => sum + c.unreadAdmin, 0),
    recentActivity: getB2BActivity().slice(0, 10),
  };
}

// ─── SEED DATA ──────────────────────────────────────
function migrateLegacyProductionOrders(): void {
  type LegacyProductionRequest = Omit<ProductionRequest, 'status'> & {
    status: ProductionStatus | 'in_production' | 'completed';
  };

  const productionRequests = getStore<LegacyProductionRequest>(KEYS.production);
  const existingOrders = getStore<B2BOrder>(KEYS.orders);

  if (productionRequests.length === 0) return;

  const orders = [...existingOrders];
  let requestsChanged = false;
  let ordersChanged = false;

  for (const request of productionRequests) {
    if (request.convertedToOrderId && orders.some((order) => order.id === request.convertedToOrderId)) {
      continue;
    }

    if (request.status === 'in_production' || request.status === 'completed') {
      const orderId = request.convertedToOrderId || generateId();
      const order: B2BOrder = {
        id: orderId,
        orderNumber: generateOrderNumber(),
        productionRequestId: request.id,
        clientId: request.clientId,
        modelId: request.modelId,
        modelName: request.modelName,
        quantity: request.estimatedQuantity,
        yarnDetails: request.preferredYarn,
        colorDetails: request.preferredColor,
        quotedPrice: request.quotedPrice,
        targetDeliveryDate: request.targetDeliveryDate,
        estimatedShipDate: request.targetDeliveryDate,
        status: request.status === 'completed' ? 'completed' : 'in_production',
        progressPercent: getDefaultOrderProgress(request.status === 'completed' ? 'completed' : 'in_production'),
        adminNotes: request.adminResponse,
        latestUpdate: request.adminResponse,
        trackingNumber: undefined,
        createdAt: request.updatedAt,
        updatedAt: request.updatedAt,
      };

      orders.unshift(order);
      request.status = 'approved';
      request.convertedToOrderId = order.id;
      request.convertedToOrderAt = request.updatedAt;
      requestsChanged = true;
      ordersChanged = true;
    }
  }

  if (requestsChanged) {
    setStore(KEYS.production, productionRequests);
  }

  if (ordersChanged) {
    setStore(KEYS.orders, orders);
  }
}

function migrateLegacyOrderFields(): void {
  const orders = getStore<B2BOrder>(KEYS.orders);
  if (orders.length === 0) return;

  let changed = false;
  for (const order of orders) {
    if (typeof order.progressPercent !== 'number') {
      order.progressPercent = getDefaultOrderProgress(order.status);
      changed = true;
    }

    if (order.latestUpdate === undefined && order.adminNotes) {
      order.latestUpdate = order.adminNotes;
      changed = true;
    }
  }

  if (changed) {
    setStore(KEYS.orders, orders);
  }
}

export async function initializeB2BStore(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(KEYS.initialized)) {
    migrateLegacyProductionOrders();
    migrateLegacyOrderFields();
    return;
  }

  const { sha256 } = await import('@/lib/b2b-auth');

  // Seed demo clients
  const demoHash = await sha256('demo2024');
  const seedClients: B2BClient[] = [
    {
      id: 'bc1',
      email: 'erik@nordmode.se',
      passwordHash: demoHash,
      role: 'client',
      status: 'approved',
      companyName: 'NordMode',
      country: 'Sweden',
      contactPerson: 'Erik Johansson',
      phone: '+46 8 123 4567',
      businessType: 'fashion_brand',
      createdAt: '2025-06-01T10:00:00Z',
      updatedAt: '2025-06-01T10:00:00Z',
      lastLoginAt: '2026-03-10T08:30:00Z',
    },
    {
      id: 'bc2',
      email: 'sophie@etoile-tricot.fr',
      passwordHash: demoHash,
      role: 'client',
      status: 'approved',
      companyName: 'Étoile Tricot',
      country: 'France',
      contactPerson: 'Sophie Laurent',
      phone: '+33 1 23 45 67 89',
      businessType: 'fashion_brand',
      createdAt: '2025-07-15T10:00:00Z',
      updatedAt: '2025-07-15T10:00:00Z',
      lastLoginAt: '2026-03-09T14:00:00Z',
    },
    {
      id: 'bc3',
      email: 'marco@altamoda.it',
      passwordHash: demoHash,
      role: 'client',
      status: 'approved',
      companyName: 'Alta Moda',
      country: 'Italy',
      contactPerson: 'Marco Venturi',
      phone: '+39 02 1234 5678',
      businessType: 'fashion_brand',
      createdAt: '2025-05-20T10:00:00Z',
      updatedAt: '2025-05-20T10:00:00Z',
      lastLoginAt: '2026-03-08T09:00:00Z',
    },
    {
      id: 'bc4',
      email: 'info@fibrelink.de',
      passwordHash: demoHash,
      role: 'client',
      status: 'pending',
      companyName: 'FibreLink',
      country: 'Germany',
      contactPerson: 'Hans Müller',
      phone: '+49 30 1234 5678',
      businessType: 'wholesaler',
      createdAt: '2026-03-11T10:00:00Z',
      updatedAt: '2026-03-11T10:00:00Z',
    },
    {
      id: 'bc5',
      email: 'contact@velvetknit.nl',
      passwordHash: demoHash,
      role: 'client',
      status: 'pending',
      companyName: 'VelvetKnit',
      country: 'Netherlands',
      contactPerson: 'Jan de Vries',
      phone: '+31 20 123 4567',
      businessType: 'retailer',
      createdAt: '2026-03-12T10:00:00Z',
      updatedAt: '2026-03-12T10:00:00Z',
    },
  ];
  setStore(KEYS.clients, seedClients);

  // Seed sample requests
  const seedSamples: SampleRequest[] = [
    {
      id: 'sr1',
      clientId: 'bc1',
      modelId: 'm1',
      modelName: 'Classic Polo',
      colorPreference: 'Navy, White',
      quantity: 3,
      deliveryCountry: 'Sweden',
      notes: 'Need sizes S, M, L for each color',
      status: 'shipped',
      trackingNumber: 'TR-2026-00142',
      adminNotes: 'Shipped via DHL Express',
      createdAt: '2026-02-15T10:00:00Z',
      updatedAt: '2026-02-28T14:00:00Z',
    },
    {
      id: 'sr2',
      clientId: 'bc2',
      modelId: 'm2',
      modelName: 'Cable Knit Sweater',
      colorPreference: 'Cream',
      quantity: 2,
      deliveryCountry: 'France',
      notes: 'Interested in 7 GG cable pattern specifically',
      status: 'in_production',
      adminNotes: 'Expected completion: March 20',
      createdAt: '2026-03-05T10:00:00Z',
      updatedAt: '2026-03-10T10:00:00Z',
    },
    {
      id: 'sr3',
      clientId: 'bc3',
      modelId: 'm7',
      modelName: 'V-Neck Pullover',
      colorPreference: 'Wine, Midnight',
      quantity: 4,
      deliveryCountry: 'Italy',
      notes: 'Silk-cashmere blend hand-feel validation',
      status: 'requested',
      createdAt: '2026-03-11T09:00:00Z',
      updatedAt: '2026-03-11T09:00:00Z',
    },
  ];
  setStore(KEYS.samples, seedSamples);

  // Seed production requests
  const seedProduction: ProductionRequest[] = [
    {
      id: 'pr1',
      clientId: 'bc1',
      modelId: 'm1',
      modelName: 'Classic Polo',
      estimatedQuantity: 5000,
      preferredYarn: '100% Supima Cotton',
      preferredColor: 'Navy',
      targetDeliveryDate: '2026-06-15',
      notes: 'SS26 main order. Need consistent quality across all pieces.',
      status: 'approved',
      adminResponse: 'Confirmed. Production starts April 1. Estimated delivery: June 10.',
      quotedPrice: '€12.50 per unit',
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-02-20T10:00:00Z',
    },
    {
      id: 'pr2',
      clientId: 'bc3',
      modelId: 'm4',
      modelName: 'Crew Neck Sweater',
      estimatedQuantity: 2000,
      preferredYarn: '50% Merino / 50% Acrylic',
      preferredColor: 'Custom colorway — see notes',
      targetDeliveryDate: '2026-09-01',
      notes: 'FW26 collection. Need custom Pantone matching: 19-1557 TPX and 19-4052 TPX',
      status: 'under_review',
      createdAt: '2026-03-08T10:00:00Z',
      updatedAt: '2026-03-08T10:00:00Z',
    },
  ];
  setStore(KEYS.production, seedProduction);

  const seedOrders: B2BOrder[] = [
    {
      id: 'ord1',
      orderNumber: 'AKR-260220-314',
      productionRequestId: 'pr1',
      clientId: 'bc1',
      modelId: 'm1',
      modelName: 'Classic Polo',
      quantity: 5000,
      yarnDetails: '100% Supima Cotton',
      colorDetails: 'Navy',
      quotedPrice: 'EUR 12.50 per unit',
      targetDeliveryDate: '2026-06-15',
      estimatedShipDate: '2026-06-10',
      status: 'in_production',
      progressPercent: 45,
      adminNotes: 'Main order confirmed. Knitting started on April 1.',
      latestUpdate: 'Knitting started on April 1. First batch review is scheduled for next week.',
      trackingNumber: undefined,
      createdAt: '2026-02-20T10:00:00Z',
      updatedAt: '2026-04-01T08:00:00Z',
    },
  ];
  setStore(KEYS.orders, seedOrders);

  // Seed favorites
  const seedFavorites: ClientFavorite[] = [
    { id: 'fv1', clientId: 'bc1', modelId: 'm1', modelName: 'Classic Polo', modelImage: '/images/models/polo.jpg', collection: 'Summer Essentials', addedAt: '2026-01-15T10:00:00Z' },
    { id: 'fv2', clientId: 'bc1', modelId: 'm3', modelName: 'Premium Tee', modelImage: '/images/models/tshirt.jpg', collection: 'Summer Essentials', addedAt: '2026-01-20T10:00:00Z' },
    { id: 'fv3', clientId: 'bc2', modelId: 'm2', modelName: 'Cable Knit Sweater', modelImage: '/images/models/cable-knit.jpg', collection: 'Winter Heritage', addedAt: '2026-02-01T10:00:00Z' },
    { id: 'fv4', clientId: 'bc3', modelId: 'm7', modelName: 'V-Neck Pullover', modelImage: '/images/models/v-neck.jpg', collection: 'Luxury Line', addedAt: '2026-02-10T10:00:00Z' },
  ];
  setStore(KEYS.favorites, seedFavorites);

  // Seed conversations & messages
  const seedConversations: B2BConversation[] = [
    {
      id: 'conv1',
      clientId: 'bc1',
      clientName: 'Erik Johansson',
      companyName: 'NordMode',
      subject: 'SS26 Collection Timeline',
      lastMessageAt: '2026-03-10T14:30:00Z',
      unreadAdmin: 1,
      unreadClient: 0,
    },
    {
      id: 'conv2',
      clientId: 'bc2',
      clientName: 'Sophie Laurent',
      companyName: 'Étoile Tricot',
      subject: 'Jacquard Pattern Customization',
      lastMessageAt: '2026-03-09T11:15:00Z',
      unreadAdmin: 1,
      unreadClient: 0,
    },
  ];
  setStore(KEYS.conversations, seedConversations);

  const seedMessages: B2BMessage[] = [
    {
      id: 'bm1',
      conversationId: 'conv1',
      clientId: 'bc1',
      senderRole: 'client',
      senderName: 'Erik Johansson',
      subject: 'SS26 Collection Timeline',
      body: 'Hi team, we are planning our SS26 collection and would like to discuss the production timeline for 15,000 pieces across 5 styles. Can we schedule a call this week?',
      read: true,
      createdAt: '2026-03-08T10:00:00Z',
    },
    {
      id: 'bm2',
      conversationId: 'conv1',
      clientId: 'bc1',
      senderRole: 'admin',
      senderName: 'AKAR ÖRME',
      subject: 'Re: SS26 Collection Timeline',
      body: 'Hello Erik, thank you for reaching out. We would be happy to discuss your SS26 plans. Our production schedule has availability starting May. How about Thursday at 14:00 CET?',
      read: true,
      createdAt: '2026-03-09T09:00:00Z',
    },
    {
      id: 'bm3',
      conversationId: 'conv1',
      clientId: 'bc1',
      senderRole: 'client',
      senderName: 'Erik Johansson',
      subject: 'Re: SS26 Collection Timeline',
      body: 'Perfect, Thursday at 14:00 CET works for us. I will send a calendar invite. Looking forward to it.',
      read: false,
      createdAt: '2026-03-10T14:30:00Z',
    },
    {
      id: 'bm4',
      conversationId: 'conv2',
      clientId: 'bc2',
      senderRole: 'client',
      senderName: 'Sophie Laurent',
      subject: 'Jacquard Pattern Customization',
      body: 'Following our meeting in Istanbul, I would like to explore custom jacquard patterns for our FW26 line. Could you share the minimum order quantity for custom patterns and the sampling lead time?',
      read: false,
      createdAt: '2026-03-09T11:15:00Z',
    },
  ];
  setStore(KEYS.messages, seedMessages);

  // Seed documents
  const seedDocuments: B2BDocument[] = [
    {
      id: 'doc1',
      name: 'SS26 Collection Catalog',
      category: 'catalog',
      description: 'Complete catalog of Summer/Spring 2026 knitwear collection with specifications and pricing tiers.',
      fileUrl: '#',
      fileSize: 4500000,
      fileType: 'application/pdf',
      uploadedBy: 'Admin',
      visibility: 'all_clients',
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'doc2',
      name: 'Fabric Technical Specifications',
      category: 'technical_sheet',
      description: 'Detailed technical specifications for all available fabric structures including gauge, weight, and composition.',
      fileUrl: '#',
      fileSize: 2800000,
      fileType: 'application/pdf',
      uploadedBy: 'Admin',
      visibility: 'all_clients',
      createdAt: '2026-01-20T10:00:00Z',
    },
    {
      id: 'doc3',
      name: 'Merino Wool Certification',
      category: 'fabric_detail',
      description: 'WOOLMARK certification and test results for our merino wool supply chain.',
      fileUrl: '#',
      fileSize: 1200000,
      fileType: 'application/pdf',
      uploadedBy: 'Admin',
      visibility: 'all_clients',
      createdAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'doc4',
      name: 'FW26 Price List — Premium Tier',
      category: 'price_list',
      description: 'Pricing for Fall/Winter 2026 premium tier clients.',
      fileUrl: '#',
      fileSize: 800000,
      fileType: 'application/pdf',
      uploadedBy: 'Admin',
      visibility: 'specific',
      allowedClientIds: ['bc1', 'bc3'],
      createdAt: '2026-02-15T10:00:00Z',
    },
  ];
  setStore(KEYS.documents, seedDocuments);

  // Seed activity
  const seedActivity: B2BActivityEntry[] = [
    { id: 'ba1', action: 'registered', entity: 'client', entityName: 'NordMode', clientId: 'bc1', timestamp: '2025-06-01T10:00:00Z' },
    { id: 'ba2', action: 'approved', entity: 'client', entityName: 'NordMode', clientId: 'bc1', timestamp: '2025-06-02T09:00:00Z' },
    { id: 'ba3', action: 'registered', entity: 'client', entityName: 'Étoile Tricot', clientId: 'bc2', timestamp: '2025-07-15T10:00:00Z' },
    { id: 'ba4', action: 'approved', entity: 'client', entityName: 'Étoile Tricot', clientId: 'bc2', timestamp: '2025-07-16T09:00:00Z' },
    { id: 'ba5', action: 'created', entity: 'sample_request', entityName: 'Classic Polo', clientId: 'bc1', timestamp: '2026-02-15T10:00:00Z' },
    { id: 'ba6', action: 'created', entity: 'production_request', entityName: 'Classic Polo', clientId: 'bc1', timestamp: '2026-02-01T10:00:00Z' },
    { id: 'ba7', action: 'uploaded', entity: 'document', entityName: 'SS26 Collection Catalog', timestamp: '2026-01-15T10:00:00Z' },
    { id: 'ba8', action: 'registered', entity: 'client', entityName: 'FibreLink', clientId: 'bc4', timestamp: '2026-03-11T10:00:00Z' },
    { id: 'ba9', action: 'registered', entity: 'client', entityName: 'VelvetKnit', clientId: 'bc5', timestamp: '2026-03-12T10:00:00Z' },
  ];
  setStore(KEYS.activity, seedActivity);

  localStorage.setItem(KEYS.initialized, 'true');
}
