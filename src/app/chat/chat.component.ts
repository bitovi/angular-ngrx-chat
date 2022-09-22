import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  Observable,
  of,
  skip,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { sendMessage } from '../store/chat/chat.actions';
import { Message } from '../store/chat/chat.model';
import {
  selectAllMessages,
  selectMessagesSlice,
} from '../store/chat/chat.selectors';
import { selectUserData } from '../store/login/login.selectors';

// TO-DO: improve reactive code
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewInit, OnDestroy, OnInit {
  protected readonly form = this.fb.nonNullable.group({
    message: ['', Validators.required],
  });
  private readonly onDestroy$ = new Subject<void>();

  private readonly INITIAL_MESSAGES_SLICE_CAP: [number, number] = [0, 49];
  private readonly INCREMENT_MESSAGES_SLICE_CAP_BY = 20;

  protected readonly _shouldIncrementMessageSliceCap$ =
    new BehaviorSubject<boolean>(false);
  protected readonly shouldIncrementMessageSliceCap$ =
    this._shouldIncrementMessageSliceCap$.pipe(debounceTime(200));

  protected readonly scrollIsAtBottom$ = new BehaviorSubject<boolean>(true);
  protected readonly messagesSlice$ = new BehaviorSubject<[number, number]>(
    this.INITIAL_MESSAGES_SLICE_CAP
  );

  protected readonly messages$: Observable<Message[]> = combineLatest([
    this.scrollIsAtBottom$.pipe(
      concatLatestFrom(() => this.store.select(selectAllMessages))
    ),
    this.messagesSlice$,
  ]).pipe(
    switchMap(([[scrollIsAtBottom, messages], messagesSlice]) => {
      if (!scrollIsAtBottom) {
        return of(messages.slice(messagesSlice[0], messagesSlice[1]));
      }
      return this.store.select(
        selectMessagesSlice(messagesSlice[0], messagesSlice[1])
      );
    })
  );

  protected readonly resetMessagesSliceCap$ = this.scrollIsAtBottom$.pipe(
    skip(1), // ignore first emitted value (false)
    tap(scrollIsAtBottom => {
      if (scrollIsAtBottom) {
        this.messagesSlice$.next(this.INITIAL_MESSAGES_SLICE_CAP);
      }
    }),
    takeUntil(this.onDestroy$)
  );

  protected readonly incrementMessagesSliceCap$ =
    this.shouldIncrementMessageSliceCap$.pipe(
      tap(shouldIncrement => {
        if (shouldIncrement) {
          const [start, end] = this.messagesSlice$.value;
          this.messagesSlice$.next([
            start,
            end + this.INCREMENT_MESSAGES_SLICE_CAP_BY,
          ]);
        }
      }),
      takeUntil(this.onDestroy$)
    );

  protected readonly userData$: Observable<{
    userId: string | null;
    username: string | null;
  }> = this.store.select(selectUserData);

  @ViewChild('scroll') scroll!: ElementRef<HTMLDivElement>;
  private unlisten!: ReturnType<Renderer2['listen']>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.resetMessagesSliceCap$.subscribe();
    this.incrementMessagesSliceCap$.subscribe();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.unlisten = this.renderer.listen(
        this.scroll.nativeElement,
        'scroll',
        (event: Event) => {
          const target = event.target as HTMLDivElement;
          const isScrollAtBottom = target.scrollTop === 0;

          // update scrollIsAtBottom if needed
          if (this.scrollIsAtBottom$.value !== isScrollAtBottom) {
            this.scrollIsAtBottom$.next(isScrollAtBottom);
          }

          const shouldIncrementMessageSliceCap =
            (target.scrollHeight - target.offsetHeight) * -0.9 >
            target.scrollTop;

          this._shouldIncrementMessageSliceCap$.next(
            shouldIncrementMessageSliceCap
          );
        }
      );
    });
  }

  ngOnDestroy(): void {
    this.unlisten();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  sendMessage(): void {
    this.store.dispatch(
      sendMessage({ body: this.form.controls.message.value })
    );
    this.form.controls.message.patchValue('');
  }

  trackByFn(index: number, item: Message) {
    return item.id;
  }
}
