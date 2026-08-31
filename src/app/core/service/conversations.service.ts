import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  IConversation,
  IConversationAttachment,
  IConversationMessage,
} from '../interface/IConversation';
import { ApiDataService } from './data/api.data.service';
import { GenericCrudService } from './data/generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ConversationsService extends GenericCrudService<IConversation> {
  constructor(apiService: ApiDataService) {
    super('conversations', apiService);
  }

  sendMessage(
    conversation: IConversation,
    text: string,
    attachments: IConversationAttachment[] = [],
  ): Observable<IConversation> {
    const now = new Date().toISOString();
    const message: IConversationMessage = {
      id: crypto.randomUUID(),
      sender: 'admin',
      text,
      createdAt: now,
      attachments,
    };

    const updatedConversation: Partial<IConversation> = {
      messages: [...conversation.messages, message],
      unreadCount: 0,
      updatedAt: now,
    };

    return this.update(conversation.id, updatedConversation).pipe(
      map((updated) => ({
        ...conversation,
        ...updatedConversation,
        ...updated,
      })),
    );
  }
}
