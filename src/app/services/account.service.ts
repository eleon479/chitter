import { EventEmitter, Injectable } from '@angular/core';
import { AtpSessionData, AtpSessionEvent, BskyAgent } from '@atproto/api';
import { Observable, tap } from 'rxjs';

export type UserAccount = {
  session: AtpSessionData;
  name: string;
  service: string;
  loggedIn: boolean;
};

export type AccountEvent = {
  type: 'empty' | 'load' | 'login' | 'switch' | 'logout' | 'expire' | 'error';
  data: UserAccount;
};

export type AccountAction = {
  source: 'client' | 'self';
  type: 'init' | 'load' | 'login' | 'update' | 'remove';
  data: UserAccount | LoginAction;
};

export type LoginAction = {
  identifier: string;
  password: string;
};

export const SESSION_STORAGE_KEY = 'account';
export const SERVICE_URL = 'https://bsky.social';
export const EmptySession: UserAccount = {
  name: '',
  session: null,
  service: SERVICE_URL,
  loggedIn: false,
};

@Injectable({ providedIn: 'root' })
export class AccountService {
  private account: UserAccount;
  private storedSession: AtpSessionData;
  private agent: BskyAgent;
  public readonly accountEvents$: EventEmitter<AccountEvent>;

  constructor() {
    this.account = EmptySession;
    this.storedSession = null as AtpSessionData;
    this.agent = null as BskyAgent;
    this.accountEvents$ = new EventEmitter<AccountEvent>();
  }

  actionHandler(action: AccountAction) {
    switch (action.type) {
      case 'init':
        // update state
        this.account = {
          name: '',
          session: null,
          service: SERVICE_URL,
          loggedIn: false,
        };
        // emit event
        this.accountEvents$.emit({
          type: 'empty',
          data: this.account,
        });
        break;

      case 'update':
        break;

      case 'load':
        // try to read from stored
        const fromStorage = this.readStoredSession();

        if (fromStorage) {
          this.account = {
            name: this.agent.session.handle,
            session: this.agent.session,
            service: SERVICE_URL,
            loggedIn: true,
          };
        } else {
          this.actionHandler({
            ...action,
            type: 'load',
          });
        }

        break;
      case 'login':
        break;
      case 'remove':
        break;
    }
  }

  onSessionEvent(appEventHandler: Function) {
    const sessionEvents = new Observable<AccountEvent>((subscriber) => {
      this.actionHandler({
        type: 'init',
        source: 'client',
        data: {
          name: '',
          session: null,
          service: '',
          loggedIn: false,
        },
      });

      this.storedSession = this.readStoredSession();

      if (this.storedSession) {
        this.account = {
          name: this.agent.session.handle,
          session: this.agent.session,
          service: SERVICE_URL,
          loggedIn: true,
        };
        // emit?
        subscriber.next({
          type: 'load',
          data: this.account,
        });
      } else {
        this.account = {
          name: '',
          session: null,
          service: SERVICE_URL,
          loggedIn: false,
        };
        subscriber.next({
          type: 'empty',
          data: this.account,
        });
        // emit?
      }
    });

    return sessionEvents;
  }

  async loadSession() {
    console.debug('loadSession()');
    this.storedSession = this.readStoredSession();

    // try to load account and session from storage
    if (this.storedSession) {
      // const response = await this.agent.resumeSession(this.storedSession);

      this.account = {
        name: this.agent.session.handle,
        session: this.agent.session,
        service: SERVICE_URL,
        loggedIn: true,
      };

      this.accountEvents$.emit({
        type: 'load',
        data: this.account,
      });
    } else {
      this.account = {
        name: '',
        session: null,
        service: SERVICE_URL,
        loggedIn: false,
      };

      this.accountEvents$.emit({
        type: 'empty',
        data: this.account,
      });
    }
  }

  async login(identifier: string, password: string) {
    console.debug(`login(${identifier}, ${password})`);

    return await this.agent
      .login({
        identifier,
        password,
      })
      .then((ok) => {
        return ok;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getAgent(): BskyAgent {
    return this.agent;
  }

  createPost(text: string) {
    console.debug(`createPost(${text})`);

    const newPost = {
      text: text,
    };

    this.agent.post(newPost).then((ok: { uri: string; cid: string }) => {
      console.log('post created: ', ok);
    });
  }

  isLoggedIn(): boolean {
    return this.account.loggedIn;
  }

  readStoredSession(): AtpSessionData {
    console.debug(`getAccountFromLocalStorage()`);
    const local = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));

    return local;
  }

  updateStoredSession(evt: AtpSessionEvent, session: AtpSessionData) {
    console.debug(`updateStoredSession(${evt}): ${session}`);
    localStorage.setItem('last-session-event', JSON.stringify(evt));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}
