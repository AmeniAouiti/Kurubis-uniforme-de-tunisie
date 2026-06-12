export type QuoteStatus = "nouveau" | "en_cours" | "accepte" | "refuse";
export type ClientStatus = "actif" | "inactif";
export type ConversationType = "devis" | "contact";
export type ConversationSource = "landing" | "account";

export interface QuoteItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
}

export interface ConversationMessage {
  id: string;
  sender: "client" | "admin";
  body: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  clientEmail: string;
  clientName: string;
  phone?: string;
  company?: string;
  subject: string;
  type: ConversationType;
  source: ConversationSource;
  quoteItems: QuoteItem[];
  quoteStatus: QuoteStatus;
  thread: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  unreadByAdmin: boolean;
  unreadByClient: boolean;
  adminNotes?: string;
}

export interface PlatformClient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: ClientStatus;
  createdAt: string;
  lastLoginAt?: string;
}

export interface PlatformData {
  conversations: Conversation[];
  clients: PlatformClient[];
}

export interface CreateConversationInput {
  clientEmail: string;
  clientName: string;
  phone?: string;
  company?: string;
  subject: string;
  type: ConversationType;
  source?: ConversationSource;
  quoteItems?: QuoteItem[];
  initialMessage: string;
}
