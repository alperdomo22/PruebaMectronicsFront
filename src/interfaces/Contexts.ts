import type { IUserSession } from "./Session";

export interface ISessionContext {
  user: IUserSession | null;
  login: (userData: IUserSession) => void;
  logout: () => void;
  getUserSession: () => IUserSession | null;
  validateSession: () => void;
};