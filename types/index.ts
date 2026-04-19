import { Timestamp } from "firebase/firestore";

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  role: "client" | "admin";
  createdAt: Timestamp;
}

// ─── Demo Request ─────────────────────────────────────────────────────────────
export interface DemoRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  whatsappNumber: string;
  businessType: string;
  requirement: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: Timestamp;
}

// ─── Demo ─────────────────────────────────────────────────────────────────────
export interface Demo {
  id: string;
  userId: string;
  demoUrl: string;
  title: string;
  status: "in_progress" | "ready" | "updated";
  notes: string;
  createdAt: Timestamp;
}

// ─── Project ──────────────────────────────────────────────────────────────────
export interface Project {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  features: string[];
  techStack: string[];
  imageUrls: string[];
  liveUrl: string;
  createdAt: Timestamp;
}

// ─── Admin Settings ───────────────────────────────────────────────────────────
export interface AdminSettings {
  defaultTheme: "light" | "dark";
  homepageHeadline: string;
  homepageSubtext: string;
}
