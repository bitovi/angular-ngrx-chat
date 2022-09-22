import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { ChatService } from './chat.service';
import * as ChatActions from './chat.actions';
import { bufferTime, map, mergeMap, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUserId } from '../login/login.selectors';

@Injectable()
export class ChatEffects {
  readonly userId$ = this.store.select(selectUserId);

  addPendingMessageOnSendMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      concatLatestFrom(() => [
        // creates a random ID and a time to show message as soon as user sends it, even though it is pending
        of({ id: crypto.randomUUID(), time: new Date().getTime() }),
        this.userId$,
      ]),
      map(([{ body }, { id, time }, userId]) =>
        ChatActions.addPendingMessage({
          message: {
            id,
            userId: userId as string,
            body,
            time,
          },
        })
      )
    );
  });

  sendMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ChatActions.addPendingMessage),
      mergeMap(({ message: { id, body, userId } }) =>
        this.chatService.sendMessage({ body, userId }).pipe(
          map(message =>
            ChatActions.sendMessageSuccess({
              message,
              pendingMessageId: id,
            })
          )
        )
      )
    );
  });

  messagesEvent$ = createEffect(() => {
    return this.chatService.messageEvents$.pipe(
      bufferTime(250),
      map(messages => ChatActions.addMessages({ messages: messages.flat() }))
    );
  });

  userJoinedEvent$ = createEffect(() => {
    return this.chatService.userJoinedEvents$.pipe(
      map(user => ChatActions.addUser({ user }))
    );
  });

  userLeftEvent$ = createEffect(() => {
    return this.chatService.userLeftEvents$.pipe(
      map(userId => ChatActions.setUserOffline({ userId }))
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private chatService: ChatService
  ) {}
}
