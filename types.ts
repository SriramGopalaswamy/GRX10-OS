
export enum Role {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  ADMIN = 'Admin'
}

export enum Team {
  MARKETING = 'Marketing',
  REVOPS = 'RevOps',
  SALES = 'Sales',
  SOLAR_OPS = 'Solar Operations',
  DESIGN = 'Designers',
  AI_ENG = 'AI Engineering',
  LEADERSHIP = 'Leadership'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  team: Team;
  avatarUrl?: string;
}

export enum GoalType {
  ANNUAL = 'Annual',
  QUARTERLY = 'Quarterly'
}

export enum GoalStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'Risk',
  OFF_TRACK = 'Off Track',
  COMPLETED = 'Completed'
}

export interface GoalComment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Goal {
  id: string;
  ownerId: string;
  title: string;
  type: GoalType;
  metric: string;
  baseline: number;
  target: number;
  current: number;
  timeline: string; // ISO Date
  status: GoalStatus;
  score?: 'A' | 'B' | 'C' | 'D' | 'F';
  managerFeedback?: string;
  comments?: GoalComment[];
}

export enum MemoStatus {
  DRAFT = 'Draft',
  PENDING_REVIEW = 'Pending Review',
  APPROVED = 'Approved',
  REVISION_REQUESTED = 'Revision Requested'
}

export interface MemoAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Memo {
  id: string;
  fromId: string;
  toId: string; // User ID or 'ALL'
  date: string;
  subject: string;
  status: MemoStatus;
  summary: string; // Single summary field replacing structured sections
  attachments: MemoAttachment[]; // File attachments
  comments: MemoComment[];
}

export interface MemoComment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'alert' | 'info';
  read: boolean;
  timestamp: string;
  actionLink?: string;
}

export interface DashboardStats {
  goalCompletion: number;
  teamScores: { name: string; score: number }[];
  companyKpis: { label: string; value: string; trend: 'up' | 'down' | 'flat' }[];
}
