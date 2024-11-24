import { JwtPayload } from "jsonwebtoken";

export enum UserRole {
  Super,
  Admin,
  User,
}

export interface IUser {
  id?: string;
  username: string;
  fullname: string;
  email: string;
  phone?: string;
  password: string;
  location?: string;
  avatarUrl?: string;
  role: UserRole;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFaEnabled?: boolean;
  expoPushToken?: string;
  refreshToken?: string;
}

export interface DecodedToken extends JwtPayload {
  id: string;
}

export interface IGoogleUser {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}

export interface TokenResponse {
  token: string;
  expireAt: number;
}
