export type ConversationMessageSender = 'admin' | 'customer';

export type ConversationAttachmentType = 'image' | 'video' | 'audio';

export interface IConversationAttachment {
  id: string;
  type: ConversationAttachmentType;
  name: string;
  url: string;
  mimeType: string;
  size: number;
  compressedSize: number;
}

export interface IConversationMessage {
  id: string;
  sender: ConversationMessageSender;
  text: string;
  createdAt: string;
  attachments: IConversationAttachment[];
}

export interface IConversation {
  id: string;
  customerName: string;
  customerPhone: string;
  avatar: string;
  unreadCount: number;
  updatedAt: string;
  messages: IConversationMessage[];
}
