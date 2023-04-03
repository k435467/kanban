/**
 * User profile information
 */
export interface UserInfo {
  readonly displayName: string | null;
  readonly email: string | null;
  readonly phoneNumber: string | null;
  readonly photoURL: string | null;
  readonly providerId: string;
  readonly uid: string;
}

export interface AuthState {
  readonly user: UserInfo | null;
  readonly loading: boolean;
}

export type ThemeMode = "light" | "dark";

export interface Project {
  id?: string;
  title: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  label: string;
  status: string;
  priority?: number;
  due?: string;
}