import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Message } from './chat.model';
import { ChatState, chatFeature, messageSelectors } from './chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');
export const selectAllMessages = createSelector(
  chatFeature.selectMessages,
  messageSelectors.selectAll
);
export const selectMessagesSlice = (start: number, end: number) =>
  createSelector(selectAllMessages, (messages: Message[]) =>
    messages ? messages.slice(start, end) : []
  );
export const selectUserById = (userId: string) =>
  createSelector(chatFeature.selectUsers, users => users.entities[userId]);
