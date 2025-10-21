export type UserRole = "admin" | "publisher" | "user";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  provider?: string;
  createdAt?: string;
  updatedAt?: string;
}
