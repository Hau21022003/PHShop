import { AccountType } from "@/schemas/account.schema";
import { storage } from "@/utils/storage";

const USER_KEY = "user";
const SESSION_TOKEN_KEY = "sessionToken";

export interface SessionTokenInfo {
  sessionToken: string;
  expiresAt: string;
}

export const authStorage = {
  getUser() {
    const user = storage.get(USER_KEY) as AccountType | undefined;
    if (!user) return undefined;

    if (!this.isSessionValid()) {
      this.clear();
      return undefined;
    }

    return user;
  },

  saveUser(user: AccountType) {
    storage.set(USER_KEY, user);
  },

  saveAuth(user: AccountType, token: SessionTokenInfo) {
    storage.set(USER_KEY, user);
    storage.set(SESSION_TOKEN_KEY, token);
  },

  getRawSessionToken(): SessionTokenInfo | undefined {
    return storage.get(SESSION_TOKEN_KEY) as SessionTokenInfo | undefined;
  },

  getSessionToken(): SessionTokenInfo | undefined {
    if (!this.isSessionValid()) {
      this.clear();
      return undefined;
    }
    return this.getRawSessionToken();
  },

  saveSessionToken(sessionToken: SessionTokenInfo) {
    return storage.set(SESSION_TOKEN_KEY, sessionToken);
  },

  clear() {
    storage.remove(USER_KEY);
    storage.remove(SESSION_TOKEN_KEY);
  },

  isSessionValid(): boolean {
    const token = this.getRawSessionToken();
    if (!token) return false;
    const expiresAtTime = new Date(token.expiresAt).getTime();
    return Date.now() < expiresAtTime;
  },
};
