import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  delay,
  filter,
  map,
  Observable,
  of,
  Subject,
  interval,
  tap,
  take,
} from 'rxjs';
import {
  Message,
  WebSocketMessageEvent,
  User,
  WebSocketEvents,
  WebSocketMessageEvents,
  WebSocketUserJoinedEvent,
  WebSocketUserLeftEvent,
  MessageStatus,
} from './chat.model';

const isMessageEvent = (
  event: WebSocketMessageEvents
): event is WebSocketMessageEvent => {
  return event.type === WebSocketEvents.MESSAGE;
};

const isUserJoinedEvent = (
  event: WebSocketMessageEvents
): event is WebSocketUserJoinedEvent => {
  return event.type === WebSocketEvents.USER_JOINED;
};

const isUserLeftEvent = (
  event: WebSocketMessageEvents
): event is WebSocketUserLeftEvent => {
  return event.type === WebSocketEvents.USER_LEFT;
};

const usersMock: User[] = [];
for (let i = 0; i < 10000; i++) {
  usersMock.push({ id: `MockedUser${i}`, name: `MockedUser${i}` });
}

const getRandomMessageBody = (len: number) => {
  const chars = [...new Array(5).fill('a'), ' '];

  const getChar = () => {
    const index = Math.floor(chars.length * Math.random());

    return chars[index];
  };

  let sentence = '';

  for (let i = 0; i < len; i++) {
    sentence += getChar();
  }

  return sentence;
};

const createRandomMessage = (userId: string): Message => {
  return {
    userId,
    id: userId,
    body: getRandomMessageBody(Math.random() * 300) ?? `Hello!`,
    time: new Date().getTime(),
  };
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // to-do: use an actual websocket connected to a backend
  private readonly webSocketEvents$ = new Subject<
    MessageEvent<WebSocketMessageEvents>
  >();
  private readonly webSocketMessageEvents$: Observable<WebSocketMessageEvents> =
    this.webSocketEvents$.pipe(map(event => event.data));

  readonly messageEvents$: Observable<Message[]> =
    this.webSocketMessageEvents$.pipe(
      filter(isMessageEvent),
      map(event => event.data)
    );
  readonly userJoinedEvents$: Observable<User> =
    this.webSocketMessageEvents$.pipe(
      filter(isUserJoinedEvent),
      map(event => event.data)
    );
  readonly userLeftEvents$: Observable<string> =
    this.webSocketMessageEvents$.pipe(
      filter(isUserLeftEvent),
      map(event => event.data)
    );

  constructor(private http: HttpClient) {
    // to-do: remove when backend sends mocked data

    interval(25)
      .pipe(
        take(usersMock.length),
        tap(i => {
          const user = usersMock[i];

          // user joins
          setTimeout(() =>
            this.webSocketEvents$.next(
              new MessageEvent('message', {
                data: {
                  type: WebSocketEvents.USER_JOINED,
                  data: user,
                },
              })
            )
          );

          // user sends message
          setTimeout(() =>
            this.webSocketEvents$.next(
              new MessageEvent('message', {
                data: {
                  type: WebSocketEvents.MESSAGE,
                  data: [createRandomMessage(user.id)],
                },
              })
            )
          );

          // user leaves after 10 seconds
          setTimeout(
            () =>
              this.webSocketEvents$.next(
                new MessageEvent('message', {
                  data: {
                    type: WebSocketEvents.USER_LEFT,
                    data: user.id,
                  },
                })
              ),
            10000
          );
        })
      )
      .subscribe();
  }

  // simulating an api call that returns created message with real id and time
  // to-do: connect to actual api
  sendMessage(message: { userId: string; body: string }): Observable<Message> {
    const response = (): Message => ({
      body: message.body,
      userId: message.userId,
      id: crypto.randomUUID(),
      time: new Date().getTime(),
      status: MessageStatus.OK,
    });

    return of(true).pipe(
      delay(3000),
      map(() => response())
    );
  }
}
