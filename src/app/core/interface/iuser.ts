export interface IUser {
  id?: string | number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = 'admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthSession {
  accessToken: string;
  user: IUser;
}
