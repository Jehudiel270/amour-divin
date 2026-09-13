export interface Profile {
  id: string;
  firstName: string;
  age: number;
  city: string;
  profession: string;
  church: string;
  bio: string;
  values: string[];
  interests: string[];
  lookingFor: string;
  verified: boolean;
  photo: string;
  lastSeen: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
}

export type NotificationType = "match" | "request" | "message" | "verified";

export interface AppNotification {
  id: string;
  type: NotificationType;
  text: string;
  time: string;
  read: boolean;
  icon: string;
}

export type AdminUserStatus = "verified" | "pending" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  city: string;
  age: number;
  joinDate: string;
  status: AdminUserStatus;
  reports: number;
}

export type AdminReportStatus = "urgent" | "pending" | "resolved";

export interface AdminReport {
  id: string;
  reporter: string;
  reporterEmail: string;
  target: string;
  reason: string;
  desc: string;
  date: string;
  status: AdminReportStatus;
}
